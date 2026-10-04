package com.clinicaba.controller;

import com.clinicaba.dto.request.AssistidoRequest;
import com.clinicaba.dto.request.PlanoIntervencaoRequest;
import com.clinicaba.dto.response.AssistidoResponse;
import com.clinicaba.dto.response.PlanoIntervencaoResponse;
import com.clinicaba.dto.response.ScorePorCategoriaResponse;
import com.clinicaba.dto.response.SessaoResumoResponse;
import com.clinicaba.service.AssistidoService;
import com.clinicaba.service.PlanoIntervencaoService;
import com.clinicaba.service.SessaoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assistidos")
@RequiredArgsConstructor
public class AssistidoController {

    private final AssistidoService service;
    private final PlanoIntervencaoService planoService;
    private final SessaoService sessaoService;

    @GetMapping
    public ResponseEntity<List<AssistidoResponse>> listar() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @PostMapping
    public ResponseEntity<AssistidoResponse> criar(@Valid @RequestBody AssistidoRequest request) {
        return ResponseEntity.ok(service.criar(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AssistidoResponse> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @GetMapping("/{assistidoId}/scores")
    public ResponseEntity<List<ScorePorCategoriaResponse>> listarScores(@PathVariable Long assistidoId) {
        return ResponseEntity.ok(service.listarScores(assistidoId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AssistidoResponse> atualizar(@PathVariable Long id, @Valid @RequestBody AssistidoRequest request) {
        return ResponseEntity.ok(service.atualizar(id, request));
    }

    @GetMapping("/{assistidoId}/planos")
    public ResponseEntity<List<PlanoIntervencaoResponse>> listarPlanos(@PathVariable Long assistidoId) {
        return ResponseEntity.ok(planoService.listarPorAssistido(assistidoId));
    }

    @PostMapping("/{assistidoId}/planos")
    public ResponseEntity<PlanoIntervencaoResponse> criarPlano(@PathVariable Long assistidoId, @Valid @RequestBody PlanoIntervencaoRequest request) {
        return ResponseEntity.ok(planoService.criar(assistidoId, request));
    }

    @GetMapping("/{assistidoId}/sessoes")
    public ResponseEntity<List<SessaoResumoResponse>> listarSessoes(@PathVariable Long assistidoId) {
        return ResponseEntity.ok(sessaoService.listarPorAssistido(assistidoId));
    }
}
