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
        
        User user = new User("1", "John", "Doe", "john.doe@example.com", "password","2025-03-13", "Male", "1234567890", "123 Main St");
        userRepository.save(user);
        User foundUser = userRepository.findByEmail("john.doe@example.com");
        assertThat(foundUser.getFirstName()).isEqualTo("John");
    }
}