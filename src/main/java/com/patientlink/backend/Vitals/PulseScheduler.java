package com.patientlink.backend.Vitals;

import java.util.List;
import java.util.Random;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.patientlink.backend.Users.User;
import com.patientlink.backend.Users.UserRepository;

@Service
public class PulseScheduler {
    private final PulseDataRepository pulseDataRepository;
    private final UserRepository userRepository;
    private final Random random = new Random();

    public PulseScheduler(PulseDataRepository pulseDataRepository, UserRepository userRepository) {
        this.pulseDataRepository = pulseDataRepository;
        this.userRepository = userRepository;
    }
    @Scheduled(fixedRate = 5000)
    public void generateRandomPulseData() {
        List<User> patients = userRepository.findAllByRole("PATIENT");
        for (User user : patients) {
            PulseData pulseData = new PulseData();
            pulseData.setPatientId(user.getId());
            pulseData.setHeartRate(random.nextInt(40) + 60); 
            pulseData.setSpo2(random.nextInt(5) + 95); 
            pulseData.setRespiratoryRate(random.nextInt(10) + 12); 
            pulseData.setBloodPressure(random.nextInt(40) + 80); 
            pulseData.setBodyTemperature(random.nextInt(3) + 36); 
            pulseData.setGlucoseLevel(random.nextInt(100) + 70); 
            pulseData.setTimestamp(String.valueOf(System.currentTimeMillis()));
            pulseDataRepository.save(pulseData);
        }
    }

}
