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

  if (loading || !sessao) return <LoadingSpinner />;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 16 + insets.bottom }}>
      <View style={styles.card}>
        <Text style={styles.title}>Data: {new Date(sessao.data).toLocaleDateString()}</Text>
        <Text style={styles.text}>Horário: {sessao.horaInicio} - {sessao.horaFim}</Text>
        <Text style={styles.text}>Profissional: {sessao.profissional.nome}</Text>
        <Text style={styles.text}>Score Geral: {sessao.score ? `${sessao.score}%` : 'N/A'}</Text>
        <Text style={styles.text}>Observações: {sessao.observacoes || 'Nenhuma'}</Text>
      </View>

      <Text style={styles.sectionTitle}>Treinos Realizados ({sessao.treinosSessao?.length || 0})</Text>
      {sessao.treinosSessao?.map(ts => (
        <View key={ts.id} style={styles.treinoCard}>
          <Text style={styles.treinoTitle}>{ts.treino.nome}</Text>
          <Text style={styles.text}>Score: {ts.score}%</Text>
          <Text style={styles.text}>Observações: {ts.observacoes || '-'}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 16 },
  card: { backgroundColor: Colors.surface, padding: 16, borderRadius: 8, marginBottom: 16, elevation: 2 },
  title: { fontSize: 20, fontWeight: 'bold', color: Colors.text, marginBottom: 8 },
  text: { fontSize: 16, color: Colors.textSecondary, marginBottom: 4 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.text, marginBottom: 8 },
  treinoCard: { backgroundColor: Colors.surface, padding: 12, borderRadius: 8, marginBottom: 8, borderWidth: 1, borderColor: Colors.border },
  treinoTitle: { fontSize: 16, fontWeight: 'bold', color: Colors.text, marginBottom: 4 }
});

export default SessaoDetailScreen;
