package com.example.geospatial.services.servicesImpl;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import com.example.geospatial.models.Annotation;
import com.example.geospatial.models.User;
import com.example.geospatial.repositories.AnnotationRepository;

@ExtendWith(MockitoExtension.class)
class AnnotationServiceImplTest {

    @Mock
    private AnnotationRepository annotationRepository;

    @InjectMocks
    private AnnotationServiceImpl annotationService;

    private Annotation annotation;
    private User owner;
    private User otherUser;

    @BeforeEach
    void setUp() {
        owner = new User();
        owner.setId(1L);
        owner.setEmail("owner@mail.com");

        otherUser = new User();
        otherUser.setId(2L);
        otherUser.setEmail("other@mail.com");

        annotation = new Annotation();
        annotation.setId(1L);
        annotation.setLat(39.5);
        annotation.setLng(21.0);
        annotation.setType("water");
        annotation.setTitle("Spring");
        annotation.setDescription("Fresh water source");
        annotation.setCreatedAt(LocalDateTime.now());
        annotation.setUser(owner);
        annotation.setTrail_id(5L);
    }

    @Test
    void addAnnotation_success() {
        when(annotationRepository.save(any(Annotation.class))).thenReturn(annotation);

        ResponseEntity<?> response = annotationService.addAnnotation(annotation);

        assertEquals(200, response.getStatusCodeValue());
        verify(annotationRepository).save(annotation);
    }

    @Test
    void getAnnotations_success() {
        when(annotationRepository.findAllByTrailId(5L)).thenReturn(List.of(annotation));

        var result = annotationService.getAnnotations(5L);

        assertEquals(1, result.size());
        assertEquals("Spring", result.get(0).getTitle());
        assertEquals("water", result.get(0).getType());
        assertEquals(5L, result.get(0).getTrailId());
    }

    @Test
    void getAnnotations_emptyList() {
        when(annotationRepository.findAllByTrailId(5L)).thenReturn(List.of());

        var result = annotationService.getAnnotations(5L);

        assertTrue(result.isEmpty());
    }

    @Test
    void deleteAnnotation_success_whenOwner() {
        when(annotationRepository.findById(1L)).thenReturn(Optional.of(annotation));

        ResponseEntity<?> response = annotationService.deleteAnnotation(1L, owner);

        assertEquals(204, response.getStatusCodeValue());
        verify(annotationRepository).deleteById(1L);
    }

    @Test
    void deleteAnnotation_notFound() {
        when(annotationRepository.findById(99L)).thenReturn(Optional.empty());

        ResponseEntity<?> response = annotationService.deleteAnnotation(99L, owner);

        assertEquals(404, response.getStatusCodeValue());
        verify(annotationRepository, never()).deleteById(anyLong());
    }

    @Test
    void deleteAnnotation_forbidden_whenNotOwner() {
        when(annotationRepository.findById(1L)).thenReturn(Optional.of(annotation));

        ResponseEntity<?> response = annotationService.deleteAnnotation(1L, otherUser);

        assertEquals(403, response.getStatusCodeValue());
        verify(annotationRepository, never()).deleteById(anyLong());
    }
}
