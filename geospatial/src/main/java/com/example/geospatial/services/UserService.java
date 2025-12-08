package com.example.geospatial.services;



import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;

import com.example.geospatial.DTO.UserDAO;
import com.example.geospatial.models.User;
import com.example.geospatial.requests.RegisterRequest;

public interface UserService {
	public ResponseEntity<?> saveUser(RegisterRequest registerRequest);
    public boolean isUserPresent(User user);
    public UserDetails loadUserByUsername(String email);
    public List<UserDAO> getAllUsers();
    public ResponseEntity<?> deleteUser(long id);
}
