import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { planoService } from '../services/planoService';
import { getApiErrorMessage } from '../services/getApiErrorMessage';
import { PlanoIntervencao, Treino } from '../types';
import { Colors } from '../theme/colors';
import { UI } from '../theme/styles';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { TreinoCard } from '../components/TreinoCard';
import { TreinoEditorModal } from '../components/TreinoEditorModal';
import { AppButton, Badge, EmptyState, ErrorNotice, SectionHeading } from '../components/ScreenUI';
import { formatDate } from '../utils/presentation';
const PlanoDetailScreen = ({ route }: any) => {
  const { planoId } = route.params;
  const insets = useSafeAreaInsets();
  const [plano, setPlano] = useState<PlanoIntervencao | null>(null);
  const [treinos, setTreinos] = useState<Treino[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);
  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [p, t] = await Promise.all([
        planoService.getPlano(planoId),
        planoService.getTreinosByPlano(planoId),
      ]);
      setPlano(p);
      setTreinos(t);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Não foi possível carregar o plano.'));
    } finally {
      setLoading(false);
    }
  }, [planoId]);
  useEffect(() => {
    void load();
  }, [load]);
  if (loading && !plano) return <LoadingSpinner />;
  if (!plano)
    return (
      <View style={[UI.screen, UI.content]}>
        <EmptyState title="Não foi possível abrir o plano" description={error} onRetry={load} />
      </View>
    );
  return (
    <View style={UI.screen}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
        contentContainerStyle={[UI.content, { paddingBottom: 28 + insets.bottom }]}
      >
        <View style={styles.header}>
          <Text style={UI.eyebrow}>PLANO DE INTERVENÇÃO · PTS</Text>
          <Text style={UI.title}>{plano.nome}</Text>
          <Badge tone={plano.status === 'ATIVO' ? 'success' : 'muted'}>
            {plano.status === 'ATIVO' ? 'Plano ativo' : 'Plano inativo'}
          </Badge>
          <View style={UI.divider} />
          <Text style={UI.label}>Objetivo</Text>
          <Text style={[UI.body, { color: Colors.text }]}>{plano.objetivo || 'Não informado'}</Text>
          <Text style={UI.body}>Criado em {formatDate(plano.dataCriacao)}</Text>
          <Text style={UI.body}>
            Profissional: {plano.profissionalCriador?.nome || 'Não informado'}
          </Text>
        </View>
        {!!error && <ErrorNotice message={error} onRetry={load} />}
        <SectionHeading title="Lista de treinos" count={treinos.length} />
        <Text style={UI.body}>
          Habilidades e atividades disponíveis para as sessões deste plano.
        </Text>
        {treinos.length ? (
          treinos.map((treino) => <TreinoCard key={treino.id} treino={treino} />)
        ) : (
          <EmptyState
            title="Este plano ainda não tem treinos"
            description="Adicione um treino para começar a registrar os resultados."
          />
        )}
        {plano.status === 'ATIVO' && (
          <AppButton title="Criar novo treino +" tone="accent" onPress={() => setCreating(true)} />
        )}
      </ScrollView>
      <TreinoEditorModal
        visible={creating}
        planoId={planoId}
        onClose={() => setCreating(false)}
        onCreated={(treino) => {
          setTreinos((prev) => [...prev, treino]);
          setCreating(false);
        }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  header: { backgroundColor: Colors.primarySoft, borderRadius: 26, padding: 22, gap: 12 },
});
export default PlanoDetailScreen;
