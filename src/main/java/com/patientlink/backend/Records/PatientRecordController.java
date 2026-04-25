package com.patientlink.backend.Records;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import com.patientlink.backend.Medication.MedicationRepository;
import com.patientlink.backend.Procedure.ProcedureRepository;
import com.patientlink.backend.Users.User;
import com.patientlink.backend.Users.UserRepository;
import com.patientlink.backend.Appointments.AppointmentRepository;

@RestController
@RequestMapping("/api/v1/patient-record")
@CrossOrigin(origins = "*")
public class PatientRecordController {

    @Autowired private UserRepository userRepo;
    @Autowired private MedicationRepository medRepo;
    @Autowired private ProcedureRepository procRepo;
    @Autowired private AppointmentRepository apptRepo;

    @GetMapping("/{patientId}/full")
    public ResponseEntity<?> getFullPatientRecord(@PathVariable String patientId) {
        
        User patient = userRepo.findById(patientId).orElse(null);
        if (patient == null || !patient.getRole().equals("PATIENT")) {
            return ResponseEntity.badRequest().body("Patient not found.");
        }

        var meds = medRepo.findByPatientId(patientId);
        var procs = procRepo.findByPatientId(patientId);
        var appts = apptRepo.findByPatientId(patientId);

        PatientRecordDTO fullRecord = new PatientRecordDTO(patient, meds, procs, appts);

        return ResponseEntity.ok(fullRecord);
    }
}