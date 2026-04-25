package com.patientlink.backend.Records;

import java.util.List;
import com.patientlink.backend.Medication.MedicationData;
import com.patientlink.backend.Procedure.ProcedureData;
import com.patientlink.backend.Users.User;
import com.patientlink.backend.Appointments.AppointmentData;
import lombok.Data;

@Data 
public class PatientRecordDTO {
    private User patientProfile;
    private List<MedicationData> medications;
    private List<ProcedureData> procedures;
    private List<AppointmentData> appointments;

    public PatientRecordDTO(User patientProfile, List<MedicationData> medications, 
                            List<ProcedureData> procedures, List<AppointmentData> appointments) {
        this.patientProfile = patientProfile;
        this.medications = medications;
        this.procedures = procedures;
        this.appointments = appointments;
    }

    
}