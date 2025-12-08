package com.example.geospatial.services.servicesImpl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.example.geospatial.DTO.ReviewDTO;
import com.example.geospatial.models.Review;
import com.example.geospatial.models.Trail;
import com.example.geospatial.models.User;
import com.example.geospatial.repositories.ReviewRepository;
import com.example.geospatial.services.ReviewService;

@Service
public class ReviewServiceImpl implements ReviewService{

    @Autowired
    private ReviewRepository reviewRepository;

    @Override
    public Review addReview(int rating, String comment, Trail trail, User user) {
        Review review = new Review(rating, comment, trail, user);
        return reviewRepository.save(review);
    }

    @Override
    public List<ReviewDTO> getReviewsByTrailId(long trailId) {        
        List<Review> reviews = reviewRepository.findByTrailId(trailId);
        return reviews.stream().map(r ->
        new ReviewDTO(
            r.getId(),
            r.getRating(),
            r.getComment(),
            r.getCreatedAt().toString(),
            r.getUser().getEmail(),
            r.getTrail().getId()
        )
    ).toList();
    }

    @Override
    public List<ReviewDTO> getUserReviews(User user) {
        List<Review> reviews = reviewRepository.findByUserId(user.getId());
        return reviews.stream().map(r ->
        new ReviewDTO(
            r.getId(),
            r.getRating(),
            r.getComment(),
            r.getCreatedAt().toString(),
            r.getUser().getEmail(),
            r.getTrail().getId()
        )
        ).toList();    
    }

    @Override
    public ResponseEntity<?> deleteReview(Long reviewId) {
        Optional<Review> existingReviewOpt = reviewRepository.findById(reviewId);
        
        if (existingReviewOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Review with id " + reviewId + " not found");
        }

        reviewRepository.deleteById(reviewId);
        
        return ResponseEntity.ok("Deleted!");
    }


}
