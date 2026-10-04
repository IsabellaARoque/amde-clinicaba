package com.clinicaba.dto.response;

import com.clinicaba.enums.TipoMedicao;
import lombok.Data;

@Data
public class TreinoResponse {
    private Long id;
    private String nome;
    private String objetivo;
    private String atividade;
    private TipoMedicao medicao;
    private CategoriaResponse categoria;
}
