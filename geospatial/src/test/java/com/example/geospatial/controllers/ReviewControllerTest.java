package com.example.geospatial.controllers;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.example.geospatial.DTO.ReviewDTO;
import com.example.geospatial.models.CustomUserDetails;
import com.example.geospatial.models.Review;
import com.example.geospatial.models.Trail;
import com.example.geospatial.models.User;
import com.example.geospatial.repositories.TrailRepository;
import com.example.geospatial.requests.ReviewRequest;
import com.example.geospatial.services.ReviewService;

@ExtendWith(MockitoExtension.class)
class ReviewControllerTest {

    @Mock
    private ReviewService reviewServiceImpl;

    @Mock
    private TrailRepository trailRepository;

    @Mock
    private CustomUserDetails customUserDetails;

    @InjectMocks
    private ReviewController reviewController;

    private User testUser;
    private Trail testTrail;
    private ReviewRequest reviewRequest;
    private ReviewDTO testReviewDTO;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("test@mail.com");

        testTrail = new Trail();
        testTrail.setId(1L);
        testTrail.setName("Mountain Trail");

        reviewRequest = new ReviewRequest();
        reviewRequest.setRating(5);
        reviewRequest.setComment("Great trail!");

        testReviewDTO = new ReviewDTO(
                1L,
                5,
                "Great trail!",
                "2025-01-01",
                "test@mail.com",
                1L
        );
    }


    @Test
    void addReview_shouldReturnOk_whenValidRequest() {
        when(trailRepository.findById(1L)).thenReturn(Optional.of(testTrail));
        when(customUserDetails.getUser()).thenReturn(testUser);
        doReturn(new Review())
                .when(reviewServiceImpl).addReview(
                        reviewRequest.getRating(),
                        reviewRequest.getComment(),
                        testTrail,
                        testUser
                );

        ResponseEntity<Map<String, String>> response = reviewController.addReview(
                1L, reviewRequest, customUserDetails
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Review created successfully", response.getBody().get("message"));
        verify(reviewServiceImpl).addReview(
                reviewRequest.getRating(),
                reviewRequest.getComment(),
                testTrail,
                testUser
        );
    }

    @Test
    void addReview_shouldThrow_whenTrailNotFound() {
        when(trailRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () ->
                reviewController.addReview(99L, reviewRequest, customUserDetails)
        );
        verify(reviewServiceImpl, never()).addReview(
                anyInt(), anyString(), any(Trail.class), any(User.class)
        );
    }

    @Test
    void addReview_shouldThrow_whenCurrentUserIsNull() {
        when(trailRepository.findById(1L)).thenReturn(Optional.of(testTrail));

        assertThrows(NullPointerException.class, () ->
                reviewController.addReview(1L, reviewRequest, null)
        );
        verify(reviewServiceImpl, never()).addReview(
                anyInt(), anyString(), any(Trail.class), any(User.class)
        );
    }

    @Test
    void addReview_shouldCallServiceWithCorrectArgs() {
        when(trailRepository.findById(1L)).thenReturn(Optional.of(testTrail));
        when(customUserDetails.getUser()).thenReturn(testUser);
        doReturn(new Review())
                .when(reviewServiceImpl).addReview(5, "Great trail!", testTrail, testUser);

        reviewController.addReview(1L, reviewRequest, customUserDetails);

        verify(reviewServiceImpl).addReview(5, "Great trail!", testTrail, testUser);
    }


    @Test
    void getReviewsByTrail_shouldReturnOkWithList() {
        List<ReviewDTO> reviews = List.of(testReviewDTO);
        when(reviewServiceImpl.getReviewsByTrailId(1L)).thenReturn(reviews);

        ResponseEntity<?> response = reviewController.getReviewsByTrail(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(reviews, response.getBody());
    }

    @Test
    void getReviewsByTrail_shouldReturnOkWithEmptyList() {
        when(reviewServiceImpl.getReviewsByTrailId(1L)).thenReturn(Collections.emptyList());

        ResponseEntity<?> response = reviewController.getReviewsByTrail(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(Collections.emptyList(), response.getBody());
    }

    @Test
    void getReviewsByTrail_shouldReturn500_whenServiceThrows() {
        when(reviewServiceImpl.getReviewsByTrailId(1L)).thenThrow(new RuntimeException("DB error"));

        ResponseEntity<?> response = reviewController.getReviewsByTrail(1L);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("something went wrong with get all reviews by trail id", response.getBody());
    }



    @Test
    void getUserReviews_shouldReturnOkWithList() {
        List<ReviewDTO> reviews = List.of(testReviewDTO);
        when(customUserDetails.getUser()).thenReturn(testUser);
        when(reviewServiceImpl.getUserReviews(testUser)).thenReturn(reviews);

        ResponseEntity<?> response = reviewController.getUserReviews(customUserDetails);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(reviews, response.getBody());
        verify(reviewServiceImpl).getUserReviews(testUser);
    }

    @Test
    void getUserReviews_shouldReturnOkWithEmptyList() {
        when(customUserDetails.getUser()).thenReturn(testUser);
        when(reviewServiceImpl.getUserReviews(testUser)).thenReturn(Collections.emptyList());

        ResponseEntity<?> response = reviewController.getUserReviews(customUserDetails);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(Collections.emptyList(), response.getBody());
    }

    @Test
    void getUserReviews_shouldReturn500_whenServiceThrows() {
        when(customUserDetails.getUser()).thenReturn(testUser);
        when(reviewServiceImpl.getUserReviews(testUser)).thenThrow(new RuntimeException("DB error"));

        ResponseEntity<?> response = reviewController.getUserReviews(customUserDetails);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("something went wrong with get user reviews", response.getBody());
    }

    @Test
    void getUserReviews_shouldReturn500_whenCurrentUserIsNull() {
        ResponseEntity<?> response = reviewController.getUserReviews(null);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("something went wrong with get user reviews", response.getBody());
    }



    @Test
    void deleteReview_shouldReturnOk_whenServiceSucceeds() {
        doReturn(ResponseEntity.ok("Deleted")).when(reviewServiceImpl).deleteReview(1L);

        ResponseEntity<?> response = reviewController.deleteReview(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(reviewServiceImpl, times(1)).deleteReview(1L);
    }

    @Test
    void deleteReview_shouldReturn500_whenServiceThrows() {
        when(reviewServiceImpl.deleteReview(1L)).thenThrow(new RuntimeException("DB error"));

        ResponseEntity<?> response = reviewController.deleteReview(1L);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("something went wrong with delete review", response.getBody());
    }

    @Test
    void deleteReview_shouldCallServiceWithCorrectId() {
        doReturn(ResponseEntity.ok("Deleted")).when(reviewServiceImpl).deleteReview(42L);

        reviewController.deleteReview(42L);

        verify(reviewServiceImpl).deleteReview(42L);
        verify(reviewServiceImpl, never()).deleteReview(1L);
    }
}