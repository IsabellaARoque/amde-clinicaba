package com.clinicaba.entity;

import com.clinicaba.enums.TipoMedicao;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Treino {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String objetivo;
    private String atividade;

    @Enumerated(EnumType.STRING)
    private TipoMedicao medicao;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categoria_id")
    private Categoria categoriaTreino;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plano_intervencao_id", nullable = false)
    private PlanoIntervencao planoIntervencao;
}
