package com.clinicaba.repository;

import com.clinicaba.entity.RegistroTreinoDuracao;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RegistroTreinoDuracaoRepository extends JpaRepository<RegistroTreinoDuracao, Long> {
    Optional<RegistroTreinoDuracao> findByTreinoSessaoId(Long treinoSessaoId);
}
