import React, { useContext, useRef, useState } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../contexts/AuthContext';
import { getApiErrorMessage } from '../services/getApiErrorMessage';
import { FormField, FormScreen } from '../components/FormScreen';
import { AppButton } from '../components/ScreenUI';
import { Colors } from '../theme/colors';
import { UI } from '../theme/styles';
const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const lock = useRef(false);
  const { signIn } = useContext(AuthContext);
  const entrar = async () => {
    if (lock.current) return;
    if (!email.trim() || !senha) {
      Alert.alert('Preencha seus dados', 'Informe seu e-mail e sua senha para entrar.');
      return;
    }
    lock.current = true;
    setLoading(true);
    try {
      await signIn(email.trim(), senha);
    } catch (err) {
      Alert.alert(
        'Não foi possível entrar',
        getApiErrorMessage(err, 'Confira seu e-mail, sua senha e a conexão com a clínica.'),
      );
    } finally {
      lock.current = false;
      setLoading(false);
    }
  };
  return (
    <SafeAreaView style={UI.screen} edges={['top']}>
      <FormScreen
        headerOffset={0}
        contentContainerStyle={{ justifyContent: 'center', paddingVertical: 40 }}
      >
        <View style={styles.mark}>
          <View style={[styles.tile, { backgroundColor: Colors.primary }]} />
          <View
            style={[styles.tile, { backgroundColor: Colors.accent, borderTopRightRadius: 24 }]}
          />
          <View
            style={[styles.tile, { backgroundColor: Colors.lavender, borderBottomLeftRadius: 24 }]}
          />
          <View style={[styles.tile, { backgroundColor: Colors.primarySoft }]} />
        </View>
        <View style={{ gap: 10 }}>
          <Text style={UI.eyebrow}>CLINICABA</Text>
          <Text style={[UI.title, { fontSize: 34, lineHeight: 42 }]}>
            Cuidar começa{'\n'}com conexão.
          </Text>
          <Text style={UI.body}>
            Entre para acompanhar seus pacientes e registrar cada evolução.
          </Text>
        </View>
        <View style={[UI.card, { gap: 20 }]}>
          <FormField
            label="E-mail"
            placeholder="seuemail@clinica.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            autoComplete="email"
            textContentType="username"
            editable={!loading}
          />
          <FormField
            label="Senha"
            placeholder="Sua senha"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
            autoComplete="current-password"
            textContentType="password"
            editable={!loading}
            returnKeyType="go"
            onSubmitEditing={entrar}
          />
          <AppButton
            title={loading ? 'Entrando...' : 'Entrar →'}
            loading={loading}
            onPress={entrar}
          />
        </View>
        <Text style={styles.footer}>Um espaço para acompanhar cada conquista.</Text>
      </FormScreen>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  mark: { width: 76, height: 76, flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginBottom: 12 },
  tile: { width: 36, height: 36, borderRadius: 10 },
  footer: { fontSize: 12, lineHeight: 19, color: Colors.textSecondary, textAlign: 'center' },
});
export default LoginScreen;
