import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { treinoService } from '../services/treinoService';
import { getApiErrorMessage } from '../services/getApiErrorMessage';
import { Colors } from '../theme/colors';

const ExecutarTreinoDuracaoScreen = ({ route, navigation }: any) => {
  const { sessaoId, treinoId } = route.params;
  const [segundos, setSegundos] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [observacoes, setObservacoes] = useState('');
  const [score, setScore] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isRunning) return undefined;
    const interval = setInterval(() => setSegundos(prev => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  const toggleTimer = () => setIsRunning(!isRunning);
  const resetTimer = () => { setIsRunning(false); setSegundos(0); };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSalvar = async () => {
    if (!score || isNaN(Number(score))) {
      Alert.alert('Erro', 'Informe um score numérico válido.');
      return;
    }
    if (!Number.isInteger(Number(score)) || Number(score) < 0 || Number(score) > 100) {
      Alert.alert('Erro', 'O score deve ser um número inteiro entre 0 e 100.');
      return;
    }
    setSaving(true);
    try {
      const ts = await treinoService.iniciarTreinoSessao(sessaoId, treinoId);
      await treinoService.registroDuracao(ts.id, segundos);
      await treinoService.encerrarTreinoSessao(ts.id, observacoes, Number(score));
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', getApiErrorMessage(error, 'Não foi possível salvar o treino.'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Registro de Duração</Text>
      
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>{formatTime(segundos)}</Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={[styles.controlBtn, isRunning ? styles.btnRed : styles.btnGreen]} onPress={toggleTimer}>
          <Text style={styles.btnText}>{isRunning ? 'PAUSAR' : 'INICIAR'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.controlBtn, styles.btnGray]} onPress={resetTimer}>
          <Text style={styles.btnText}>ZERAR</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Observações do treino"
        value={observacoes}
        onChangeText={setObservacoes}
        multiline
      />

      <TextInput
        style={styles.input}
        placeholder="Score (%)"
        value={score}
        onChangeText={setScore}
        keyboardType="numeric"
      />

      <TouchableOpacity style={[styles.saveBtn, (saving || isRunning) && styles.disabledButton]} onPress={handleSalvar} disabled={saving || isRunning}>
        <Text style={styles.saveText}>{saving ? 'SALVANDO...' : 'SALVAR TREINO'}</Text>
      </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  container: { flexGrow: 1, backgroundColor: Colors.background, padding: 16, paddingBottom: 24 },
  title: { fontSize: 24, fontWeight: 'bold', color: Colors.text, textAlign: 'center', marginBottom: 24 },
  timerContainer: { backgroundColor: Colors.surface, padding: 48, borderRadius: 100, alignSelf: 'center', elevation: 4, marginBottom: 32 },
  timerText: { fontSize: 48, fontWeight: 'bold', color: Colors.text },
  controls: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 32 },
  controlBtn: { paddingVertical: 16, paddingHorizontal: 32, borderRadius: 8, elevation: 2 },
  btnGreen: { backgroundColor: Colors.success },
  btnRed: { backgroundColor: Colors.danger },
  btnGray: { backgroundColor: Colors.gray },
  btnText: { color: Colors.surface, fontSize: 16, fontWeight: 'bold' },
  input: { backgroundColor: Colors.surface, padding: 16, borderRadius: 8, marginBottom: 16, borderWidth: 1, borderColor: Colors.border, fontSize: 16 },
  saveBtn: { backgroundColor: Colors.primary, padding: 16, borderRadius: 8, alignItems: 'center' },
  disabledButton: { opacity: 0.55 },
  saveText: { color: Colors.surface, fontSize: 18, fontWeight: 'bold' }
});

export default ExecutarTreinoDuracaoScreen;
