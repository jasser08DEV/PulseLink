package com.patientlink.backend;

public class Doctor extends User{
    private String department;

    public Doctor(String id, String firstName, String lastName, String email, String password, String dob, String gender, String contactNumber, String address, String department) {
        super(id, firstName, lastName, email, password, dob, gender, contactNumber, address);
        this.department = department;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }
}
