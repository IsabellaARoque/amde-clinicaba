package com.clinicaba.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

@Data
public class AssistidoRequest {
    @NotBlank private String cpf;
    @NotBlank private String nome;
    @NotNull private LocalDate dataNasc;
    private String convenio;
    private String sala;
    private String agenteDaSala;
    private String periodo;
    private String frequencia;
    private String nomeResponsavel;
    private String cpfResponsavel;
}
