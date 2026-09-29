package com.backend.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity 
@Table (name = "planosintervencao")
public class Treino {
    @Id 
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    @Column (nullable = false, name = "id_treino")
    private Long id;
    @Column(nullable = false, name = "nomeTreino")
    private String nome;
    
    private String objetivo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, name = "categoria_treino")
    private Categoria categoria;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, name = "tipo_medicao")
    private TipoMedicao tipoMedicao;

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


    public String getObjetivo() {
        return objetivo;
    }


    public void setObjetivo(String objetivo) {
        this.objetivo = objetivo;
    }


    public Categoria getCategoria() {
        return categoria;
    }


    public void setCategoria(Categoria categoria) {
        this.categoria = categoria;
    }


    public TipoMedicao getTipoMedicao() {
        return tipoMedicao;
    }


    public void setTipoMedicao(TipoMedicao tipoMedicao) {
        this.tipoMedicao = tipoMedicao;
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
        result = prime * result + ((id == null) ? 0 : id.hashCode());
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
        Treino other = (Treino) obj;
        if (id == null) {
            if (other.id != null)
                return false;
        } else if (!id.equals(other.id))
            return false;
        return true;
    }
}
