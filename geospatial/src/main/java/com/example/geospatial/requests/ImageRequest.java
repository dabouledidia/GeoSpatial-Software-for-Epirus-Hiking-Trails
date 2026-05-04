package com.example.geospatial.requests;

public class ImageRequest {

    private String[] imagesURL;

    public ImageRequest() {}

    public ImageRequest(String[] imagesURL) {
        this.imagesURL = imagesURL;
    }

    public String[] getImagesURL() {
        return imagesURL;
    }

    public void setImagesURL(String[] imagesURL) {
        this.imagesURL = imagesURL;
    }
}