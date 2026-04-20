package com.patientlink.backend;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
@SpringBootTest
public class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    public void testFindByEmail() {
        
       // Add the 10th argument: "PATIENT"
        User user = new User("1", "Mo", "Abdou", "mo@example.com", "pass123", "01/01/2000", "Male", "1234567890", "Jacksonville", "PATIENT");
        userRepository.save(user);
        User foundUser = userRepository.findByEmail("mo@example.com");
        assertThat(foundUser.getFirstName()).isEqualTo("Mo");
    }
}