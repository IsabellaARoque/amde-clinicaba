package com.clinicaba.service;

import com.clinicaba.dto.request.AssistidoRequest;
import com.clinicaba.dto.response.AssistidoResponse;
import com.clinicaba.dto.response.ScorePorCategoriaResponse;
import com.clinicaba.entity.Assistido;
import com.clinicaba.entity.ScorePorCategoria;
import com.clinicaba.exception.BusinessException;
import com.clinicaba.exception.ResourceNotFoundException;
import com.clinicaba.repository.AssistidoRepository;
import com.clinicaba.repository.ScorePorCategoriaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AssistidoService {

    private final AssistidoRepository repository;
    private final ScorePorCategoriaRepository scoreRepository;
    private final CategoriaService categoriaService;

    public List<AssistidoResponse> listarTodos() {
        return repository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public AssistidoResponse buscarPorId(Long id) {
        return mapToResponse(findById(id));
    }

    public List<ScorePorCategoriaResponse> listarScores(Long assistidoId) {
        findById(assistidoId);
        return scoreRepository.findByAssistidoId(assistidoId).stream()
                .map(this::mapToScoreResponse)
                .collect(Collectors.toList());
    }
    
    public Assistido findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assistido não encontrado"));
    }

    public AssistidoResponse criar(AssistidoRequest request) {
        if (repository.findByCpf(request.getCpf()).isPresent()) {
            throw new BusinessException("CPF já cadastrado para outro assistido");
        }
        Assistido assistido = Assistido.builder()
                .cpf(request.getCpf())
                .nome(request.getNome())
                .dataNasc(request.getDataNasc())
                .convenio(request.getConvenio())
                .sala(request.getSala())
                .agenteDaSala(request.getAgenteDaSala())
                .periodo(request.getPeriodo())
                .frequencia(request.getFrequencia())
                .nomeResponsavel(request.getNomeResponsavel())
                .cpfResponsavel(request.getCpfResponsavel())
                .build();
        return mapToResponse(repository.save(assistido));
    }

    public AssistidoResponse atualizar(Long id, AssistidoRequest request) {
        Assistido assistido = findById(id);
        if (!assistido.getCpf().equals(request.getCpf()) && repository.findByCpf(request.getCpf()).isPresent()) {
            throw new BusinessException("CPF já cadastrado para outro assistido");
        }
        assistido.setCpf(request.getCpf());
        assistido.setNome(request.getNome());
        assistido.setDataNasc(request.getDataNasc());
        assistido.setConvenio(request.getConvenio());
        assistido.setSala(request.getSala());
        assistido.setAgenteDaSala(request.getAgenteDaSala());
        assistido.setPeriodo(request.getPeriodo());
        assistido.setFrequencia(request.getFrequencia());
        assistido.setNomeResponsavel(request.getNomeResponsavel());
        assistido.setCpfResponsavel(request.getCpfResponsavel());
        return mapToResponse(repository.save(assistido));
    }

    private AssistidoResponse mapToResponse(Assistido a) {
        AssistidoResponse resp = new AssistidoResponse();
        resp.setId(a.getId());
        resp.setCpf(a.getCpf());
        resp.setNome(a.getNome());
        resp.setDataNasc(a.getDataNasc());
        resp.setConvenio(a.getConvenio());
        resp.setSala(a.getSala());
        resp.setAgenteDaSala(a.getAgenteDaSala());
        resp.setPeriodo(a.getPeriodo());
        resp.setFrequencia(a.getFrequencia());
        resp.setNomeResponsavel(a.getNomeResponsavel());
        resp.setCpfResponsavel(a.getCpfResponsavel());
        return resp;
    }

    private ScorePorCategoriaResponse mapToScoreResponse(ScorePorCategoria score) {
        ScorePorCategoriaResponse response = new ScorePorCategoriaResponse();
        response.setId(score.getId());
        response.setCategoria(categoriaService.mapToResponse(score.getCategoria()));
        response.setValor(score.getValor());
        return response;
    }
}
