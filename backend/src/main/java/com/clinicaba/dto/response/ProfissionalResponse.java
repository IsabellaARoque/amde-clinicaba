package com.clinicaba.dto.response;

import lombok.Data;

@Data
public class ProfissionalResponse {
    private Long id;
    private String cpf;
    private String nome;
    private String email;
}
