package com.example.geospatial.controllers;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.io.FileNotFoundException;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;

import com.example.geospatial.DTO.TrailpointDTO;
import com.example.geospatial.services.TrailpointService;

@ExtendWith(MockitoExtension.class)
class TrailpointControllerTest {

    @Mock
    private TrailpointService trailpointService;

    private TrailpointController trailpointController;

    private TrailpointDTO testPoint;

    @BeforeEach
    void setUp() {
        // TrailpointController takes its dependency through the constructor
        // rather than field injection, so it is wired up explicitly here.
        trailpointController = new TrailpointController(trailpointService);

        testPoint = new TrailpointDTO(1L, 0, 39.5, 21.0, 300.0);
    }

    @Test
    void getPoints_shouldReturnOkWithList() {
        when(trailpointService.getPointsByTrail(1L)).thenReturn(List.of(testPoint));

        ResponseEntity<List<TrailpointDTO>> response = trailpointController.getPoints(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
    }

    @Test
    void getPoints_shouldReturnOkWithEmptyList() {
        when(trailpointService.getPointsByTrail(1L)).thenReturn(List.of());

        ResponseEntity<List<TrailpointDTO>> response = trailpointController.getPoints(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody().isEmpty());
    }

    @Test
    void savePoints_shouldReturnOkWithSavedPoints() {
        List<TrailpointDTO> input = List.of(testPoint);
        when(trailpointService.savePoints(1L, input)).thenReturn(input);

        ResponseEntity<List<TrailpointDTO>> response = trailpointController.savePoints(1L, input);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(input, response.getBody());
        verify(trailpointService).savePoints(1L, input);
    }

    @Test
    void importGpx_shouldReturnOkWithGpxPath() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file", "route.gpx", "application/gpx+xml", "<gpx></gpx>".getBytes());
        when(trailpointService.importGpx(1L, file)).thenReturn("uploads/gpx/trail-1-abc.gpx");

        ResponseEntity<?> response = trailpointController.importGpx(1L, file);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        @SuppressWarnings("unchecked")
        Map<String, String> body = (Map<String, String>) response.getBody();
        assertEquals("uploads/gpx/trail-1-abc.gpx", body.get("gpxPath"));
    }

    @Test
    void importGpx_shouldReturnBadRequest_whenServiceThrows() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file", "bad.gpx", "application/gpx+xml", "not-valid".getBytes());
        when(trailpointService.importGpx(1L, file)).thenThrow(new RuntimeException("Invalid GPX file"));

        ResponseEntity<?> response = trailpointController.importGpx(1L, file);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Invalid GPX file", response.getBody());
    }

    @Test
    void getGpxFile_shouldReturnOkWithBytes() throws Exception {
        byte[] fakeBytes = "<gpx></gpx>".getBytes();
        when(trailpointService.getGpxFile(1L)).thenReturn(fakeBytes);

        ResponseEntity<byte[]> response = trailpointController.getGpxFile(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertArrayEquals(fakeBytes, response.getBody());
        assertEquals("application/gpx+xml", response.getHeaders().getFirst(HttpHeaders.CONTENT_TYPE));
    }

    @Test
    void getGpxFile_shouldReturnNotFound_whenFileMissing() throws Exception {
        when(trailpointService.getGpxFile(1L)).thenThrow(new FileNotFoundException("No GPX file stored"));

        ResponseEntity<byte[]> response = trailpointController.getGpxFile(1L);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void getGpxFile_shouldReturn500_whenOtherExceptionThrown() throws Exception {
        when(trailpointService.getGpxFile(1L)).thenThrow(new RuntimeException("Disk error"));

        ResponseEntity<byte[]> response = trailpointController.getGpxFile(1L);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
    }
}
