import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { planoService } from '../services/planoService';
import { PlanoIntervencao, Treino } from '../types';
import { Colors } from '../theme/colors';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { TreinoCard } from '../components/TreinoCard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PlanoDetailScreen = ({ route }: any) => {
  const { planoId } = route.params;
  const insets = useSafeAreaInsets();
  const [plano, setPlano] = useState<PlanoIntervencao | null>(null);
  const [treinos, setTreinos] = useState<Treino[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const p = await planoService.getPlano(planoId);
        const t = await planoService.getTreinosByPlano(planoId);
        setPlano(p);
        setTreinos(t);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [planoId]);

  if (loading || !plano) return <LoadingSpinner />;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 24 + insets.bottom }}>
      <View style={styles.header}>
        <Text style={styles.title}>{plano.nome}</Text>
        <Text style={styles.status}>Status: {plano.status}</Text>
        <Text style={styles.subtitle}>Objetivo: {plano.objetivo}</Text>
      </View>
      
      <Text style={styles.sectionTitle}>Treinos do Plano ({treinos.length})</Text>
      <View style={styles.list}>
        {treinos.map(treino => (
          <TreinoCard key={treino.id} treino={treino} />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { backgroundColor: Colors.surface, padding: 16, marginBottom: 16 },
  title: { fontSize: 22, fontWeight: 'bold', color: Colors.text, marginBottom: 8 },
  status: { fontSize: 16, fontWeight: 'bold', color: Colors.primary, marginBottom: 8 },
  subtitle: { fontSize: 16, color: Colors.textSecondary },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.text, marginHorizontal: 16, marginBottom: 8 },
  list: { paddingHorizontal: 16 }
});

export default PlanoDetailScreen;
