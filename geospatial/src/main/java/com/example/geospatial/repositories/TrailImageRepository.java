package com.example.geospatial.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.geospatial.models.TrailImage;

@Repository
public interface TrailImageRepository extends JpaRepository<TrailImage, Long> {

}
