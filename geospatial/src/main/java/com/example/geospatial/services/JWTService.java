package com.example.geospatial.services;

import java.text.ParseException;

import org.apache.tomcat.util.net.openssl.ciphers.Authentication;



public interface JWTService {
    String generateJwt(String email) throws ParseException;
    Authentication validateJwt(String jtw);

}
