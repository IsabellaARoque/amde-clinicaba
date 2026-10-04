import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { assistidoService } from '../services/assistidoService';
import { Assistido } from '../types';
import { Colors } from '../theme/colors';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AssistidosScreen = () => {
  const insets = useSafeAreaInsets();
  const [assistidos, setAssistidos] = useState<Assistido[]>([]);
  const [filtered, setFiltered] = useState<Assistido[]>([]);
  const [search, setSearch] = useState('');
  const navigation = useNavigation<any>();

  useEffect(() => {
    loadAssistidos();
  }, []);

  const loadAssistidos = async () => {
    const data = await assistidoService.getAssistidos();
    setAssistidos(data);
    setFiltered(data);
  };

  const handleSearch = (text: string) => {
    setSearch(text);
    if (text) {
      setFiltered(assistidos.filter(a => a.nome.toLowerCase().includes(text.toLowerCase())));
    } else {
      setFiltered(assistidos);
    }
  };

  const renderItem = ({ item }: { item: Assistido }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('AssistidoDetail', { assistidoId: item.id })}>
      <Text style={styles.nome}>{item.nome}</Text>
      <Text style={styles.info}>Período: {item.periodo}</Text>
      <Text style={styles.info}>Sala: {item.sala}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.search}
        placeholder="Buscar assistido..."
        value={search}
        onChangeText={handleSearch}
      />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={[styles.list, { paddingBottom: 16 + insets.bottom }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  search: { backgroundColor: Colors.surface, padding: 12, margin: 16, borderRadius: 8, borderWidth: 1, borderColor: Colors.border },
  list: { paddingHorizontal: 16 },
  card: { backgroundColor: Colors.surface, padding: 16, borderRadius: 8, marginBottom: 12, elevation: 2 },
  nome: { fontSize: 18, fontWeight: 'bold', color: Colors.text, marginBottom: 4 },
  info: { fontSize: 14, color: Colors.textSecondary }
});

export default AssistidosScreen;
