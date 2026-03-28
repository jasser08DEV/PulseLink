package com.patientlink.backend;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/signup")
    public ResponseEntity<String> signUp(@RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()) != null) {
            return ResponseEntity.status(400).body("Email is already Registered");
        } else {
            String shortId = RandomStringUtils.random(8, "0123456789abcdef");
            String id = "P" + shortId;
            user.setId(id);
            while (userRepository.existsById(id)) {
                shortId = RandomStringUtils.random(8, "0123456789abcdef");
                id = "P" + shortId;
                user.setId(id);
            }
                userRepository.save(user);
                return ResponseEntity.ok("Account created successfully!");
            
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {
        String identifier = loginData.get("identifier");
        String password = loginData.get("password");

        User user;
        if (identifier.startsWith("P")) {
            user = userRepository.findUserById(identifier);
        } else {
            user = userRepository.findByEmail(identifier);
        }
        if (user != null && user.getPassword().equals(password)) {
            return ResponseEntity.ok("Login Successful!");
        } else {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }
}