import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import { Colors } from '../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PerfilScreen = () => {
  const { user, signOut } = useContext(AuthContext);
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: 16 + insets.bottom }]}>
      <View style={styles.card}>
        <Text style={styles.name}>{user?.nome}</Text>
        <Text style={styles.info}>Email: {user?.email}</Text>
        <Text style={styles.info}>CPF: {user?.cpf}</Text>
      </View>
      <TouchableOpacity style={styles.btn} onPress={signOut}>
        <Text style={styles.btnText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 16, justifyContent: 'center' },
  card: { backgroundColor: Colors.surface, padding: 24, borderRadius: 8, elevation: 4, alignItems: 'center', marginBottom: 32 },
  name: { fontSize: 24, fontWeight: 'bold', color: Colors.text, marginBottom: 16 },
  info: { fontSize: 16, color: Colors.textSecondary, marginBottom: 8 },
  btn: { backgroundColor: Colors.danger, padding: 16, borderRadius: 8, alignItems: 'center' },
  btnText: { color: Colors.surface, fontSize: 18, fontWeight: 'bold' }
});

export default PerfilScreen;
