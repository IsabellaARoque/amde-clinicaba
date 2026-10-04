package com.clinicaba.service;

import com.clinicaba.dto.request.TreinoRequest;
import com.clinicaba.dto.response.TreinoResponse;
import com.clinicaba.entity.Categoria;
import com.clinicaba.entity.PlanoIntervencao;
import com.clinicaba.entity.Treino;
import com.clinicaba.exception.ResourceNotFoundException;
import com.clinicaba.repository.TreinoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TreinoService {

    private final TreinoRepository repository;
    private final PlanoIntervencaoService planoService;
    private final CategoriaService categoriaService;

    public List<TreinoResponse> listarPorPlano(Long planoId) {
        return repository.findByPlanoIntervencaoId(planoId).stream()
                .map(this::mapToResponse).collect(Collectors.toList());
    }
    
    public Treino findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Treino não encontrado"));
    }

    public TreinoResponse buscarPorId(Long id) {
        return mapToResponse(findById(id));
    }

    public TreinoResponse criar(Long planoId, TreinoRequest request) {
        PlanoIntervencao plano = planoService.findById(planoId);
        Categoria categoria = request.getCategoriaId() != null ? categoriaService.findById(request.getCategoriaId()) : null;

        Treino treino = Treino.builder()
                .nome(request.getNome())
                .objetivo(request.getObjetivo())
                .atividade(request.getAtividade())
                .medicao(request.getMedicao())
                .categoriaTreino(categoria)
                .planoIntervencao(plano)
                .build();
        return mapToResponse(repository.save(treino));
    }

    public TreinoResponse atualizar(Long id, TreinoRequest request) {
        Treino treino = findById(id);
        Categoria categoria = request.getCategoriaId() != null ? categoriaService.findById(request.getCategoriaId()) : null;
        
        treino.setNome(request.getNome());
        treino.setObjetivo(request.getObjetivo());
        treino.setAtividade(request.getAtividade());
        treino.setMedicao(request.getMedicao());
        treino.setCategoriaTreino(categoria);
        return mapToResponse(repository.save(treino));
    }

    public TreinoResponse mapToResponse(Treino t) {
        TreinoResponse resp = new TreinoResponse();
        resp.setId(t.getId());
        resp.setNome(t.getNome());
        resp.setObjetivo(t.getObjetivo());
        resp.setAtividade(t.getAtividade());
        resp.setMedicao(t.getMedicao());
        resp.setCategoria(categoriaService.mapToResponse(t.getCategoriaTreino()));
        return resp;
    }
}
