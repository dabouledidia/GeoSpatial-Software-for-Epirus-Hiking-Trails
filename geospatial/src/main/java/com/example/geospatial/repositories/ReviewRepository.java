package com.example.geospatial.repositories;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.geospatial.models.Review;

@Repository 
public interface ReviewRepository extends JpaRepository<Review, Long>{
    List<Review> findByTrailId(Long trailId);
    List<Review> findByUserId(Long userId);}
