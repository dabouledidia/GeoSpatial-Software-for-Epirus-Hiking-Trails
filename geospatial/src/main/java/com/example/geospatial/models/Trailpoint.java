package com.example.geospatial.models;

import jakarta.persistence.*;

@Entity
@Table(name = "trail_points")
public class Trailpoint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trail_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Trail trail;

    @Column(name = "point_order", nullable = false)
    private Integer pointOrder;

    @Column(nullable = false)
    private Double lat;

    @Column(nullable = false)
    private Double lng;

    @Column
    private Double elevation;

    public Trailpoint() {}

    public Trailpoint(Trail trail, Integer pointOrder, Double lat, Double lng, Double elevation) {
        this.trail = trail;
        this.pointOrder = pointOrder;
        this.lat = lat;
        this.lng = lng;
        this.elevation = elevation;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Trail getTrail() { return trail; }
    public void setTrail(Trail trail) { this.trail = trail; }

    public Integer getPointOrder() { return pointOrder; }
    public void setPointOrder(Integer pointOrder) { this.pointOrder = pointOrder; }

    public Double getLat() { return lat; }
    public void setLat(Double lat) { this.lat = lat; }

    public Double getLng() { return lng; }
    public void setLng(Double lng) { this.lng = lng; }

    public Double getElevation() { return elevation; }
    public void setElevation(Double elevation) { this.elevation = elevation; }
}