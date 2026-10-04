import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Colors } from '../theme/colors';
import { SessaoResumo } from '../types';

interface SessaoCardProps {
  sessao: SessaoResumo;
  onPress: () => void;
}

export const SessaoCard = ({ sessao, onPress }: SessaoCardProps) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <View style={styles.header}>
      <Text style={styles.title}>Sessão: {new Date(sessao.data).toLocaleDateString()}</Text>
      <Text style={styles.score}>{sessao.score ? `${sessao.score.toFixed(2)}%` : 'N/A'}</Text>
    </View>
    <Text style={styles.subtitle}>Plano: {sessao.planoNome}</Text>
    <Text style={styles.subtitle}>Duração: {sessao.horaInicio} - {sessao.horaFim || 'Em andamento'}</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: 'bold',
  },
  score: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
});
