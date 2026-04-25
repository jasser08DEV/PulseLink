package com.patientlink.backend.Vitals;


import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/alerts")
@CrossOrigin(origins = "*")
public class AlertController {
    @Autowired 
    private PulseDataRepository pulseRepo;

    @GetMapping("/patient/{patientId}")
    public List<Map<String, String>> getAlerts(@PathVariable String patientId) {
        List<PulseData> history = pulseRepo.findByPatientId(patientId);
        return history.stream()
            .filter(p -> p.getHeartRate() > 100 || p.getSpo2() < 95)
            .map(p -> Map.of("type", "critical", "message", "Vitals out of range", "time", "Just now"))
            .collect(Collectors.toList());
    }
}