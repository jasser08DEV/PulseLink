package com.patientlink.backend.Medication;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;


@Data
@Document(collection = "medications")

public class MedicationData {



    @Id
    private String id;
    private String patientId;
    private String medicationName;
    private String dosage;
    private String frequency;
    private String startDate;
    private String endDate;
    private boolean takenToday;

    
    public MedicationData() {
    }

    public MedicationData(String id, String patientId, String medicationName, String dosage, String frequency,
            String startDate, String endDate, boolean takenToday) {
        this.id = id;
        this.patientId = patientId;
        this.medicationName = medicationName;
        this.dosage = dosage;
        this.frequency = frequency;
        this.startDate = startDate;
        this.endDate = endDate;
        this.takenToday = takenToday;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPatientId() {
        return patientId;
    }

    public void setPatientId(String patientId) {
        this.patientId = patientId;
    }

    public String getMedicationName() {
        return medicationName;
    }

    public void setMedicationName(String medicationName) {
        this.medicationName = medicationName;
    }


    public String getDosage() {
        return dosage;
    }
    
    public void setDosage(String dosage) {
        this.dosage = dosage;
    }

    public String getFrequency() {
        return frequency;
    }

    public void setFrequency(String frequency) {
        this.frequency = frequency;
    }


    public String getStartDate() {
        return startDate;
    }


    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getEndDate() {
        return endDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }

    public boolean isTakenToday() {
        return takenToday;
    }
    

    public void setTakenToday(boolean takenToday) {
        this.takenToday = takenToday;
    }

}
