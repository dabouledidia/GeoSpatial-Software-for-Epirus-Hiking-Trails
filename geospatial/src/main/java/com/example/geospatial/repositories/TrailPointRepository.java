package com.example.geospatial.repositories;

import com.example.geospatial.models.Trailpoint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrailPointRepository extends JpaRepository<Trailpoint, Long> {

    List<Trailpoint> findByTrailIdOrderByPointOrderAsc(Long trailId);

    @Modifying
    @Query("DELETE FROM Trailpoint tp WHERE tp.trail.id = :trailId")
    void deleteAllByTrailId(Long trailId);
}