package com.patientlink.backend;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class SecurityFilterIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    public void setup() {
        userRepository.deleteAll();
        User testUser = new User();
        testUser.setId("P8821x");
        testUser.setEmail("test@pulse.com");
        testUser.setPassword("encodedPassword");
        userRepository.save(testUser);
    }

    @Test
    public void accessMeWithoutToken_ShouldReturn401() throws Exception {
        mockMvc.perform(get("/api/users/me"))
               .andExpect(status().isUnauthorized());
    }

    @Test
    public void accessMeWithValidToken_ShouldReturn200() throws Exception {
        String token = jwtUtil.generateToken("P8821x");

        mockMvc.perform(get("/api/users/me")
               .header("Authorization", "Bearer " + token))
               .andExpect(status().isOk());
    }

    @Test
    public void accessMeWithTamperedToken_ShouldReturn401() throws Exception {
        String token = jwtUtil.generateToken("P8821x") + "tampered";

        mockMvc.perform(get("/api/users/me")
               .header("Authorization", "Bearer " + token))
               .andExpect(status().isUnauthorized());
    }
}