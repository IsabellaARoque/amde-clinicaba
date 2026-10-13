package com.clinicaba.repository;

import com.clinicaba.entity.ScorePorCategoria;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ScorePorCategoriaRepository extends JpaRepository<ScorePorCategoria, Long> {
    List<ScorePorCategoria> findByAssistidoId(Long assistidoId);
    Optional<ScorePorCategoria> findByAssistidoIdAndCategoriaId(Long assistidoId, Long categoriaId);
}
