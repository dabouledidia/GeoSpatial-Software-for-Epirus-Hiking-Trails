package com.example.geospatial.services.servicesImpl;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.geospatial.services.FileStorageService;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileStorageServiceImpl implements FileStorageService{


    @Value("${app.upload.gpx-dir:uploads/gpx}")
    private String gpxUploadDir;


    public String storeGpxFile(Long trailId, MultipartFile file) throws IOException {
        Path dir = Paths.get(gpxUploadDir);
        Files.createDirectories(dir);

        String filename = "trail-" + trailId + "-" + UUID.randomUUID() + ".gpx";
        Path target = dir.resolve(filename).normalize();

        file.transferTo(target);

        return target.toString();
    }

    public byte[] readFile(String relativePath) throws IOException {
        return Files.readAllBytes(Paths.get(relativePath));
    }

    public void deleteFile(String relativePath) throws IOException {
        if (relativePath != null) {
            Files.deleteIfExists(Paths.get(relativePath));
        }
    }
}