package com.example.geospatial.repositories;



import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.geospatial.models.User;

@Repository 
public interface UserRepository extends JpaRepository<User, Long>{
        Optional<User> findByEmail(String email);

}
