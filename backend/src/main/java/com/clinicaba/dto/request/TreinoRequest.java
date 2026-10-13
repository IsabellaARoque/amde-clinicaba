package com.clinicaba.dto.request;

import com.clinicaba.enums.TipoMedicao;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TreinoRequest {
    @NotBlank private String nome;
    private String objetivo;
    private String atividade;
    @NotNull private TipoMedicao medicao;
    private Long categoriaId;
}
