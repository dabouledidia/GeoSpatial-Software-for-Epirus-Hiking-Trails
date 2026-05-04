package com.example.geospatial.services.servicesImpl;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.example.geospatial.DTO.UserDAO;
import com.example.geospatial.models.User;
import com.example.geospatial.repositories.UserRepository;
import com.example.geospatial.requests.RegisterRequest;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private BCryptPasswordEncoder passwordEncoder;

    @InjectMocks
    private UserServiceImpl userService;

    private User user;

    @BeforeEach
    void setUp() {
        user = new User("John", "Doe", "john@example.com", "password");
        user.setId(1L);
    }

    @Test
    void saveUser_success() {
        RegisterRequest request = new RegisterRequest("John", "Doe", "john@example.com", "password");

        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");

        ResponseEntity<?> response = userService.saveUser(request);

        assertEquals(200, response.getStatusCodeValue());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void saveUser_userAlreadyExists() {
        RegisterRequest request = new RegisterRequest("John", "Doe", "john@example.com", "password");

        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(user));

        ResponseEntity<?> response = userService.saveUser(request);

        assertEquals(400, response.getStatusCodeValue());
        verify(userRepository, never()).save(any());
    }

    @Test
    void isUserPresent_true() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        boolean result = userService.isUserPresent(user);

        assertTrue(result);
    }

    @Test
    void isUserPresent_false() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        boolean result = userService.isUserPresent(user);

        assertFalse(result);
    }

    @Test
    void loadUserByUsername_success() {
        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(user));

        var userDetails = userService.loadUserByUsername("john@example.com");

        assertNotNull(userDetails);
        assertEquals("john@example.com", userDetails.getUsername());
    }

    @Test
    void loadUserByUsername_notFound() {
        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.empty());

        assertThrows(Exception.class, () -> {
            userService.loadUserByUsername("john@example.com");
        });
    }

    @Test
    void getAllUsers_success() {
        List<User> users = List.of(user);
        when(userRepository.findAll()).thenReturn(users);

        List<UserDAO> result = userService.getAllUsers();

        assertEquals(1, result.size());
        assertEquals(user.getEmail(), result.get(0).getEmail());
    }

    @Test
    void deleteUser_success() {
        when(userRepository.existsById(1L)).thenReturn(true);

        ResponseEntity<?> response = userService.deleteUser(1L);

        assertEquals(200, response.getStatusCodeValue());
        verify(userRepository).deleteById(1L);
    }

    @Test
    void deleteUser_notFound() {
        when(userRepository.existsById(1L)).thenReturn(false);

        ResponseEntity<?> response = userService.deleteUser(1L);

        assertEquals(404, response.getStatusCodeValue());
        verify(userRepository, never()).deleteById(anyLong());
    }
}