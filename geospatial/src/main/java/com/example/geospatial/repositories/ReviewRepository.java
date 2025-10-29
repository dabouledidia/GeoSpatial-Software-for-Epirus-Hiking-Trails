package com.example.geospatial.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.geospatial.models.Review;

@Repository 
public interface ReviewRepository extends JpaRepository<Review, Long>{

}
