# ClinicABA mobile

## Executar

Use Node 22.13 ou superior na linha 22, ou Node 24.3 ou superior na linha 24, conforme os requisitos do Expo 58.

```cmd
npm ci
npx expo start --go --lan --clear
```

O celular e o computador devem estar na mesma rede. O backend precisa estar acessível pela porta 8080. A URL fica em `src/services/api.ts`; confira o IPv4 do Wi-Fi quando trocar de rede.

## Interface

O tema em `src/theme` segue as referências fornecidas: azul claro, cartões arredondados, detalhes em amarelo e navegação com identificação por ícones e texto. Os componentes em `src/components` concentram botões, campos, estados vazios e formulários.

- Pacientes: busca sem diferenciação de acentos, atualização ao puxar, erros com nova tentativa.
- Paciente: dados reais da API, responsável, planos, sessões recentes e soma dos scores dos treinos por categoria.
- Plano: objetivo, treinos existentes e criação de um novo treino.
- Nova sessão: escolha de plano e seleção de treinos em uma única janela, com criação de treino integrada.
- Atendimento: seleção e conclusão de treino são estados distintos. O score é um inteiro informado pela clínica, incluindo zero e valores acima de 100. Os scores dos treinos são somados por categoria; o score final da sessão é informado separadamente.
- Histórico: sessões em aberto podem ser retomadas pelo profissional responsável.

Nível de suporte, telefone do responsável, período do plano e objetivo livre da sessão aparecem nas referências, mas ainda não fazem parte dos contratos da API. A interface não inventa esses dados nem mostra campos que não possam ser salvos.

## Formulários e teclado

`FormScreen` combina ajuste da área disponível, rolagem do campo em foco, respeito às áreas seguras e ação para ocultar o teclado numérico. `FormField` mantém o rótulo visível e permite observações com múltiplas linhas.

Foi aplicado no login, registro de frequência, duração, encerramento e criação de treino. No Android, a configuração nativa do projeto usa `softwareKeyboardLayoutMode: resize`.

Os formulários de atendimento confirmam a saída quando há dados não salvos. Tentativas podem ser desfeitas; o cronômetro usa o tempo decorrido real para não perder segundos quando o app vai para segundo plano.

## Conferência

```cmd
npm run typecheck
npm run check:ui
```

Os testes de regressão cobrem a validação de scores inteiros, datas, idade, busca, geometria da rolagem e distinção entre treino selecionado e concluído, inclusive registros antigos duplicados.

### Conferir no aparelho

1. Em um aparelho pequeno, preencher observações longas e o score nos registros de frequência, duração e encerramento.
2. Abrir e ocultar o teclado numérico, trocar o foco e rolar até o botão de salvar.
3. Criar treino pela seleção de uma nova sessão; cancelar a edição e confirmar uma seleção.
4. Registrar tentativa por engano e desfazer; salvar com score zero.
5. Pausar o cronômetro, colocar o app em segundo plano e retornar.
6. Testar nova tentativa após erro da API e retomar uma sessão em aberto pelo histórico.

A conferência de tipos e os testes automáticos não substituem a validação do teclado nativo no Expo Go.
