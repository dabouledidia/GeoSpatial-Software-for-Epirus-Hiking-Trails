package com.example.geospatial.services.servicesImpl;

import static org.junit.jupiter.api.Assertions.*;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

class JWTServiceImplTest {

    private JWTServiceImpl jwtService;
    private UserDetails userDetails;

    @BeforeEach
    void setUp() {
        jwtService = new JWTServiceImpl();

        userDetails = new User(
                "test@mail.com",
                "password",
                List.of(new SimpleGrantedAuthority("ROLE_USER"))
        );
    }

    @Test
    void generateJwt_shouldCreateValidToken() {
        String token = jwtService.generateJwt(userDetails);

        assertNotNull(token);
        assertFalse(token.isEmpty());
    }

    @Test
    void extractEmail_shouldReturnCorrectEmail() {
        String token = jwtService.generateJwt(userDetails);

        String email = jwtService.extractEmail(token);

        assertEquals("test@mail.com", email);
    }

    @Test
    void extractRoles_shouldReturnRoles() {
        String token = jwtService.generateJwt(userDetails);

        List<String> roles = jwtService.extractRoles(token);

        assertEquals(1, roles.size());
        assertEquals("ROLE_USER", roles.get(0));
    }

    @Test
    void isTokenValid_shouldReturnTrue() {
        String token = jwtService.generateJwt(userDetails);

        boolean result = jwtService.isTokenValid(token, userDetails);

        assertTrue(result);
    }

    @Test
    void isTokenValid_shouldReturnFalseForDifferentUser() {
        String token = jwtService.generateJwt(userDetails);

        UserDetails anotherUser = new User(
                "other@mail.com",
                "password",
                List.of(new SimpleGrantedAuthority("ROLE_USER"))
        );

        boolean result = jwtService.isTokenValid(token, anotherUser);

        assertFalse(result);
    }
}