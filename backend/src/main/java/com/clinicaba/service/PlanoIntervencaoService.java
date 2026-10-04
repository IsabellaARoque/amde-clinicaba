package com.clinicaba.service;

import com.clinicaba.dto.request.PlanoIntervencaoRequest;
import com.clinicaba.dto.response.PlanoIntervencaoResponse;
import com.clinicaba.dto.response.ProfissionalResponse;
import com.clinicaba.entity.Assistido;
import com.clinicaba.entity.PlanoIntervencao;
import com.clinicaba.entity.Profissional;
import com.clinicaba.enums.StatusPlano;
import com.clinicaba.exception.BusinessException;
import com.clinicaba.exception.ResourceNotFoundException;
import com.clinicaba.exception.UnauthorizedException;
import com.clinicaba.repository.PlanoIntervencaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PlanoIntervencaoService {

    private final PlanoIntervencaoRepository repository;
    private final AssistidoService assistidoService;
    private final ProfissionalService profissionalService;

    public List<PlanoIntervencaoResponse> listarPorAssistido(Long assistidoId) {
        return repository.findByAssistidoId(assistidoId).stream()
                .map(this::mapToResponse).collect(Collectors.toList());
    }
    
    public PlanoIntervencao findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Plano não encontrado"));
    }

    public PlanoIntervencaoResponse buscarPorId(Long id) {
        return mapToResponse(findById(id));
    }

    public PlanoIntervencaoResponse criar(Long assistidoId, PlanoIntervencaoRequest request) {
        Assistido assistido = assistidoService.findById(assistidoId);
        Profissional profissional = profissionalService.getCurrentUser();

        PlanoIntervencao plano = PlanoIntervencao.builder()
                .nome(request.getNome())
                .objetivo(request.getObjetivo())
                .dataCriacao(LocalDate.now())
                .status(StatusPlano.ATIVO)
                .assistido(assistido)
                .profissionalCriador(profissional)
                .build();
        return mapToResponse(repository.save(plano));
    }

    public PlanoIntervencaoResponse atualizar(Long id, PlanoIntervencaoRequest request) {
        PlanoIntervencao plano = findById(id);
        validarPropriedade(plano);
        plano.setNome(request.getNome());
        plano.setObjetivo(request.getObjetivo());
        return mapToResponse(repository.save(plano));
    }

    public void desativar(Long id) {
        PlanoIntervencao plano = findById(id);
        validarPropriedade(plano);
        plano.setStatus(StatusPlano.INATIVO);
        repository.save(plano);
    }

    public void reativar(Long id) {
        PlanoIntervencao plano = findById(id);
        validarPropriedade(plano);
        plano.setStatus(StatusPlano.ATIVO);
        repository.save(plano);
    }

    private void validarPropriedade(PlanoIntervencao plano) {
        Profissional atual = profissionalService.getCurrentUser();
        if (!plano.getProfissionalCriador().getId().equals(atual.getId())) {
            throw new UnauthorizedException("Apenas o criador do plano pode modificá-lo");
        }
    }

    private PlanoIntervencaoResponse mapToResponse(PlanoIntervencao p) {
        PlanoIntervencaoResponse resp = new PlanoIntervencaoResponse();
        resp.setId(p.getId());
        resp.setNome(p.getNome());
        resp.setDataCriacao(p.getDataCriacao());
        resp.setObjetivo(p.getObjetivo());
        resp.setStatus(p.getStatus());
        
        ProfissionalResponse pr = new ProfissionalResponse();
        pr.setId(p.getProfissionalCriador().getId());
        pr.setNome(p.getProfissionalCriador().getNome());
        pr.setCpf(p.getProfissionalCriador().getCpf());
        pr.setEmail(p.getProfissionalCriador().getEmail());
        resp.setProfissionalCriador(pr);
        
        return resp;
    }
}
