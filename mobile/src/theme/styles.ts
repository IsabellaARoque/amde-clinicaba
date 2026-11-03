import { StyleSheet } from 'react-native';
import { Colors } from './colors';
export const UI = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20, gap: 16 },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  title: {
    fontSize: 28,
    lineHeight: 35,
    fontWeight: '700',
    color: Colors.text,
    letterSpacing: -0.6,
  },
  heading: { fontSize: 21, lineHeight: 28, fontWeight: '700', color: Colors.text },
  body: { fontSize: 15, lineHeight: 23, color: Colors.textSecondary },
  label: { fontSize: 15, lineHeight: 22, fontWeight: '600', color: Colors.text, marginBottom: 8 },
  eyebrow: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '700',
    color: Colors.primaryDark,
    letterSpacing: 1.4,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  divider: { height: 2, backgroundColor: Colors.accent, marginVertical: 4 },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});
