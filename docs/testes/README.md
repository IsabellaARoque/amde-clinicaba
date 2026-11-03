# Plano e evidências de teste

## Estratégia

| Camada | Objetivo | Situação |
|---|---|---|
| Regressões mobile | Regras puras de score, busca, datas, rolagem e estado de treino. | Automatizado. |
| TypeScript mobile | Compatibilidade de tipos do aplicativo. | Automatizado. |
| Build web | Compilação TypeScript e bundle Vite. | Automatizado por comando local. |
| Build Docker web | Geração da imagem e serviço Nginx. | Validado localmente. |
| Backend | Regras de serviço e endpoints. | Cobertura automatizada ainda insuficiente. |
| QA em aparelho | Teclado, áreas seguras, cronômetro e rede. | Pendente de execução completa. |

## Comandos

```powershell
cd mobile
npm run typecheck
npm run check:ui

cd ..\web
npm run build

cd ..
docker compose -p pi build web
```

## Resultado registrado em 2026-11-03

- 10 regressões mobile passaram.
- Typecheck do mobile passou.
- Build do portal (`tsc && vite build`) passou.
- Imagem web foi reconstruída e o portal respondeu HTTP 200 em `localhost:3000`.
- Login web foi inspecionado em viewport desktop e em 390 px.
- Diff foi conferido sem erros de whitespace.

Esses resultados não equivalem a uma homologação clínica nem substituem testes de integração completos.

## Casos prioritários de QA manual

1. Preencher observações extensas e score com teclado aberto em aparelho pequeno.
2. Salvar score zero e valores inteiros maiores que 100.
3. Confirmar que valores fracionários são rejeitados.
4. Desfazer tentativa de frequência e revisar os três contadores.
5. Pausar cronômetro, colocar o aplicativo em segundo plano e retornar.
6. Criar treino durante a seleção de uma sessão e cancelar sem duplicar dados.
7. Simular falha da API, usar nova tentativa e retomar sessão aberta.
8. Editar score de treino já encerrado e verificar que a categoria recebe apenas a diferença.
9. Exportar PDF e conferir conteúdo, nome e legibilidade.
10. Verificar autorização ao tentar alterar plano ou sessão de outro profissional.

## Dados de teste

Utilizar pessoas e CPFs sintéticos. Não anexar capturas, bancos ou logs contendo informações reais de pacientes.
