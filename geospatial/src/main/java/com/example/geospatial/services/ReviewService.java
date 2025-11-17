package com.example.geospatial.services;

import java.util.List;

import com.example.geospatial.DTO.ReviewDTO;
import com.example.geospatial.models.Review;
import com.example.geospatial.models.Trail;
import com.example.geospatial.models.User;

public interface ReviewService {
    Review addReview(int rating, String comment, Trail trail, User user);
    List<ReviewDTO> getReviewsByTrailId(long trailId);
}
