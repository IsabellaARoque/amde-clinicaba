import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { treinoService } from '../services/treinoService';
import { getApiErrorMessage } from '../services/getApiErrorMessage';
import { Colors } from '../theme/colors';

const ExecutarTreinoFrequenciaScreen = ({ route, navigation }: any) => {
  const { sessaoId, treinoId } = route.params;
  const [execSemAjuda, setExecSemAjuda] = useState(0);
  const [execComAjuda, setExecComAjuda] = useState(0);
  const [naoExecutado, setNaoExecutado] = useState(0);
  const [observacoes, setObservacoes] = useState('');
  const [score, setScore] = useState('');
  const [saving, setSaving] = useState(false);

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
      await treinoService.registroFrequencia(ts.id, execSemAjuda, execComAjuda, naoExecutado);
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
      <Text style={styles.title}>Registro de Frequência</Text>
      
      <View style={styles.counters}>
        <TouchableOpacity style={[styles.btn, styles.btnGreen]} onPress={() => setExecSemAjuda(prev => prev + 1)}>
          <Text style={styles.btnText}>Executou Sem Ajuda</Text>
          <Text style={styles.countText}>{execSemAjuda}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btn, styles.btnYellow]} onPress={() => setExecComAjuda(prev => prev + 1)}>
          <Text style={styles.btnText}>Executou Com Ajuda</Text>
          <Text style={styles.countText}>{execComAjuda}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btn, styles.btnRed]} onPress={() => setNaoExecutado(prev => prev + 1)}>
          <Text style={styles.btnText}>Não Executou</Text>
          <Text style={styles.countText}>{naoExecutado}</Text>
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

      <TouchableOpacity style={[styles.saveBtn, saving && styles.disabledButton]} onPress={handleSalvar} disabled={saving}>
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
  counters: { justifyContent: 'space-around' },
  btn: { padding: 24, borderRadius: 16, alignItems: 'center', justifyContent: 'center', elevation: 4, marginBottom: 16 },
  btnGreen: { backgroundColor: Colors.success },
  btnYellow: { backgroundColor: Colors.warning },
  btnRed: { backgroundColor: Colors.danger },
  btnText: { fontSize: 20, color: Colors.surface, fontWeight: 'bold', marginBottom: 8 },
  countText: { fontSize: 32, color: Colors.surface, fontWeight: 'bold' },
  input: { backgroundColor: Colors.surface, padding: 16, borderRadius: 8, marginBottom: 16, borderWidth: 1, borderColor: Colors.border, fontSize: 16 },
  saveBtn: { backgroundColor: Colors.primary, padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 16 },
  disabledButton: { opacity: 0.55 },
  saveText: { color: Colors.surface, fontSize: 18, fontWeight: 'bold' }
});

export default ExecutarTreinoFrequenciaScreen;
