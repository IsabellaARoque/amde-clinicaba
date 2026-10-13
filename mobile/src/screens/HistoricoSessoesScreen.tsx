import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { assistidoService } from '../services/assistidoService';
import { SessaoResumo } from '../types';
import { Colors } from '../theme/colors';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { SessaoCard } from '../components/SessaoCard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const HistoricoSessoesScreen = ({ route, navigation }: any) => {
  const { assistidoId } = route.params;
  const insets = useSafeAreaInsets();
  const [sessoes, setSessoes] = useState<SessaoResumo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await assistidoService.getSessoes(assistidoId);
        setSessoes(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [assistidoId]);

  if (loading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      <FlatList
        data={sessoes}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <SessaoCard sessao={item} onPress={() => navigation.navigate('SessaoDetail', { sessaoId: item.id })} />
        )}
        contentContainerStyle={[styles.list, { paddingBottom: 16 + insets.bottom }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  list: { padding: 16 }
});

export default HistoricoSessoesScreen;
