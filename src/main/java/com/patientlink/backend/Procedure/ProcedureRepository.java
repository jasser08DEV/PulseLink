package com.patientlink.backend.Procedure;

import java.util.List;

import org.springframework.stereotype.Repository;

@Repository

public interface ProcedureRepository extends org.springframework.data.mongodb.repository.MongoRepository<ProcedureData, String> {
    List<ProcedureData> findByPatientId(String patientId);
}