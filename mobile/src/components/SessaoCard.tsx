import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';
import { UI } from '../theme/styles';
import { SessaoResumo } from '../types';
import { Badge } from './ScreenUI';
import { formatDate } from '../utils/presentation';
export const SessaoCard = ({ sessao, onPress }: { sessao: SessaoResumo; onPress: () => void }) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel={'Visualizar sessão de ' + formatDate(sessao.data)}
    onPress={onPress}
    style={({ pressed }) => [styles.card, pressed && { opacity: 0.8 }]}
  >
    <View style={[UI.row, { justifyContent: 'space-between', flexWrap: 'wrap' }]}>
      <Text style={styles.title}>
        {formatDate(sessao.data)} · {sessao.horaInicio?.slice(0, 5)}
      </Text>
      <Badge tone={sessao.horaFim ? 'success' : 'warning'}>
        {sessao.horaFim ? 'Encerrada' : 'Em aberto'}
      </Badge>
    </View>
    <Text style={UI.body}>{sessao.profissionalNome}</Text>
    <Text style={UI.body}>{sessao.planoNome}</Text>
    <View style={[UI.row, { justifyContent: 'space-between' }]}>
      <Text style={styles.score}>
        {sessao.horaFim && sessao.score != null ? 'Score: ' + sessao.score : 'Sessão em andamento'}
      </Text>
      <Text style={styles.link}>Visualizar →</Text>
    </View>
  </Pressable>
);
const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.primarySoft,
    padding: 18,
    borderRadius: 22,
    marginVertical: 4,
    gap: 8,
  },
  title: { fontSize: 15, color: Colors.text, fontWeight: '700', flexShrink: 1 },
  score: { fontSize: 12, color: Colors.textSecondary, flexShrink: 1 },
  link: { fontSize: 13, fontWeight: '700', color: Colors.primaryDark },
});
