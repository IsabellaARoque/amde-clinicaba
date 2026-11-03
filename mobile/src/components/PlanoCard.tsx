import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { PlanoIntervencao } from '../types';
import { Colors } from '../theme/colors';
import { UI } from '../theme/styles';
import { Badge } from './ScreenUI';
import { formatDate } from '../utils/presentation';
export const PlanoCard = ({ plano, onPress }: { plano: PlanoIntervencao; onPress: () => void }) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel={'Acessar plano ' + plano.nome}
    onPress={onPress}
    style={({ pressed }) => [styles.card, pressed && { opacity: 0.8 }]}
  >
    <View style={[UI.row, { justifyContent: 'space-between', flexWrap: 'wrap' }]}>
      <Text style={UI.heading}>{plano.nome}</Text>
      <Badge tone={plano.status === 'ATIVO' ? 'success' : 'muted'}>
        {plano.status === 'ATIVO' ? 'Ativo' : 'Inativo'}
      </Badge>
    </View>
    <Text style={UI.body} numberOfLines={3}>
      {plano.objetivo || 'Objetivo não informado.'}
    </Text>
    <Text style={styles.date}>Criado em {formatDate(plano.dataCriacao)}</Text>
    <View style={styles.action}>
      <Text style={styles.actionText}>Acessar plano →</Text>
    </View>
  </Pressable>
);
const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.primarySoft,
    padding: 20,
    borderRadius: 24,
    gap: 10,
    marginVertical: 4,
  },
  date: { fontSize: 12, lineHeight: 18, color: Colors.textSecondary },
  action: {
    backgroundColor: Colors.accent,
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 12,
    alignSelf: 'flex-end',
  },
  actionText: { color: Colors.text, fontSize: 14, fontWeight: '700' },
});
