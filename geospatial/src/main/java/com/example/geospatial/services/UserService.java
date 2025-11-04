package com.example.geospatial.services;



import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.example.geospatial.models.User;

@Service
public interface UserService {
	public ResponseEntity<?> saveUser(User user);
    public boolean isUserPresent(User user);
}
