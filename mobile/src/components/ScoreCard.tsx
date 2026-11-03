import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';
import { ScorePorCategoria } from '../types';
export const ScoreCard = ({ score }: { score: ScorePorCategoria }) => (
  <View style={styles.card}>
    <Text style={styles.title}>{score.categoria.nome}</Text>
    <Text style={styles.value}>{score.valor.toLocaleString('pt-BR')}</Text>
  </View>
);
const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 14,
  },
  title: { fontSize: 15, lineHeight: 23, color: Colors.text, fontWeight: '600', flex: 1 },
  value: { fontSize: 18, color: Colors.primaryDark, fontWeight: '700' },
});
