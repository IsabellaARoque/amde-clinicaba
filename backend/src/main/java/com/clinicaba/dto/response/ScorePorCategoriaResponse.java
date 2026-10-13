package com.clinicaba.dto.response;

import lombok.Data;

@Data
public class ScorePorCategoriaResponse {
    private Long id;
    private CategoriaResponse categoria;
    private Double valor;
}
