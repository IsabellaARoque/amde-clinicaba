package com.clinicaba.repository;

import com.clinicaba.entity.Profissional;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ProfissionalRepository extends JpaRepository<Profissional, Long> {
    Optional<Profissional> findByEmail(String email);
    Optional<Profissional> findByCpf(String cpf);
}
