package com.patientlink.backend.Procedure;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/procedure")
@CrossOrigin(origins = "*")

public class ProcedureController {

    private final ProcedureRepository repository;

    public ProcedureController(ProcedureRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/patient/{patientId}")
    public List<ProcedureData> getProceduresByPatientId(@PathVariable String patientId) {
        return repository.findByPatientId(patientId);
    }


    @PostMapping("/assign")
    public ProcedureData assignProcedure(@RequestBody ProcedureData procedure) {
        return repository.save(procedure);
    }
}
