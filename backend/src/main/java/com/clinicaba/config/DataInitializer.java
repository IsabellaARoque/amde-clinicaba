package com.clinicaba.config;

import com.clinicaba.entity.Categoria;
import com.clinicaba.entity.Profissional;
import com.clinicaba.repository.CategoriaRepository;
import com.clinicaba.repository.ProfissionalRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final ProfissionalRepository profissionalRepository;
    private final CategoriaRepository categoriaRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Inicializa usuario padrao se nao existir
        if (profissionalRepository.findByEmail("admin@clinicaba.com").isEmpty()) {
            Profissional admin = Profissional.builder()
                    .nome("Profissional Administrador")
                    .cpf("000.000.000-00")
                    .email("admin@clinicaba.com")
                    .senha(passwordEncoder.encode("admin123"))
                    .build();
            profissionalRepository.save(admin);
            log.info(">>> Usuario inicial criado com sucesso: admin@clinicaba.com / admin123");
        }

        // Inicializa categorias padrao de ABA se nao existirem
        if (categoriaRepository.count() == 0) {
            List<String> categorias = List.of(
                    "Comunicação e Linguagem",
                    "Comportamento e Adaptação",
                    "Habilidades Sociais",
                    "Coordenação Motora",
                    "Autonomia e AVD",
                    "Cognição e Aprendizagem"
            );
            for (String nome : categorias) {
                categoriaRepository.save(Categoria.builder().nome(nome).build());
            }
            log.info(">>> Categorias iniciais de ABA cadastradas com sucesso");
        }
    }
}
