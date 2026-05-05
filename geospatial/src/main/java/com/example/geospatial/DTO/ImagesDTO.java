package com.example.geospatial.DTO;

public class ImagesDTO {

    private Long id;
    private String imageURL;

    public ImagesDTO() {}

    public ImagesDTO(Long id, String imageURL) {
        this.id = id;
        this.imageURL = imageURL;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getImageURL() {
        return imageURL;
    }

    public void setImageURL(String imageURL) {
        this.imageURL = imageURL;
    }
}