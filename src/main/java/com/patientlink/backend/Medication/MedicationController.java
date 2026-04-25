package com.patientlink.backend.Medication;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/medication")
@CrossOrigin(origins = "*")

public class MedicationController {

    private final MedicationRepository repository;

    public MedicationController(MedicationRepository repository) {
        this.repository = repository;
    }
    @GetMapping("/patient/{patientId}")
    public List<MedicationData> getMyMeds(@PathVariable String patientId) {
        return repository.findByPatientId(patientId);
    }

    @PostMapping("/toggle/{medId}")
    public ResponseEntity<?> toggleMedication(@PathVariable String medId) {
        MedicationData med = repository.findById(medId).orElseThrow();
        med.setTakenToday(!med.isTakenToday());
        repository.save(med);
        return ResponseEntity.ok(med);
    }

    @PostMapping("/prescribe")
    public ResponseEntity<?> prescribeMedication(@RequestBody MedicationData medication) {
        System.out.println("Prescribing for patient: " + medication.getPatientId());
        return ResponseEntity.ok(repository.save(medication));
    }

    @Scheduled(cron = "0 0 0 * * *") // Runs at midnight every day
    public void resetMedicationStatus() {
        List<MedicationData> allMeds = repository.findAll();
        for (MedicationData med : allMeds) {
            med.setTakenToday(false);
            repository.save(med);
        }
    }

}