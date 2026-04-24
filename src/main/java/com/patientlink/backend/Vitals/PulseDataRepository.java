package com.patientlink.backend.Vitals;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PulseDataRepository extends MongoRepository<PulseData, String> {
    List<PulseData> findByPatientId(String patientId);
}