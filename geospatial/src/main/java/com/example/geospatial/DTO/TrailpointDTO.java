package com.example.geospatial.DTO;


public class TrailpointDTO {

    private Long id;
    private Integer pointOrder;
    private Double lat;
    private Double lng;
    private Double elevation;

    public TrailpointDTO() {}

    public TrailpointDTO(Long id, Integer pointOrder, Double lat, Double lng, Double elevation) {
        this.id = id;
        this.pointOrder = pointOrder;
        this.lat = lat;
        this.lng = lng;
        this.elevation = elevation;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Integer getPointOrder() { return pointOrder; }
    public void setPointOrder(Integer pointOrder) { this.pointOrder = pointOrder; }

    public Double getLat() { return lat; }
    public void setLat(Double lat) { this.lat = lat; }

    public Double getLng() { return lng; }
    public void setLng(Double lng) { this.lng = lng; }

    public Double getElevation() { return elevation; }
    public void setElevation(Double elevation) { this.elevation = elevation; }
}