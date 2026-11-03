# ADR-004 — Endereço da API no mobile

**Estado:** provisória.

## Contexto

Expo Go precisa alcançar a máquina que executa o backend. O endereço muda conforme Wi-Fi, hotspot, emulador ou encaminhamento USB.

## Decisão atual

Durante o desenvolvimento, conferir o IPv4 da máquina e ajustar localmente a URL do cliente. Endereços particulares não devem ser enviados ao repositório como configuração universal.

## Consequência e evolução

O procedimento funciona, mas é sujeito a erro. O backlog prevê configuração por variável de ambiente ou perfil de execução.
