package com.example.geospatial.services;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.example.geospatial.DTO.TrailpointDTO;

public interface TrailpointService {

    public List<TrailpointDTO> getPointsByTrail(Long trailId);
    public List<TrailpointDTO> savePoints(Long trailId, List<TrailpointDTO> points);
    public List<TrailpointDTO> importGpx(Long trailId, MultipartFile file) throws Exception;
    public Double calculateDistance(Long trailId);
    

}
