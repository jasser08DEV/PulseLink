package com.patientlink.backend;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class JwtUtilTest {

    @Autowired
    private JwtUtil jwtUtil; 

    @Test
    public void testGenerateToken() {
        String token = jwtUtil.generateToken("Bill");
        assertNotNull(token);
        assertFalse(token.isEmpty());
    }

    @Test
    public void testGetUserFromToken() {
        String token = jwtUtil.generateToken("Bill");
        String user = jwtUtil.getUserFromToken(token);
        assertEquals("Bill", user);
    }

    @Test
    public void testValidateToken() {
        String token = jwtUtil.generateToken("Bill");
        boolean valid = jwtUtil.validateToken(token);
        assertTrue(valid);
    }
}