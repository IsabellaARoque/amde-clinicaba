package com.clinicaba.controller;

import com.clinicaba.dto.request.TreinoRequest;
import com.clinicaba.dto.response.TreinoResponse;
import com.clinicaba.service.TreinoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/treinos")
@RequiredArgsConstructor
public class TreinoController {

    private final TreinoService service;

    @GetMapping("/{id}")
    public ResponseEntity<TreinoResponse> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TreinoResponse> atualizar(@PathVariable Long id, @Valid @RequestBody TreinoRequest request) {
        return ResponseEntity.ok(service.atualizar(id, request));
    }
}
