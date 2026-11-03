# ClinicABA — Sistema AMDE

Sistema para apoiar profissionais de clínicas ABA no cadastro de pacientes, planejamento de intervenções e registro de sessões terapêuticas.

> Este software organiza registros de atendimento. Ele não calcula avaliações clínicas nem substitui o julgamento do profissional.

## Componentes

| Pasta | Tecnologia | Responsabilidade |
|---|---|---|
| `backend/` | Java 21, Spring Boot e JPA | API, autenticação, regras, PDF e persistência. |
| `web/` | React, TypeScript e Vite | Cadastro, planejamento, histórico, edição e exportação. |
| `mobile/` | Expo e React Native | Configuração e execução das sessões em sala. |
| `docs/` | Markdown e Mermaid | Requisitos, modelos, arquitetura, testes e decisões. |

A documentação completa começa em [`docs/README.md`](docs/README.md). O trabalho planejado e as pendências ficam no [`PRODUCT-BACKLOG.md`](PRODUCT-BACKLOG.md).

## Funcionalidades atuais

- Cadastro e autenticação de profissionais com JWT.
- Cadastro e consulta de pacientes e responsáveis.
- Planos de intervenção com status ativo ou inativo.
- Treinos por frequência ou duração, vinculados a categorias.
- Início, configuração, execução, encerramento e histórico de sessões.
- Score inteiro informado manualmente para cada treino.
- Soma dos scores dos treinos por categoria.
- Score final da sessão informado manualmente e separado.
- Exportação de detalhes da sessão em PDF pelo portal.
- Portal responsivo e aplicativo preparado para uso com teclado aberto.

## Iniciar com Docker

### Pré-requisitos

- Docker Desktop em execução.
- Portas `3000`, `5432` e `8080` disponíveis.

Na raiz do repositório:

```powershell
docker compose -p pi up -d --build
docker compose -p pi ps
```

Acessos locais:

- Portal: <http://localhost:3000>
- API: <http://localhost:8080>

Para encerrar sem apagar os dados:

```powershell
docker compose -p pi down
```

Não use `down -v` quando precisar preservar o volume do PostgreSQL.

## Desenvolvimento web

```powershell
cd web
npm install
npm run dev
```

Validação de produção:

```powershell
npm run build
```

## Desenvolvimento mobile

Consulte também [`mobile/README.md`](mobile/README.md).

```powershell
cd mobile
npm install
npx expo start --go --lan --clear
```

O computador e o celular precisam conseguir se comunicar. Em uma rede local, confira o IPv4 do computador e ajuste localmente a URL em `mobile/src/services/api.ts`. Esse endereço depende da rede e não deve ser enviado ao repositório como configuração geral.

Para conferir o aplicativo:

```powershell
npm run typecheck
npm run check:ui
```

### Android por USB

Com `adb` disponível e o aparelho autorizado:

```powershell
adb devices
adb reverse tcp:8081 tcp:8081
adb reverse tcp:8080 tcp:8080
```

Depois, execute o Expo. O encaminhamento de portas é uma alternativa quando a rede Wi-Fi bloqueia a comunicação entre dispositivos.

## Segurança e dados

- Não registre credenciais reais, tokens, IPs particulares ou dados de pacientes na documentação, em commits ou evidências.
- Use dados sintéticos durante desenvolvimento e testes.
- Altere qualquer acesso inicial de desenvolvimento antes de compartilhar ou publicar um ambiente.
- Preserve o volume do banco e faça backup antes de alterações estruturais.

## Estrutura documental

```text
docs/
├── requisitos/
├── casos-de-uso/
├── der/
├── arquitetura/
├── prototipos/
├── testes/
├── decisoes/
├── continuidade/
└── backlog/
```

O template acadêmico e os arquivos `tg.docx` e `tg.pdf` não estão incluídos. Quando forem fornecidos, devem ser mantidos em `docs/` seguindo a orientação institucional e com identificação de versão.
