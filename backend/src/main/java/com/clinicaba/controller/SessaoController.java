package com.clinicaba.controller;

import com.clinicaba.dto.request.*;
import com.clinicaba.dto.response.SessaoResponse;
import com.clinicaba.dto.response.TreinoSessaoResponse;
import com.clinicaba.service.SessaoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class SessaoController {

    private final SessaoService sessaoService;

    @PostMapping("/assistidos/{assistidoId}/sessoes/iniciar")
    public ResponseEntity<SessaoResponse> iniciarSessao(@PathVariable Long assistidoId, @Valid @RequestBody IniciarSessaoRequest request) {
        return ResponseEntity.ok(sessaoService.iniciarSessao(assistidoId, request));
    }

    @PutMapping("/sessoes/{id}/configurar")
    public ResponseEntity<Void> configurarSessao(@PathVariable Long id, @Valid @RequestBody ConfigurarSessaoRequest request) {
        sessaoService.configurarSessao(id, request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/sessoes/{sessaoId}/treinos/{treinoId}/iniciar")
    public ResponseEntity<TreinoSessaoResponse> iniciarTreinoSessao(
            @PathVariable Long sessaoId,
            @PathVariable Long treinoId
    ) {
        return ResponseEntity.ok(sessaoService.iniciarTreinoSessao(sessaoId, treinoId));
    }

    @PostMapping("/treino-sessao/{id}/registro-frequencia")
    public ResponseEntity<Void> registrarFrequencia(@PathVariable Long id, @Valid @RequestBody RegistroFrequenciaRequest request) {
        sessaoService.registrarFrequencia(id, request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/treino-sessao/{id}/registro-duracao")
    public ResponseEntity<Void> registrarDuracao(@PathVariable Long id, @Valid @RequestBody RegistroDuracaoRequest request) {
        sessaoService.registrarDuracao(id, request);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/treino-sessao/{id}/encerrar")
    public ResponseEntity<Void> encerrarTreinoSessao(@PathVariable Long id, @Valid @RequestBody EncerrarTreinoSessaoRequest request) {
        sessaoService.encerrarTreinoSessao(id, request);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/sessoes/{id}/encerrar")
    public ResponseEntity<Void> encerrarSessao(
            @PathVariable Long id,
            @RequestBody EditarSessaoRequest request
    ) {
        sessaoService.encerrarSessao(id, request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/sessoes/{id}")
    public ResponseEntity<SessaoResponse> buscarSessao(@PathVariable Long id) {
        return ResponseEntity.ok(sessaoService.buscarPorId(id));
    }

    @PutMapping("/sessoes/{id}/editar")
    public ResponseEntity<Void> editarSessao(@PathVariable Long id, @Valid @RequestBody EditarSessaoRequest request) {
        sessaoService.editarSessao(id, request);
        return ResponseEntity.ok().build();
    }

    @GetMapping(value = "/sessoes/{id}/exportar-pdf", produces = "application/pdf")
    public ResponseEntity<byte[]> exportarPdf(@PathVariable Long id) {
        byte[] pdf = sessaoService.exportarPdf(id);
        return ResponseEntity.ok()
                .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"sessao-" + id + ".pdf\"")
                .body(pdf);
    }
}
