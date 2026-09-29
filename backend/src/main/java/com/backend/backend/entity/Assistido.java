package com.backend.backend.entity;

import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity 
@Table (name = "assistidos")
public class Assistido {
    
    @Id 
    @Column (nullable = false, name = "cpfAssistido", unique = true, length = 11)
    private Long cpf;

    @Column (nullable = false, name = "nomeAssistido")
    private String nome;
    private Date dataNasc;
    private String convenio;
    private String sala;
    private String agenteDeSala;
    private String periodo;
    private String frequencia;
    private String responsavel;
    @Column (length = 15)
    private String telefResponsavel;

    public Long getCpf() {
        return cpf;
    }
    public void setCpf(Long cpf) {
        this.cpf = cpf;
    }
    public String getNome() {
        return nome;
    }
    public void setNome(String nome) {
        this.nome = nome;
    }
    public Date getDataNasc() {
        return dataNasc;
    }
    public void setDataNasc(Date dataNasc) {
        this.dataNasc = dataNasc;
    }
    public String getConvenio() {
        return convenio;
    }
    public void setConvenio(String convenio) {
        this.convenio = convenio;
    }
    public String getSala() {
        return sala;
    }
    public void setSala(String sala) {
        this.sala = sala;
    }
    public String getAgenteDeSala() {
        return agenteDeSala;
    }
    public void setAgenteDeSala(String agenteDeSala) {
        this.agenteDeSala = agenteDeSala;
    }
    public String getPeriodo() {
        return periodo;
    }
    public void setPeriodo(String periodo) {
        this.periodo = periodo;
    }
    public String getFrequencia() {
        return frequencia;
    }
    public void setFrequencia(String frequencia) {
        this.frequencia = frequencia;
    }
    public String getResponsavel() {
        return responsavel;
    }
    public void setResponsavel(String responsavel) {
        this.responsavel = responsavel;
    }
    public String getTelefResponsavel() {
        return telefResponsavel;
    }
    public void setTelefResponsavel(String telefResponsavel) {
        this.telefResponsavel = telefResponsavel;
    }

    
    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((cpf == null) ? 0 : cpf.hashCode());
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
        Assistido other = (Assistido) obj;
        if (cpf == null) {
            if (other.cpf != null)
                return false;
        } else if (!cpf.equals(other.cpf))
            return false;
        return true;
    }
}
