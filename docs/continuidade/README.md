# Continuidade e evolução

## Linha de base recebida

A referência desta etapa é a branch `development` no commit `23c6844`. Ela já continha:

- backend Spring Boot com autenticação, pacientes, planos, treinos e sessões;
- banco PostgreSQL executado por Docker;
- portal web administrativo;
- aplicativo Expo para execução dos atendimentos;
- histórico de sessões por paciente;
- registro por frequência e duração;
- exportação de sessão em PDF no portal.

## Alterações desta etapa

| Área | Evolução |
|---|---|
| Mobile | Novo sistema visual, revisão de todas as telas principais e componentes reutilizáveis. |
| Usabilidade | Rolagem com teclado, proteção contra saída sem salvar, nova tentativa e estados vazios. |
| Sessões | Seleção/criação de treinos, distinção entre selecionado e concluído e retomada de sessão aberta. |
| Frequência | Desfazer última tentativa e contadores mais seguros. |
| Duração | Cronômetro baseado em tempo decorrido para sobreviver ao segundo plano. |
| Scores | Inteiros manuais, sem porcentagem; soma por categoria preservada; final da sessão separado. |
| Web | Identidade alinhada ao mobile, responsividade, navegação e cartões modernizados. |
| Documentação | Requisitos, casos, arquitetura, dados, testes, decisões, backlog e rastreabilidade. |

## Fontes acadêmicas incorporadas

O levantamento com RF01 a RF25 e a especificação com UC01 a UC20 foram preservados em `docs/requisitos` e `docs/casos-de-uso`. A documentação Markdown confronta essas fontes com o código atual. O diagrama de classes recebido foi identificado pela equipe como anterior ao modelo vigente e não foi adotado; o DER técnico deriva das entidades Java atuais.

## Compatibilidade preservada

- Contratos principais da API foram mantidos.
- Estrutura do banco não foi removida ou recriada.
- Score acumulado por categoria continua compatível com registros existentes.
- Campos presentes apenas nas referências visuais não foram inventados.

## Pendências conhecidas

- QA completa em aparelho físico e em diferentes versões do Expo Go.
- Testes automatizados do backend e do portal.
- Migrações versionadas do banco.
- Configuração da API mobile por ambiente.
- Alinhamento entre a regra prometida de 24 horas e a comparação de dias corridos na API.
- Homologação dos PDFs gerados.

O histórico Git continua sendo a fonte para autoria e sequência de commits; este documento explica o significado funcional das mudanças.
