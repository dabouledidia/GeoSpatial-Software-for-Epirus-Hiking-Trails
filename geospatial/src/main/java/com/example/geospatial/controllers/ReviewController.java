package com.example.geospatial.controllers;


import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.geospatial.DTO.ReviewDTO;
import com.example.geospatial.models.CustomUserDetails;
import com.example.geospatial.models.Trail;
import com.example.geospatial.models.User;
import com.example.geospatial.repositories.TrailRepository;
import com.example.geospatial.requests.ReviewRequest;
import com.example.geospatial.services.ReviewService;



@RestController
public class ReviewController {

    @Autowired
    private ReviewService reviewServiceImpl;

    @Autowired
    private TrailRepository trailRepository;

    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @PostMapping("/add/{trailId}")
    public ResponseEntity<Map<String,String>> addReview(
            @PathVariable Long trailId,
            @RequestBody ReviewRequest reviewRequest,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
                
        Trail trail = trailRepository.findById(trailId)
                .orElseThrow(() -> new RuntimeException("Trail not found"));

        User user = currentUser.getUser();

        reviewServiceImpl.addReview(
            reviewRequest.getRating(),
            reviewRequest.getComment(),
            trail,
            user
        );
        return ResponseEntity.ok(Map.of("message", "Review created successfully"));
    }
    
    
    @GetMapping("/reviews/{trailId}")
    public ResponseEntity<?> getReviewsByTrail(@PathVariable Long trailId) {
        try{
            List<ReviewDTO> reviews = reviewServiceImpl.getReviewsByTrailId(trailId);
            return ResponseEntity.ok(reviews);
        }catch(Exception e){
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("something went wrong with get all reviews by trail id");
        }
    }

    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @GetMapping("/userReviews")
    public ResponseEntity<?> getUserReviews(@AuthenticationPrincipal CustomUserDetails currentUser){
       try{
        User user = currentUser.getUser();
        List<ReviewDTO> reviews = reviewServiceImpl.getUserReviews(user);
        return ResponseEntity.ok(reviews);
       }catch(Exception e){
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("something went wrong with get user reviews");
        }
            
    }

    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @DeleteMapping("/deleteReview/{reviewId}")
    public ResponseEntity<?> deleteReview(@PathVariable Long reviewId){
        try {
            return ResponseEntity.ok(reviewServiceImpl.deleteReview(reviewId));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("something went wrong with delete review");
        }
    }
}
