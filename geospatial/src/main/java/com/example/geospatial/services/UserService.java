package com.example.geospatial.services;



import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;

import com.example.geospatial.models.User;

public interface UserService {
	public ResponseEntity<?> saveUser(User user);
    public boolean isUserPresent(User user);
    UserDetails loadUserByUsername(String email);
}
