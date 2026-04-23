package com.patientlink.backend.Users;


public class Nurse extends User {
    private String licenseType;

    public Nurse (String id, String firstName, String lastName, String email, String password, String dob, String gender, String contactNumber, String address, String licenseType) {
        super(id, firstName, lastName, email, password, dob, gender, contactNumber, address, "NURSE");
        this.licenseType = licenseType;
    }

    public String getLicenseType() {
        return licenseType;
    }

    public void setLicenseType(String licenseType) {
        this.licenseType = licenseType;
    }
}
