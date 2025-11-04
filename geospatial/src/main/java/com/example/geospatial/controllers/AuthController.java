package com.example.geospatial.controllers;


import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.geospatial.models.CustomUserDetails;
import com.example.geospatial.models.User;
import com.example.geospatial.requests.LoginRequest;
import com.example.geospatial.services.JWTService;
import com.example.geospatial.services.servicesImpl.UserServiceImpl;

@RestController
public class AuthController {

    @Autowired
    private UserServiceImpl userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JWTService jwtService;


    @PostMapping("/register")
    @CrossOrigin(origins = "http://localhost:4200")
    public ResponseEntity<?> addUser(@Validated @RequestBody User user){
        try {
            return ResponseEntity.ok(userService.saveUser(user));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("something went wrong with register");
        } 
    }

    @PostMapping("/login")
    @CrossOrigin(origins = "http://localhost:4200")
    public ResponseEntity<?> loginUser(@Validated @RequestBody LoginRequest loginRequest){
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getEmail(),
                    loginRequest.getPassword()
                )
            );

            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

            String token = jwtService.generateJwt(userDetails.getUsername());

            return ResponseEntity.ok(Map.of(
                "email", loginRequest.getEmail(),
                "tokenValid", false,
                "authValid", true,
                "mfaRequired", false,
                "message", "User authenticated using email and password",
                "jwt", token
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Something went wrong with login");
        }
    }
}
