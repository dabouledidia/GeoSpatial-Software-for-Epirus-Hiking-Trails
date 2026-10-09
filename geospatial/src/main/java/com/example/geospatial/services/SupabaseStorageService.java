
package com.example.geospatial.services;

import java.io.IOException;

import org.springframework.web.multipart.MultipartFile;

public interface SupabaseStorageService {

    String uploadImage(MultipartFile image)
            throws IOException, InterruptedException;

    String uploadGpx(MultipartFile file)
            throws IOException, InterruptedException;
}