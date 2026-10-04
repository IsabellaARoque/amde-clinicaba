import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';
import { ScorePorCategoria } from '../types';

interface ScoreCardProps {
  score: ScorePorCategoria;
}

export const ScoreCard = ({ score }: ScoreCardProps) => (
  <View style={styles.card}>
    <Text style={styles.title}>{score.categoria.nome}</Text>
    <Text style={styles.value}>{score.valor.toFixed(2)}%</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  title: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 18,
    color: Colors.primary,
    fontWeight: 'bold',
  },
});
