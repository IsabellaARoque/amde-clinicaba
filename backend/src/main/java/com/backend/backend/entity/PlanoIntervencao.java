package com.backend.backend.entity;

import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity 
@Table (name = "planosintervencao")
public class PlanoIntervencao {
    @Id 
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    @Column (nullable = false, name = "id_planointerv")
    private Long id;
    @Column(nullable = false, name = "nomePlano")
    private String nome;
    
    private Date dataCriacao;
    private String objetivo;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cpf_assistido", referencedColumnName = "cpfAssistido", nullable = false)
    private Assistido assistido;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cpf_profissional", referencedColumnName = "cpfProfissional", nullable = false)
    private Profissional profissional;
    
    
    @Column(nullable = false)
    private Boolean status = true;


    public Long getId() {
        return id;
    }


    public void setId(Long id) {
        this.id = id;
    }


    public String getNome() {
        return nome;
    }


    public void setNome(String nome) {
        this.nome = nome;
    }


    public Date getDataCriacao() {
        return dataCriacao;
    }


    public void setDataCriacao(Date dataCriacao) {
        this.dataCriacao = dataCriacao;
    }


    public String getObjetivo() {
        return objetivo;
    }


    public void setObjetivo(String objetivo) {
        this.objetivo = objetivo;
    }


    public Assistido getAssistido() {
        return assistido;
    }


    public void setAssistido(Assistido assistido) {
        this.assistido = assistido;
    }


    public Profissional getProfissional() {
        return profissional;
    }


    public void setProfissional(Profissional profissional) {
        this.profissional = profissional;
    }


    public Boolean getStatus() {
        return status;
    }


    public void setStatus(Boolean status) {
        this.status = status;
    }


    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((assistido == null) ? 0 : assistido.hashCode());
        result = prime * result + ((profissional == null) ? 0 : profissional.hashCode());
        return result;
    }


    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        PlanoIntervencao other = (PlanoIntervencao) obj;
        if (assistido == null) {
            if (other.assistido != null)
                return false;
        } else if (!assistido.equals(other.assistido))
            return false;
        if (profissional == null) {
            if (other.profissional != null)
                return false;
        } else if (!profissional.equals(other.profissional))
            return false;
        return true;
    }
    
}
