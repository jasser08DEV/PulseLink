package com.patientlink.backend;

import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.patientlink.backend.Users.User;
import com.patientlink.backend.Users.UserRepository;
import com.patientlink.backend.diagnostics.BenchmarkTimings;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;
    private final BenchmarkTimings timings;

    @Autowired
    public CustomUserDetailsService(UserRepository userRepository, BenchmarkTimings timings) {
        this.userRepository = userRepository;
        this.timings = timings;
    }

    @Override
    public UserDetails loadUserByUsername(String identifier) throws UsernameNotFoundException {
        return timings.measure("auth.userDetails", () -> {
            User user = identifier.startsWith("P")
                    ? timings.measure("auth.user.findUserById",
                            () -> userRepository.findUserById(identifier))
                    : timings.measure("auth.user.findByEmail",
                            () -> userRepository.findByEmail(identifier));
            if (user == null) {
                throw new UsernameNotFoundException("User not found with identifier: " + identifier);
            }
            return new org.springframework.security.core.userdetails.User(
                    user.getEmail(), user.getPassword(),
                    Collections.singletonList(new SimpleGrantedAuthority(user.getRole())));
        });
    }
}
