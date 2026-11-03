# Documentação do ClinicABA

Esta pasta reúne a documentação técnica e funcional do ClinicABA. O conteúdo descreve o comportamento observado no código da API, do portal web e do aplicativo móvel. Funcionalidades planejadas são identificadas como backlog e não são apresentadas como concluídas.

## Organização

| Área | Conteúdo |
|---|---|
| [Requisitos](requisitos/README.md) | Requisitos funcionais, qualidades, regras e rastreabilidade. |
| [Casos de uso](casos-de-uso/README.md) | Atores, fluxos principais, alternativas e exceções. |
| [Dados](der/README.md) | Modelo entidade-relacionamento e dicionário de dados. |
| [Arquitetura](arquitetura/README.md) | Componentes, responsabilidades e fluxos técnicos. |
| [Protótipos](prototipos/README.md) | Telas, navegação e decisões de interface por plataforma. |
| [Testes](testes/README.md) | Estratégia, comandos, resultados e validações pendentes. |
| [Decisões](decisoes/README.md) | Decisões técnicas e de produto com suas consequências. |
| [Continuidade](continuidade/README.md) | Linha de base e evolução realizada nesta etapa. |
| [Backlog](backlog/README.md) | Forma de organização e ligação com o backlog do produto. |

## Fontes acadêmicas recebidas

- Levantamento de requisitos com RF01 a RF25.
- Especificação dos casos de uso com UC01 a UC20.

Os arquivos Word originais não são versionados, conforme a orientação de manter em `docs/` apenas os artefatos úteis para a entrega. Os respectivos `README.md` preservam o catálogo acadêmico, registram a aderência ao código e as decisões posteriores. O diagrama de classes enviado com esses documentos representa uma versão anterior e, por orientação da equipe, não integra esta linha de base.

## Documento acadêmico

O template institucional, `tg.docx` e `tg.pdf` não estão versionados neste repositório. Quando forem fornecidos pela equipe, devem permanecer nesta pasta, com data ou versão que permita identificar a correspondência entre o documento editável e o PDF exportado. A estrutura do template institucional deve ser preservada.

## Princípios

- Dados pessoais, credenciais e endereços de rede locais não devem ser registrados como evidência.
- Exemplos devem usar dados sintéticos.
- Uma implementação só é marcada como validada quando há evidência registrada.
- Diagramas e requisitos devem acompanhar mudanças relevantes no código.
- Nem todo requisito precisa gerar uma tela, endpoint ou entidade própria.

Última revisão estrutural: 2026-11-03.
