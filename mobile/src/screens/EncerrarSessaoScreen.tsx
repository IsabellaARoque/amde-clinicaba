
import React, { useEffect, useRef, useState } from 'react';
import { Text, View, Alert } from 'react-native';
import { sessaoService } from '../services/sessaoService';
import { getApiErrorMessage } from '../services/getApiErrorMessage';
import { FormField, FormScreen } from '../components/FormScreen';
import { AppButton, Badge } from '../components/ScreenUI';
import { useUnsavedChanges } from '../hooks/useUnsavedChanges';
import { UI } from '../theme/styles';
import { Sessao } from '../types';
import { sessionTrainingGroups } from '../utils/session';

const EncerrarSessaoScreen = ({ route, navigation }: any) => {
  const { sessaoId } = route.params;

  const [sessao, setSessao] = useState<Sessao | null>(null);
  const [observacoes, setObservacoes] = useState('');
  const [saving, setSaving] = useState(false);
  const [loadingSessao, setLoadingSessao] = useState(true);

  const lock = useRef(false);

  const permitExit = useUnsavedChanges(!!observacoes, saving);

  useEffect(() => {
    const carregarSessao = async () => {
      try {
        const dados = await sessaoService.getSessao(sessaoId);
        setSessao(dados);
      } catch (err) {
        Alert.alert(
          'Não foi possível carregar a sessão',
          getApiErrorMessage(err, 'Tente novamente.')
        );
      } finally {
        setLoadingSessao(false);
      }
    };

    void carregarSessao();
  }, [sessaoId]);

  const { selected } = sessionTrainingGroups(
    sessao?.treinosSessao ?? [],
    []
  );

  const scoreTotal = [...selected.values()].reduce(
    (total, treinoSessao) => total + (treinoSessao.score ?? 0),
    0
  );

  const encerrar = async () => {
    if (lock.current || !sessao) return;

    lock.current = true;
    setSaving(true);

    try {
      await sessaoService.encerrar(
        sessaoId,
        observacoes.trim(),
        scoreTotal
      );

      permitExit();

      Alert.alert(
        'Sessão encerrada',
        'O atendimento foi salvo no histórico do paciente.',
        [
          {
            text: 'Concluir',
            onPress: () => navigation.popToTop(),
          },
        ]
      );
    } catch (err) {
      Alert.alert(
        'Não foi possível encerrar',
        getApiErrorMessage(err, 'Seus dados continuam nesta tela. Tente novamente.')
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

      <Text style={UI.body}>
        Registre os pontos importantes do atendimento antes de encerrar.
      </Text>

      <View style={[UI.card, { gap: 20 }]}>
        <FormField
          label="Observações gerais"
          placeholder="Descreva a evolução, as dificuldades e as orientações..."
          value={observacoes}
          onChangeText={setObservacoes}
          multiline
          editable={!saving}
        />

        <View style={{ gap: 8 }}>
          <Text style={UI.label}>Score final da sessão</Text>

          <Text style={UI.title}>
            {loadingSessao ? 'Carregando...' : scoreTotal}
          </Text>

          <Text style={UI.body}>
            Calculado automaticamente pela soma dos scores dos treinos.
          </Text>
        </View>
      </View>

      <AppButton
        title={
          loadingSessao
            ? 'Carregando sessão...'
            : saving
              ? 'Encerrando...'
              : 'Confirmar encerramento'
        }
        tone="success"
        loading={saving || loadingSessao}
        onPress={encerrar}
      />
    </FormScreen>
  );
};

export default EncerrarSessaoScreen;
