package com.clinicaba.dto.response;

import lombok.Data;

@Data
public class TreinoSessaoResponse {
    private Long id;
    private TreinoResponse treino;
    private Integer score;
    private String observacoes;
    private RegistroFrequenciaResponse registroFrequencia;
    private RegistroDuracaoResponse registroDuracao;
}
