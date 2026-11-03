import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, RefreshControl, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { sessaoService } from '../services/sessaoService';
import { planoService } from '../services/planoService';
import { getApiErrorMessage } from '../services/getApiErrorMessage';
import { Sessao, Treino } from '../types';
import { UI } from '../theme/styles';
import { Colors } from '../theme/colors';
import { sessionTrainingGroups } from '../utils/session';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { TreinoCard } from '../components/TreinoCard';
import { AppButton, Badge, EmptyState, ErrorNotice, SectionHeading } from '../components/ScreenUI';
const SessaoEmAndamentoScreen = ({ route, navigation }: any) => {
  const { sessaoId } = route.params;
  const insets = useSafeAreaInsets();
  const [sessao, setSessao] = useState<Sessao | null>(null);
  const [treinos, setTreinos] = useState<Treino[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const s = await sessaoService.getSessao(sessaoId);
      setSessao(s);
      setTreinos(await planoService.getTreinosByPlano(s.planoIntervencaoId));
    } catch (err) {
      setError(getApiErrorMessage(err, 'Não foi possível carregar a sessão.'));
    } finally {
      setLoading(false);
    }
  }, [sessaoId]);
  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );
  if (loading && !sessao) return <LoadingSpinner />;
  if (!sessao)
    return (
      <View style={[UI.screen, UI.content]}>
        <EmptyState title="Não foi possível abrir a sessão" description={error} onRetry={load} />
      </View>
    );
  const {
    selected,
    planned: sessionTreinos,
    others,
    completed: done,
  } = sessionTrainingGroups(sessao.treinosSessao ?? [], treinos);
  const completed = (id: number) => selected.get(id)?.score != null;
  const executar = (treino: Treino) => {
    if (sessao.horaFim || completed(treino.id)) return;
    navigation.navigate(
      treino.medicao === 'FREQUENCIA' ? 'ExecutarTreinoFrequencia' : 'ExecutarTreinoDuracao',
      { sessaoId, treinoId: treino.id },
    );
  };
  const encerrar = () => {
    const pending = sessionTreinos.length - done;
    const go = () => navigation.navigate('EncerrarSessao', { sessaoId });
    if (pending > 0)
      Alert.alert(
        'Há treinos pendentes',
        'Ainda há ' + pending + ' treino(s) sem resultado. Deseja encerrar a sessão mesmo assim?',
        [
          { text: 'Continuar sessão', style: 'cancel' },
          { text: 'Encerrar', onPress: go },
        ],
      );
    else go();
  };
  return (
    <View style={UI.screen}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
        contentContainerStyle={[UI.content, { paddingBottom: 28 }]}
      >
        <View style={[UI.card, { backgroundColor: Colors.primarySoft, gap: 12 }]}>
          <Badge tone={sessao.horaFim ? 'muted' : 'success'}>
            {sessao.horaFim ? 'Sessão encerrada' : 'Atendimento em andamento'}
          </Badge>
          <Text style={UI.title}>{sessao.assistidoNome}</Text>
          <Text style={UI.body}>{sessao.planoNome}</Text>
          <Text style={UI.body}>Início às {sessao.horaInicio?.slice(0, 5)}</Text>
          <Text style={UI.label}>
            {done} de {sessionTreinos.length} treinos concluídos
          </Text>
        </View>
        {!!error && <ErrorNotice message={error} onRetry={load} />}
        <SectionHeading title="Treinos da sessão" count={sessionTreinos.length} />
        {sessionTreinos.length ? (
          sessionTreinos.map((treino) => (
            <TreinoCard
              key={treino.id}
              treino={treino}
              completed={completed(treino.id)}
              onPress={
                !sessao.horaFim && !completed(treino.id) ? () => executar(treino) : undefined
              }
            />
          ))
        ) : (
          <Text style={UI.body}>Selecione abaixo um treino para começar.</Text>
        )}
        {others.length > 0 && (
          <>
            <SectionHeading title="Outros treinos do plano" count={others.length} />
            <Text style={UI.body}>
              Também é possível trabalhar estas atividades durante a sessão.
            </Text>
            {others.map((treino) => (
              <TreinoCard
                key={treino.id}
                treino={treino}
                onPress={!sessao.horaFim ? () => executar(treino) : undefined}
              />
            ))}
          </>
        )}
        {!sessionTreinos.length && !others.length && (
          <EmptyState
            title="Nenhum treino disponível"
            description="Este plano ainda não possui treinos cadastrados."
          />
        )}
      </ScrollView>
      <View style={[UI.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <AppButton
          title={sessao.horaFim ? 'Ver registro da sessão' : 'Encerrar sessão'}
          tone="accent"
          onPress={
            sessao.horaFim ? () => navigation.replace('SessaoDetail', { sessaoId }) : encerrar
          }
        />
      </View>
    </View>
  );
};
export default SessaoEmAndamentoScreen;
