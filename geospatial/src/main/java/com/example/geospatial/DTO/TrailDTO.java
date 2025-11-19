package com.example.geospatial.DTO;

public class TrailDTO {

    private Long id;
    private String trailName;
    private String location;
    private double lengthKm;
    private double duration;
    private String difficulty;
    private String description;
    private String email;
    
    public TrailDTO(Long id, String trailName, String location, double lengthKm, double duration, String difficulty,
            String description, String email) {
        this.id = id;
        this.trailName = trailName;
        this.location = location;
        this.lengthKm = lengthKm;
        this.duration = duration;
        this.difficulty = difficulty;
        this.description = description;
        this.email = email;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTrailName() {
        return trailName;
    }

    public void setTrailName(String trailName) {
        this.trailName = trailName;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public double getLengthKm() {
        return lengthKm;
    }

    public void setLengthKm(double lengthKm) {
        this.lengthKm = lengthKm;
    }

    public double getDuration() {
        return duration;
    }

    public void setDuration(double duration) {
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    
}
