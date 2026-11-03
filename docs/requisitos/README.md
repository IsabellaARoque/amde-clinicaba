# Requisitos e aderência ao sistema

Este catálogo preserva a identificação do levantamento acadêmico entregue pela equipe. A coluna **Aderência** compara cada requisito com o código atual. Quando uma decisão posterior alterou o requisito, ela é registrada sem apresentar o texto antigo como comportamento vigente.

## Atores definidos no levantamento

- **Administrador:** cadastro e edição de profissionais e pacientes e demais funções administrativas.
- **Profissional:** acompanhamento dos pacientes, planos, treinos, sessões, resultados e exportação. O documento define que este ator também herda as funções do Administrador.

**Aderência atual:** a entidade `Profissional` não possui papel ou autoridade diferenciada e a API não implementa um ator Administrador separado. Toda pessoa autenticada possui o mesmo conjunto técnico de permissões, sujeito apenas às regras de propriedade de planos e sessões. O cadastro de profissional é público em `/api/auth/register`.

## Requisitos funcionais

| ID | Requisito acadêmico | Plataforma | Aderência ao código atual |
|---|---|---|---|
| RF01 | Cadastrar profissional | Site | **Parcial.** Cadastro existe, mas não é restrito a Administrador. |
| RF02 | Autenticar usuário | Site e Mobile | **Implementado.** Login com JWT nas duas interfaces. |
| RF03 | Visualizar perfil de usuário | Site e Mobile | **Implementado.** Endpoint e telas de perfil disponíveis. |
| RF04 | Editar usuário | Site | **Implementado.** Usuário altera o próprio perfil. |
| RF05 | Cadastrar assistido | Site | **Parcial.** Cadastro existe; observações gerais não fazem parte da entidade ou do contrato. Não há papel Administrador. |
| RF06 | Editar assistido | Site | **Implementado** para os campos persistidos atualmente. |
| RF07 | Visualizar assistidos disponíveis | Site e Mobile | **Parcial.** Lista existe, mas `Assistido` não possui estado ativo/inativo para filtrar disponibilidade. |
| RF08 | Visualizar perfil do assistido | Site e Mobile | **Implementado.** Dados, scores, planos e histórico podem ser acessados. |
| RF09 | Criar plano terapêutico | Site | **Parcial.** Nome, objetivo, criador e data existem; observação própria do plano não existe. |
| RF10 | Alterar plano terapêutico | Site | **Implementado.** Somente o criador pode alterar. |
| RF11 | Visualizar plano e treinos | Site e Mobile | **Implementado.** |
| RF12 | Desativar plano terapêutico | Site | **Implementado.** Somente o criador pode desativar. |
| RF13 | Reativar plano terapêutico | Site | **Implementado.** Somente o criador pode reativar. |
| RF14 | Cadastrar treino | Site | **Implementado e ampliado.** Também pode ser criado no fluxo mobile; objetivo e atividade complementam os campos previstos. |
| RF15 | Alterar treino | Site | **Parcial.** Edição existe, mas o backend não valida se o treino pertence a plano criado pelo profissional atual. |
| RF16 | Iniciar sessão e registrar paciente, profissional, data e hora | Mobile | **Implementado.** |
| RF17 | Configurar objetivo, plano e treinos da sessão | Mobile | **Parcial.** Plano é definido na abertura e treinos são configurados; objetivo livre da sessão não é persistido. |
| RF18 | Escolher e iniciar treinos dentro da sessão | Mobile | **Implementado.** Observação geral é registrada no encerramento. |
| RF19 | Executar treino de frequência ou duração e registrar score | Mobile | **Implementado.** Inclui frequência, cronômetro, observação e score inteiro manual. |
| RF20 | Encerrar sessão e calcular score pela soma dos treinos | Mobile | **Substituído parcialmente.** Horário e informações são gravados, mas o score final é manual conforme decisão posterior [ADR-001](../decisoes/ADR-001-score.md). |
| RF21 | Visualizar histórico de sessões | Site e Mobile | **Implementado.** |
| RF22 | Visualizar detalhes e score somado da sessão | Site e Mobile | **Parcial.** Detalhes existem; o score final exibido é manual e separado. |
| RF23 | Editar sessão própria em até 24 horas e recalcular score | Site | **Parcial.** Propriedade é validada; API compara dias corridos, não 24 horas exatas; contrato de edição atual altera apenas observação e score final. |
| RF24 | Exportar sessão em PDF | Site | **Implementado.** Homologação completa do conteúdo do PDF continua pendente. |
| RF25 | Consultar e analisar evolução por gráficos e tabelas | Fora do escopo | **Não implementado**, conforme o próprio levantamento. |

## Requisitos não funcionais

| ID | Requisito acadêmico | Aderência e evidência |
|---|---|---|
| RNF01 | Responder às ações em menos de 2 segundos | **Não comprovado.** Não há ensaio de desempenho registrado. |
| RNF02 | Interface mobile simples e intuitiva | **Em validação.** Interface foi modernizada; avaliação com usuários não foi registrada. |
| RNF03 | Exigir poucos passos para registrar informações | **Em validação.** Fluxos foram simplificados, mas não há métrica formal. |
| RNF04 | Proteger contra acesso não autorizado | **Parcial.** JWT, BCrypt e propriedade de recursos existem; papéis, CORS de produção e credencial inicial ainda exigem revisão. |
| RNF05 | Apenas o autor pode editar sua sessão | **Implementado** no serviço de sessão. |
| RNF06 | Preservar integridade dos registros | **Parcial.** Persistência e atualização por diferença de score existem; faltam testes de integração e migrações. |
| RNF07 | Manter desempenho com aumento de volume | **Não comprovado.** Não há teste de carga. |
| RNF08 | Impedir cadastro duplicado de assistido | **Implementado** por CPF único e validação de persistência. |
| RNF09 | Diferenciar dados ativos e desativados | **Parcial.** Planos possuem status; pacientes e outros registros não possuem estado equivalente. |
| RNF10 | Somente responsável desativa ou reativa plano | **Implementado.** |

## Regras vigentes complementares

- O score de treino é inteiro manual e não representa porcentagem.
- Scores de treinos atualizam a soma acumulada do paciente por categoria.
- Ao reeditar um score de treino, aplica-se apenas a diferença em relação ao valor anterior.
- O score final da sessão é manual e independente da soma por categoria.
- Score zero é resultado concluído válido.
- Não é permitido adicionar treino a uma sessão encerrada.
- O registro deve corresponder ao tipo `FREQUENCIA` ou `DURACAO` do treino.

## Rastreabilidade resumida

| Faixa | Backend | Web | Mobile | Evidência atual |
|---|---|---|---|---|
| RF01–RF04 | autenticação e profissional | login, cadastro e perfil | login e perfil | Builds e checagem de tipos; papéis pendentes. |
| RF05–RF08 | `AssistidoController` | cadastro, lista e detalhe | lista e detalhe | Busca, dados e estados de interface implementados. |
| RF09–RF15 | planos e treinos | planejamento e edição | consulta e criação integrada | Propriedade de treino precisa de reforço. |
| RF16–RF20 | `SessaoController` e `SessaoService` | consulta posterior | atendimento completo | Regressões mobile; QA física pendente. |
| RF21–RF24 | histórico, edição e PDF | histórico, edição e exportação | histórico e detalhes | PDF e janela temporal ainda precisam de homologação. |

O arquivo Word original permanece fora do repositório. Este catálogo Markdown é a versão rastreável mantida com o código. Para alterações futuras, requisitos, casos de uso e decisões devem ser revisados em conjunto.
