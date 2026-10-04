package com.clinicaba.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PlanoIntervencaoRequest {
    @NotBlank private String nome;
    private String objetivo;
}
