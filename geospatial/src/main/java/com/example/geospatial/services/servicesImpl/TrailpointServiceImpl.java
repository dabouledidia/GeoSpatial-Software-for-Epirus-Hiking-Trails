package com.example.geospatial.services.servicesImpl;

import com.example.geospatial.DTO.TrailpointDTO;
import com.example.geospatial.models.Trail;
import com.example.geospatial.models.Trailpoint;
import com.example.geospatial.repositories.TrailPointRepository;
import com.example.geospatial.repositories.TrailRepository;
import com.example.geospatial.services.FileStorageService;
import com.example.geospatial.services.TrailpointService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TrailpointServiceImpl implements TrailpointService {

    private final TrailPointRepository trailPointRepository;
    private final TrailRepository trailRepository;
    private final FileStorageService fileStorageService;

    public TrailpointServiceImpl(
            TrailPointRepository trailPointRepository,
            TrailRepository trailRepository,
            FileStorageService fileStorageService) {
        this.trailPointRepository = trailPointRepository;
        this.trailRepository = trailRepository;
        this.fileStorageService = fileStorageService;
    }

    // Get all points for a trail
    public List<TrailpointDTO> getPointsByTrail(Long trailId) {
        return trailPointRepository.findByTrailIdOrderByPointOrderAsc(trailId)
                .stream()
                .map(p -> new TrailpointDTO(p.getId(), p.getPointOrder(), p.getLat(), p.getLng(), p.getElevation()))
                .collect(Collectors.toList());
    }

    // Save points drawn on map (replaces existing)
    @Transactional
    public List<TrailpointDTO> savePoints(Long trailId, List<TrailpointDTO> points) {
        Trail trail = trailRepository.findById(trailId)
                .orElseThrow(() -> new RuntimeException("Trail not found: " + trailId));

        // A trail is represented either by drawn points or by an imported
        // GPX file, not both. If this trail previously had a GPX file,
        // drop it now so the two representations can't disagree.
        if (trail.getGpxPath() != null) {
            try {
                fileStorageService.deleteFile(trail.getGpxPath());
            } catch (Exception ignored) {
                // Stale file on disk isn't worth failing the save over —
                // the DB reference is what matters and is cleared below.
            }
            trail.setGpxPath(null);
            trailRepository.save(trail);
        }

        trailPointRepository.deleteAllByTrailId(trailId);

        List<Trailpoint> entities = new ArrayList<>();
        for (int i = 0; i < points.size(); i++) {
            TrailpointDTO dto = points.get(i);
            entities.add(new Trailpoint(trail, i, dto.getLat(), dto.getLng(), dto.getElevation()));
        }

        List<Trailpoint> saved = trailPointRepository.saveAll(entities);
        return saved.stream()
                .map(p -> new TrailpointDTO(p.getId(), p.getPointOrder(), p.getLat(), p.getLng(), p.getElevation()))
                .collect(Collectors.toList());
    }

    // Import a GPX file: store it on disk as-is and remember its path.
    // No longer parsed into individual point rows — the file is served
    // back raw and parsed client-side (TrailMapComponent.parseGpx already
    // does this via the gpxUrl input).
    @Transactional
    public String importGpx(Long trailId, MultipartFile file) throws Exception {
        Trail trail = trailRepository.findById(trailId)
                .orElseThrow(() -> new RuntimeException("Trail not found: " + trailId));

        // Same reasoning as above, reversed: importing a file replaces
        // any previously drawn points.
        trailPointRepository.deleteAllByTrailId(trailId);

        String path = fileStorageService.storeGpxFile(trailId, file);
        trail.setGpxPath(path);
        trailRepository.save(trail);

        return path;
    }

    public byte[] getGpxFile(Long trailId) throws Exception {
        Trail trail = trailRepository.findById(trailId)
                .orElseThrow(() -> new RuntimeException("Trail not found: " + trailId));

        if (trail.getGpxPath() == null) {
            throw new FileNotFoundException("No GPX file stored for trail " + trailId);
        }

        return fileStorageService.readFile(trail.getGpxPath());
    }

    // Calculate total distance in km from saved points.
    // NOTE: only meaningful for point-based trails now — a GPX-imported
    // trail has no trail_points rows, so this returns 0.0 for those.
    // Distance for GPX-imported trails is computed client-side instead
    // (see TrailMapComponent.calculateDistance, run against the parsed file).
    public Double calculateDistance(Long trailId) {
        List<Trailpoint> points = trailPointRepository.findByTrailIdOrderByPointOrderAsc(trailId);
        if (points.size() < 2) return 0.0;

        double total = 0;
        for (int i = 1; i < points.size(); i++) {
            total += haversine(
                points.get(i-1).getLat(), points.get(i-1).getLng(),
                points.get(i).getLat(),   points.get(i).getLng()
            );
        }
        return Math.round(total * 10.0) / 10.0;
    }

    private double haversine(double lat1, double lng1, double lat2, double lng2) {
        final int R = 6371;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLng = Math.toRadians(lng2 - lng1);
        double a = Math.sin(dLat/2) * Math.sin(dLat/2)
                 + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                 * Math.sin(dLng/2) * Math.sin(dLng/2);
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    }
}