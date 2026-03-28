package com.patientlink.backend;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails; // Added
import org.springframework.security.core.userdetails.UserDetailsService; // Added
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service; // Added

@Service

public class CustomUserDetailsService implements UserDetailsService {
    
    private UserRepository userRepository;

    @Autowired
    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }


    @Override
    public UserDetails loadUserByUsername(String identifier) throws UsernameNotFoundException {
        User user = identifier.startsWith("P") 
            ? userRepository.findUserById(identifier) 
            : userRepository.findByEmail(identifier);
        if (user == null) {
            throw new UsernameNotFoundException("User not found with identifier: " + identifier);
        }
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(), 
                user.getPassword(), 
                new ArrayList<>());
    }   
    
} 
