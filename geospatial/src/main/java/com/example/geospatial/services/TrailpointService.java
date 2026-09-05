package com.example.geospatial.services;

import com.example.geospatial.DTO.TrailpointDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface TrailpointService {

    List<TrailpointDTO> getPointsByTrail(Long trailId);

    List<TrailpointDTO> savePoints(Long trailId, List<TrailpointDTO> points);


    String importGpx(Long trailId, MultipartFile file) throws Exception;

    byte[] getGpxFile(Long trailId) throws Exception;

    Double calculateDistance(Long trailId);
}