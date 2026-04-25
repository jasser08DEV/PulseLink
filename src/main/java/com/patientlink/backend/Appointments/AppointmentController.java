package com.patientlink.backend.Appointments;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/appointments")
@CrossOrigin(origins = "*")

public class AppointmentController {

    private final AppointmentRepository repository;

    public AppointmentController(AppointmentRepository repository) {
        this.repository = repository;
    }

    @PostMapping("/schedule")
    public AppointmentData scheduleAppointment(@RequestBody AppointmentData appointment) {
        return repository.save(appointment);
    }

    @GetMapping("/patient/{patientId}")
    public List<AppointmentData> getAppointmentsByPatientId(@PathVariable String patientId)
    {
        return repository.findByPatientId(patientId);
    }
    
}
