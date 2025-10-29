package com.example.geospatial.models;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "trails")
public class Trail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "location")
    private String location;

    @Column(name = ("length_Km"))
    private Double lengthKm;

    @Column(name = "duration")
    private Double duration;

    @Column(name = "difficulty")
    private String difficulty;

    @Column(name = "description", length = 2000)
    private String description;

    @Column(name = "path_image")
    private List<String> pathImage;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "trail", cascade = CascadeType.ALL, orphanRemoval = true,  fetch = FetchType.LAZY)
    private List<Review> reviews = new ArrayList<>();

    public Trail(){}

    public Trail(String name, String location, Double lengthKm, Double duration, String difficulty, String description,
            List<String> pathImage) {
                super();
                this.name = name;
                this.location = location;
                this.lengthKm = lengthKm;
                this.duration = duration;
                this.difficulty = difficulty;
                this.description = description;
                this.pathImage = pathImage;
                this.reviews = new ArrayList<>();
                this.createdAt = LocalDateTime.now();

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Double getLengthKm() {
        return lengthKm;
    }

    public void setLengthKm(Double lengthKm) {
        this.lengthKm = lengthKm;
    }

    public Double getDuration() {
        return duration;
    }

    public void setDuration(Double duration) {
        this.duration = duration;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<String> getPathImage() {
        return pathImage;
    }

    public void setPathImage(List<String> pathImage) {
        this.pathImage = pathImage;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
  
    public List<Review> getReviews() {
    return reviews;
    }

    public void setReviews(List<Review> reviews) {
        this.reviews = reviews;
    }
}
