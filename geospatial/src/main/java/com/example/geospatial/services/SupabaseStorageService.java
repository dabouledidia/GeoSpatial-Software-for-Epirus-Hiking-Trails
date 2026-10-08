package com.example.geospatial.services;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class SupabaseStorageService {

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.service-role-key}")
    private String serviceRoleKey;

    private final HttpClient httpClient = HttpClient.newHttpClient();

    public String uploadImage(MultipartFile image) throws IOException, InterruptedException {

        String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();

        String uploadUrl = supabaseUrl
                + "/storage/v1/object/images/"
                + fileName;

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(uploadUrl))
                .header("Authorization", "Bearer " + serviceRoleKey)
                .header("Content-Type", image.getContentType())
                .POST(HttpRequest.BodyPublishers.ofByteArray(image.getBytes()))
                .build();

        HttpResponse<String> response =
                httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() < 200 || response.statusCode() >= 300) {
            throw new RuntimeException(
                    "Supabase upload failed: "
                    + response.statusCode()
                    + " - "
                    + response.body()
            );
        }

        return supabaseUrl
                + "/storage/v1/object/public/images/"
                + fileName;
    }
}