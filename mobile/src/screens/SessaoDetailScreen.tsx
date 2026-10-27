
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { sessaoService } from '../services/sessaoService';
import { Sessao } from '../types';
import { Colors } from '../theme/colors';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SessaoDetailScreen = ({ route }: any) => {
  const { sessaoId } = route.params;
  const insets = useSafeAreaInsets();

  const [sessao, setSessao] = useState<Sessao | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await sessaoService.getSessao(sessaoId);
        setSessao(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [sessaoId]);

  if (loading || !sessao) {
    return <LoadingSpinner />;
  }

  const formatarDuracao = (duracao: unknown) => {
    if (duracao === null || duracao === undefined || duracao === '') {
      return 'Não informado';
    }
    if (typeof duracao === 'number' || !isNaN(Number(duracao))) {
      const totalSegundos = Number(duracao);

      if (!Number.isFinite(totalSegundos) || totalSegundos < 0) {
        return 'Não informado';
      }

      const horas = Math.floor(totalSegundos / 3600);
      const minutos = Math.floor((totalSegundos % 3600) / 60);
      const segundos = Math.floor(totalSegundos % 60);

      if (horas > 0) {
        return `${horas}h ${minutos}min ${segundos}s`;
      }

      if (minutos > 0) {
        return `${minutos}min ${segundos}s`;
      }

      return `${segundos}s`;
    }
    return String(duracao);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingBottom: 16 + insets.bottom,
      }}
    >
      <View style={styles.card}>
        <Text style={styles.title}>
          Data: {new Date(sessao.data).toLocaleDateString()}
        </Text>

        <Text style={styles.text}>
          Horário: {sessao.horaInicio} - {sessao.horaFim || 'Em andamento'}
        </Text>

        <Text style={styles.text}>
          Profissional: {sessao.profissional.nome}
        </Text>

        <Text style={styles.text}>
          Score Geral: {sessao.score != null ? `${sessao.score}%` : 'N/A'}
        </Text>

        <Text style={styles.text}>
          Observações: {sessao.observacoes || 'Nenhuma'}
        </Text>
      </View>

      <Text style={styles.sectionTitle}>
        Treinos Realizados ({sessao.treinosSessao?.length || 0})
      </Text>

      {sessao.treinosSessao?.map((ts: any) => {
        const medicao = String(ts.treino?.medicao || '').toUpperCase();
        const frequencia = ts.registroFrequencia;
        const duracao = ts.registroDuracao;

        return (
          <View key={ts.id} style={styles.treinoCard}>
            <Text style={styles.treinoTitle}>
              {ts.treino.nome}
            </Text>

            <View style={styles.tipoContainer}>
              <Text style={styles.tipoText}>
                {medicao === 'FREQUENCIA'
                  ? 'Treino de Frequência'
                  : medicao === 'DURACAO'
                    ? 'Treino de Duração'
                    : 'Tipo de medição não identificado'}
              </Text>
            </View>

            {medicao === 'FREQUENCIA' && (
              <View style={styles.resultadosContainer}>
                <View style={styles.resultadoItem}>
                  <View style={[styles.indicador, styles.indicadorVerde]} />
                  <Text style={styles.resultadoLabel}>
                    Executou sem ajuda
                  </Text>
                  <Text style={styles.resultadoValor}>
                    {frequencia?.execSemAjuda ?? 0}
                  </Text>
                </View>

                <View style={styles.resultadoItem}>
                  <View style={[styles.indicador, styles.indicadorAmarelo]} />
                  <Text style={styles.resultadoLabel}>
                    Executou com ajuda
                  </Text>
                  <Text style={styles.resultadoValor}>
                    {frequencia?.execComAjuda ?? 0}
                  </Text>
                </View>

                <View style={styles.resultadoItem}>
                  <View style={[styles.indicador, styles.indicadorVermelho]} />
                  <Text style={styles.resultadoLabel}>
                    Não executou
                  </Text>
                  <Text style={styles.resultadoValor}>
                    {frequencia?.naoExecutado ?? 0}
                  </Text>
                </View>

                <View style={styles.totalContainer}>
                  <Text style={styles.totalLabel}>
                    Total de tentativas
                  </Text>
                  <Text style={styles.totalValor}>
                    {(frequencia?.execSemAjuda ?? 0) +
                      (frequencia?.execComAjuda ?? 0) +
                      (frequencia?.naoExecutado ?? 0)}
                  </Text>
                </View>
              </View>
            )}

            {medicao === 'DURACAO' && (
              <View style={styles.duracaoContainer}>
                <Text style={styles.duracaoLabel}>
                  Duração registrada
                </Text>

                <Text style={styles.duracaoValor}>
                  {formatarDuracao(duracao?.duracao)}
                </Text>
              </View>
            )}

            <View style={styles.divider} />

            <Text style={styles.text}>
              Score: {ts.score != null ? `${ts.score}%` : 'N/A'}
            </Text>

            <Text style={styles.text}>
              Observações: {ts.observacoes || '-'}
            </Text>
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  card: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  treinoCard: {
    backgroundColor: Colors.surface,
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  treinoTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  tipoContainer: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.background,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    marginBottom: 14,
  },
  tipoText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
  },
  resultadosContainer: {
    marginBottom: 12,
  },
  resultadoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  indicador: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  indicadorVerde: {
    backgroundColor: Colors.success,
  },
  indicadorAmarelo: {
    backgroundColor: Colors.warning,
  },
  indicadorVermelho: {
    backgroundColor: Colors.danger,
  },
  resultadoLabel: {
    flex: 1,
    fontSize: 14,
    color: Colors.textSecondary,
  },
  resultadoValor: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    padding: 10,
    backgroundColor: Colors.background,
    borderRadius: 8,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  totalValor: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  duracaoContainer: {
    backgroundColor: Colors.background,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  duracaoLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  duracaoValor: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 12,
  },
});

export default SessaoDetailScreen;
