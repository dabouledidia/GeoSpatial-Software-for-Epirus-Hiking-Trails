package com.example.geospatial.services.servicesImpl;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.example.geospatial.models.Trail;
import com.example.geospatial.models.TrailImage;
import com.example.geospatial.repositories.TrailImageRepository;
import com.example.geospatial.services.ImageService;

@Service
public class ImageServiceImpl implements ImageService{

    @Autowired
    private TrailImageRepository trailImageRepository;

@Override
public ResponseEntity<?> addImages(String[] imagesURL, Trail trail) {

    for (String url : imagesURL) {
        TrailImage image = new TrailImage(url, trail);
        trailImageRepository.save(image);
    }

    return ResponseEntity.ok(Map.of("message", "Images added successfully"));
}

}
