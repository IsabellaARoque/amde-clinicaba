package com.clinicaba.repository;

import com.clinicaba.entity.PlanoIntervencao;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PlanoIntervencaoRepository extends JpaRepository<PlanoIntervencao, Long> {
    List<PlanoIntervencao> findByAssistidoId(Long assistidoId);
}
