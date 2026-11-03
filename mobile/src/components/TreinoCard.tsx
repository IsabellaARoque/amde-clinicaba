import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';
import { UI } from '../theme/styles';
import { Treino } from '../types';
import { Badge } from './ScreenUI';
export const TreinoCard = ({
  treino,
  onPress,
  selected,
  completed = false,
}: {
  treino: Treino;
  onPress?: () => void;
  selected?: boolean;
  completed?: boolean;
}) => (
  <Pressable
    accessibilityRole={onPress ? 'button' : undefined}
    accessibilityState={{ disabled: !onPress }}
    onPress={onPress}
    disabled={!onPress}
    style={({ pressed }) => [
      styles.card,
      selected && styles.selected,
      completed && styles.completed,
      pressed && { opacity: 0.8 },
    ]}
  >
    <View style={UI.row}>
      <Text style={[styles.title, { flex: 1 }]}>{treino.nome}</Text>
      <Badge tone={completed ? 'success' : 'muted'}>
        {completed ? '✓ Concluído' : treino.medicao === 'FREQUENCIA' ? 'Frequência' : 'Duração'}
      </Badge>
    </View>
    {!!treino.objetivo && <Text style={UI.body}>{treino.objetivo}</Text>}
    {!!treino.atividade && <Text style={UI.body}>{treino.atividade}</Text>}
    {!!treino.categoria && <Text style={styles.category}>{treino.categoria.nome}</Text>}
  </Pressable>
);
const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    padding: 18,
    borderRadius: 20,
    marginVertical: 4,
    gap: 8,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  selected: { borderColor: Colors.primaryDark, backgroundColor: '#F0F9FF' },
  completed: { borderColor: '#B6DDC4', backgroundColor: '#F3FBF5' },
  title: { color: Colors.text, fontSize: 16, lineHeight: 23, fontWeight: '700' },
  category: { color: Colors.primaryDark, fontSize: 12, fontWeight: '600' },
});
