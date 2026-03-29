package com.patientlink.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<?> getMyProfile(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).body("Not authenticated");
        }

        String identifier = authentication.getName();

        User user = identifier.startsWith("P") 
                    ? userRepository.findById(identifier).orElse(null) 
                    : userRepository.findByEmail(identifier);

        if (user == null) {
            return ResponseEntity.status(404).body("User not found in PulseLink records");
        }

        user.setPassword(null); 
        return ResponseEntity.ok(user);
    }
}