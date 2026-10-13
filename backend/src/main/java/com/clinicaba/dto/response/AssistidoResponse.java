package com.clinicaba.dto.response;

import lombok.Data;
import java.time.LocalDate;

@Data
public class AssistidoResponse {
    private Long id;
    private String cpf;
    private String nome;
    private LocalDate dataNasc;
    private String convenio;
    private String sala;
    private String agenteDaSala;
    private String periodo;
    private String frequencia;
    private String nomeResponsavel;
    private String cpfResponsavel;
}
