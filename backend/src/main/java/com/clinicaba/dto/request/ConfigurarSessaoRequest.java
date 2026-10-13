package com.clinicaba.dto.request;

import lombok.Data;
import java.util.List;

@Data
public class ConfigurarSessaoRequest {
    private List<Long> treinoIds;
}
