package com.example.geospatial.services;

import java.util.List;

import org.springframework.http.ResponseEntity;

import com.example.geospatial.DTO.ImagesDTO;
import com.example.geospatial.models.Trail;


public interface ImageService {
    public ResponseEntity<?> addImages(List<String> imagesURL, Trail trail);

    public List<ImagesDTO> getImagesByTrail(Long trailId);

    public ResponseEntity<?> deleteImage(Long imageId);

}
