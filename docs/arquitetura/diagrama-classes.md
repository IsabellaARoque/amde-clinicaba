# Diagrama de Classes de Domínio — Sistema AMDE

> O diagrama de classes representa a estrutura estática do sistema ClinicABA, apresentando as principais entidades do domínio, seus atributos, operações, relacionamentos e multiplicidades. O modelo contempla o gerenciamento de profissionais, salas, assistidos, planos de interve
nção, sessões e treinos, além das diferentes formas de registro de execução das atividades terapêuticas.


# Descrição das Classes e Responsabilidades
**Profissional:** Representa os profissionais responsáveis pelo atendimento e acompanhamento dos assistidos na instituição. Armazena informações de identificação, contato e permissões de acesso ao sistema. Suas operações permitem realizar cadastro, autenticação e gerenciamento dos próprios dados de perfil, além de estabelecer a relação entre os profissionais, os assistidos, as sessões e os planos de intervenção.

**Assistido:** Representa as crianças, adolescentes e jovens atendidos pela instituição. Contém informações pessoais, dados do responsável legal, convênio, sala, período e frequência de atendimento. A classe disponibiliza operações de cadastro, edição, consulta e visualização dos dados dos assistidos.

**Sessao:** Representa os atendimentos realizados pelos profissionais aos assistidos. Armazena informações como data, horários de início e término, observações e pontuação obtida durante o atendimento. Suas operações permitem iniciar, configurar, encerrar e visualizar uma sessão, além de editar informações e exportar os registros em PDF.

**PlanoDeIntervencao:** Representa o planejamento terapêutico individualizado elaborado para cada assistido. Armazena informações como nome, objetivos, data de criação e situação do plano. Permite criar, alterar, visualizar, desativar, reativar e consultar planos de intervenção, além de relacioná-los aos treinos que serão trabalhados durante os atendimentos.

**Treino:** Representa as atividades e habilidades que serão desenvolvidas com o assistido, conforme os objetivos estabelecidos no plano de intervenção. Armazena informações como nome, objetivo, tipo de medição e descrição da atividade. Disponibiliza operações de cadastro, alteração, visualização e consulta dos treinos, além de permitir sua associação às respectivas categorias.

**TreinoSessao:** Representa a execução de um treino específico durante uma sessão de atendimento. Registra informações referentes à execução, como pontuação (*score*) e observações do profissional. Suas operações permitem iniciar e encerrar a execução do treino, registrar os resultados obtidos e acompanhar o andamento das atividades realizadas durante a sessão.

**Categoria:** Representa a classificação utilizada para organizar os treinos de acordo com suas características ou áreas de desenvolvimento. Armazena o nome da categoria e disponibiliza operações para seu cadastro e edição. Essa classificação também permite organizar os resultados registrados por categoria.

**ScorePorCategoria:** Responsável por armazenar a pontuação (*score*) obtida pelo assistido em determinada categoria. Possui um identificador e um valor numérico que representa o resultado registrado, permitindo a atualização dessas informações e o acompanhamento do desempenho do assistido.

**RegiTreinoFrequencia:** Especialização da classe `TreinoSessao`, destinada ao registro dos resultados de treinos mensurados por frequência. Armazena a quantidade de execuções realizadas sem ajuda, com ajuda e de tentativas não executadas, permitindo acompanhar o desempenho do assistido durante a atividade.

**RegiTreinoDuracao:** Especialização da classe `TreinoSessao`, responsável pelo registro dos resultados de treinos mensurados por duração. Armazena o tempo registrado durante a execução da atividade, permitindo acompanhar o desempenho do assistido com base no tempo utilizado para realizar determinado treino.

---

### Figura – Diagrama de Classes de Domínio do Sistema ClinicABA

```mermaid
classDiagram
class Profissional {
    -id: Long
    -cpf: string
    -nome: string
    -email: string
    -senha: string
    -permissao: string
    +cadastrar(): void
    +autenticar(senha: String): boolean
    +visualizarPerfil(): void
    +editarPerfil(): void
}

class Assistido {
    -id: Long
    -cpf: string
    -nome: string
    -dataNascimento: date
    -convenio: string
    -sala: string
    -agenteDeSala: string
    -periodo: string
    -frequencia: string
    -nomeResponsavel: string
    -cpfResponsavel: string
    +cadastrar(): void
    +editar(): void
    +visualizarPerfil(): Assistido
    +buscar(): Assistido
}

class Sessao {
    -id: Long
    -observacoes: string
    -data: date
    -horaInicio: time
    -horaFim: time
    -score: int
    +iniciar(): void
    +configurar(): void
    +encerrar(): void
    +editar(objetivo: string): void
    +exportarPDF(): void
    +visualizar(): void
}

class PlanoDeIntervencao {
    -id: Long
    -nome: string
    -objetivo: string
    -dataCriacao: date
    -status: enum
    +criar(): void
    +alterar(): void
    +desativar(): void
    +reativar(): void
    +visualizar(): void
    +buscarPorId(): void
}

class TreinoSessao {
    -id: Long
    -score: int
    -observacao: string
    +executarTreino(): void
    +registrarScore(score: int): void
    +iniciarTreinoSessao(): void
    +encerrarTreinoSessao(): void
}

class Treino {
    -id: Long
    -nome: string
    -objetivo: string
    -tipoMedicao: enum
    -atividade: string
    +criar(): void
    +alterar(): void
    +visualizar(): void
    +buscarPorId(): void
}

class ScorePorCategoria {
    -id: Long
    -valor: double
    +editar()
}

class Categoria {
    -id: Long
    -nome: string
    +cadastrar()
    +editar()
}

class RegiTreinoFrequencia {
    -id: Long
    -execucoesSemAjuda: int
    -execucoesComAjuda: int
    -naoExecutados: int
    +registrarFrequencia(): void
}

class RegiTreinoDuracao {
    -id: Long
    -duracao: Long
    +registrarDuracao(): void
}

Profissional "1" -- "0*" Sessao
Profissional "1" -- "0*" PlanoDeIntervencao
Profissional "1" -- "0*" Assistido

Sessao "0*" -- "1" PlanoDeIntervencao
Sessao "1" -- "0*" TreinoSessao

PlanoDeIntervencao "1" -- "0*" Treino

TreinoSessao "0*" -- "1" Treino

Assistido "1" -- "0*" ScorePorCategoria
ScorePorCategoria "0*" -- "1" Categoria
Treino "0*" -- "1" Categoria

TreinoSessao <|-- RegiTreinoFrequencia
TreinoSessao <|-- RegiTreinoDuracao
    