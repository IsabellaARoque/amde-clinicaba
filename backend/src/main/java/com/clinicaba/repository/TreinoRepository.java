package com.clinicaba.repository;

import com.clinicaba.entity.Treino;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TreinoRepository extends JpaRepository<Treino, Long> {
    List<Treino> findByPlanoIntervencaoId(Long planoIntervencaoId);
}
