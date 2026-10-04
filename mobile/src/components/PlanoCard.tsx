import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';
import { PlanoIntervencao } from '../types';

interface PlanoCardProps {
  plano: PlanoIntervencao;
  onPress: () => void;
}

export const PlanoCard = ({ plano, onPress }: PlanoCardProps) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Text style={styles.title}>{plano.nome}</Text>
    <Text style={styles.subtitle}>Criado em: {new Date(plano.dataCriacao).toLocaleDateString()}</Text>
    <Text style={[styles.status, { color: plano.status === 'ATIVO' ? Colors.success : Colors.danger }]}>
      {plano.status}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    color: Colors.text,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
