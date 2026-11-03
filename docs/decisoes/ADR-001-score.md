# ADR-001 — Tratamento dos scores

**Estado:** aceita em 2026-11-03.

## Contexto

O levantamento acadêmico original, especialmente RF20, RF22 e RF23, previa que o score da sessão fosse a soma dos scores dos treinos. A clínica esclareceu posteriormente que score não é porcentagem, que apenas os scores dos treinos são somados por categoria e que o score final da sessão é preenchido separadamente.

## Decisão

- Score de treino é inteiro manual, inclusive zero e valores maiores que 100.
- Scores dos treinos são somados somente por categoria.
- Ao alterar um treino, a API aplica a diferença entre o valor novo e o anterior.
- Score final da sessão é inteiro manual e independente.
- Nenhuma interface calcula automaticamente uma avaliação clínica.

## Consequências

Esta decisão substitui a parte de RF20, RF22, RF23 e dos casos UC16 e UC18 que determina soma automática no score final. Interfaces não exibem `%` nem impõem faixa clínica arbitrária. `ScorePorCategoria.valor` permanece `Double` por compatibilidade com o modelo legado e deve ser revisto em uma migração futura.
