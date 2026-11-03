import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { assistidoService } from '../services/assistidoService';
import { planoService } from '../services/planoService';
import { getApiErrorMessage } from '../services/getApiErrorMessage';
import { Assistido, PlanoIntervencao, ScorePorCategoria, SessaoResumo } from '../types';
import { Colors } from '../theme/colors';
import { UI } from '../theme/styles';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { PlanoCard } from '../components/PlanoCard';
import { ScoreCard } from '../components/ScoreCard';
import { SessaoCard } from '../components/SessaoCard';
import { AppButton, Badge, EmptyState, ErrorNotice, SectionHeading } from '../components/ScreenUI';
import { formatDate, getAge } from '../utils/presentation';
const AssistidoDetailScreen = ({ route, navigation }: any) => {
  const { assistidoId } = route.params;
  const insets = useSafeAreaInsets();
  const [assistido, setAssistido] = useState<Assistido | null>(null);
  const [planos, setPlanos] = useState<PlanoIntervencao[]>([]);
  const [scores, setScores] = useState<ScorePorCategoria[]>([]);
  const [sessoes, setSessoes] = useState<SessaoResumo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    const results = await Promise.allSettled([
      assistidoService.getAssistido(assistidoId),
      planoService.getPlanosByAssistido(assistidoId),
      assistidoService.getScores(assistidoId),
      assistidoService.getSessoes(assistidoId),
    ]);
    if (results[0].status === 'fulfilled') setAssistido(results[0].value);
    if (results[1].status === 'fulfilled') setPlanos(results[1].value);
    if (results[2].status === 'fulfilled') setScores(results[2].value);
    if (results[3].status === 'fulfilled') setSessoes(results[3].value);
    const failed = results.find((result) => result.status === 'rejected');
    if (failed?.status === 'rejected')
      setError(getApiErrorMessage(failed.reason, 'Parte das informações não pôde ser carregada.'));
    setLoading(false);
  }, [assistidoId]);
  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );
  if (loading && !assistido) return <LoadingSpinner />;
  if (!assistido)
    return (
      <View style={[UI.screen, UI.content]}>
        <EmptyState title="Não foi possível abrir o paciente" description={error} onRetry={load} />
      </View>
    );
  const age = getAge(assistido.dataNasc);
  const canStart = planos.some((plano) => plano.status === 'ATIVO');
  const recent = [...sessoes]
    .sort((a, b) => (b.data + b.horaInicio).localeCompare(a.data + a.horaInicio))
    .slice(0, 3);
  return (
    <View style={UI.screen}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={load} tintColor={Colors.primaryDark} />
        }
        contentContainerStyle={[UI.content, { paddingBottom: 28 + insets.bottom }]}
      >
        <View style={styles.patientHeader}>
          <Text style={UI.eyebrow}>PACIENTE</Text>
          <View style={styles.namePill}>
            <Text style={UI.title}>{assistido.nome}</Text>
          </View>
          <View style={UI.wrap}>
            {age !== null && <Badge>{age + (age === 1 ? ' ano' : ' anos')}</Badge>}
            {!!assistido.periodo && <Badge tone="muted">{assistido.periodo}</Badge>}
            {!!assistido.sala && <Badge tone="muted">{'Sala ' + assistido.sala}</Badge>}
          </View>
        </View>
        {!!error && <ErrorNotice message={error} onRetry={load} />}
        <View style={UI.card}>
          <SectionHeading title="Informações do paciente" />
          <View style={UI.divider} />
          <Text style={UI.body}>Nascimento: {formatDate(assistido.dataNasc)}</Text>
          <Text style={UI.body}>Convênio: {assistido.convenio || 'Não informado'}</Text>
          <Text style={UI.body}>Frequência: {assistido.frequencia || 'Não informada'}</Text>
          <Text style={styles.responsibleLabel}>Responsável</Text>
          <Text style={UI.heading}>{assistido.nomeResponsavel || 'Não informado'}</Text>
        </View>
        <SectionHeading title="Planos de intervenção" count={planos.length} />
        {planos.length === 0 ? (
          <EmptyState
            title="Paciente sem plano de intervenção"
            description="Um plano ativo é necessário para iniciar uma sessão."
          />
        ) : (
          planos.map((plano) => (
            <PlanoCard
              key={plano.id}
              plano={plano}
              onPress={() => navigation.navigate('PlanoDetail', { planoId: plano.id })}
            />
          ))
        )}
        <SectionHeading title="Sessões" count={sessoes.length} />
        <View style={[UI.card, { gap: 12 }]}>
          <AppButton
            title="Iniciar nova sessão +"
            tone="accent"
            disabled={!canStart || loading}
            onPress={() => navigation.navigate('IniciarSessao', { assistidoId })}
          />
          <AppButton
            title="Acessar histórico →"
            tone="ghost"
            onPress={() => navigation.navigate('HistoricoSessoes', { assistidoId })}
          />
        </View>
        {recent.length > 0 && (
          <>
            <Text style={UI.label}>Últimas sessões</Text>
            {recent.map((sessao) => (
              <SessaoCard
                key={sessao.id}
                sessao={sessao}
                onPress={() => navigation.navigate('SessaoDetail', { sessaoId: sessao.id })}
              />
            ))}
          </>
        )}
        <SectionHeading title="Scores por categoria" count={scores.length} />
        {scores.length ? (
          scores.map((score) => <ScoreCard key={score.id} score={score} />)
        ) : (
          <Text style={UI.body}>Os resultados aparecerão após o registro dos treinos.</Text>
        )}
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  patientHeader: { gap: 14, marginBottom: 4 },
  namePill: { backgroundColor: Colors.primarySoft, borderRadius: 24, padding: 18 },
  responsibleLabel: {
    fontSize: 12,
    lineHeight: 18,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginTop: 18,
    marginBottom: 4,
  },
});
export default AssistidoDetailScreen;
