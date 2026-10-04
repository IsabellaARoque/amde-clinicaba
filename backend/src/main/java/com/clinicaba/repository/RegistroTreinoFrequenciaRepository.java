package com.clinicaba.repository;

import com.clinicaba.entity.RegistroTreinoFrequencia;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RegistroTreinoFrequenciaRepository extends JpaRepository<RegistroTreinoFrequencia, Long> {
    Optional<RegistroTreinoFrequencia> findByTreinoSessaoId(Long treinoSessaoId);
}
