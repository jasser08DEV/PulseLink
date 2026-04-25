package com.patientlink.backend.Medication;

import java.util.List;

import org.springframework.stereotype.Repository;

@Repository

public interface MedicationRepository extends org.springframework.data.mongodb.repository.MongoRepository<MedicationData, String> {
   List<MedicationData> findByPatientId(String patientId);
}