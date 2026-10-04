import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Colors } from '../theme/colors';
import { Treino } from '../types';

interface TreinoCardProps {
  treino: Treino;
  onPress?: () => void;
  selected?: boolean;
}

export const TreinoCard = ({ treino, onPress, selected }: TreinoCardProps) => (
  <TouchableOpacity 
    style={[styles.card, selected && styles.selectedCard]} 
    onPress={onPress}
    disabled={!onPress}
  >
    <View style={styles.header}>
      <Text style={styles.title}>{treino.nome}</Text>
      <Text style={styles.badge}>{treino.medicao}</Text>
    </View>
    <Text style={styles.subtitle}>{treino.objetivo}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    elevation: 2,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: Colors.primary,
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
    flex: 1,
  },
  badge: {
    backgroundColor: Colors.lightGray,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
});
