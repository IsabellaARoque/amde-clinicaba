import React, { useCallback, useState } from 'react';
import { View, FlatList, Text } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { assistidoService } from '../services/assistidoService';
import { getApiErrorMessage } from '../services/getApiErrorMessage';
import { SessaoResumo } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { SessaoCard } from '../components/SessaoCard';
import { EmptyState, ErrorNotice } from '../components/ScreenUI';
import { UI } from '../theme/styles';
const HistoricoSessoesScreen = ({ route, navigation }: any) => {
  const { assistidoId } = route.params;
  const insets = useSafeAreaInsets();
  const [sessoes, setSessoes] = useState<SessaoResumo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await assistidoService.getSessoes(assistidoId);
      setSessoes(
        [...data].sort((a, b) => (b.data + b.horaInicio).localeCompare(a.data + a.horaInicio)),
      );
    } catch (err) {
      setError(getApiErrorMessage(err, 'Não foi possível carregar o histórico.'));
    } finally {
      setLoading(false);
    }
  }, [assistidoId]);
  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );
  if (loading && !sessoes.length) return <LoadingSpinner />;
  return (
    <View style={UI.screen}>
      <FlatList
        data={sessoes}
        keyExtractor={(item) => String(item.id)}
        refreshing={loading}
        onRefresh={load}
        contentContainerStyle={[UI.content, { flexGrow: 1, paddingBottom: 24 + insets.bottom }]}
        ListHeaderComponent={
          <View style={{ gap: 16 }}>
            <Text style={UI.eyebrow}>EVOLUÇÃO DO ATENDIMENTO</Text>
            <Text style={UI.title}>Histórico de sessões</Text>
            {!!error && <ErrorNotice message={error} onRetry={load} />}
          </View>
        }
        ListEmptyComponent={
          !error ? (
            <EmptyState
              title="Nenhuma sessão registrada"
              description="Os atendimentos deste paciente aparecerão aqui."
            />
          ) : undefined
        }
        renderItem={({ item }) => (
          <SessaoCard
            sessao={item}
            onPress={() => navigation.navigate('SessaoDetail', { sessaoId: item.id })}
          />
        )}
      />
    </View>
  );
};
export default HistoricoSessoesScreen;
