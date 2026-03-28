package com.patientlink.backend;
import org.springframework.data.mongodb.repository.MongoRepository;
public interface UserRepository extends MongoRepository<User, String> {
    User findByEmail(String email);
    User findUserById(String id);
    boolean existsById(String id);
}
