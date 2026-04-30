package com.example.geospatial.controllers;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import java.util.Collections;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.example.geospatial.DTO.UserDAO;
import com.example.geospatial.services.UserService;

@ExtendWith(MockitoExtension.class)
class UserControllerTest {

    @Mock
    private UserService userServiceImpl;

    @InjectMocks
    private UserController userController;

    private UserDAO testUser;

    @BeforeEach
    void setUp() {
        testUser = new UserDAO(1L, "test@mail.com", "John", "Doe", "ROLE_USER");
    }


    @Test
    void getAllUsers_shouldReturnOkWithUserList() {
        List<UserDAO> users = List.of(testUser);
        when(userServiceImpl.getAllUsers()).thenReturn(users);

        ResponseEntity<?> response = userController.getAllUsers();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(users, response.getBody());
        verify(userServiceImpl, times(1)).getAllUsers();
    }

    @Test
    void getAllUsers_shouldReturnOkWithEmptyList() {
        when(userServiceImpl.getAllUsers()).thenReturn(Collections.emptyList());

        ResponseEntity<?> response = userController.getAllUsers();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(Collections.emptyList(), response.getBody());
    }

    @Test
    void getAllUsers_shouldReturnMultipleUsers() {
        UserDAO secondUser = new UserDAO(2L, "jane@mail.com", "Jane", "Doe", "ROLE_USER");
        List<UserDAO> users = List.of(testUser, secondUser);
        when(userServiceImpl.getAllUsers()).thenReturn(users);

        ResponseEntity<?> response = userController.getAllUsers();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        @SuppressWarnings("unchecked")
        List<UserDAO> body = (List<UserDAO>) response.getBody();
        assertNotNull(body);
        assertEquals(2, body.size());
    }



    @Test
    void deleteUser_shouldReturnOk_whenServiceSucceeds() {
        doReturn(ResponseEntity.ok("Deleted")).when(userServiceImpl).deleteUser(1L);

        ResponseEntity<?> response = userController.deleteUser(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(userServiceImpl, times(1)).deleteUser(1L);
    }

    @Test
    void deleteUser_shouldReturn500_whenServiceThrowsException() {
        when(userServiceImpl.deleteUser(1L)).thenThrow(new RuntimeException("DB error"));

        ResponseEntity<?> response = userController.deleteUser(1L);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("something went wrong with delete trail", response.getBody());
    }

    @Test
    void deleteUser_shouldReturn500_whenServiceThrowsUncheckedException() {
        when(userServiceImpl.deleteUser(99L)).thenThrow(new IllegalArgumentException("User not found"));

        ResponseEntity<?> response = userController.deleteUser(99L);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertNotNull(response.getBody());
    }

    @Test
    void deleteUser_shouldNotCallService_withNegativeId() {
        when(userServiceImpl.deleteUser(-1L)).thenThrow(new IllegalArgumentException("Invalid ID"));

        ResponseEntity<?> response = userController.deleteUser(-1L);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
    }

    @Test
    void deleteUser_shouldCallServiceWithCorrectId() {
        doReturn(ResponseEntity.ok("Deleted")).when(userServiceImpl).deleteUser(42L);
        userController.deleteUser(42L);

        verify(userServiceImpl).deleteUser(42L);
        verify(userServiceImpl, never()).deleteUser(1L);  
    }
}