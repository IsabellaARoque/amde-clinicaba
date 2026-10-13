package com.clinicaba.service;

import com.clinicaba.dto.request.UpdateProfissionalRequest;
import com.clinicaba.dto.response.ProfissionalResponse;
import com.clinicaba.entity.Profissional;
import com.clinicaba.exception.ResourceNotFoundException;
import com.clinicaba.repository.ProfissionalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProfissionalService {

    private final ProfissionalRepository repository;

    public Profissional getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return repository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Profissional não encontrado"));
    }

    public ProfissionalResponse getMe() {
        return mapToResponse(getCurrentUser());
    }

    public ProfissionalResponse updateMe(UpdateProfissionalRequest request) {
        Profissional p = getCurrentUser();
        if (request.getNome() != null) p.setNome(request.getNome());
        if (request.getEmail() != null) p.setEmail(request.getEmail());
        repository.save(p);
        return mapToResponse(p);
    }

    private ProfissionalResponse mapToResponse(Profissional p) {
        ProfissionalResponse resp = new ProfissionalResponse();
        resp.setId(p.getId());
        resp.setCpf(p.getCpf());
        resp.setNome(p.getNome());
        resp.setEmail(p.getEmail());
        return resp;
    }
}
