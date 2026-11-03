import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Alert, AppState, Platform } from 'react-native';
import { treinoService } from '../services/treinoService';
import { getApiErrorMessage } from '../services/getApiErrorMessage';
import { FormField, FormScreen } from '../components/FormScreen';
import { AppButton, Badge } from '../components/ScreenUI';
import { useUnsavedChanges } from '../hooks/useUnsavedChanges';
import { formatClock, isValidScore } from '../utils/presentation';
import { Colors } from '../theme/colors';
import { UI } from '../theme/styles';
const ExecutarTreinoDuracaoScreen = ({ route, navigation }: any) => {
  const { sessaoId, treinoId } = route.params;
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [observacoes, setObservacoes] = useState('');
  const [score, setScore] = useState('');
  const [saving, setSaving] = useState(false);
  const elapsedMs = useRef(0);
  const startedAt = useRef<number | null>(null);
  const lock = useRef(false);
  const permitExit = useUnsavedChanges(running || seconds > 0 || !!observacoes || !!score, saving);
  const getElapsedMs = () =>
    elapsedMs.current + (startedAt.current === null ? 0 : Date.now() - startedAt.current);
  useEffect(() => {
    if (!running) return;
    const sync = () => setSeconds(Math.floor(getElapsedMs() / 1000));
    const timer = setInterval(sync, 250);
    const listener = AppState.addEventListener('change', (state) => {
      if (state === 'active') sync();
    });
    return () => {
      clearInterval(timer);
      listener.remove();
    };
  }, [running]);
  const toggle = () => {
    if (running) {
      elapsedMs.current = getElapsedMs();
      startedAt.current = null;
      setSeconds(Math.floor(elapsedMs.current / 1000));
      setRunning(false);
    } else {
      startedAt.current = Date.now();
      setRunning(true);
    }
  };
  const reset = () =>
    Alert.alert('Zerar cronômetro?', 'A duração registrada até agora será descartada.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Zerar',
        style: 'destructive',
        onPress: () => {
          elapsedMs.current = 0;
          startedAt.current = null;
          setRunning(false);
          setSeconds(0);
        },
      },
    ]);
  const salvar = async () => {
    if (lock.current || running) return;
    if (!isValidScore(score)) {
      Alert.alert('Confira o score', 'Informe um número inteiro válido.');
      return;
    }
    lock.current = true;
    setSaving(true);
    try {
      const ts = await treinoService.iniciarTreinoSessao(sessaoId, treinoId);
      await treinoService.registroDuracao(ts.id, Math.floor(elapsedMs.current / 1000));
      await treinoService.encerrarTreinoSessao(ts.id, observacoes.trim(), Number(score));
      permitExit();
      navigation.goBack();
    } catch (err) {
      Alert.alert(
        'Não foi possível salvar',
        getApiErrorMessage(err, 'Seus dados continuam nesta tela. Tente novamente.'),
      );
    } finally {
      lock.current = false;
      setSaving(false);
    }
  };
  return (
    <FormScreen>
      <Text style={UI.eyebrow}>REGISTRO DE DURAÇÃO</Text>
      <Text style={UI.title}>Tempo de atividade</Text>
      <Text style={UI.body}>Inicie o cronômetro durante a atividade e pause antes de salvar.</Text>
      <View style={styles.timer}>
        <Badge tone={running ? 'success' : 'muted'}>
          {running ? 'Em andamento' : seconds > 0 ? 'Pausado' : 'Pronto para iniciar'}
        </Badge>
        <Text accessibilityLabel={'Duração: ' + seconds + ' segundos'} style={styles.clock}>
          {formatClock(seconds)}
        </Text>
        <Text style={UI.body}>minutos : segundos</Text>
      </View>
      <View style={UI.row}>
        <View style={{ flex: 1 }}>
          <AppButton
            title={running ? 'Pausar' : seconds > 0 ? 'Continuar' : 'Iniciar'}
            tone={running ? 'accent' : 'success'}
            disabled={saving}
            onPress={toggle}
          />
        </View>
        <View style={{ flex: 1 }}>
          <AppButton
            title="Zerar"
            tone="ghost"
            disabled={saving || (!running && !seconds)}
            onPress={reset}
          />
        </View>
      </View>
      <FormField
        label="Observações do treino"
        placeholder="Registre o comportamento durante a atividade..."
        value={observacoes}
        onChangeText={setObservacoes}
        multiline
        editable={!saving}
      />
      <FormField
        label="Score do treino *"
        hint="Valor inteiro informado pela clínica."
        placeholder="Ex.: 85"
        value={score}
        onChangeText={setScore}
        keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'numeric'}
        editable={!saving}
        returnKeyType="done"
      />
      {running && (
        <Text accessibilityRole="alert" style={UI.body}>
          Pause o cronômetro para salvar o treino.
        </Text>
      )}
      <AppButton
        title={saving ? 'Salvando...' : 'Salvar treino'}
        loading={saving}
        disabled={running}
        onPress={salvar}
      />
    </FormScreen>
  );
};
const styles = StyleSheet.create({
  timer: {
    alignItems: 'center',
    paddingVertical: 36,
    paddingHorizontal: 16,
    gap: 16,
    backgroundColor: Colors.primarySoft,
    borderRadius: 30,
  },
  clock: {
    fontSize: 60,
    lineHeight: 76,
    fontWeight: '700',
    color: Colors.text,
    fontVariant: ['tabular-nums'],
  },
});
export default ExecutarTreinoDuracaoScreen;
