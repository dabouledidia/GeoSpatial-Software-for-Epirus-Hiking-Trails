package com.example.geospatial.controllers;

import java.util.List;

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
    
    @Autowired
    private TrailService trailServiceImpl;


    @GetMapping("/trail_by_id")
    public ResponseEntity<?> getTrail(@Validated @RequestParam long id){
        try {
            return ResponseEntity.ok(trailServiceImpl.getTrail(id));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("something went wrong with trail find by id");
        } 
    }

    @GetMapping("/all_trails")
    public ResponseEntity<?> getAllTrail(){
        try {
            List<TrailDTO> trails = trailServiceImpl.getAllTrail();
            return ResponseEntity.ok(trails);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("something went wrong with get all trails");
        } 
    }

    // @GetMapping("/user_trails")
    // public ResponseEntity<?> getUserTrail(@AuthenticationPrincipal CustomUserDetails currentUser){
    //     try {
    //         User user = currentUser.getUser();
    //         return ResponseEntity.ok(trailServiceImpl.getUserTrail(user.getEmail()));
    //     } catch (Exception e) {
    //         e.printStackTrace();
    //         return ResponseEntity.internalServerError().body("something went wrong with get all trails");
    //     } 
    // }
    
    @PreAuthorize("hasRole('USER')")    
    @PostMapping("/createTrail")
    public ResponseEntity<?> createTrail(@Validated @RequestBody Trail trail, @AuthenticationPrincipal CustomUserDetails currentUser){
        try {
            User user = currentUser.getUser();
            trail.setUser(user);
            trailServiceImpl.createTrail(trail);
            return ResponseEntity.ok().body("Created!");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("something went wrong with trail create");
        } 
    }

    @PreAuthorize("hasRole('USER')")    
    @PutMapping("/updateTrail")
    public ResponseEntity<?> updateTrail(@Validated @RequestBody Trail trail){
        try {
            return ResponseEntity.ok(trailServiceImpl.updateTrail(trail));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("something went wrong with trail update");
        } 
    }
    
    @PreAuthorize("hasRole('USER')")
    @DeleteMapping("/deleteTrail/{id}")
    public ResponseEntity<?> deleteTrail(@Validated @PathVariable long id){
        try {
            return ResponseEntity.ok(trailServiceImpl.deleteTrail(id));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("something went wrong with delete trail");
        } 
    }

}
