package com.clinicaba.service;

import com.clinicaba.dto.response.CategoriaResponse;
import com.clinicaba.entity.Categoria;
import com.clinicaba.exception.ResourceNotFoundException;
import com.clinicaba.repository.CategoriaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoriaService {
    private final CategoriaRepository repository;

    public List<CategoriaResponse> listarTodas() {
        return repository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public Categoria findById(Long id) {
        return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada"));
    }

    public CategoriaResponse criar(String nome) {
        Categoria cat = new Categoria();
        cat.setNome(nome);
        return mapToResponse(repository.save(cat));
    }

    public CategoriaResponse mapToResponse(Categoria c) {
        if(c == null) return null;
        CategoriaResponse r = new CategoriaResponse();
        r.setId(c.getId());
        r.setNome(c.getNome());
        return r;
    }
}
