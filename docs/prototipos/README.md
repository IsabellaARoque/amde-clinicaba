# Interfaces e fluxos

Esta documentação registra a implementação das referências visuais, sem substituir os arquivos de design originais.

## Sistema visual compartilhado

- Azul claro para áreas de destaque e cartões de acesso.
- Amarelo para ações de maior destaque.
- Superfícies brancas, bordas suaves e cantos amplos.
- Texto principal azul-escuro e texto secundário com contraste reduzido.
- Estados de sucesso, atenção, erro, carregamento e vazio.

## Mobile

| Fluxo | Telas principais |
|---|---|
| Acesso | Login e perfil profissional. |
| Pacientes | Lista com pesquisa, detalhe e atualização. |
| Planejamento | Detalhe de plano, lista e criação de treino. |
| Nova sessão | Seleção de plano, seleção/criação de treinos e configuração. |
| Atendimento | Sessão em andamento, frequência, duração e encerramento. |
| Consulta | Histórico e detalhe de sessão. |

Decisões de interação:

- Formulários rolam até o campo focado quando o teclado aparece.
- Teclado numérico pode ser ocultado sem abandonar o formulário.
- Saída com dados não salvos exige confirmação.
- Score zero diferencia treino concluído de treino ainda sem resultado.
- O cronômetro considera tempo real decorrido quando o aplicativo vai para segundo plano.

## Web

| Área | Comportamento |
|---|---|
| Login e cadastro | Apresentação da identidade ClinicABA e formulário centralizado. |
| Navegação | Barra lateral no desktop e barra inferior em telas menores. |
| Pacientes | Pesquisa sem diferenciação de acentos, cartões de acesso e estado vazio. |
| Detalhes | Dados pessoais, dados clínicos, planos e scores por categoria. |
| Planos e treinos | Formulários, status e ações de edição. |
| Sessões | Histórico, detalhe, edição permitida e exportação de PDF. |

## Responsividade e acessibilidade

- Breakpoint principal do portal em 860 px para troca da navegação.
- Formulários e grades passam a uma coluna em telas estreitas.
- Controles possuem foco visível e rótulos associados.
- Modais possuem semântica de diálogo e fechamento identificado.
- Animações são reduzidas quando o sistema operacional solicita menos movimento.

## Limites da referência

Campos ausentes na API não foram simulados. Qualquer novo campo deve passar por requisito, modelo de dados, contrato da API e interface antes de ser considerado implementado.
