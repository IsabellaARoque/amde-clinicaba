package com.clinicaba.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CadastroProfissionalRequest {
    @NotBlank
    private String cpf;
    
    @NotBlank
    private String nome;
    
    @NotBlank
    @Email
    private String email;
    
    @NotBlank
    private String senha;
}
