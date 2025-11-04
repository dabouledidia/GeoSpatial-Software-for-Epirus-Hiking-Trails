package com.example.geospatial.services.servicesImpl;

import java.nio.charset.StandardCharsets;
import java.sql.Date;
import java.text.ParseException;

import javax.crypto.SecretKey;

import org.apache.tomcat.util.net.openssl.ciphers.Authentication;
import org.springframework.stereotype.Service;

import com.example.geospatial.services.JWTService;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JWTServiceImpl implements JWTService {

    private final String key = "jxgEQeXHuPq8VdbyYFNkANdudQ53YUn4";
    private final SecretKey secretKey = Keys.hmacShaKeyFor(key.getBytes(StandardCharsets.UTF_8));

    @Override
    public String generateJwt(String email) throws ParseException {
        Date date = new Date(0); 
        return  Jwts.builder()
                .setIssuer("MFA Server")
                .setSubject("JWT Auth Token")
                .claim("email", email)
                .setIssuedAt(date)
                .setExpiration(new Date(date.getTime() + 60000))
                .signWith(secretKey)
                .compact();
    }

    @Override
    public Authentication validateJwt(String jwt) {
        // JwtParser jwtParser = Jwts.parserBuilder()
        //         .setSigningKey(secretKey)
        //         .build();
        // Claims claims = jwtParser.parseClaimsJws(jwt).getBody();
        // String email = (String)claims.getOrDefault("email",null);
        // if(Objects.nonNull(email)){
        //     return new UsernamePasswordAuthenticationToken(email, null, new ArrayList<>());
        // }
        return null;
    }

}