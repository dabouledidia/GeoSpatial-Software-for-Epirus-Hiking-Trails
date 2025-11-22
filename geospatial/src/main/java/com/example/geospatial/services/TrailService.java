package com.example.geospatial.services;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;

import com.example.geospatial.DTO.TrailDTO;
import com.example.geospatial.models.Trail;
import com.example.geospatial.models.User;

public interface TrailService {
    public ResponseEntity<?> createTrail(Trail trail);

    public Optional<Trail> getTrail(long id);

    public List<TrailDTO> getAllTrail();

    public ResponseEntity<?> updateTrail(Trail trail);

    public ResponseEntity<?> deleteTrail(long id);

    public List<TrailDTO> getUserTrail(User user);

}
