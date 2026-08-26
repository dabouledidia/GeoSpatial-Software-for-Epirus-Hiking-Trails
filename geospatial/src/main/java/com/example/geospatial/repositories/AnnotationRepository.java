package com.example.geospatial.repositories;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.geospatial.models.Annotation;

@Repository
public interface AnnotationRepository extends JpaRepository<Annotation, Long> {
List<Annotation> findAllByTrailId(long trailId);
    

}
