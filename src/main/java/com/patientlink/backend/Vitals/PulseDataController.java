package com.patientlink.backend.Vitals;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/vitals")
@CrossOrigin(origins = "*")
public class PulseDataController {

    private final PulseDataRepository repository;

    public PulseDataController(PulseDataRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/pulse/{patientId}")
    public List<PulseData> getPulseDataByPatientId(@PathVariable String patientId) {
        return repository.findByPatientId(patientId);
    }

}
