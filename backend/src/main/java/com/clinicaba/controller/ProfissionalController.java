package com.clinicaba.controller;

import com.clinicaba.dto.request.UpdateProfissionalRequest;
import com.clinicaba.dto.response.ProfissionalResponse;
import com.clinicaba.service.ProfissionalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profissionais")
@RequiredArgsConstructor
public class ProfissionalController {

    private final ProfissionalService service;

    @GetMapping("/me")
    public ResponseEntity<ProfissionalResponse> getMe() {
        return ResponseEntity.ok(service.getMe());
    }

    @PutMapping("/me")
    public ResponseEntity<ProfissionalResponse> updateMe(@Valid @RequestBody UpdateProfissionalRequest request) {
        return ResponseEntity.ok(service.updateMe(request));
    }
}
