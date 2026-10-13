package com.clinicaba.dto.response;

import com.clinicaba.enums.StatusPlano;
import lombok.Data;
import java.time.LocalDate;

@Data
public class PlanoIntervencaoResponse {
    private Long id;
    private String nome;
    private LocalDate dataCriacao;
    private String objetivo;
    private StatusPlano status;
    private ProfissionalResponse profissionalCriador;
}
