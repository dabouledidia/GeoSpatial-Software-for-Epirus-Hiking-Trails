package com.example.geospatial.services.servicesImpl;

import java.sql.Date;
import java.text.ParseException;


import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.example.geospatial.services.JWTService;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import java.security.Key;


@Service
public class JWTServiceImpl implements JWTService {

    private final String secret  = "jxgEQeXHuPq8VdbyYFNkANdudQ53YUn4";
    private final Key key = Keys.hmacShaKeyFor(secret.getBytes());

    @Override
    public String generateJwt(String email) throws ParseException {
        return Jwts.builder()
            .setSubject(email) 
            .setIssuedAt(new Date(System.currentTimeMillis()))
            .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60)) 
            .signWith(key, SignatureAlgorithm.HS256)
            .compact();
}

    public String extractEmail(String token) {
        Claims claims = Jwts.parserBuilder()
                            .setSigningKey(key)     
                            .build()
                            .parseClaimsJws(token)
                            .getBody();
        return claims.getSubject();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        String email = extractEmail(token);
        return email.equals(userDetails.getUsername());
    }
    

}