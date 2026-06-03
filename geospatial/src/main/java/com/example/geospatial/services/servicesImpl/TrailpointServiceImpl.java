package com.example.geospatial.services.servicesImpl;

import com.example.geospatial.DTO.TrailpointDTO;
import com.example.geospatial.models.Trail;
import com.example.geospatial.models.Trailpoint;
import com.example.geospatial.repositories.TrailPointRepository;
import com.example.geospatial.repositories.TrailRepository;
import com.example.geospatial.services.TrailpointService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.w3c.dom.Document;
import org.w3c.dom.NodeList;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TrailpointServiceImpl implements TrailpointService{

    private final TrailPointRepository trailPointRepository;
    private final TrailRepository trailRepository;

    public TrailpointServiceImpl(TrailPointRepository trailPointRepository, TrailRepository trailRepository) {
        this.trailPointRepository = trailPointRepository;
        this.trailRepository = trailRepository;
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

    // Import from GPX file
    @Transactional
    public List<TrailpointDTO> importGpx(Long trailId, MultipartFile file) throws Exception {
        Trail trail = trailRepository.findById(trailId)
                .orElseThrow(() -> new RuntimeException("Trail not found: " + trailId));

        List<Trailpoint> points = parseGpx(file.getInputStream(), trail);

        trailPointRepository.deleteAllByTrailId(trailId);
        List<Trailpoint> saved = trailPointRepository.saveAll(points);

        return saved.stream()
                .map(p -> new TrailpointDTO(p.getId(), p.getPointOrder(), p.getLat(), p.getLng(), p.getElevation()))
                .collect(Collectors.toList());
    }

    // Parse GPX file into TrailPoint list
    private List<Trailpoint> parseGpx(InputStream inputStream, Trail trail) throws Exception {
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        DocumentBuilder builder = factory.newDocumentBuilder();
        Document doc = builder.parse(inputStream);
        doc.getDocumentElement().normalize();

        // Try trkpt first, then rtept
        NodeList nodes = doc.getElementsByTagName("trkpt");
        if (nodes.getLength() == 0) {
            nodes = doc.getElementsByTagName("rtept");
        }

        List<Trailpoint> points = new ArrayList<>();
        for (int i = 0; i < nodes.getLength(); i++) {
            org.w3c.dom.Element el = (org.w3c.dom.Element) nodes.item(i);
            double lat = Double.parseDouble(el.getAttribute("lat"));
            double lng = Double.parseDouble(el.getAttribute("lon"));

            Double elevation = null;
            NodeList eleNodes = el.getElementsByTagName("ele");
            if (eleNodes.getLength() > 0) {
                elevation = Double.parseDouble(eleNodes.item(0).getTextContent().trim());
            }

            points.add(new Trailpoint(trail, i, lat, lng, elevation));
        }

        if (points.isEmpty()) {
            throw new RuntimeException("No track points found in GPX file");
        }

        return points;
    }

    // Calculate total distance in km from saved points
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