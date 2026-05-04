package com.example.geospatial.services.servicesImpl;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
import java.util.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import com.example.geospatial.models.Review;
import com.example.geospatial.models.Trail;
import com.example.geospatial.models.User;
import com.example.geospatial.repositories.ReviewRepository;

@ExtendWith(MockitoExtension.class)
class ReviewServiceImplTest {

    @Mock
    private ReviewRepository reviewRepository;

    @InjectMocks
    private ReviewServiceImpl reviewService;

    private Review review;
    private User user;
    private Trail trail;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setEmail("user@test.com");

        trail = new Trail();
        trail.setId(1L);

        review = new Review(5, "Great!", trail, user);
        review.setId(1L);
        review.setCreatedAt(LocalDateTime.now());
    }

    @Test
    void addReview_success() {
        when(reviewRepository.save(any(Review.class))).thenReturn(review);

        Review result = reviewService.addReview(5, "Great!", trail, user);

        assertNotNull(result);
        assertEquals(5, result.getRating());
        verify(reviewRepository).save(any(Review.class));
    }

    @Test
    void getReviewsByTrailId_success() {
        when(reviewRepository.findByTrailId(1L)).thenReturn(List.of(review));

        var result = reviewService.getReviewsByTrailId(1L);

        assertEquals(1, result.size());
        assertEquals("Great!", result.get(0).getComment());
        assertEquals("user@test.com", result.get(0).getUserEmail());
    }

    @Test
    void getUserReviews_success() {
        when(reviewRepository.findByUserId(1L)).thenReturn(List.of(review));

        var result = reviewService.getUserReviews(user);

        assertEquals(1, result.size());
        assertEquals(5, result.get(0).getRating());
    }

    @Test
    void deleteReview_success() {
        when(reviewRepository.findById(1L)).thenReturn(Optional.of(review));

        ResponseEntity<?> response = reviewService.deleteReview(1L);

        assertEquals(200, response.getStatusCodeValue());
        verify(reviewRepository).deleteById(1L);
    }

    @Test
    void deleteReview_notFound() {
        when(reviewRepository.findById(1L)).thenReturn(Optional.empty());

        ResponseEntity<?> response = reviewService.deleteReview(1L);

        assertEquals(404, response.getStatusCodeValue());
        verify(reviewRepository, never()).deleteById(anyLong());
    }
}