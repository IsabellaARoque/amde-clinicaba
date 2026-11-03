# ADR-002 — Clientes separados e API comum

**Estado:** aceita.

## Decisão

Manter portal React/Vite e aplicativo Expo/React Native como clientes separados da API Spring Boot. Ambos usam os mesmos contratos HTTP e autenticação JWT; PostgreSQL só é acessado pelo backend.

## Consequências

As plataformas podem otimizar seus fluxos sem duplicar regras de negócio críticas. Mudanças contratuais exigem alinhamento de backend, web, mobile e documentação.
