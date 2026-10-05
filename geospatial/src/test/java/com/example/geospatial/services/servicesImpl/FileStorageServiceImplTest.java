package com.example.geospatial.services.servicesImpl;

import static org.junit.jupiter.api.Assertions.*;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;

/**
 * Unlike the other services, FileStorageServiceImpl talks directly to the
 * filesystem rather than a repository, so there is nothing meaningful to
 * mock here — these tests exercise real file I/O against a JUnit-managed
 * temporary directory instead.
 */
class FileStorageServiceImplTest {

    private FileStorageServiceImpl fileStorageService;

    @TempDir
    Path tempDir;

    @BeforeEach
    void setUp() {
        fileStorageService = new FileStorageServiceImpl();
        ReflectionTestUtils.setField(fileStorageService, "gpxUploadDir", tempDir.toString());
    }

    @Test
    void storeGpxFile_success_createsFileWithExpectedNamingPattern() throws IOException {
        MockMultipartFile file = new MockMultipartFile(
                "file", "route.gpx", "application/gpx+xml", "<gpx></gpx>".getBytes());

        String path = fileStorageService.storeGpxFile(7L, file);

        assertTrue(Files.exists(Path.of(path)));
        assertTrue(Path.of(path).getFileName().toString().startsWith("trail-7-"));
        assertTrue(path.endsWith(".gpx"));
    }

    @Test
    void storeGpxFile_contentIsWrittenCorrectly() throws IOException {
        byte[] content = "<gpx version=\"1.1\"></gpx>".getBytes();
        MockMultipartFile file = new MockMultipartFile("file", "route.gpx", "application/gpx+xml", content);

        String path = fileStorageService.storeGpxFile(1L, file);

        assertArrayEquals(content, Files.readAllBytes(Path.of(path)));
    }

    @Test
    void readFile_success() throws IOException {
        Path testFile = tempDir.resolve("sample.gpx");
        Files.write(testFile, "hello".getBytes());

        byte[] result = fileStorageService.readFile(testFile.toString());

        assertArrayEquals("hello".getBytes(), result);
    }

    @Test
    void readFile_nonExistentFile_throwsIOException() {
        Path missing = tempDir.resolve("does-not-exist.gpx");

        assertThrows(IOException.class, () -> fileStorageService.readFile(missing.toString()));
    }

    @Test
    void deleteFile_success_removesExistingFile() throws IOException {
        Path testFile = tempDir.resolve("to-delete.gpx");
        Files.write(testFile, "data".getBytes());

        fileStorageService.deleteFile(testFile.toString());

        assertFalse(Files.exists(testFile));
    }

    @Test
    void deleteFile_nullPath_doesNotThrow() {
        assertDoesNotThrow(() -> fileStorageService.deleteFile(null));
    }

    @Test
    void deleteFile_nonExistentFile_doesNotThrow() {
        Path missing = tempDir.resolve("already-gone.gpx");

        assertDoesNotThrow(() -> fileStorageService.deleteFile(missing.toString()));
    }
}
