import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../theme/colors';
import { UI } from '../theme/styles';
import { Icon } from './Icon';
type Tone = 'primary' | 'accent' | 'success' | 'danger' | 'ghost';
const tones = {
  primary: { backgroundColor: Colors.primary, color: Colors.text },
  accent: { backgroundColor: Colors.accent, color: Colors.text },
  success: { backgroundColor: Colors.success, color: Colors.surface },
  danger: { backgroundColor: Colors.danger, color: Colors.surface },
  ghost: { backgroundColor: Colors.lightGray, color: Colors.text },
};
export const AppButton = ({
  title,
  onPress,
  tone = 'primary',
  disabled = false,
  loading = false,
}: {
  title: string;
  onPress: () => void;
  tone?: Tone;
  disabled?: boolean;
  loading?: boolean;
}) => (
  <Pressable
    accessibilityRole="button"
    accessibilityState={{ disabled: disabled || loading, busy: loading }}
    disabled={disabled || loading}
    onPress={onPress}
    style={({ pressed }) => [
      styles.button,
      { backgroundColor: tones[tone].backgroundColor },
      (disabled || loading) && styles.disabled,
      pressed && styles.pressed,
    ]}
  >
    {loading && <ActivityIndicator color={tones[tone].color} />}
    <Text style={[styles.buttonText, { color: tones[tone].color }]}>{title}</Text>
  </Pressable>
);
export const Badge = ({
  children,
  tone = 'blue',
}: {
  children: React.ReactNode;
  tone?: 'blue' | 'success' | 'muted' | 'warning';
}) => (
  <View
    style={[
      styles.badge,
      {
        backgroundColor: {
          blue: Colors.primarySoft,
          success: Colors.successSoft,
          muted: Colors.lightGray,
          warning: Colors.warningSoft,
        }[tone],
      },
    ]}
  >
    <Text
      style={[
        styles.badgeText,
        {
          color: {
            blue: Colors.primaryDark,
            success: Colors.success,
            muted: Colors.textSecondary,
            warning: Colors.warning,
          }[tone],
        },
      ]}
    >
      {children}
    </Text>
  </View>
);
export const SectionHeading = ({ title, count }: { title: string; count?: number }) => (
  <View style={styles.sectionHeading}>
    <Text style={[UI.heading, { flex: 1 }]}>{title}</Text>
    {count !== undefined && <Badge>{count}</Badge>}
  </View>
);
export const EmptyState = ({
  title,
  description,
  onRetry,
}: {
  title: string;
  description?: string;
  onRetry?: () => void;
}) => (
  <View style={styles.empty}>
    <View style={styles.emptyIcon}>
      <Icon name={onRetry ? 'arrow' : 'patients'} size={28} color={Colors.primaryDark} />
    </View>
    <Text style={styles.emptyTitle}>{title}</Text>
    {description && <Text style={styles.emptyDescription}>{description}</Text>}
    {onRetry && <AppButton title="Tentar novamente" onPress={onRetry} />}
  </View>
);
export const ErrorNotice = ({ message, onRetry }: { message: string; onRetry?: () => void }) => (
  <View accessibilityRole="alert" style={styles.notice}>
    <Text style={[UI.body, { color: Colors.danger }]}>{message}</Text>
    {onRetry && <AppButton tone="ghost" title="Tentar novamente" onPress={onRetry} />}
  </View>
);
const styles = StyleSheet.create({
  button: {
    minHeight: 54,
    paddingHorizontal: 22,
    paddingVertical: 15,
    borderRadius: 28,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  buttonText: { fontSize: 16, lineHeight: 23, fontWeight: '700', textAlign: 'center' },
  disabled: { opacity: 0.5 },
  pressed: { opacity: 0.8 },
  badge: { alignSelf: 'flex-start', borderRadius: 20, paddingVertical: 6, paddingHorizontal: 12 },
  badgeText: { fontSize: 12, lineHeight: 17, fontWeight: '700' },
  sectionHeading: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 8 },
  empty: {
    padding: 24,
    gap: 12,
    alignItems: 'stretch',
    backgroundColor: Colors.lightGray,
    borderRadius: 22,
  },
  emptyIcon: {
    alignSelf: 'center',
    padding: 16,
    backgroundColor: Colors.surface,
    borderRadius: 40,
  },
  emptyTitle: { fontSize: 17, fontWeight: '700', color: Colors.text, textAlign: 'center' },
  emptyDescription: {
    fontSize: 14,
    lineHeight: 22,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  notice: { padding: 16, gap: 12, borderRadius: 16, backgroundColor: Colors.dangerSoft },
});
