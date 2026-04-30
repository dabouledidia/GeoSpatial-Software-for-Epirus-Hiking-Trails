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

import com.example.geospatial.models.Trail;
import com.example.geospatial.models.User;
import com.example.geospatial.repositories.TrailRepository;

@ExtendWith(MockitoExtension.class)
class TrailServiceImplTest {

    @Mock
    private TrailRepository trailRepository;

    @InjectMocks
    private TrailServiceImpl trailService;

    private Trail trail;
    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setEmail("test@mail.com");

        trail = new Trail();
        trail.setId(1L);
        trail.setName("Trail 1");
        trail.setLocation("Athens");
        trail.setLengthKm(10.0);
        trail.setDuration(2.0);
        trail.setDifficulty("Medium");
        trail.setDescription("Nice trail");
        trail.setImage("img.png");
        trail.setUser(user);
    }

    @Test
    void createTrail_success() {
        when(trailRepository.save(any(Trail.class))).thenReturn(trail);

        ResponseEntity<?> response = trailService.createTrail(trail);

        assertEquals(200, response.getStatusCodeValue());
        verify(trailRepository).save(trail);
    }

    @Test
    void createTrail_failure() {
        when(trailRepository.save(any(Trail.class)))
                .thenThrow(new RuntimeException());

        ResponseEntity<?> response = trailService.createTrail(trail);

        assertEquals(400, response.getStatusCodeValue());
    }

    @Test
    void getTrail_found() {
        when(trailRepository.findById(1L)).thenReturn(Optional.of(trail));

        Optional<Trail> result = trailService.getTrail(1L);

        assertTrue(result.isPresent());
    }

    @Test
    void getAllTrail_success() {
        when(trailRepository.findAll()).thenReturn(List.of(trail));

        var result = trailService.getAllTrail();

        assertEquals(1, result.size());
        assertEquals("Trail 1", result.get(0).getTrailName());
    }

    @Test
    void getUserTrail_success() {
        when(trailRepository.findByUserId(1L)).thenReturn(List.of(trail));

        var result = trailService.getUserTrail(user);

        assertEquals(1, result.size());
        assertEquals("test@mail.com", result.get(0).getEmail());
    }

    @Test
    void updateTrail_success() {
        when(trailRepository.findById(1L)).thenReturn(Optional.of(trail));

        ResponseEntity<?> response = trailService.updateTrail(trail);

        assertEquals(200, response.getStatusCodeValue());
        verify(trailRepository).save(any(Trail.class));
    }

    @Test
    void updateTrail_notFound() {
        when(trailRepository.findById(1L)).thenReturn(Optional.empty());

        ResponseEntity<?> response = trailService.updateTrail(trail);

        assertEquals(404, response.getStatusCodeValue());
    }

    @Test
    void deleteTrail_success() {
        when(trailRepository.findById(1L)).thenReturn(Optional.of(trail));

        ResponseEntity<?> response = trailService.deleteTrail(1L);

        assertEquals(200, response.getStatusCodeValue());
        verify(trailRepository).deleteById(1L);
    }

    @Test
    void deleteTrail_notFound() {
        when(trailRepository.findById(1L)).thenReturn(Optional.empty());

        ResponseEntity<?> response = trailService.deleteTrail(1L);

        assertEquals(404, response.getStatusCodeValue());
    }
}