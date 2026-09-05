package com.example.geospatial.controllers;

import com.example.geospatial.DTO.TrailpointDTO;
import com.example.geospatial.services.TrailpointService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/trails/{trailId}/points")
@CrossOrigin(origins = "http://localhost:4200")
public class TrailpointController {

    private final TrailpointService trailpointService;

    public TrailpointController(TrailpointService trailpointService) {
        this.trailpointService = trailpointService;
    }

    @GetMapping
    public ResponseEntity<List<TrailpointDTO>> getPoints(@PathVariable Long trailId) {
        return ResponseEntity.ok(trailpointService.getPointsByTrail(trailId));
    }

    @PostMapping
    public ResponseEntity<List<TrailpointDTO>> savePoints(
            @PathVariable Long trailId,
            @RequestBody List<TrailpointDTO> points) {
        return ResponseEntity.ok(trailpointService.savePoints(trailId, points));
    }

    @PostMapping("/gpx")
    public ResponseEntity<?> importGpx(
            @PathVariable Long trailId,
            @RequestParam("file") MultipartFile file) {
        try {
            String path = trailpointService.importGpx(trailId, file);
            return ResponseEntity.ok(Map.of("gpxPath", path));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Serves the raw GPX file back — TrailMapComponent's [gpxUrl] input
    // fetches this URL directly and parses it client-side.
    @GetMapping("/gpx")
    public ResponseEntity<byte[]> getGpxFile(@PathVariable Long trailId) {
        try {
            byte[] data = trailpointService.getGpxFile(trailId);
            return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, "application/gpx+xml")
                .body(data);
        } catch (FileNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}