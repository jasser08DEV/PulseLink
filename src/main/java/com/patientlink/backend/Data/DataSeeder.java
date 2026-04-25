package com.patientlink.backend.Data;

import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.patientlink.backend.Users.User;
import com.patientlink.backend.Users.UserRepository;

@Service
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("Clearing old data...");
        userRepository.deleteAll();

        seedDemoData();
    }

    public void seedDemoData() {
        String fileName = "demo_credentials.txt";

        try (PrintWriter writer = new PrintWriter(new FileWriter(fileName))) {
            writer.println("PulseLink Demo Credentials");
            writer.println("Format: [ROLE] Email | Password");
            writer.println("--------------------------------------------------");

            createUsers(5, "DOCTOR", "doctor", writer);

            createUsers(10, "NURSE", "nurse", writer);

            createUsers(35, "PATIENT", "patient", writer);

            System.out.println("Demo data seeded successfully! Check " + fileName);

        } catch (IOException e) {
            System.err.println("Error writing credentials file: " + e.getMessage());
        }
    }

    private void createUsers(int count, String role, String prefix, PrintWriter writer) {
        for (int i = 1; i <= count; i++) {
            String email = prefix + i + "@pulselink.com";
            String rawPassword = "password123"; 

            String id = prefix.substring(0, 1).toUpperCase() + UUID.randomUUID().toString().substring(0, 8);

            User user = new User();
            user.setId(id);
            user.setFirstName(prefix.substring(0, 1).toUpperCase() + prefix.substring(1));
            user.setLastName("User" + i);
            user.setEmail(email);
            user.setRole(role);
            user.setPassword(passwordEncoder.encode(rawPassword));

            userRepository.save(user); // Saves to your MongoDB
            writer.printf("[%s] %s | %s%n", role, email, rawPassword);
        }
    }
}