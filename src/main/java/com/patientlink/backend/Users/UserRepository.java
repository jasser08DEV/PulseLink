package com.patientlink.backend.Users;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
public interface UserRepository extends MongoRepository<User, String> {
    User findByEmail(String email);
    User findUserById(String id);
    boolean existsById(String id);
    List<User> findAllByRole(String role);
}
