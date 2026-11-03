import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatDate,
  getAge,
  isValidScore,
  normalizeSearch,
  formatClock,
} from '../src/utils/presentation.ts';
import { focusedScrollTarget } from '../src/utils/keyboard.ts';
import { sessionTrainingGroups } from '../src/utils/session.ts';

test('score aceita inteiros informados pela clínica, inclusive acima de cem', () => {
  for (const value of ['0', '85', '100', '101', '250', '1000', '-5', ' 0 '])
    assert.equal(isValidScore(value), true, value);
  for (const value of ['', ' ', '-', '1.0', '1.5', '1,5', '1e2', 'Infinity', 'NaN'])
    assert.equal(isValidScore(value), false, value);
});
test('score preserva os limites técnicos do inteiro da API sem arredondar valores', () => {
  for (const value of ['2147483647', '-2147483648']) assert.equal(isValidScore(value), true, value);
  for (const value of ['2147483648', '-2147483649', '99999999999999999999'])
    assert.equal(isValidScore(value), false, value);
});
test('datas do servidor preservam o dia sem conversão de fuso', () => {
  assert.equal(formatDate('2026-10-27'), '27/10/2026');
  assert.equal(formatDate(null), 'Não informado');
});
test('idade considera aniversário, datas inválidas e nascimento futuro', () => {
  assert.equal(getAge('2000-10-27', new Date(2026, 9, 26)), 25);
  assert.equal(getAge('2000-10-27', new Date(2026, 9, 27)), 26);
  assert.equal(getAge('2025-02-30', new Date(2026, 9, 27)), null);
  assert.equal(getAge('2030-01-01', new Date(2026, 9, 27)), null);
});
test('busca ignora acentos e espaços, cronômetro não limita a 59 minutos', () => {
  assert.equal(normalizeSearch('  MÁRIA  '), 'maria');
  assert.equal(formatClock(3601), '60:01');
});
test('foco abaixo do teclado rola até mostrar o campo inteiro', () => {
  assert.equal(
    focusedScrollTarget({
      viewportTop: 80,
      viewportHeight: 700,
      inputTop: 600,
      inputHeight: 54,
      keyboardTop: 500,
      scrollY: 0,
    }),
    174,
  );
});
test('foco já visível não move a tela, inclusive após o resize do Android', () => {
  assert.equal(
    focusedScrollTarget({
      viewportTop: 80,
      viewportHeight: 400,
      inputTop: 380,
      inputHeight: 54,
      keyboardTop: 500,
      scrollY: 100,
    }),
    100,
  );
});
test('campos altos alinham o topo e rolagem nunca fica negativa', () => {
  assert.equal(
    focusedScrollTarget({
      viewportTop: 80,
      viewportHeight: 200,
      inputTop: 300,
      inputHeight: 250,
      keyboardTop: 500,
      scrollY: 0,
    }),
    208,
  );
  assert.equal(
    focusedScrollTarget({
      viewportTop: 80,
      viewportHeight: 400,
      inputTop: 10,
      inputHeight: 54,
      keyboardTop: 500,
      scrollY: 0,
    }),
    0,
  );
});
const treino = (id) => ({
  id,
  nome: 'Treino ' + id,
  objetivo: '',
  atividade: '',
  categoria: null,
  medicao: 'FREQUENCIA',
});
const record = (id, score, rowId = id) => ({
  id: rowId,
  treino: treino(id),
  score,
  observacoes: null,
});
test('treino selecionado sem score fica pendente; score zero é concluído', () => {
  const groups = sessionTrainingGroups(
    [record(1, null), record(2, 0)],
    [treino(1), treino(2), treino(3)],
  );
  assert.equal(groups.completed, 1);
  assert.equal(groups.selected.get(1).score, null);
  assert.deepEqual(
    groups.others.map((item) => item.id),
    [3],
  );
});
test('registros antigos duplicados não duplicam treinos nem escondem resultado salvo', () => {
  const groups = sessionTrainingGroups(
    [record(1, null, 10), record(1, 0, 11), record(1, null, 12)],
    [treino(1), treino(2)],
  );
  assert.equal(groups.planned.length, 1);
  assert.equal(groups.completed, 1);
  assert.equal(groups.selected.get(1).score, 0);
  assert.deepEqual(
    groups.others.map((item) => item.id),
    [2],
  );
});
