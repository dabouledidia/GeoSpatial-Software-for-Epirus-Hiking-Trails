package com.example.geospatial.services;



import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;

import com.example.geospatial.models.User;
import com.example.geospatial.requests.RegisterRequest;

public interface UserService {
	public ResponseEntity<?> saveUser(RegisterRequest registerRequest);
    public boolean isUserPresent(User user);
    UserDetails loadUserByUsername(String email);
}
