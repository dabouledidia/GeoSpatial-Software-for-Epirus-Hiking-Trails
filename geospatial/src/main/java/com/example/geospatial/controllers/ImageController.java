package com.example.geospatial.controllers;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.geospatial.models.CustomUserDetails;
import com.example.geospatial.models.Trail;
import com.example.geospatial.repositories.TrailRepository;
import com.example.geospatial.requests.ImageRequest;
import com.example.geospatial.services.ImageService;

import org.springframework.web.bind.annotation.RequestBody;
@RestController
public class ImageController {

    @Autowired
    private TrailRepository trailRepository;

    @Autowired
    private ImageService imageServiceImpl;

    @PostMapping("/add_images/{trailId}")
    public ResponseEntity<?> addReview(
            @PathVariable Long trailId,
            @RequestBody ImageRequest imagesRequest,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
                
        Trail trail = trailRepository.findById(trailId)
                .orElseThrow(() -> new RuntimeException("Trail not found"));


        imageServiceImpl.addImages(
        imagesRequest.getImagesURL(),
        trail
        );
       return ResponseEntity.ok(Map.of("message", "Images added successfully"));
    }

}
