package com.example.geospatial.services;

import org.springframework.http.ResponseEntity;

import com.example.geospatial.models.Trail;


public interface ImageService {
    public ResponseEntity<?> addImages(String[] imagesURL, Trail trail);

}
