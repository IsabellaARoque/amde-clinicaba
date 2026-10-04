package com.clinicaba.repository;

import com.clinicaba.entity.Assistido;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AssistidoRepository extends JpaRepository<Assistido, Long> {
    Optional<Assistido> findByCpf(String cpf);
}
