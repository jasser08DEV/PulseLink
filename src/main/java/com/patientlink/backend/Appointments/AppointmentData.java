package com.patientlink.backend.Appointments;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data
@Document(collection = "appointments")

public class AppointmentData {

    @Id
    private String id;
    private String patientId;
    private String doctorName;
    private String doctorId;
    private String title;
    private String appointmentTime;
    private String appointmentDate;

    public AppointmentData() {
    }
    
    public AppointmentData(String id, String patientId, String doctorName, String doctorId, String title, String appointmentTime,
            String appointmentDate) {
        this.id = id;
        this.patientId = patientId;
        this.doctorName = doctorName;
        this.doctorId = doctorId;
        this.title = title;
        this.appointmentTime = appointmentTime;
        this.appointmentDate = appointmentDate;
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

    public String getDoctorName() {
        return doctorName;
    }

    public void setDoctorName(String doctorName) {
        this.doctorName = doctorName;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(String doctorId) {
        this.doctorId = doctorId;
    }

    public String getAppointmentTime() {
        return appointmentTime;
    }

    public void setAppointmentTime(String appointmentTime) {
        this.appointmentTime = appointmentTime;
    }

    public String getAppointmentDate() {
        return appointmentDate;
    }

    public void setAppointmentDate(String appointmentDate) {
        this.appointmentDate = appointmentDate;
    }

    
    
}
