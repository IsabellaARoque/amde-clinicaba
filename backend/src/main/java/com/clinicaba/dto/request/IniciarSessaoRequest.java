package com.clinicaba.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class IniciarSessaoRequest {
    @NotNull private Long planoIntervencaoId;
}
