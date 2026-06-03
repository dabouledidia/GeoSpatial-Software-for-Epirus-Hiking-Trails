package com.example.geospatial.controllers;

import com.example.geospatial.DTO.TrailpointDTO;
import com.example.geospatial.services.TrailpointService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/trails/{trailId}/points")
@CrossOrigin(origins = "http://localhost:4200")
public class TrailpointController {

    private final TrailpointService trailpointService;

    public TrailpointController(TrailpointService trailpointService) {
        this.trailpointService = trailpointService;
    }

    // GET /api/trails/{trailId}/points
    @GetMapping
    public ResponseEntity<List<TrailpointDTO>> getPoints(@PathVariable Long trailId) {
        return ResponseEntity.ok(trailpointService.getPointsByTrail(trailId));
    }

    // POST /api/trails/{trailId}/points
    // Body: [{ lat, lng, elevation }, ...]
    @PostMapping
    public ResponseEntity<List<TrailpointDTO>> savePoints(
            @PathVariable Long trailId,
            @RequestBody List<TrailpointDTO> points) {
        return ResponseEntity.ok(trailpointService.savePoints(trailId, points));
    }

    // POST /api/trails/{trailId}/points/gpx
    // Multipart: file = .gpx
    @PostMapping("/gpx")
    public ResponseEntity<List<TrailpointDTO>> importGpx(
            @PathVariable Long trailId,
            @RequestParam("file") MultipartFile file) {
        try {
            return ResponseEntity.ok(trailpointService.importGpx(trailId, file));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}