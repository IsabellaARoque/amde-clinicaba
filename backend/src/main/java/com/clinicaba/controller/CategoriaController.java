package com.clinicaba.controller;

import com.clinicaba.dto.request.*;
import com.clinicaba.dto.response.CategoriaResponse;
import com.clinicaba.service.CategoriaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
@RequiredArgsConstructor
public class CategoriaController {

    private final CategoriaService service;

    @GetMapping
    public ResponseEntity<List<CategoriaResponse>> listar() {
        return ResponseEntity.ok(service.listarTodas());
    }

    @PostMapping
    public ResponseEntity<CategoriaResponse> criar(@RequestParam String nome) {
        return ResponseEntity.ok(service.criar(nome));
    }
}
