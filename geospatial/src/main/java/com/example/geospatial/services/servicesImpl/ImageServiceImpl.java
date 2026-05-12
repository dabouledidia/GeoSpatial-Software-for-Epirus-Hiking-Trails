package com.example.geospatial.services.servicesImpl;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.example.geospatial.DTO.ImagesDTO;
import com.example.geospatial.models.Trail;
import com.example.geospatial.models.TrailImage;
import com.example.geospatial.repositories.TrailImageRepository;
import com.example.geospatial.services.ImageService;

@Service
public class ImageServiceImpl implements ImageService{

    @Autowired
    private TrailImageRepository trailImageRepository;

@Override
public ResponseEntity<?> addImages(List<String> imagesURL, Trail trail) {

    for (String url : imagesURL) {
        TrailImage image = new TrailImage(url, trail);
        trailImageRepository.save(image);
    }

    return ResponseEntity.ok(Map.of("message", "Images added successfully"));
}

@Override
public List<ImagesDTO> getImagesByTrail(Long trailId) {

    List<TrailImage> trailImages = trailImageRepository.findByTrailId(trailId);

    return trailImages.stream()
            .map(r -> new ImagesDTO(
                    r.getId(),
                    r.getImageUrl()
            ))
            .toList();
}

@Override
public ResponseEntity<?> deleteImage(Long imageId) {
        Optional<TrailImage> existingTrailImage = trailImageRepository.findById(imageId);
        
        if (existingTrailImage.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Image with id " + imageId + " not found");
        }

        trailImageRepository.deleteById(imageId);
        
        return ResponseEntity.ok("Deleted!");
    }
}


