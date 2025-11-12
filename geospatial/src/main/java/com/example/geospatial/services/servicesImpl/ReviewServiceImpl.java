package com.example.geospatial.services.servicesImpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
    public List<Review> getReviewsByTrail(Trail trail) {
        return reviewRepository.findByTrail(trail);
    }

}
