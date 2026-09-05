package com.example.geospatial.services;

import java.util.List;

import org.springframework.http.ResponseEntity;

import com.example.geospatial.DTO.AnnotationDTO;
import com.example.geospatial.models.Annotation;
import com.example.geospatial.models.User;

public interface AnnotationService {

    public ResponseEntity<?> addAnnotation(Annotation annotation);

    public List<AnnotationDTO> getAnnotations(long trailId);

    public ResponseEntity<?> deleteAnnotation(long id, User currentUser);


}
