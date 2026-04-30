package com.example.geospatial.controllers;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;

import com.example.geospatial.models.CustomUserDetails;
import com.example.geospatial.models.User;
import com.example.geospatial.requests.LoginRequest;
import com.example.geospatial.requests.RegisterRequest;
import com.example.geospatial.services.JWTService;
import com.example.geospatial.services.UserService;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private UserService userService;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JWTService jwtService;

    @Mock
    private Authentication authentication;

    @Mock
    private CustomUserDetails customUserDetails;

    @InjectMocks
    private AuthController authController;

    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;
    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("test@mail.com");

        registerRequest = new RegisterRequest();
        registerRequest.setEmail("test@mail.com");
        registerRequest.setPassword("password123");
        registerRequest.setFirstname("John");
        registerRequest.setLastname("Doe");

        loginRequest = new LoginRequest();
        loginRequest.setEmail("test@mail.com");
        loginRequest.setPassword("password123");
    }



    @Test
    void register_shouldReturnOk_whenValidRequest() {
        doReturn(ResponseEntity.ok("User saved")).when(userService).saveUser(registerRequest);

        ResponseEntity<?> response = authController.addUser(registerRequest);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(userService, times(1)).saveUser(registerRequest);
    }

    @Test
    void register_shouldReturn500_whenServiceThrows() {
        when(userService.saveUser(registerRequest)).thenThrow(new RuntimeException("DB error"));

        ResponseEntity<?> response = authController.addUser(registerRequest);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("something went wrong with register", response.getBody());
    }

    @Test
    void register_shouldReturn500_whenEmailAlreadyExists() {
        when(userService.saveUser(registerRequest))
                .thenThrow(new RuntimeException("Email already in use"));

        ResponseEntity<?> response = authController.addUser(registerRequest);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("something went wrong with register", response.getBody());
    }




    @Test
    void login_shouldReturn500_whenAuthenticationFails() {
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        ResponseEntity<?> response = authController.loginUser(loginRequest);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("Something went wrong with login", response.getBody());
    }
    @Test
    @SuppressWarnings("unchecked")
    void login_shouldReturnOkWithToken_whenValidCredentials() throws Exception {
        when(authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken("test@mail.com", "password123")
        )).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(customUserDetails);
        when(jwtService.generateJwt(any(UserDetails.class))).thenReturn("mocked-jwt-token");

        ResponseEntity<?> response = authController.loginUser(loginRequest);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertNotNull(body);
        assertEquals("test@mail.com", body.get("email"));
        assertEquals(true, body.get("authValid"));
        assertEquals(false, body.get("mfaRequired"));
        assertEquals("User authenticated using email and password", body.get("message"));
        assertEquals("mocked-jwt-token", body.get("jwt"));
    }

    @Test
    void login_shouldReturn500_whenJwtServiceThrows() throws Exception {
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(customUserDetails);
        when(jwtService.generateJwt(any(UserDetails.class)))
                .thenThrow(new RuntimeException("JWT error"));

        ResponseEntity<?> response = authController.loginUser(loginRequest);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("Something went wrong with login", response.getBody());
    }

    @Test
    void login_shouldAuthenticateWithCorrectCredentials() throws Exception {
        when(authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken("test@mail.com", "password123")
        )).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(customUserDetails);
        when(jwtService.generateJwt(any(UserDetails.class))).thenReturn("mocked-jwt-token");

        authController.loginUser(loginRequest);

        verify(authenticationManager).authenticate(
                new UsernamePasswordAuthenticationToken("test@mail.com", "password123")
        );
        verify(jwtService).generateJwt(any(UserDetails.class));
    }

    @Test
    void login_shouldNotCallJwtService_whenAuthenticationFails() throws Exception {
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        authController.loginUser(loginRequest);

        verify(jwtService, never()).generateJwt(any(UserDetails.class));
    }

    




    @Test
    @SuppressWarnings("unchecked")
    void logout_shouldReturnOkWithMessage() {
        ResponseEntity<?> response = authController.logoutUser();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        Map<String, String> body = (Map<String, String>) response.getBody();
        assertNotNull(body);
        assertEquals("User logged out successfully", body.get("message"));
    }

    @Test
    void logout_shouldNotInteractWithAnyService() {
        authController.logoutUser();

        verifyNoInteractions(userService, authenticationManager, jwtService);
    }
}