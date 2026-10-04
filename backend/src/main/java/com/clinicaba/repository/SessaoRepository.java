package com.clinicaba.repository;

import com.clinicaba.entity.Sessao;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SessaoRepository extends JpaRepository<Sessao, Long> {
    List<Sessao> findByAssistidoId(Long assistidoId);
}
