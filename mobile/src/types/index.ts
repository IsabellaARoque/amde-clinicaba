export interface Profissional { id: number; cpf: string; nome: string; email: string; }
export interface Assistido { id: number; cpf: string; nome: string; dataNasc: string; convenio: string; sala: string; agenteDaSala: string; periodo: string; frequencia: string; nomeResponsavel: string; cpfResponsavel: string; }
export interface PlanoIntervencao { id: number; nome: string; dataCriacao: string; objetivo: string; status: 'ATIVO' | 'INATIVO'; profissionalCriador: Profissional; assistidoId: number; }
export interface Treino { id: number; nome: string; objetivo: string; categoria: Categoria | null; medicao: 'FREQUENCIA' | 'DURACAO'; atividade: string; }
export interface Sessao { id: number; profissional: Profissional; assistidoId: number; assistidoNome: string; planoIntervencaoId: number; planoNome: string; data: string; horaInicio: string; horaFim: string; score: number; observacoes: string; treinosSessao: TreinoSessao[]; }
export interface SessaoResumo { id: number; profissionalNome: string; assistidoId: number; assistidoNome: string; planoIntervencaoId: number; planoNome: string; data: string; horaInicio: string; horaFim: string; score: number; }
export interface TreinoSessao { id: number; treino: Treino; score: number; observacoes: string; registroFrequencia?: RegistroFrequencia; registroDuracao?: RegistroDuracao; }
export interface RegistroFrequencia { execSemAjuda: number; execComAjuda: number; naoExecutado: number; }
export interface RegistroDuracao { duracao: number; }
export interface Categoria { id: number; nome: string; }
export interface ScorePorCategoria { id: number; categoria: Categoria; valor: number; }
