package com.example.geospatial.controllers;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.geospatial.DTO.TrailDTO;
import com.example.geospatial.models.CustomUserDetails;
import com.example.geospatial.models.Trail;
import com.example.geospatial.models.User;
import com.example.geospatial.services.TrailService;

@RestController
public class TrailController {
    
    private static final Logger logger = LoggerFactory.getLogger(TrailController.class);

    @Autowired
    private TrailService trailServiceImpl;

    @GetMapping("/trail_by_id")
    public ResponseEntity<?> getTrail(@Validated @RequestParam long id){
        try {
            return ResponseEntity.ok(trailServiceImpl.getTrail(id));
        } catch (Exception e) {
            logger.error("Error fetching trail with id: {}", id, e);
            return ResponseEntity.internalServerError().body(Map.of("error", "Unable to fetch trail."));
        } 
    }

    @GetMapping("/all_trails")
    public ResponseEntity<?> getAllTrail(){
        try {
            List<TrailDTO> trails = trailServiceImpl.getAllTrail();
            return ResponseEntity.ok(trails);
        } catch (Exception e) {
            logger.error("Error fetching all trails", e);
            return ResponseEntity.internalServerError().body(Map.of("error", "Unable to fetch trails."));
        } 
    }

    @GetMapping("/user_trails")
    public ResponseEntity<?> getUserTrail(@AuthenticationPrincipal CustomUserDetails currentUser){
        try {
            User user = currentUser.getUser();
            List<TrailDTO> trails = trailServiceImpl.getUserTrail(user);
            return ResponseEntity.ok(trails);
        } catch (Exception e) {
            logger.error("Error fetching user trails", e);
            return ResponseEntity.internalServerError().body(Map.of("error", "Unable to fetch user trails."));
        } 
    }
    
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")    
    @PostMapping("/createTrail")
    public ResponseEntity<?> createTrail(
            @Validated @RequestBody Trail trail,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        try {
            User user = currentUser.getUser();
            trail.setUser(user);
            trailServiceImpl.createTrail(trail);
            return ResponseEntity.ok(Map.of("message", "Trail created successfully"));
        } catch (Exception e) {
            logger.error("Error creating trail", e);
            return ResponseEntity.internalServerError().body(Map.of("error", "Unable to create trail."));
        } 
    }

    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")    
    @PutMapping("/updateTrail")
    public ResponseEntity<?> updateTrail(@Validated @RequestBody Trail trail){
        try {
            return ResponseEntity.ok(trailServiceImpl.updateTrail(trail));
        } catch (Exception e) {
            logger.error("Error updating trail id: {}", trail.getId(), e);
            return ResponseEntity.internalServerError().body(Map.of("error", "Unable to update trail."));
        } 
    }
    
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @DeleteMapping("/deleteTrail/{id}")
    public ResponseEntity<?> deleteTrail(@Validated @PathVariable long id){
        try {
            return ResponseEntity.ok(trailServiceImpl.deleteTrail(id));
        } catch (Exception e) {
            logger.error("Error deleting trail id: {}", id, e);
            return ResponseEntity.internalServerError().body(Map.of("error", "Unable to delete trail."));
        } 
    }
}