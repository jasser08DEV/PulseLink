package com.patientlink.backend;

public class Patient extends User {
    private String healthIssue;

    public Patient(String id, String firstName, String lastName, String email, String password, String dob, String gender, String contactNumber, String address, String healthIssue) {
        super(id, firstName, lastName, email, password, dob, gender, contactNumber, address);
        this.healthIssue = healthIssue;
    }

    public String getHealthIssue() {
        return healthIssue;
    }

    public void setHealthIssue(String healthIssue) {
        this.healthIssue = healthIssue;
    }
}
