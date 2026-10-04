package com.clinicaba.dto.request;

import lombok.Data;

@Data
public class RegistroFrequenciaRequest {
    private int execSemAjuda;
    private int execComAjuda;
    private int naoExecutado;
}
