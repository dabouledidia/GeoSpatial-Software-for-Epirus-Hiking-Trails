package com.example.geospatial.services.servicesImpl;

import java.util.Optional;


import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.geospatial.models.CustomUserDetails;
import com.example.geospatial.models.User;
import com.example.geospatial.repositories.UserRepository;
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
	public ResponseEntity<?> saveUser(User user) {
        if (userRepository.findById(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("User already exists!");
}
		String encodedPassword = bCryptPasswordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);
        userRepository.save(user);	
        return ResponseEntity.ok("Register user "+user.getEmail()+ " was successful");
    }

	@Override
	@Transactional
	public boolean isUserPresent(User user) {
		Optional<User> storedUser = userRepository.findById(user.getEmail());
		return storedUser.isPresent();
	}

	// Method defined in Spring Security UserDetailsService interface
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findById(email)
                .orElseThrow(() -> new UsernameNotFoundException("USER_NOT_FOUND " + email));
        return new CustomUserDetails(user);
    }
	
        
}
