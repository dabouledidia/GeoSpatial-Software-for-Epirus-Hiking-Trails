package com.example.geospatial.services.servicesImpl;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.geospatial.DTO.UserDAO;
import com.example.geospatial.models.CustomUserDetails;
import com.example.geospatial.models.User;
import com.example.geospatial.repositories.UserRepository;
import com.example.geospatial.requests.RegisterRequest;
import com.example.geospatial.services.UserService;

import jakarta.transaction.Transactional;

@Service
public class UserServiceImpl implements UserService, UserDetailsService {

	private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final UserRepository userRepository;

    public UserServiceImpl(BCryptPasswordEncoder bCryptPasswordEncoder, UserRepository userRepository) {
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.userRepository = userRepository;
    }


	@Override
	public ResponseEntity<?> saveUser(RegisterRequest registerRequest) {
        if (userRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("User already exists!");
        }
        User user = new User(registerRequest.getFirstname(),
         registerRequest.getLastname(),
         registerRequest.getEmail(),
         registerRequest.getPassword());
		String encodedPassword = bCryptPasswordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);
        userRepository.save(user);	
        return ResponseEntity.ok("Register user "+user.getEmail()+ " was successful");
    }

	@Override
	@Transactional
	public boolean isUserPresent(User user) {
		Optional<User> storedUser = userRepository.findById(user.getId());
		return storedUser.isPresent();
	}

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("USER_NOT_FOUND " + email));
        return new CustomUserDetails(user);
    }
	
    @Override
    public List<UserDAO> getAllUsers(){
        List<User> users = userRepository.findAll();

        return users.stream().map(r ->
        new UserDAO(
            r.getId(),
            r.getEmail(),
            r.getFirstname(),
            r.getLastname(),
            r.getRole()
        )).toList();
    }


    @Override
    public ResponseEntity<?> deleteUser(long id) {
            if (!userRepository.existsById(id)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "User with id " + id + " not found"));
            }

            userRepository.deleteById(id);
            
            return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
        }
}
