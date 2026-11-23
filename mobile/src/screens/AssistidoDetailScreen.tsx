
import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { assistidoService } from '../services/assistidoService';
import { planoService } from '../services/planoService';
import { getApiErrorMessage } from '../services/getApiErrorMessage';

import {
  Assistido,
  PlanoIntervencao,
  ScorePorCategoria,
  SessaoResumo,
} from '../types';

import { Colors } from '../theme/colors';
import { UI } from '../theme/styles';

import { LoadingSpinner } from '../components/LoadingSpinner';
import { PlanoCard } from '../components/PlanoCard';
import { ScoreCard } from '../components/ScoreCard';
import { SessaoCard } from '../components/SessaoCard';

import {
  AppButton,
  Badge,
  EmptyState,
  ErrorNotice,
  SectionHeading,
} from '../components/ScreenUI';

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

    if (failed?.status === 'rejected') {
      setError(
        getApiErrorMessage(
          failed.reason,
          'Parte das informações não pôde ser carregada.'
        )
      );
    }

    setLoading(false);
  }, [assistidoId]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  if (loading && !assistido) return <LoadingSpinner />;

  if (!assistido) {
    return (
      <View style={[UI.screen, UI.content]}>
        <EmptyState
          title="Não foi possível abrir o paciente"
          description={error}
          onRetry={load}
        />
      </View>
    );
  }

  const age = getAge(assistido.dataNasc);
  const canStart = planos.some((plano) => plano.status === 'ATIVO');

  const recent = [...sessoes]
    .sort((a, b) =>
      (b.data + b.horaInicio).localeCompare(a.data + a.horaInicio)
    )
    .slice(0, 3);

  return (
    <View style={UI.screen}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={load}
            tintColor={Colors.primaryDark}
          />
        }
        contentContainerStyle={[
          UI.content,
          { paddingBottom: 28 + insets.bottom },
        ]}
      >
        {!!error && <ErrorNotice message={error} onRetry={load} />}

        {/* Cabeçalho do paciente */}
        <View style={styles.header}>
          <Text style={UI.eyebrow}>PACIENTE</Text>

          <Text style={styles.patientName}>{assistido.nome}</Text>

          <View style={styles.badges}>
            {age !== null && (
              <Badge>{age + (age === 1 ? ' ano' : ' anos')}</Badge>
            )}
            {!!assistido.periodo && (
              <Badge tone="muted">{assistido.periodo}</Badge>
            )}
            {!!assistido.sala && (
              <Badge tone="muted">{'Sala ' + assistido.sala}</Badge>
            )}
          </View>
        </View>

        {/* Informações do paciente */}
        <View style={[UI.card, { gap: 16 }]}>
          <SectionHeading title="Dados do paciente" />

          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Nascimento</Text>
              <Text style={styles.infoValue}>
                {formatDate(assistido.dataNasc)}
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Convênio</Text>
              <Text style={styles.infoValue}>
                {assistido.convenio || 'Não informado'}
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Frequência</Text>
              <Text style={styles.infoValue}>
                {assistido.frequencia || 'Não informada'}
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Responsável</Text>
              <Text style={styles.infoValue}>
                {assistido.nomeResponsavel || 'Não informado'}
              </Text>
            </View>
          </View>
        </View>

        {/* Planos */}
        <View style={styles.section}>
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
                onPress={() =>
                  navigation.navigate('PlanoDetail', {
                    planoId: plano.id,
                  })
                }
              />
            ))
          )}
        </View>

        {/* Sessões */}
        <View style={styles.section}>
          <SectionHeading title="Sessões" count={sessoes.length} />

          <View style={[UI.card, { gap: 10 }]}>
            <AppButton
              title="Iniciar nova sessão +"
              tone="accent"
              disabled={!canStart || loading}
              onPress={() =>
                navigation.navigate('IniciarSessao', { assistidoId })
              }
            />

            <AppButton
              title="Acessar histórico →"
              tone="ghost"
              onPress={() =>
                navigation.navigate('HistoricoSessoes', { assistidoId })
              }
            />
          </View>

          {recent.length > 0 && (
            <View style={styles.subsection}>
              <Text style={styles.subsectionTitle}>Últimas sessões</Text>

              {recent.map((sessao) => (
                <SessaoCard
                  key={sessao.id}
                  sessao={sessao}
                  onPress={() =>
                    navigation.navigate('SessaoDetail', {
                      sessaoId: sessao.id,
                    })
                  }
                />
              ))}
            </View>
          )}
        </View>

        {/* Scores */}
        <View style={styles.section}>
          <SectionHeading
            title="Scores por categoria"
            count={scores.length}
          />

          {scores.length ? (
            scores.map((score) => (
              <ScoreCard key={score.id} score={score} />
            ))
          ) : (
            <View style={styles.emptyScores}>
              <Text style={UI.body}>
                Os resultados aparecerão após o registro dos treinos.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    gap: 10,
    marginBottom: 8,
  },

  patientName: {
    fontSize: 25,
    fontWeight: '700',
    color: Colors.text,
    lineHeight: 32,
  },

  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 18,
  },

  infoItem: {
    width: '50%',
    gap: 5,
    paddingRight: 10,
  },

  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },

  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },

  section: {
    gap: 12,
  },

  subsection: {
    gap: 10,
    marginTop: 6,
  },

  subsectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },

  emptyScores: {
    paddingVertical: 8,
  },
});

export default AssistidoDetailScreen;
