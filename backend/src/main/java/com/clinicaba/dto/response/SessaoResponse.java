package com.clinicaba.dto.response;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
public class SessaoResponse {
    private Long id;
    private Long assistidoId;
    private String assistidoNome;
    private Long planoIntervencaoId;
    private String planoNome;
    private ProfissionalResponse profissional;
    private PlanoIntervencaoResponse planoIntervencao;
    private AssistidoResumoResponse assistido;
    private LocalDate data;
    private LocalTime horaInicio;
    private LocalTime horaFim;
    private Integer score;
    private String observacoes;
    private List<TreinoSessaoResponse> treinos;
    private List<TreinoSessaoResponse> treinosSessao;
}
