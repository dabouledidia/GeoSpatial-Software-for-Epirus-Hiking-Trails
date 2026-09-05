package com.example.geospatial.DTO;

import java.time.LocalDateTime;

public class AnnotationDTO {

    private Long id;
    private Double lat;
    private Double lng;
    private LocalDateTime createdAt;
    private String description;
    private String type;
    private Long trailId;
    private String title;

   
    private String createdBy;

    public AnnotationDTO(
        Long id,
        Double lat,
        Double lng,
        LocalDateTime createdAt,
        String description,
        String type,
        Long trailId,
        String title,
        String createdBy
    ) {
        this.id = id;
        this.lat = lat;
        this.lng = lng;
        this.createdAt = createdAt;
        this.description = description;
        this.type = type;
        this.trailId = trailId;
        this.title = title;
        this.createdBy = createdBy;
    }

    public Long getId() { return id; }
    public Double getLat() { return lat; }
    public Double getLng() { return lng; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public String getDescription() { return description; }
    public String getType() { return type; }
    public Long getTrailId() { return trailId; }
    public String getTitle() { return title; }
    public String getCreatedBy() { return createdBy; }
}