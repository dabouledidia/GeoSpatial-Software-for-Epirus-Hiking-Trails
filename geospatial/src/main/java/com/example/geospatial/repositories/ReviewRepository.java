package com.example.geospatial.repositories;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.geospatial.models.Review;
import com.example.geospatial.models.Trail;

@Repository 
public interface ReviewRepository extends JpaRepository<Review, Long>{
    List<Review> findByTrail(Trail trail);
}
