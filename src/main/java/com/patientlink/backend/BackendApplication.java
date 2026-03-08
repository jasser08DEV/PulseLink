package com.patientlink.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.mongodb.core.SimpleMongoClientDatabaseFactory;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}
	@Bean
	public SimpleMongoClientDatabaseFactory mongoDbFactory() {
    	return new SimpleMongoClientDatabaseFactory("mongodb://10.0.0.116:27017/patient_system");
	}

}
