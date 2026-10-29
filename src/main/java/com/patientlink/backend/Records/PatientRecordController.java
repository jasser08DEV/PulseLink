package com.patientlink.backend.Records;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.patientlink.backend.Medication.MedicationRepository;
import com.patientlink.backend.Procedure.ProcedureRepository;
import com.patientlink.backend.Users.User;
import com.patientlink.backend.Users.UserRepository;
import com.patientlink.backend.Appointments.AppointmentRepository;
import com.patientlink.backend.diagnostics.BenchmarkTimings;

@RestController
@RequestMapping("/api/v1/patient-record")
@CrossOrigin(origins = "*")
public class PatientRecordController {
    @Autowired private UserRepository userRepo;
    @Autowired private MedicationRepository medRepo;
    @Autowired private ProcedureRepository procRepo;
    @Autowired private AppointmentRepository apptRepo;
    @Autowired private BenchmarkTimings timings;

    @GetMapping("/{patientId}/full")
    public ResponseEntity<?> getFullPatientRecord(@PathVariable String patientId) {
        return timings.measure("record.controller", () -> {
            User patient = timings.measure("record.patient.findById",
                    () -> userRepo.findById(patientId).orElse(null));
            if (patient == null || !"PATIENT".equals(patient.getRole())) {
                return ResponseEntity.badRequest().body("Patient not found.");
            }
            var meds = timings.measure("record.medications.findByPatientId",
                    () -> medRepo.findByPatientId(patientId));
            var procs = timings.measure("record.procedures.findByPatientId",
                    () -> procRepo.findByPatientId(patientId));
            var appts = timings.measure("record.appointments.findByPatientId",
                    () -> apptRepo.findByPatientId(patientId));
            PatientRecordDTO fullRecord = new PatientRecordDTO(patient, meds, procs, appts);
            return ResponseEntity.ok(fullRecord);
        });
    }
}
