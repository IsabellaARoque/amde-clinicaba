package com.clinicaba.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegistroTreinoFrequencia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "treino_sessao_id", nullable = false)
    private TreinoSessao treinoSessao;

    private int execSemAjuda;
    private int execComAjuda;
    private int naoExecutado;
}
