package com.clinicaba.repository;

import com.clinicaba.entity.TreinoSessao;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TreinoSessaoRepository extends JpaRepository<TreinoSessao, Long> {
    List<TreinoSessao> findBySessaoId(Long sessaoId);
    java.util.Optional<TreinoSessao> findBySessaoIdAndTreinoId(Long sessaoId, Long treinoId);
}
