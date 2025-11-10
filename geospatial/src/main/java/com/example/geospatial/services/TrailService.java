package com.example.geospatial.services;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;

import com.example.geospatial.models.Trail;

public interface TrailService {
    public ResponseEntity<?> createTrail(Trail trail);

    public Optional<Trail> getTrail(long id);

    public List<Trail> getAllTrail();

    public ResponseEntity<?> updateTrail(Trail trail);

    public ResponseEntity<?> deleteTrail(long id);

}
