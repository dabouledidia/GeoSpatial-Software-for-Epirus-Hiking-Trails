package com.example.geospatial.controllers;


import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.geospatial.models.CustomUserDetails;
import com.example.geospatial.requests.LoginRequest;
import com.example.geospatial.requests.RegisterRequest;
import com.example.geospatial.services.JWTService;
import com.example.geospatial.services.UserService;

@RestController
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JWTService jwtService;


    @PostMapping("/register")
    public ResponseEntity<?> addUser(@Validated @RequestBody RegisterRequest registerRequest){
        try {
            return ResponseEntity.ok(userService.saveUser(registerRequest));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("something went wrong with register");
        } 
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@Validated @RequestBody LoginRequest loginRequest){
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getEmail(),
                    loginRequest.getPassword()
                )
            );

            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

            String token = jwtService.generateJwt(userDetails);

            return ResponseEntity.ok(Map.of(
                "email", loginRequest.getEmail(),
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

    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser(){
        return ResponseEntity.ok(Map.of("message", "User logged out successfully"));
    }
}
