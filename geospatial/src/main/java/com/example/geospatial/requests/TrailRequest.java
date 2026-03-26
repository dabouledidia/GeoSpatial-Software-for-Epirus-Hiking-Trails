package com.example.geospatial.requests;

public class TrailRequest {
    private String name;
    private String location;
    private double lengthKm;
    private double duration;
    private String difficulty;
    private String description;
    private String image;

    public TrailRequest(){}

    public TrailRequest(String name, String location, double lengthKm, double duration, String difficulty,
            String description, String image) {
        this.name = name;
        this.location = location;
        this.lengthKm = lengthKm;
        this.duration = duration;
        this.difficulty = difficulty;
        this.description = description;
        this.image = image;
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
    public String getImage() {
        return image;
    }
    public void setImage(String image) {
        this.image = image;
    }


}
