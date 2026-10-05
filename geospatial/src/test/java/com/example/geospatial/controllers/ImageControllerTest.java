package com.example.geospatial.controllers;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import com.example.geospatial.DTO.ImagesDTO;
import com.example.geospatial.models.Trail;
import com.example.geospatial.repositories.TrailRepository;
import com.example.geospatial.services.ImageService;

/**
 * Note: addImages() writes the uploaded file(s) to the local "uploads/"
 * directory as part of the controller method itself (see ImageController),
 * so — consistent with TrailControllerTest's createTrail tests — these
 * tests have a real (harmless) filesystem side effect when run.
 */
@ExtendWith(MockitoExtension.class)
class ImageControllerTest {

    @Mock
    private TrailRepository trailRepository;

    @Mock
    private ImageService imageServiceImpl;

    @InjectMocks
    private ImageController imageController;

    private Trail testTrail;
    private ImagesDTO testImageDTO;

    @BeforeEach
    void setUp() {
        testTrail = new Trail();
        testTrail.setId(1L);
        testTrail.setName("Mountain Trail");

        testImageDTO = new ImagesDTO(10L, "uploads/photo1.jpg");
    }

    @Test
    void addImages_shouldReturnOk_whenValidRequest() throws Exception {
        MockMultipartFile image = new MockMultipartFile(
                "images", "photo1.jpg", "image/jpeg", "fake-bytes".getBytes());
        when(trailRepository.findById(1L)).thenReturn(Optional.of(testTrail));

        ResponseEntity<?> response = imageController.addImages(1L, List.of(image));

        assertEquals(HttpStatus.OK, response.getStatusCode());
        @SuppressWarnings("unchecked")
        Map<String, String> body = (Map<String, String>) response.getBody();
        assertEquals("Images uploaded successfully", body.get("message"));
        verify(imageServiceImpl).addImages(anyList(), eq(testTrail));
    }

    @Test
    void addImages_shouldThrow_whenTrailNotFound() {
        when(trailRepository.findById(99L)).thenReturn(Optional.empty());
        List<MultipartFile> images = List.of(
                new MockMultipartFile("images", "p.jpg", "image/jpeg", "x".getBytes()));

        assertThrows(RuntimeException.class, () -> imageController.addImages(99L, images));
        verify(imageServiceImpl, never()).addImages(anyList(), any());
    }

    @Test
    void getImages_shouldReturnOkWithList() {
        when(imageServiceImpl.getImagesByTrail(1L)).thenReturn(List.of(testImageDTO));

        ResponseEntity<?> response = imageController.getImages(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(List.of(testImageDTO), response.getBody());
    }

    @Test
    void getImages_shouldReturnOkWithEmptyList() {
        when(imageServiceImpl.getImagesByTrail(1L)).thenReturn(Collections.emptyList());

        ResponseEntity<?> response = imageController.getImages(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(Collections.emptyList(), response.getBody());
    }

    @Test
    void getImages_shouldReturn500_whenServiceThrows() {
        when(imageServiceImpl.getImagesByTrail(1L)).thenThrow(new RuntimeException("DB error"));

        ResponseEntity<?> response = imageController.getImages(1L);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
    }

    @Test
    void deleteImage_shouldReturnOk_whenServiceSucceeds() {
        doReturn(ResponseEntity.ok("Deleted!")).when(imageServiceImpl).deleteImage(10L);

        ResponseEntity<?> response = imageController.deleteImage(10L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(imageServiceImpl).deleteImage(10L);
    }

    @Test
    void deleteImage_shouldReturn500_whenServiceThrows() {
        when(imageServiceImpl.deleteImage(10L)).thenThrow(new RuntimeException("DB error"));

        ResponseEntity<?> response = imageController.deleteImage(10L);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
    }
}
