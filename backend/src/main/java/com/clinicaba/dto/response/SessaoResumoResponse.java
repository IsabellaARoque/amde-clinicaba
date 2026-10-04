package com.clinicaba.dto.response;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class SessaoResumoResponse {
    private Long id;
    private Long assistidoId;
    private String assistidoNome;
    private Long planoIntervencaoId;
    private String planoNome;
    private LocalDate data;
    private LocalTime horaInicio;
    private LocalTime horaFim;
    private Integer score;
    private String profissionalNome;
}
