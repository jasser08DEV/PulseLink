package com.patientlink.backend.Procedure;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data
@Document(collection = "procedures")

public class ProcedureData {

    @Id
    private String id;
    private String patientId;
    private String doctorId;
    private String name;
    private String date;
    
    public ProcedureData() {}

    public ProcedureData(String patientId, String doctorId, String name, String date) {
        this.patientId = patientId;
        this.doctorId = doctorId;
        this.name = name;
        this.date = date;
    }

    public void setId(String id) {
        this.id = id;
    }   

    public String getId() {
        return id;
    }

    public String getPatientId() {
        return patientId;
    }

    public void setPatientId(String patientId) {
        this.patientId = patientId;
    }

    public String getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(String doctorId) {
        this.doctorId = doctorId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

}
