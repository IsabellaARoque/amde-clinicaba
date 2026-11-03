import React, { useCallback, useContext, useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { assistidoService } from '../services/assistidoService';
import { getApiErrorMessage } from '../services/getApiErrorMessage';
import { AuthContext } from '../contexts/AuthContext';
import { Assistido } from '../types';
import { Colors } from '../theme/colors';
import { UI } from '../theme/styles';
import { Badge, EmptyState, ErrorNotice } from '../components/ScreenUI';
import { Icon } from '../components/Icon';
import { normalizeSearch } from '../utils/presentation';
const AssistidosScreen = () => {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation<any>();
  const [assistidos, setAssistidos] = useState<Assistido[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setAssistidos(await assistidoService.getAssistidos());
    } catch (err) {
      setError(getApiErrorMessage(err, 'Não foi possível carregar os pacientes.'));
    } finally {
      setLoading(false);
    }
  }, []);
  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );
  const filtered = useMemo(
    () => assistidos.filter((item) => normalizeSearch(item.nome).includes(normalizeSearch(search))),
    [assistidos, search],
  );
  return (
    <SafeAreaView style={UI.screen} edges={['top']}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        refreshing={loading && assistidos.length > 0}
        onRefresh={load}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={UI.row}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Abrir meu perfil"
                onPress={() => navigation.navigate('Perfil')}
                style={styles.avatar}
              >
                <Text style={styles.initial}>
                  {user?.nome?.trim().charAt(0).toUpperCase() || 'P'}
                </Text>
              </Pressable>
              <View style={{ flex: 1 }}>
                <Text style={styles.greeting}>
                  Olá, {user?.nome?.trim().split(' ')[0] || 'profissional'}
                </Text>
                <Text style={UI.body}>Seu cuidado faz a diferença.</Text>
              </View>
            </View>
            <View style={[UI.row, { justifyContent: 'space-between' }]}>
              <Text style={UI.title}>Pacientes</Text>
              <Badge>{assistidos.length}</Badge>
            </View>
            <View style={styles.search}>
              <Icon name="search" size={21} />
              <TextInput
                accessibilityLabel="Pesquisar pacientes pelo nome"
                placeholder="Pesquisar paciente"
                placeholderTextColor={Colors.textSecondary}
                value={search}
                onChangeText={setSearch}
                style={styles.searchInput}
                autoCorrect={false}
                returnKeyType="search"
              />
              {search.length > 0 && (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Limpar pesquisa"
                  onPress={() => setSearch('')}
                  hitSlop={10}
                >
                  <Icon name="close" />
                </Pressable>
              )}
            </View>
            <View style={UI.divider} />
            {!!error && <ErrorNotice message={error} onRetry={load} />}
          </View>
        }
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator style={{ padding: 32 }} color={Colors.primaryDark} />
          ) : error ? undefined : (
            <EmptyState
              title={search ? 'Nenhum paciente encontrado' : 'Nenhum paciente cadastrado'}
              description={
                search
                  ? 'Tente pesquisar por outro nome.'
                  : 'Os pacientes cadastrados aparecerão aqui.'
              }
            />
          )
        }
        renderItem={({ item }) => (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={'Abrir paciente ' + item.nome}
            style={({ pressed }) => [styles.patient, pressed && { opacity: 0.8 }]}
            onPress={() => navigation.navigate('AssistidoDetail', { assistidoId: item.id })}
          >
            <View style={{ flex: 1, gap: 5 }}>
              <Text style={styles.name}>{item.nome}</Text>
              <Text style={styles.meta}>
                {[item.periodo, item.sala && 'Sala ' + item.sala].filter(Boolean).join(' · ') ||
                  'Ver informações do paciente'}
              </Text>
            </View>
            <View style={styles.arrow}>
              <Icon name="arrow" size={28} />
            </View>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  list: { padding: 20, paddingBottom: 28, gap: 12, flexGrow: 1 },
  header: { gap: 22, marginBottom: 8 },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.lavender,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initial: { fontSize: 22, fontWeight: '700', color: Colors.secondary },
  greeting: { fontSize: 17, fontWeight: '600', color: Colors.text, marginBottom: 3 },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lavender,
    borderRadius: 30,
    paddingHorizontal: 18,
    minHeight: 56,
    gap: 12,
  },
  searchInput: { flex: 1, minWidth: 0, paddingVertical: 15, fontSize: 16, color: Colors.text },
  patient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 17,
    gap: 14,
    backgroundColor: Colors.primarySoft,
    borderRadius: 22,
    minHeight: 88,
  },
  name: { fontSize: 16, lineHeight: 23, fontWeight: '700', color: Colors.text },
  meta: { fontSize: 13, lineHeight: 20, color: Colors.textSecondary },
  arrow: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default AssistidosScreen;
