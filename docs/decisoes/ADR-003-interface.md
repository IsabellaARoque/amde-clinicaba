# ADR-003 — Sistema visual compartilhado

**Estado:** aceita em 2026-11-03.

## Decisão

Web e mobile compartilham linguagem visual baseada em azul claro, amarelo, cartões arredondados, tipografia de alta legibilidade e estados explícitos. A implementação é nativa de cada plataforma, sem biblioteca visual comum.

## Consequências

O produto mantém identidade coerente, mas tokens equivalentes ainda vivem em CSS e TypeScript separados. Alterações visuais devem ser comparadas nas duas plataformas.
