package com.example.geospatial.services.servicesImpl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.stereotype.Service;

import com.example.geospatial.DTO.AnnotationDTO;
import com.example.geospatial.models.Annotation;
import com.example.geospatial.models.User;
import com.example.geospatial.repositories.AnnotationRepository;
import com.example.geospatial.services.AnnotationService;

@Service
public class AnnotationServiceImpl implements AnnotationService {

    @Autowired
    private AnnotationRepository annotationRepository;

    @Override
    public ResponseEntity<?> addAnnotation(Annotation annotation) {
        Annotation saved = annotationRepository.save(annotation);
        return ResponseEntity.ok(toDto(saved));
    }

    @Override
    public List<AnnotationDTO> getAnnotations(long trailId) {
        List<Annotation> annotations = annotationRepository.findAllByTrailId(trailId);
        return annotations.stream().map(this::toDto).toList();
    }

    @Override
    public ResponseEntity<?> deleteAnnotation(long id, User currentUser) {
        Optional<Annotation> existingAnnotationOpt = annotationRepository.findById(id);
        if (existingAnnotationOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("Annotation with id " + id + " not found");
        }

        Annotation existing = existingAnnotationOpt.get();

        if (existing.getUser() == null
            || !existing.getUser().getId().equals(currentUser.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body("You do not have permission to delete this annotation");
        }

        annotationRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

   
    private AnnotationDTO toDto(Annotation r) {
        String createdBy = r.getUser() != null ? String.valueOf(r.getUser().getId()) : null;

        return new AnnotationDTO(
            r.getId(),
            r.getLat(),
            r.getLng(),
            r.getCreatedAt(),
            r.getDescription(),
            r.getType(),
            r.getTrailId(),
            r.getTitle(),
            createdBy
        );
    }
}