package com.clinicaba.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Assistido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String cpf;

    @Column(nullable = false)
    private String nome;

    private LocalDate dataNasc;
    private String convenio;
    private String sala;
    private String agenteDaSala;
    private String periodo;
    private String frequencia;
    private String nomeResponsavel;
    private String cpfResponsavel;
}
