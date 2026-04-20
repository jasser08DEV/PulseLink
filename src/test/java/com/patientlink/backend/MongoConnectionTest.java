package com.patientlink.backend;

import org.bson.Document;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.mongodb.core.MongoTemplate;

@SpringBootTest
class MongoConnectionTest {

    @Autowired
    private MongoTemplate mongoTemplate;

    @Test
    void testConnection() {
       
        Document buildInfo = mongoTemplate.executeCommand("{ buildInfo: 1 }");
        
        assertNotNull(buildInfo);
        System.out.println("🚀 Connected to MongoDB version: " + buildInfo.getString("version"));
    }
}