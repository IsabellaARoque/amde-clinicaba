import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { assistidoService } from '../services/assistidoService';
import { planoService } from '../services/planoService';
import { Assistido, PlanoIntervencao, ScorePorCategoria } from '../types';
import { Colors } from '../theme/colors';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { PlanoCard } from '../components/PlanoCard';
import { ScoreCard } from '../components/ScoreCard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AssistidoDetailScreen = ({ route, navigation }: any) => {
  const { assistidoId } = route.params;
  const insets = useSafeAreaInsets();
  const [assistido, setAssistido] = useState<Assistido | null>(null);
  const [planos, setPlanos] = useState<PlanoIntervencao[]>([]);
  const [scores, setScores] = useState<ScorePorCategoria[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [ass, pls, scs] = await Promise.all([
          assistidoService.getAssistido(assistidoId),
          planoService.getPlanosByAssistido(assistidoId),
          assistidoService.getScores(assistidoId)
        ]);
        setAssistido(ass);
        setPlanos(pls);
        setScores(scs);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [assistidoId]);

  if (loading || !assistido) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: 116 + insets.bottom }]}>
        <View style={styles.section}>
          <Text style={styles.title}>{assistido.nome}</Text>
          <Text style={styles.text}>Nascimento: {new Date(assistido.dataNasc).toLocaleDateString()}</Text>
          <Text style={styles.text}>Responsável: {assistido.nomeResponsavel}</Text>
        </View>

        <TouchableOpacity 
          style={styles.historyButton} 
          onPress={() => navigation.navigate('HistoricoSessoes', { assistidoId })}
        >
          <Text style={styles.historyText}>Ver Histórico de Sessões</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Planos de Intervenção</Text>
        {planos.map(plano => (
          <PlanoCard 
            key={plano.id} 
            plano={plano} 
            onPress={() => navigation.navigate('PlanoDetail', { planoId: plano.id })} 
          />
        ))}

        <Text style={styles.sectionTitle}>Scores por Categoria</Text>
        {scores.map(score => (
          <ScoreCard key={score.id} score={score} />
        ))}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity style={styles.startButton} onPress={() => navigation.navigate('IniciarSessao', { assistidoId })}>
          <Text style={styles.startText}>INICIAR SESSÃO</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 16, paddingBottom: 116 },
  section: { backgroundColor: Colors.surface, padding: 16, borderRadius: 8, marginBottom: 16 },
  title: { fontSize: 22, fontWeight: 'bold', color: Colors.text, marginBottom: 8 },
  text: { fontSize: 16, color: Colors.textSecondary, marginBottom: 4 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.text, marginTop: 16, marginBottom: 8 },
  historyButton: { backgroundColor: Colors.secondary, padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 16 },
  historyText: { color: Colors.surface, fontWeight: 'bold' },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 16, paddingTop: 16, backgroundColor: Colors.surface, borderTopWidth: 1, borderTopColor: Colors.border },
  startButton: { backgroundColor: Colors.primary, padding: 16, borderRadius: 8, alignItems: 'center' },
  startText: { color: Colors.surface, fontSize: 16, fontWeight: 'bold' }
});

export default AssistidoDetailScreen;
