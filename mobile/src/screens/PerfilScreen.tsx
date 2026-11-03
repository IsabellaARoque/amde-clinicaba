import React, { useContext, useState } from 'react';
import { View, Text, ScrollView, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../contexts/AuthContext';
import { AppButton, Badge } from '../components/ScreenUI';
import { Colors } from '../theme/colors';
import { UI } from '../theme/styles';
const PerfilScreen = () => {
  const { user, signOut } = useContext(AuthContext);
  const [leaving, setLeaving] = useState(false);
  const sair = () =>
    Alert.alert('Sair da conta?', 'Você precisará entrar novamente para acessar seus pacientes.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          setLeaving(true);
          try {
            await signOut();
          } catch {
            Alert.alert('Não foi possível sair', 'Tente novamente.');
          } finally {
            setLeaving(false);
          }
        },
      },
    ]);
  return (
    <SafeAreaView style={UI.screen} edges={['top']}>
      <ScrollView contentContainerStyle={[UI.content, { paddingBottom: 32 }]}>
        <Text style={UI.eyebrow}>SUA CONTA</Text>
        <Text style={UI.title}>Meu perfil</Text>
        <View style={[UI.card, { alignItems: 'center', gap: 14, paddingVertical: 32 }]}>
          <View style={styles.avatar}>
            <Text style={styles.initial}>{user?.nome?.trim().charAt(0).toUpperCase() || 'P'}</Text>
          </View>
          <Text style={[UI.heading, { textAlign: 'center' }]}>{user?.nome}</Text>
          <Badge>Profissional</Badge>
        </View>
        <View style={UI.card}>
          <Text style={UI.label}>E-mail</Text>
          <Text selectable style={UI.body}>
            {user?.email || 'Não informado'}
          </Text>
          <View style={{ height: 20 }} />
          <Text style={UI.label}>CPF</Text>
          <Text style={UI.body}>{user?.cpf || 'Não informado'}</Text>
        </View>
        <AppButton
          title={leaving ? 'Saindo...' : 'Sair da conta'}
          tone="ghost"
          loading={leaving}
          onPress={sair}
        />
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.lavender,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: { color: Colors.secondary, fontSize: 34, fontWeight: '700' },
});
export default PerfilScreen;
