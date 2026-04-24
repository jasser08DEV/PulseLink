package com.patientlink.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class BackendApplication {

	public static void main(String[] args) {
		System.setProperty("server.address", "0.0.0.0");
		SpringApplication.run(BackendApplication.class, args);
	}
	

}
