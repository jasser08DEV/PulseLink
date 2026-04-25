package com.patientlink.backend.Appointments;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository

public interface AppointmentRepository extends MongoRepository<AppointmentData, String> {
    List<AppointmentData> findByPatientId(String patientId);
}