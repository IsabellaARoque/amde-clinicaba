package com.clinicaba.controller;

import com.clinicaba.dto.request.PlanoIntervencaoRequest;
import com.clinicaba.dto.request.TreinoRequest;
import com.clinicaba.dto.response.PlanoIntervencaoResponse;
import com.clinicaba.dto.response.TreinoResponse;
import com.clinicaba.service.PlanoIntervencaoService;
import com.clinicaba.service.TreinoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/planos")
@RequiredArgsConstructor
public class PlanoIntervencaoController {

    private final PlanoIntervencaoService service;
    private final TreinoService treinoService;

    @GetMapping("/{id}")
    public ResponseEntity<PlanoIntervencaoResponse> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PlanoIntervencaoResponse> atualizar(@PathVariable Long id, @Valid @RequestBody PlanoIntervencaoRequest request) {
        return ResponseEntity.ok(service.atualizar(id, request));
    }

    @PutMapping("/{id}/desativar")
    public ResponseEntity<Void> desativar(@PathVariable Long id) {
        service.desativar(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/reativar")
    public ResponseEntity<Void> reativar(@PathVariable Long id) {
        service.reativar(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{planoId}/treinos")
    public ResponseEntity<List<TreinoResponse>> listarTreinos(@PathVariable Long planoId) {
        return ResponseEntity.ok(treinoService.listarPorPlano(planoId));
    }

    @PostMapping("/{planoId}/treinos")
    public ResponseEntity<TreinoResponse> criarTreino(@PathVariable Long planoId, @Valid @RequestBody TreinoRequest request) {
        return ResponseEntity.ok(treinoService.criar(planoId, request));
    }
}
