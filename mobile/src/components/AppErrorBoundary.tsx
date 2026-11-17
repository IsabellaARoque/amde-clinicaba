import React, { ErrorInfo, ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class AppErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Erro de renderização no aplicativo', error, info.componentStack);
  }

  private retry = () => {
    this.setState({ error: null });
  };

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.card}>
          <Text style={styles.title}>Não foi possível exibir esta tela</Text>
          <Text style={styles.message}>
            O aplicativo encontrou um erro inesperado. Tente abrir a tela novamente.
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Tentar abrir o aplicativo novamente"
            onPress={this.retry}
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          >
            <Text style={styles.buttonText}>Tentar novamente</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  card: {
    gap: 16,
    padding: 24,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  title: {
    color: Colors.text,
    fontSize: 22,
    lineHeight: 29,
    fontWeight: '700',
  },
  message: {
    color: Colors.textSecondary,
    fontSize: 15,
    lineHeight: 23,
  },
  button: {
    minHeight: 52,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: Colors.primaryDark,
  },
  buttonPressed: { opacity: 0.8 },
  buttonText: { color: Colors.surface, fontSize: 16, fontWeight: '700' },
});
