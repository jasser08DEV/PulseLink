package com.patientlink.backend.Appointments;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/appointment-alerts")
@CrossOrigin(origins = "*")

public class AppointmentAlert {
    @Autowired
    private AppointmentRepository appointmentRepo;

    @GetMapping("/patient/{patientId}")
    public String checkAppointmentAlerts(@PathVariable String patientId) {
        var appointments = appointmentRepo.findByPatientId(patientId);
        if (appointments.isEmpty()) {
            return "No upcoming appointments.";
        } else {
            for (AppointmentData appt : appointments) {
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
                LocalDateTime apptDateTime = LocalDateTime.parse(appt.getAppointmentDate() + " " + appt.getAppointmentTime(), formatter);
                LocalDateTime now = LocalDateTime.now();
                if (apptDateTime.isAfter(now) && apptDateTime.isBefore(now.plusHours(24))) {
                    return "Upcoming appointment with Dr. " + appt.getDoctorName() + " on " + appt.getAppointmentDate() + " at " + appt.getAppointmentTime();
                }
            }
        }
        return "No upcoming appointments within the next 24 hours.";
    }
    
}
