package com.example.geospatial.controllers;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.util.Collections;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.example.geospatial.DTO.AnnotationDTO;
import com.example.geospatial.models.Annotation;
import com.example.geospatial.models.CustomUserDetails;
import com.example.geospatial.models.User;
import com.example.geospatial.requests.CreateAnnotationRequest;
import com.example.geospatial.services.AnnotationService;

@ExtendWith(MockitoExtension.class)
class AnnotationControllerTest {

    @Mock
    private AnnotationService annotationService;

    @Mock
    private CustomUserDetails customUserDetails;

    @InjectMocks
    private AnnotationController annotationController;

    private User testUser;
    private CreateAnnotationRequest request;
    private AnnotationDTO testAnnotationDTO;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("test@mail.com");

        request = new CreateAnnotationRequest();
        request.setLat(39.5);
        request.setLng(21.0);
        request.setType("water");
        request.setTitle("Spring");
        request.setDescription("Fresh water source");

        testAnnotationDTO = new AnnotationDTO(
                1L, 39.5, 21.0, null, "Fresh water source", "water", 5L, "Spring", "1"
        );
    }

    @Test
    void getAnnotations_shouldReturnOkWithList() {
        when(annotationService.getAnnotations(5L)).thenReturn(List.of(testAnnotationDTO));

        ResponseEntity<List<AnnotationDTO>> response = annotationController.getAnnotations(5L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
    }

    @Test
    void getAnnotations_shouldReturnOkWithEmptyList() {
        when(annotationService.getAnnotations(5L)).thenReturn(Collections.emptyList());

        ResponseEntity<List<AnnotationDTO>> response = annotationController.getAnnotations(5L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody().isEmpty());
    }

    @Test
    void addAnnotation_shouldReturnOk_whenValidRequest() {
        when(customUserDetails.getUser()).thenReturn(testUser);
        doReturn(ResponseEntity.ok(testAnnotationDTO))
                .when(annotationService).addAnnotation(any(Annotation.class));

        ResponseEntity<?> response = annotationController.addAnnotation(5L, request, customUserDetails);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(annotationService).addAnnotation(any(Annotation.class));
    }

    @Test
    void addAnnotation_shouldBuildAnnotationWithCorrectFields() {
        when(customUserDetails.getUser()).thenReturn(testUser);
        doReturn(ResponseEntity.ok(testAnnotationDTO))
                .when(annotationService).addAnnotation(any(Annotation.class));

        annotationController.addAnnotation(5L, request, customUserDetails);

        ArgumentCaptor<Annotation> captor = ArgumentCaptor.forClass(Annotation.class);
        verify(annotationService).addAnnotation(captor.capture());

        Annotation built = captor.getValue();
        assertEquals("Spring", built.getTitle());
        assertEquals("water", built.getType());
        assertEquals(39.5, built.getLat());
        assertEquals(21.0, built.getLng());
        assertEquals(5L, built.getTrailId());
        assertEquals(testUser, built.getUser());
        assertNotNull(built.getCreatedAt());
    }

    @Test
    void deleteAnnotation_shouldReturnOk_whenServiceSucceeds() {
        when(customUserDetails.getUser()).thenReturn(testUser);
        doReturn(ResponseEntity.noContent().build())
                .when(annotationService).deleteAnnotation(1L, testUser);

        ResponseEntity<?> response = annotationController.deleteAnnotation(1L, customUserDetails);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(annotationService).deleteAnnotation(1L, testUser);
    }

    @Test
    void deleteAnnotation_shouldReturnForbidden_whenNotOwner() {
        when(customUserDetails.getUser()).thenReturn(testUser);
        doReturn(ResponseEntity.status(HttpStatus.FORBIDDEN).body("You do not have permission"))
                .when(annotationService).deleteAnnotation(1L, testUser);

        ResponseEntity<?> response = annotationController.deleteAnnotation(1L, customUserDetails);

        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
    }
}
