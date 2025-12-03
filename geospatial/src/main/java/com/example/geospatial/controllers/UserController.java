package com.example.geospatial.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.example.geospatial.DTO.UserDAO;
import com.example.geospatial.services.UserService;

@RestController
public class UserController {

    @Autowired
    private UserService userServiceImpl;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all_users")
    public ResponseEntity<?> getAllUsers(){
        List<UserDAO> users = userServiceImpl.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/deleteUser/{id}")
    public ResponseEntity<?> deleteUser(@Validated @PathVariable long id){
        try {
            return ResponseEntity.ok(userServiceImpl.deleteUser(id));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("something went wrong with delete trail");
        } 
    }
}
