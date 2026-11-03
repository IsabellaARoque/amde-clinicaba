import React, { useRef, useState } from 'react';
import { Text, View, Alert, Platform } from 'react-native';
import { sessaoService } from '../services/sessaoService';
import { getApiErrorMessage } from '../services/getApiErrorMessage';
import { FormField, FormScreen } from '../components/FormScreen';
import { AppButton, Badge } from '../components/ScreenUI';
import { useUnsavedChanges } from '../hooks/useUnsavedChanges';
import { isValidScore } from '../utils/presentation';
import { UI } from '../theme/styles';
const EncerrarSessaoScreen = ({ route, navigation }: any) => {
  const { sessaoId } = route.params;
  const [observacoes, setObservacoes] = useState('');
  const [score, setScore] = useState('');
  const [saving, setSaving] = useState(false);
  const lock = useRef(false);
  const permitExit = useUnsavedChanges(!!observacoes || !!score, saving);
  const encerrar = async () => {
    if (lock.current) return;
    if (!isValidScore(score)) {
      Alert.alert('Confira o score final', 'Informe um número inteiro válido.');
      return;
    }
    lock.current = true;
    setSaving(true);
    try {
      await sessaoService.encerrar(sessaoId, observacoes.trim(), Number(score));
      permitExit();
      Alert.alert('Sessão encerrada', 'O atendimento foi salvo no histórico do paciente.', [
        { text: 'Concluir', onPress: () => navigation.popToTop() },
      ]);
    } catch (err) {
      Alert.alert(
        'Não foi possível encerrar',
        getApiErrorMessage(err, 'Seus dados continuam nesta tela. Tente novamente.'),
      );
    } finally {
      lock.current = false;
      setSaving(false);
    }
  };
  return (
    <FormScreen>
      <Badge>Finalizar atendimento</Badge>
      <Text style={UI.title}>Resumo da sessão</Text>
      <Text style={UI.body}>Registre os pontos importantes do atendimento antes de encerrar.</Text>
      <View style={[UI.card, { gap: 20 }]}>
        <FormField
          label="Observações gerais"
          placeholder="Descreva a evolução, as dificuldades e as orientações..."
          value={observacoes}
          onChangeText={setObservacoes}
          multiline
          editable={!saving}
        />
        <FormField
          label="Score final da sessão *"
          hint="Valor inteiro informado pela clínica."
          placeholder="Ex.: 85"
          value={score}
          onChangeText={setScore}
          keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'numeric'}
          editable={!saving}
          returnKeyType="done"
        />
      </View>
      <AppButton
        title={saving ? 'Encerrando...' : 'Confirmar encerramento'}
        tone="success"
        loading={saving}
        onPress={encerrar}
      />
    </FormScreen>
  );
};
export default EncerrarSessaoScreen;
