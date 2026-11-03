import type { Treino, TreinoSessao } from '../types/index';
export function sessionTrainingGroups(records: TreinoSessao[], available: Treino[]) {
  const selected = new Map<number, TreinoSessao>();
  for (const record of records) {
    const previous = selected.get(record.treino.id);
    if (!previous || (previous.score == null && record.score != null))
      selected.set(record.treino.id, record);
  }
  return {
    selected,
    planned: [...selected.values()].map((record) => record.treino),
    others: available.filter((treino) => !selected.has(treino.id)),
    completed: [...selected.values()].filter((record) => record.score != null).length,
  };
}
