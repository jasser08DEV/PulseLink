package com.patientlink.backend.Users;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/patients")
@CrossOrigin(origins = "*")
public class PatientController {

    @Autowired

    private UserRepository userRepo;
    
    @PostMapping("/supervise")
    public ResponseEntity<?> supervisePatient(@RequestBody Map<String, String> payload) {
        String patientId = payload.get("patientId");
        String nurseEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User nurse = userRepo.findByEmail(nurseEmail);
        User patient = userRepo.findById(patientId).orElse(null);

        if (patient == null || nurse == null) {
            return ResponseEntity.badRequest().body("Patient or nurse not found.");
        }
        if(nurse.getSupervisedPatients() == null) {
            nurse.setSupervisedPatients(new java.util.ArrayList<>());
        }

        if (!nurse.getSupervisedPatients().contains(patientId)) {
            nurse.getSupervisedPatients().add(patientId);
            userRepo.save(nurse);
        }
        return ResponseEntity.ok(patient);
    }

    @GetMapping("/supervised")
    public ResponseEntity<?> getSupervisedPatients() {
        String nurseEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User nurse = userRepo.findByEmail(nurseEmail);

        if (nurse == null) {
            return ResponseEntity.badRequest().body("Nurse not found.");
        }
        var supervisedPatients = nurse.getSupervisedPatients();
        if(supervisedPatients == null || supervisedPatients.isEmpty()) {
            return ResponseEntity.ok(java.util.Collections.emptyList());
        }
        var patients = userRepo.findAllById(supervisedPatients);
        return ResponseEntity.ok(patients);
    }

    
}