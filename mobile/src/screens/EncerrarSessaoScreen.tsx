import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { sessaoService } from '../services/sessaoService';
import { getApiErrorMessage } from '../services/getApiErrorMessage';
import { Colors } from '../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const EncerrarSessaoScreen = ({ route, navigation }: any) => {
  const { sessaoId } = route.params;
  const insets = useSafeAreaInsets();
  const [observacoes, setObservacoes] = useState('');
  const [scoreFinal, setScoreFinal] = useState('');
  const [saving, setSaving] = useState(false);

  const handleEncerrar = async () => {
    if (!scoreFinal || isNaN(Number(scoreFinal))) {
      Alert.alert('Erro', 'Informe um score final válido para a sessão.');
      return;
    }

    setSaving(true);
    try {
      await sessaoService.encerrar(sessaoId, observacoes, Number(scoreFinal));
      Alert.alert('Sucesso', 'Sessão encerrada com sucesso!', [
        { text: 'OK', onPress: () => navigation.popToTop() }
      ]);
    } catch (error) {
      Alert.alert('Erro', getApiErrorMessage(error, 'Não foi possível encerrar a sessão.'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.keyboardAvoiding} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 16 + insets.bottom }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Resumo da Sessão</Text>
      
        <View style={styles.form}>
        <Text style={styles.label}>Observações Gerais</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Descreva como foi a sessão de forma geral..."
          value={observacoes}
          onChangeText={setObservacoes}
          multiline
          numberOfLines={4}
        />

        <Text style={styles.label}>Score Final da Sessão (%)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 85"
          value={scoreFinal}
          onChangeText={setScoreFinal}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.btn} onPress={handleEncerrar} disabled={saving}>
          <Text style={styles.btnText}>{saving ? 'ENCERRANDO...' : 'CONFIRMAR ENCERRAMENTO'}</Text>
        </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoiding: { flex: 1 },
  container: { flex: 1, backgroundColor: Colors.background, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: Colors.text, marginBottom: 24 },
  form: { backgroundColor: Colors.surface, padding: 16, borderRadius: 8, elevation: 2 },
  label: { fontSize: 16, fontWeight: 'bold', color: Colors.text, marginBottom: 8 },
  input: { backgroundColor: Colors.background, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: Colors.border, marginBottom: 16, fontSize: 16 },
  textArea: { height: 120, textAlignVertical: 'top' },
  btn: { backgroundColor: Colors.danger, padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 16 },
  btnText: { color: Colors.surface, fontSize: 18, fontWeight: 'bold' }
});

export default EncerrarSessaoScreen;
