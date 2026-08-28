package com.example.geospatial.services;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface FileStorageService {

    String storeGpxFile(Long trailId, MultipartFile file) throws IOException;

    byte[] readFile(String relativePath) throws IOException;

    void deleteFile(String relativePath) throws IOException;
}