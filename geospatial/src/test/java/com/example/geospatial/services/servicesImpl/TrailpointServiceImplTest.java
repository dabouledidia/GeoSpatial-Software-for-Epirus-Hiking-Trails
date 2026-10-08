package com.example.geospatial.services.servicesImpl;

import static org.junit.jupiter.api.Assertions.*;

import static org.mockito.Mockito.*;

import java.io.FileNotFoundException;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;

import com.example.geospatial.models.Trail;
import com.example.geospatial.models.Trailpoint;
import com.example.geospatial.repositories.TrailPointRepository;
import com.example.geospatial.repositories.TrailRepository;

@ExtendWith(MockitoExtension.class)
class TrailpointServiceImplTest {

    @Mock
    private TrailPointRepository trailPointRepository;

    @Mock
    private TrailRepository trailRepository;

    
    @InjectMocks
    private TrailpointServiceImpl trailpointService;

    private Trail trail;

    @BeforeEach
    void setUp() {
        trail = new Trail();
        trail.setId(1L);
        trail.setName("Mountain Trail");
    }

    @Test
    void getPointsByTrail_success() {
        Trailpoint p = new Trailpoint(trail, 0, 39.5, 21.0, 300.0);
        p.setId(1L);
        when(trailPointRepository.findByTrailIdOrderByPointOrderAsc(1L)).thenReturn(List.of(p));

        var result = trailpointService.getPointsByTrail(1L);

        assertEquals(1, result.size());
        assertEquals(39.5, result.get(0).getLat());
    }





    @Test
    void savePoints_trailNotFound_throwsException() {
        when(trailRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () ->
                trailpointService.savePoints(99L, List.of()));
    }

    

    @Test
    void importGpx_trailNotFound_throwsException() {
        when(trailRepository.findById(99L)).thenReturn(Optional.empty());
        MockMultipartFile file = new MockMultipartFile("file", "r.gpx", "application/gpx+xml", new byte[0]);

        assertThrows(RuntimeException.class, () -> trailpointService.importGpx(99L, file));
    }



    @Test
    void getGpxFile_noGpxStored_throwsFileNotFoundException() {
        trail.setGpxPath(null);
        when(trailRepository.findById(1L)).thenReturn(Optional.of(trail));

        assertThrows(FileNotFoundException.class, () -> trailpointService.getGpxFile(1L));
    }

    @Test
    void getGpxFile_trailNotFound_throwsException() {
        when(trailRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> trailpointService.getGpxFile(99L));
    }

    @Test
    void calculateDistance_withTwoPoints_returnsPositiveDistance() {
        // Athens -> Thessaloniki, roughly 400km apart
        Trailpoint p1 = new Trailpoint(trail, 0, 37.9838, 23.7275, null);
        Trailpoint p2 = new Trailpoint(trail, 1, 40.6401, 22.9444, null);
        when(trailPointRepository.findByTrailIdOrderByPointOrderAsc(1L)).thenReturn(List.of(p1, p2));

        Double distance = trailpointService.calculateDistance(1L);

        assertNotNull(distance);
        assertTrue(distance > 300 && distance < 400);
    }

    @Test
    void calculateDistance_withFewerThanTwoPoints_returnsZero() {
        when(trailPointRepository.findByTrailIdOrderByPointOrderAsc(1L)).thenReturn(List.of());

        Double distance = trailpointService.calculateDistance(1L);

        assertEquals(0.0, distance);
    }
}
