# ClinicABA (Sistema AMDE)

Sistema para gerenciamento de atendimentos em clínicas de terapia ABA (Análise do Comportamento Aplicada).

O objetivo principal deste software é facilitar o trabalho de terapeutas e administradores de clínicas no acompanhamento de pessoas assistidas, organização de planos de ensino e registro das sessões terapêuticas em tempo real.

---

## O que o sistema faz

O projeto é dividido em três partes complementares:

### 1. Sistema Web (Navegador)
Voltado para uso no computador, focado no trabalho administrativo e no planejamento dos atendimentos:
* Cadastro e consulta de profissionais terapeutas.
* Cadastro completo das pessoas atendidas (assistidos), incluindo dados do responsável, convênio, horários e sala de atendimento.
* Criação de planos terapêuticos com objetivos específicos para cada assistido.
* Cadastro de treinos vinculados a cada plano, definindo a categoria e a forma de medição.
* Visualização do histórico de atendimentos e pontuações por categoria.
* Exportação dos dados de cada atendimento em arquivo no formato PDF.

### 2. Aplicativo para Celular (Mobile)
Desenvolvido para ser utilizado pelo terapeuta dentro da sala durante o atendimento:
* Acesso rápido à lista de pessoas atendidas.
* Início de uma nova sessão de atendimento com registro automático da data e do horário.
* Escolha do plano terapêutico e dos treinos que serão feitos no dia.
* Tela de contagem para treinos baseados em repetição: botões grandes para marcar com facilidade se o assistido realizou a tarefa sem ajuda, com ajuda ou se não executou.
* Tela com cronômetro para treinos medidos por tempo de duração.
* Atribuição de nota para cada treino e encerramento automático da sessão com a soma das notas.

### 3. Servidor e Banco de Dados (Backend)
Responsável por conectar todas as partes, guardar as informações em segurança no banco PostgreSQL e garantir as regras de negócio:
* Proteção dos dados por meio de login com senha criptografada.
* Garantia de que cada assistido tenha um cadastro único pelo CPF.
* Regra para que apenas o terapeuta responsável possa alterar ou desativar o plano que criou.
* Liberação de edição de uma sessão encerrada somente nas primeiras vinte e quatro horas após o término.

---

## Como o sistema funciona na prática

1. **Acesso:** o profissional entra no sistema informando seu e-mail e senha.
2. **Cadastro do assistido:** na versão web, o profissional cadastra a pessoa que receberá o atendimento.
3. **Plano e treinos:** o profissional cria um plano de ensino para aquele assistido e adiciona os treinos necessários (por exemplo: treino de comunicação ou treino de autonomia).
4. **Atendimento em sala:** no aplicativo do celular, o profissional abre o perfil do assistido e inicia a sessão. Durante os exercícios, o profissional clica nos botões para registrar as respostas do assistido.
5. **Finalização:** ao concluir os treinos, o terapeuta encerra a sessão. O sistema calcula a pontuação total e atualiza o histórico do paciente.
6. **Relatório:** a qualquer momento, o profissional pode consultar o histórico e gerar um documento em PDF com tudo o que aconteceu na sessão.
Outras opcões ainda a serem incluídas é o gráfico. A fazer ainda, vamos alinhar primeiro as funcionalidade essenciais do sistema... Pelo menos, acho que é mais interessante pensar assim primeiro. 

---

## Como iniciar o projeto no computador

O projeto foi preparado para rodar completo usando Docker, sem a necessidade de instalar banco de dados ou ferramentas de programação manualmente na máquina.

### Pré-requisitos
* Ter o Docker Desktop instalado e aberto no computador.

### Passo a passo para rodar

1. Abra o terminal na pasta principal do projeto:
```
cd PI
```

2. Execute o comando para construir e ligar os serviços:
```
docker compose up --build
```

O comando irá montar o banco de dados, o servidor e a versão web. Esse processo pode demorar alguns minutos na primeira vez em que for executado.

3. Quando a inicialização terminar, acesse pelo seu navegador:
* **Versão Web:** http://localhost:3000
* **Servidor (Backend):** http://localhost:8080

4. Para desligar o sistema quando terminar de usar, aperte `Ctrl + C` no terminal ou execute em outra janela do terminal:
```
docker compose down
```

