# Modelo Entidade-Relacionamento — ClinicABA

***Aguardando orientações enquanto a dúvida de colocar ou não as Foreign Keys no DER...se for preciso colocar, o modelo de DER sugerido pelo professor é válido e pode ser colocado na doc**

```mermaid
erDiagram

    PROFISSIONAL {
        BIGINT id PK
        VARCHAR cpf
        VARCHAR nome
        VARCHAR senha
        VARCHAR email
        VARCHAR permissao
    }

    ASSISTIDO {
        BIGINT id PK
        VARCHAR cpf
        VARCHAR cpfResponsavel
        VARCHAR nome
        DATE dataNasc
        VARCHAR convenio
        VARCHAR sala
        VARCHAR agenteDeSala
        VARCHAR periodo
        VARCHAR frequencia
        VARCHAR nomeResponsavel
    }

    PLANO_INTERVENCAO {
        BIGINT id PK
        VARCHAR nome
        DATE dataCriacao
        VARCHAR objetivo
        VARCHAR status
    }

    SESSAO {
        BIGINT id PK
        DATE data
        VARCHAR observacoes
        TIME horaInicio
        TIME horaFim
        INT score
    }

    TREINO_SESSAO {
        BIGINT id PK
        INT score
        VARCHAR observacao
    }

    TREINO {
        BIGINT id PK
        VARCHAR nome
        VARCHAR objetivo
        VARCHAR tipoMedicao
        VARCHAR atividade
    }

    SCORE_POR_CATEGORIA {
        BIGINT id PK
        DOUBLE valor
    }

    CATEGORIA {
        BIGINT id PK
        VARCHAR nome
    }

    REG_TREINO_FREQ {
        BIGINT id PK
        INT execSemAjuda
        INT execComAjuda
        INT naoExecutado
    }

    REG_TREINO_DURAC {
        BIGINT id PK
        BIGINT duracao
    }

    PROFISSIONAL ||--o{ SESSAO : cria
    PROFISSIONAL ||--o{ PLANO_INTERVENCAO : cria
    ASSISTIDO ||--o{ PLANO_INTERVENCAO : possui
    ASSISTIDO ||--o| SCORE_POR_CATEGORIA : possui

    PLANO_INTERVENCAO ||--o{ SESSAO : inclui
    PLANO_INTERVENCAO ||--o{ TREINO : inclui

    SESSAO ||--|{ TREINO_SESSAO : define
    TREINO ||--o{ TREINO_SESSAO : associado

    TREINO ||--o{ CATEGORIA : possui
    CATEGORIA ||--o{ SCORE_POR_CATEGORIA : associado

    TREINO_SESSAO ||--o| REG_TREINO_FREQ : especializa
    TREINO_SESSAO ||--o| REG_TREINO_DURAC : especializa
```
