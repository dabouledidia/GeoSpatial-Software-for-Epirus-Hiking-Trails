package com.example.geospatial.services;

import java.text.ParseException;

import org.springframework.security.core.userdetails.UserDetails;




public interface JWTService {
    String generateJwt(String email) throws ParseException;
    String extractEmail(String token);
    boolean isTokenValid(String token, UserDetails userDetails);
}
