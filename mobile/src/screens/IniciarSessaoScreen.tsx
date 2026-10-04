import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { isAxiosError } from 'axios';
import { planoService } from '../services/planoService';
import { sessaoService } from '../services/sessaoService';
import { PlanoIntervencao, Treino } from '../types';
import { Colors } from '../theme/colors';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { TreinoCard } from '../components/TreinoCard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const IniciarSessaoScreen = ({ route, navigation }: any) => {
  const { assistidoId } = route.params;
  const insets = useSafeAreaInsets();
  const [planos, setPlanos] = useState<PlanoIntervencao[]>([]);
  const [selectedPlano, setSelectedPlano] = useState<number | null>(null);
  const [treinos, setTreinos] = useState<Treino[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingTreinos, setLoadingTreinos] = useState(false);
  const [treinosLoadFailed, setTreinosLoadFailed] = useState(false);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    async function loadPlanos() {
      try {
        const pls = await planoService.getPlanosByAssistido(assistidoId);
        const ativos = pls.filter(p => p.status === 'ATIVO');
        setPlanos(ativos);
        if (ativos.length > 0) {
          setSelectedPlano(ativos[0].id);
        }
      } catch (error) {
        console.error(error);
        Alert.alert('Erro', getErrorMessage(error, 'Não foi possível carregar os planos.'));
      } finally {
        setLoading(false);
      }
    }
    loadPlanos();
  }, [assistidoId]);

  useEffect(() => {
    if (selectedPlano === null) {
      setTreinos([]);
      setTreinosLoadFailed(false);
      return;
    }

    let isCurrentSelection = true;
    setTreinos([]);
    setLoadingTreinos(true);
    setTreinosLoadFailed(false);

    planoService.getTreinosByPlano(selectedPlano)
      .then((data) => {
        if (isCurrentSelection) setTreinos(data);
      })
      .catch((error: unknown) => {
        console.error(error);
        if (isCurrentSelection) {
          setTreinosLoadFailed(true);
          Alert.alert('Erro', getErrorMessage(error, 'Não foi possível carregar os treinos do plano.'));
        }
      })
      .finally(() => {
        if (isCurrentSelection) setLoadingTreinos(false);
      });

    return () => {
      isCurrentSelection = false;
    };
  }, [selectedPlano]);

  const handleIniciar = async () => {
    if (!selectedPlano) {
      Alert.alert('Aviso', 'Selecione um plano de intervenção');
      return;
    }

    const planoIntervencaoId = selectedPlano;
    setStarting(true);
    try {
      const sessao = await sessaoService.iniciar(assistidoId, planoIntervencaoId);
      navigation.replace('SessaoEmAndamento', { sessaoId: sessao.id });
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', getErrorMessage(error, 'Não foi possível iniciar a sessão.'));
      setStarting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: 116 + insets.bottom }]}>
        <Text style={styles.title}>Selecione o Plano Ativo</Text>
        {planos.map(plano => (
          <TouchableOpacity 
            key={plano.id} 
            style={[styles.planoBtn, selectedPlano === plano.id && styles.planoBtnSelected]}
            onPress={() => setSelectedPlano(plano.id)}
          >
            <Text style={[styles.planoText, selectedPlano === plano.id && styles.planoTextSelected]}>{plano.nome}</Text>
          </TouchableOpacity>
        ))}

        {selectedPlano && (
          <>
            <Text style={styles.subtitle}>
              {loadingTreinos ? 'Carregando treinos...' : `Treinos que serão executados (${treinos.length}):`}
            </Text>
            {!loadingTreinos && treinos.map(treino => (
              <TreinoCard key={treino.id} treino={treino} />
            ))}
          </>
        )}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity
          style={[styles.startButton, (starting || !selectedPlano || loadingTreinos || treinosLoadFailed) && styles.startButtonDisabled]}
          onPress={handleIniciar}
          disabled={starting || !selectedPlano || loadingTreinos || treinosLoadFailed}
        >
          <Text style={styles.startText}>{starting ? 'INICIANDO...' : 'CONFIRMAR E INICIAR'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 16, paddingBottom: 116 },
  title: { fontSize: 18, fontWeight: 'bold', color: Colors.text, marginBottom: 12 },
  planoBtn: { padding: 16, backgroundColor: Colors.surface, borderRadius: 8, marginBottom: 8, borderWidth: 2, borderColor: 'transparent' },
  planoBtnSelected: { borderColor: Colors.primary },
  planoText: { fontSize: 16, color: Colors.text },
  planoTextSelected: { fontWeight: 'bold', color: Colors.primary },
  subtitle: { fontSize: 18, fontWeight: 'bold', color: Colors.text, marginTop: 16, marginBottom: 12 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 16, paddingTop: 16, backgroundColor: Colors.surface, borderTopWidth: 1, borderTopColor: Colors.border },
  startButton: { backgroundColor: Colors.primary, padding: 16, borderRadius: 8, alignItems: 'center' },
  startButtonDisabled: { opacity: 0.55 },
  startText: { color: Colors.surface, fontSize: 16, fontWeight: 'bold' }
});

function getErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError(error)) {
    const data: unknown = error.response?.data;
    if (typeof data === 'string' && data.length > 0) return data;
    if (data && typeof data === 'object' && 'error' in data && typeof data.error === 'string') {
      return data.error;
    }
    if (error.response?.status) {
      return `${fallback} (HTTP ${error.response.status})`;
    }
  }
  return fallback;
}

export default IniciarSessaoScreen;
