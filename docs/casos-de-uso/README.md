# Casos de uso e aderência

O documento acadêmico define 20 casos de uso. Este catálogo mantém seus códigos, atores e plataformas e registra a situação observada no sistema atual.

## Catálogo

| Código | Caso de uso | Ator definido | Plataforma | Aderência |
|---|---|---|---|---|
| UC01 | Cadastrar profissional | Administrador | Site | Parcial; cadastro existe sem papel Administrador. |
| UC02 | Autenticar usuário | Administrador | Site e Mobile | Implementado para profissional cadastrado. |
| UC03 | Visualizar perfil de usuário | Administrador | Site e Mobile | Implementado. |
| UC04 | Editar usuário | Administrador | Site | Implementado para o próprio perfil. |
| UC05 | Cadastrar assistido | Administrador | Site | Parcial; observações gerais e papel Administrador não existem. |
| UC06 | Editar assistido | Administrador | Site | Implementado para os campos atuais. |
| UC07 | Visualizar assistidos | Profissional | Site e Mobile | Implementado sem conceito de assistido ativo/inativo. |
| UC08 | Visualizar perfil de assistido | Profissional | Site e Mobile | Implementado. |
| UC09 | Criar plano terapêutico | Profissional | Site | Parcial; observação própria do plano não existe. |
| UC10 | Alterar plano terapêutico | Profissional | Site | Implementado com validação do criador. |
| UC11 | Visualizar plano terapêutico | Profissional | Site e Mobile | Implementado. |
| UC12 | Desativar plano terapêutico | Profissional | Site | Implementado com validação do criador. |
| UC13 | Reativar plano terapêutico | Profissional | Site | Implementado com validação do criador. |
| UC14 | Cadastrar treino | Profissional | Site e Mobile | Implementado nas duas plataformas. |
| UC15 | Alterar treino | Profissional | Site | Parcial; edição existe sem validação de propriedade no serviço. |
| UC16 | Configurar e executar sessão | Profissional | Mobile | Implementado com ressalvas de objetivo livre e score final manual. |
| UC17 | Visualizar histórico de sessões | Profissional | Site e Mobile | Implementado. |
| UC18 | Visualizar sessão | Profissional | Site e Mobile | Implementado; score final não é soma automática. |
| UC19 | Editar sessão | Profissional | Site | Parcial; edição é restrita ao responsável, mas a janela não calcula 24 horas exatas e os treinos não são alterados pelo contrato atual. |
| UC20 | Exportar sessão | Profissional | Site | Implementado; homologação do PDF pendente. |

## Fluxos consolidados

### UC01 a UC04 — Acesso e perfil

O usuário cadastra uma conta, autentica-se, consulta o próprio perfil e altera os campos permitidos. Dados inválidos ou duplicados impedem a gravação. A restrição do cadastro ao ator Administrador está prevista no documento, mas não existe na autorização atual.

### UC05 a UC08 — Assistidos

O usuário cadastra ou edita um assistido, consulta a lista, pesquisa pelo nome e abre seu perfil com informações gerais, planos, scores e histórico. O modelo atual não persiste observações gerais do assistido nem um status ativo/inativo.

### UC09 a UC15 — Planos e treinos

O profissional cria um plano para um assistido, consulta seus treinos e, se for o criador, altera seu conteúdo ou estado. Treinos registram nome, objetivo, atividade, categoria e tipo de medição. A API ainda precisa aplicar ao treino a mesma validação de propriedade usada no plano.

### UC16 — Configuração e execução de sessão

1. O profissional seleciona paciente e plano; a API grava profissional, data e horário inicial.
2. O profissional escolhe os treinos da sessão.
3. Em frequência, registra sem ajuda, com ajuda ou não executado.
4. Em duração, utiliza o cronômetro e grava o tempo em segundos.
5. Ao concluir cada treino, informa score inteiro e observação.
6. O score atualiza a soma acumulada da categoria do paciente.
7. No encerramento, informa observação geral e score final manual; a API grava o horário final.

O fluxo acadêmico original previa objetivo livre da sessão e soma automática dos scores dos treinos como score final. O objetivo ainda não é persistido, e a soma automática foi substituída pela [ADR-001](../decisoes/ADR-001-score.md).

### UC17 a UC20 — Histórico, edição e exportação

O profissional consulta o histórico e os detalhes de uma sessão. O responsável pode editar observação e score final enquanto a API considerar a sessão dentro da janela permitida. O portal solicita à API um PDF da sessão. Alteração dos registros de treino e recálculo automático do score final, descritos na fonte acadêmica, não fazem parte do contrato atual.

## Fontes e manutenção

O arquivo Word original permanece fora do repositório. Este catálogo Markdown é a versão rastreável mantida com o código. O diagrama de classes recebido não foi incorporado porque representa um modelo anterior; entidades e relacionamentos vigentes são descritos em [Modelo de dados](../der/README.md), extraídos do backend atual.
