package com.example.geospatial.services.servicesImpl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.example.geospatial.DTO.TrailDTO;
import com.example.geospatial.models.Trail;
import com.example.geospatial.models.User;
import com.example.geospatial.repositories.TrailRepository;
import com.example.geospatial.services.TrailService;

@Service
public class TrailServiceImpl implements TrailService{

    @Autowired
    private TrailRepository trailRepository;

    public ResponseEntity<?> createTrail(Trail trail){
        try {
            trailRepository.save(trail);
            return ResponseEntity.ok(trail);
        } catch (Exception e){
           return ResponseEntity.badRequest().body("something went wrong with creation of trail");
        }
    }

    public Optional<Trail> getTrail(long id) {
        return trailRepository.findById(id);
    }

    @Override
    public List<TrailDTO> getAllTrail() {
        List<Trail> trails = trailRepository.findAll();

        return trails.stream().map(r ->
        new TrailDTO(
            r.getId(),
            r.getName(),
            r.getLocation(),
            r.getLengthKm(),
            r.getDuration(),
            r.getDifficulty(),
            r.getDescription(),
            r.getUser().getEmail()
        )
    ).toList();
    }

    @Override
    public List<TrailDTO> getUserTrail(User user) {
        List<Trail> trails = trailRepository.findByUserId(user.getId());
        return trails.stream().map(r ->
        new TrailDTO(
            r.getId(),
            r.getName(),
            r.getLocation(),
            r.getLengthKm(),
            r.getDuration(),
            r.getDifficulty(),
            r.getDescription(),
            r.getUser().getEmail()
        )
    ).toList();
    }

    @Override
    public ResponseEntity<?> updateTrail(Trail trail) {
        Optional<Trail> existingTrailOpt = trailRepository.findById(trail.getId());

        if (existingTrailOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Trail with id " + trail.getId() + " not found");
        }

        Trail existingTrail = existingTrailOpt.get();

        existingTrail.setName(trail.getName());
        existingTrail.setLocation(trail.getLocation());
        existingTrail.setLengthKm(trail.getLengthKm());
        existingTrail.setDuration(trail.getDuration());
        existingTrail.setDifficulty(trail.getDifficulty());
        existingTrail.setDescription(trail.getDescription());

        trailRepository.save(existingTrail);

        return ResponseEntity.ok("Trail updated successfully!");
    }

    @Override
    public ResponseEntity<?> deleteTrail(long id) {
        Optional<Trail> existingTrailOpt = trailRepository.findById(id);

        if (existingTrailOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Trail with id " + id + " not found");
        }

        trailRepository.deleteById(id);
        
        return ResponseEntity.ok("Deleted!");
    }

}
