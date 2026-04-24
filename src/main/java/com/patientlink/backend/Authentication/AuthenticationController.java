package com.patientlink.backend.Authentication;


import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.patientlink.backend.RandomStringUtils;
import com.patientlink.backend.Users.User;
import com.patientlink.backend.Users.UserRepository;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "*")
public class AuthenticationController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final JwtUtil jwtUtil;

    public AuthenticationController(
        AuthenticationManager authenticationManager,
        UserRepository userRepository,
        PasswordEncoder encoder,
        JwtUtil jwtUtil
    ){
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.encoder = encoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()) != null) {
            return ResponseEntity.status(400).body(Map.of("message", "Email is already in use!"));
        }

        String shortId = RandomStringUtils.random(8, "0123456789abcdef");
        String generatedId = "P" + shortId;

        while (userRepository.existsById(generatedId)) {
            shortId = RandomStringUtils.random(8, "0123456789abcdef");
            generatedId = "P" + shortId;
        }
        
        user.setId(generatedId);
        user.setPassword(encoder.encode(user.getPassword()));
        userRepository.save(user);

        return ResponseEntity.ok(Map.of(
            "message", "User registered successfully!",
            "patientId", generatedId
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody User user) {
        String loginIdentifier = (user.getEmail() != null && !user.getEmail().isEmpty()) 
                                 ? user.getEmail() 
                                 : user.getId();

        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(loginIdentifier, user.getPassword())
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String jwt = jwtUtil.generateToken(userDetails.getUsername());

        User authenticatedUser = userRepository.findByEmail(userDetails.getUsername());
        if (authenticatedUser == null) {
            authenticatedUser = userRepository.findById(userDetails.getUsername()).orElse(null);
        }

        System.out.println("DEBUG - Role found for " + userDetails.getUsername() + " is: " + 
                  (authenticatedUser != null ? authenticatedUser.getRole() : "NULL"));

        return ResponseEntity.ok(Map.of(
            "token", jwt,
            "type", "Bearer",
            "identifier", userDetails.getUsername(),
            "role", authenticatedUser != null ? authenticatedUser.getRole() : "UNKNOWN"
        ));
    }
}