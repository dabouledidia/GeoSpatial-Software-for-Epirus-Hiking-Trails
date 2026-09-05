package com.example.geospatial.controllers;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.example.geospatial.DTO.AnnotationDTO;
import com.example.geospatial.requests.CreateAnnotationRequest;
import com.example.geospatial.models.Annotation;
import com.example.geospatial.models.CustomUserDetails;
import com.example.geospatial.models.User;
import com.example.geospatial.services.AnnotationService;

@RestController
@RequestMapping("/api/trails")
public class AnnotationController {

    @Autowired
    private AnnotationService annotationService;

    @GetMapping("/{trailId}/annotations")
    public ResponseEntity<List<AnnotationDTO>> getAnnotations(@PathVariable Long trailId) {
        return ResponseEntity.ok(annotationService.getAnnotations(trailId));
    }

    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @PostMapping("/{trailId}/annotations")
    public ResponseEntity<?> addAnnotation(
        @PathVariable Long trailId,
        @RequestBody CreateAnnotationRequest request,
        @AuthenticationPrincipal CustomUserDetails currentUser) {

        User user = currentUser.getUser();

        Annotation annotation = new Annotation();
        annotation.setDescription(request.getDescription());
        annotation.setLat(request.getLat());
        annotation.setLng(request.getLng());
        annotation.setTitle(request.getTitle());
        annotation.setType(request.getType());
        annotation.setUser(user);
        annotation.setTrail_id(trailId);
        annotation.setCreatedAt(LocalDateTime.now());

        return annotationService.addAnnotation(annotation);
    }

    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @DeleteMapping("/annotations/{id}")
    public ResponseEntity<?> deleteAnnotation(
        @PathVariable Long id,
        @AuthenticationPrincipal CustomUserDetails currentUser) {
            return annotationService.deleteAnnotation(id, currentUser.getUser());
}
}