package com.example.geospatial.controllers;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.geospatial.DTO.ImagesDTO;
import com.example.geospatial.models.Trail;
import com.example.geospatial.repositories.TrailRepository;
import com.example.geospatial.services.ImageService;
import com.example.geospatial.services.SupabaseStorageService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.web.bind.annotation.RequestParam;



@RestController
public class ImageController {

    @Autowired
    private TrailRepository trailRepository;

    @Autowired
    private ImageService imageServiceImpl;

    @Autowired
    private SupabaseStorageService supabaseStorageService;

    private static final Logger logger = LoggerFactory.getLogger(TrailController.class);

    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
@PostMapping("/add_images/{trailId}")
public ResponseEntity<?> addImages(
        @PathVariable Long trailId,
        @RequestParam("images") List<MultipartFile> images) {

    try {
        Trail trail = trailRepository.findById(trailId)
                .orElseThrow(() -> new RuntimeException("Trail not found"));

        List<String> imageUrls = new ArrayList<>();

        for (MultipartFile image : images) {
            String imageUrl = supabaseStorageService.uploadImage(image);
            imageUrls.add(imageUrl);
        }

        imageServiceImpl.addImages(imageUrls, trail);

        return ResponseEntity.ok(
                Map.of("message", "Images uploaded successfully")
        );

    } catch (Exception e) {
        logger.error("Error uploading images", e);

        return ResponseEntity.internalServerError()
                .body(Map.of("error", "Unable to upload images."));
    }
}

    @GetMapping("/images_by_trail/{trailId}")
    public ResponseEntity<?> getImages(@PathVariable Long trailId){
        try {
            List<ImagesDTO> images = imageServiceImpl.getImagesByTrail(trailId);
            return ResponseEntity.ok(images);
        } catch (Exception e) {
            logger.error("Error fetching all images by trail", e);
            return ResponseEntity.internalServerError().body(Map.of("error", "Unable to fetch images by trail."));
        } 
    }

    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @DeleteMapping("/deleteImage/{imageId}")
    public ResponseEntity<?> deleteImage(@PathVariable Long imageId){
        try {
            return ResponseEntity.ok(imageServiceImpl.deleteImage(imageId));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("something went wrong with delete image");
        }
    }

}
