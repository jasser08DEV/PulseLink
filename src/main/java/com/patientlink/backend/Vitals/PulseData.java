package com.patientlink.backend.Vitals;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data
@Document(collection = "pulse_logs")
public class PulseData {
    @Id
    private String id;
    private String patientId;
    private int heartRate;
    private int spo2;
    private int respiratoryRate;
    private int bloodPressure;
    private int bodyTemperature;
    private int glucoseLevel;
    private String timestamp;

    public PulseData() {}

    public PulseData(String patientId, int heartRate, int spo2, int respiratoryRate, int bloodPressure, int bodyTemperature, int glucoseLevel, String timestamp) {
        this.patientId = patientId;
        this.heartRate = heartRate;
        this.spo2 = spo2;
        this.respiratoryRate = respiratoryRate;
        this.bloodPressure = bloodPressure;
        this.bodyTemperature = bodyTemperature;
        this.glucoseLevel = glucoseLevel;
        this.timestamp = timestamp;
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
    public int getHeartRate() {
        return heartRate;
    }
    public void setHeartRate(int heartRate) {
        this.heartRate = heartRate;
    }
    public int getSpo2() {
        return spo2;
    }
    public void setSpo2(int spo2) {
        this.spo2 = spo2;
    }
    public int getRespiratoryRate() {
        return respiratoryRate;
    }
    public void setRespiratoryRate(int respiratoryRate) {
        this.respiratoryRate = respiratoryRate;
    }
    public int getBloodPressure() {
        return bloodPressure;
    }
    public void setBloodPressure(int bloodPressure) {
        this.bloodPressure = bloodPressure;
    }
    public int getBodyTemperature() {
        return bodyTemperature;
    }
    public void setBodyTemperature(int bodyTemperature) {
        this.bodyTemperature = bodyTemperature;
    }
    public int getGlucoseLevel() {
        return glucoseLevel;
    }
    public void setGlucoseLevel(int glucoseLevel) {
        this.glucoseLevel = glucoseLevel;
    }
    public String getTimestamp() {
        return timestamp;
    }
    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

   


}