*Observação:* os programas não iniciam sozinhos quando o Docker é aberto. Eles só rodam quando você executa o comando acima. 

### Executar o aplicativo no Android pelo USB

O aplicativo móvel usa Expo Go para abrir no celular; não é necessário ter um chip SIM. Instale o Expo Go no celular e ative a Depuração USB nas opções de desenvolvedor do Android.

1. Deixe o backend em execução com `docker compose up -d backend`.
2. Conecte o celular por USB, aceite a autorização de depuração e confirme que `adb devices` mostra o dispositivo como `device`.
3. Na pasta `mobile`, encaminhe as portas do Metro e do backend para o celular:
```
adb reverse tcp:8081 tcp:8081
adb reverse tcp:8080 tcp:8080
```
4. Inicie o Expo:
```
npm start
```
5. Em outro terminal, abra o projeto no Expo Go pelo USB:(Pessoal, se forem testar, tem que trocar o endereco ip de vcs.)
- Vai no cmd e dá ipconfig, vai ter o endereço ipv4, ele é o seu IP. 
- Pega o IP e substitue em: mobile/src/services/api.ts
```
export const api = axios.create({
  baseURL: 'http://<ColacaIPaquiiii>:8080/api',
});
```

```
adb shell am start -a android.intent.action.VIEW -d exp://<EuEnderecoIP>:8081
```

O servidor Expo inicia em modo LAN para escutar em IPv4; o encaminhamento USB permite abrir o endereço local mesmo sem o computador e o celular estarem na mesma rede Wi-Fi. O app acessa o backend em `http://localhost:8080` pelo encaminhamento USB. Na rede Wi-Fi, conecte computador e celular à mesma rede, abra o app pelo QR Code do Expo Go e altere `baseURL` em `mobile/src/services/api.ts` para o IP do computador.

---

## Dados de acesso inicial

Para você entrar no sistema logo após a primeira inicialização, foi criado um usuário padrão:

* **E-mail:** admin@clinicaba.com
* **Senha:** admin123

Você também pode criar novos usuários a qualquer momento clicando no botão de cadastro na página inicial da aplicação web.

---

## Organização das pastas

* **backend:** código fonte do servidor construído em Java com Spring Boot e banco de dados PostgreSQL.
* **web:** código fonte do painel de computador construído em React com TypeScript.
* **mobile:** código fonte do aplicativo de celular construído em React Native com Expo e TypeScript.
* **docker-compose.yml:** arquivo que junta todos os serviços para rodarem juntos de forma simples.

## Pensar: 

- Queria ver com vcs, sobre colocarmos uma lib de frontend ou não.
- E como essa é uma versão mais inicial para poder "andar" mais rápido o projeto, não refinei muito. Quero tratar as telas melhor, é claro. E o fluxo da ordem das coisas, seguindo o FIGMA.



## Para auxílio do dev:

### Instalação das dependências para desenvolvimento local

O projeto não tem um `package.json` na pasta principal. Instale as dependências dentro da pasta do aplicativo que você pretende executar. É necessário ter Node.js e npm instalados.

**Aplicação Web**

No terminal, entre na pasta `web` e instale as dependências:
```
cd web
npm install
```

Para iniciar o servidor de desenvolvimento web:
```
npm run dev
```

**Aplicativo Mobile (Expo)**

No terminal, entre na pasta `mobile` e instale as dependências:
```
cd mobile
npm install
```

Para iniciar o Expo:
```
npm start
```

Se for usar o aplicativo mobile com a API, deixe o backend em execução também. As instruções para Docker e conexão pelo USB estão na seção [Executar o aplicativo no Android pelo USB](#executar-o-aplicativo-no-android-pelo-usb).

O backend é Java/Spring Boot e não usa `npm install`; suas dependências são gerenciadas pelo Maven e instaladas automaticamente ao executar o projeto com Docker.

- https://www.figma.com/design/iMOpl5e93b2JKJJeouEgwv/ClinicABA?node-id=90-166&t=8EOm7US8HtB3fxN4-1

- no entanto, dá pra rodar via docker tb. Se for tratar apenas uma parte, é legar rodar separado pela questão de velocidade, a não ser que vc dependa de outra parte como o backend, por exemplo.
