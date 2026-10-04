package com.clinicaba.dto.response;

import lombok.Data;

@Data
public class RegistroFrequenciaResponse {
    private Long id;
    private int execSemAjuda;
    private int execComAjuda;
    private int naoExecutado;
}
