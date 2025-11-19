package com.example.geospatial.repositories;



import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.geospatial.models.Trail;

@Repository 
public interface TrailRepository extends JpaRepository<Trail, Long>{
    // List<Trail> findByEmail(Long trailId);
}
