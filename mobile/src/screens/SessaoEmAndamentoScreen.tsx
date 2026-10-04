import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { sessaoService } from '../services/sessaoService';
import { planoService } from '../services/planoService';
import { Sessao, Treino } from '../types';
import { Colors } from '../theme/colors';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { TreinoCard } from '../components/TreinoCard';
import { useIsFocused } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SessaoEmAndamentoScreen = ({ route, navigation }: any) => {
  const { sessaoId } = route.params;
  const insets = useSafeAreaInsets();
  const [sessao, setSessao] = useState<Sessao | null>(null);
  const [treinos, setTreinos] = useState<Treino[]>([]);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      loadData();
    }
  }, [isFocused]);

  const loadData = async () => {
    try {
      const s = await sessaoService.getSessao(sessaoId);
      setSessao(s);
      if (s.planoIntervencaoId) {
        const t = await planoService.getTreinosByPlano(s.planoIntervencaoId);
        setTreinos(t);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const isTreinoRealizado = (treinoId: number) => {
    return sessao?.treinosSessao?.some(ts => ts.treino.id === treinoId);
  };

  const handleExecutarTreino = (treino: Treino) => {
    if (isTreinoRealizado(treino.id)) {
      Alert.alert('Aviso', 'Este treino já foi realizado nesta sessão.');
      return;
    }

    if (treino.medicao === 'FREQUENCIA') {
      navigation.navigate('ExecutarTreinoFrequencia', { sessaoId, treinoId: treino.id });
    } else {
      navigation.navigate('ExecutarTreinoDuracao', { sessaoId, treinoId: treino.id });
    }
  };

  if (loading || !sessao) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: 116 + insets.bottom }]}>
        <View style={styles.header}>
          <Text style={styles.title}>Assistido: {sessao.assistidoNome}</Text>
          <Text style={styles.info}>Início: {sessao.horaInicio}</Text>
        </View>

        <Text style={styles.subtitle}>Treinos Pendentes</Text>
        {treinos.map(treino => {
          const realizado = isTreinoRealizado(treino.id);
          return (
            <TouchableOpacity 
              key={treino.id} 
              onPress={() => handleExecutarTreino(treino)}
              style={{ opacity: realizado ? 0.5 : 1 }}
            >
              <TreinoCard treino={treino} />
              {realizado && <Text style={styles.realizado}>✓ Realizado</Text>}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity style={styles.endButton} onPress={() => navigation.navigate('EncerrarSessao', { sessaoId })}>
          <Text style={styles.endText}>ENCERRAR SESSÃO</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 16, paddingBottom: 116 },
  header: { backgroundColor: Colors.surface, padding: 16, borderRadius: 8, marginBottom: 16, elevation: 2 },
  title: { fontSize: 20, fontWeight: 'bold', color: Colors.text, marginBottom: 8 },
  info: { fontSize: 16, color: Colors.textSecondary },
  subtitle: { fontSize: 18, fontWeight: 'bold', color: Colors.text, marginBottom: 12 },
  realizado: { color: Colors.success, fontWeight: 'bold', position: 'absolute', top: 24, right: 24 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 16, paddingTop: 16, backgroundColor: Colors.surface, borderTopWidth: 1, borderTopColor: Colors.border },
  endButton: { backgroundColor: Colors.danger, padding: 16, borderRadius: 8, alignItems: 'center' },
  endText: { color: Colors.surface, fontSize: 16, fontWeight: 'bold' }
});

export default SessaoEmAndamentoScreen;
