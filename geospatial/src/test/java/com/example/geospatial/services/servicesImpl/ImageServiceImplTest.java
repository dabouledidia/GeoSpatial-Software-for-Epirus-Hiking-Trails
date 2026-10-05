package com.example.geospatial.services.servicesImpl;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import com.example.geospatial.models.Trail;
import com.example.geospatial.models.TrailImage;
import com.example.geospatial.repositories.TrailImageRepository;

@ExtendWith(MockitoExtension.class)
class ImageServiceImplTest {

    @Mock
    private TrailImageRepository trailImageRepository;

    @InjectMocks
    private ImageServiceImpl imageService;

    private Trail trail;
    private TrailImage trailImage;

    @BeforeEach
    void setUp() {
        trail = new Trail();
        trail.setId(1L);
        trail.setName("Mountain Trail");

        trailImage = new TrailImage("uploads/photo1.jpg", trail);
        trailImage.setId(10L);
    }

    @Test
    void addImages_success_savesOneImagePerUrl() {
        List<String> urls = List.of("uploads/a.jpg", "uploads/b.jpg", "uploads/c.jpg");

        ResponseEntity<?> response = imageService.addImages(urls, trail);

        assertEquals(200, response.getStatusCodeValue());
        verify(trailImageRepository, times(3)).save(any(TrailImage.class));
    }

    @Test
    void addImages_savesCorrectUrlAndTrail() {
        ArgumentCaptor<TrailImage> captor = ArgumentCaptor.forClass(TrailImage.class);

        imageService.addImages(List.of("uploads/a.jpg"), trail);

        verify(trailImageRepository).save(captor.capture());
        assertEquals("uploads/a.jpg", captor.getValue().getImageUrl());
        assertEquals(trail, captor.getValue().getTrail());
    }

    @Test
    void addImages_emptyList_savesNothing() {
        ResponseEntity<?> response = imageService.addImages(List.of(), trail);

        assertEquals(200, response.getStatusCodeValue());
        verify(trailImageRepository, never()).save(any());
    }

    @Test
    void getImagesByTrail_success() {
        when(trailImageRepository.findByTrailId(1L)).thenReturn(List.of(trailImage));

        var result = imageService.getImagesByTrail(1L);

        assertEquals(1, result.size());
        assertEquals("uploads/photo1.jpg", result.get(0).getImageURL());
        assertEquals(10L, result.get(0).getId());
    }

    @Test
    void getImagesByTrail_emptyList() {
        when(trailImageRepository.findByTrailId(1L)).thenReturn(List.of());

        var result = imageService.getImagesByTrail(1L);

        assertTrue(result.isEmpty());
    }

    @Test
    void deleteImage_success() {
        when(trailImageRepository.findById(10L)).thenReturn(Optional.of(trailImage));

        ResponseEntity<?> response = imageService.deleteImage(10L);

        assertEquals(200, response.getStatusCodeValue());
        verify(trailImageRepository).deleteById(10L);
    }

    @Test
    void deleteImage_notFound() {
        when(trailImageRepository.findById(99L)).thenReturn(Optional.empty());

        ResponseEntity<?> response = imageService.deleteImage(99L);

        assertEquals(404, response.getStatusCodeValue());
        verify(trailImageRepository, never()).deleteById(anyLong());
    }
}
