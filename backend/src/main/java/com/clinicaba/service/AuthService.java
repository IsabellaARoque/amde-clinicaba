package com.clinicaba.service;

import com.clinicaba.config.JwtService;
import com.clinicaba.dto.request.CadastroProfissionalRequest;
import com.clinicaba.dto.request.LoginRequest;
import com.clinicaba.dto.response.TokenResponse;
import com.clinicaba.entity.Profissional;
import com.clinicaba.exception.BusinessException;
import com.clinicaba.repository.ProfissionalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final ProfissionalRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public TokenResponse register(CadastroProfissionalRequest request) {
        if (repository.findByEmail(request.getEmail()).isPresent()) {
            throw new BusinessException("Email já cadastrado");
        }
        if (repository.findByCpf(request.getCpf()).isPresent()) {
            throw new BusinessException("CPF já cadastrado");
        }

        var user = Profissional.builder()
                .nome(request.getNome())
                .cpf(request.getCpf())
                .email(request.getEmail())
                .senha(passwordEncoder.encode(request.getSenha()))
                .build();
        repository.save(user);
        var jwtToken = jwtService.generateToken(user);
        return TokenResponse.builder().token(jwtToken).build();
    }

    public TokenResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getSenha()
                )
        );
        var user = repository.findByEmail(request.getEmail())
                .orElseThrow();
        var jwtToken = jwtService.generateToken(user);
        return TokenResponse.builder().token(jwtToken).build();
    }
}
