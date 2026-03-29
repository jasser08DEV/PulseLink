package com.patientlink.backend;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

public class JwtUtilTest {
    private JwtUtil jwtUtil;
    
    public void setUp() {
        jwtUtil.init();
    }

    @Test
    public void testGenerateToken() {
        String token = jwtUtil.generateToken("Bill");
        assertNotNull(token);
        assertTrue(!token.isEmpty());
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
        assertEquals(true, valid);
    }
}
