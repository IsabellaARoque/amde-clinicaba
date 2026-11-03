import React, { useContext } from 'react';
import { View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { AuthContext } from '../contexts/AuthContext';
import { Colors } from '../theme/colors';
import { Icon } from '../components/Icon';
import { LoadingSpinner } from '../components/LoadingSpinner';
import LoginScreen from '../screens/LoginScreen';
import AssistidosScreen from '../screens/AssistidosScreen';
import AssistidoDetailScreen from '../screens/AssistidoDetailScreen';
import PlanoDetailScreen from '../screens/PlanoDetailScreen';
import IniciarSessaoScreen from '../screens/IniciarSessaoScreen';
import SessaoEmAndamentoScreen from '../screens/SessaoEmAndamentoScreen';
import ExecutarTreinoFrequenciaScreen from '../screens/ExecutarTreinoFrequenciaScreen';
import ExecutarTreinoDuracaoScreen from '../screens/ExecutarTreinoDuracaoScreen';
import EncerrarSessaoScreen from '../screens/EncerrarSessaoScreen';
import HistoricoSessoesScreen from '../screens/HistoricoSessoesScreen';
import SessaoDetailScreen from '../screens/SessaoDetailScreen';
import PerfilScreen from '../screens/PerfilScreen';
export type RootStackParamList = {
  Auth: undefined;
  MainTabs: undefined;
  AssistidoDetail: { assistidoId: number };
  PlanoDetail: { planoId: number };
  IniciarSessao: { assistidoId: number };
  SessaoEmAndamento: { sessaoId: number };
  ExecutarTreinoFrequencia: { sessaoId: number; treinoId: number };
  ExecutarTreinoDuracao: { sessaoId: number; treinoId: number };
  EncerrarSessao: { sessaoId: number };
  HistoricoSessoes: { assistidoId: number };
  SessaoDetail: { sessaoId: number };
};
const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: Colors.background,
    card: Colors.surface,
    text: Colors.text,
    border: Colors.border,
    primary: Colors.primaryDark,
  },
};
const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: Colors.text,
      tabBarInactiveTintColor: Colors.textSecondary,
      tabBarHideOnKeyboard: true,
      tabBarStyle: {
        backgroundColor: Colors.surface,
        borderTopColor: Colors.border,
        paddingTop: 8,
        minHeight: 68,
      },
      tabBarLabelStyle: { fontSize: 11, fontWeight: '600', marginBottom: 6 },
      tabBarIcon: ({ focused }) => (
        <View
          style={{
            width: 44,
            height: 34,
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: focused
              ? route.name === 'Perfil'
                ? Colors.lavender
                : Colors.primarySoft
              : 'transparent',
          }}
        >
          <Icon
            name={route.name === 'Perfil' ? 'profile' : 'patients'}
            size={24}
            color={focused ? Colors.text : Colors.textSecondary}
          />
        </View>
      ),
    })}
  >
    <Tab.Screen name="Assistidos" component={AssistidosScreen} options={{ title: 'Pacientes' }} />
    <Tab.Screen name="Perfil" component={PerfilScreen} options={{ title: 'Meu perfil' }} />
  </Tab.Navigator>
);
const AppNavigator = () => {
  const { signed, loading } = useContext(AuthContext);
  if (loading) return <LoadingSpinner />;
  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator
        screenOptions={{
          headerTintColor: Colors.text,
          headerStyle: { backgroundColor: Colors.background, elevation: 0, shadowOpacity: 0 },
          headerTitleStyle: { fontSize: 17, fontWeight: '600' },
          headerBackButtonDisplayMode: 'minimal',
          cardStyle: { backgroundColor: Colors.background },
        }}
      >
        {!signed ? (
          <Stack.Screen name="Auth" component={LoginScreen} options={{ headerShown: false }} />
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
            <Stack.Screen
              name="AssistidoDetail"
              component={AssistidoDetailScreen}
              options={{ title: 'Paciente' }}
            />
            <Stack.Screen
              name="PlanoDetail"
              component={PlanoDetailScreen}
              options={{ title: 'Plano de intervenção' }}
            />
            <Stack.Screen
              name="IniciarSessao"
              component={IniciarSessaoScreen}
              options={{ title: 'Nova sessão' }}
            />
            <Stack.Screen
              name="SessaoEmAndamento"
              component={SessaoEmAndamentoScreen}
              options={{ title: 'Atendimento', headerLeft: () => null, gestureEnabled: false }}
            />
            <Stack.Screen
              name="ExecutarTreinoFrequencia"
              component={ExecutarTreinoFrequenciaScreen}
              options={{ title: 'Treino de frequência' }}
            />
            <Stack.Screen
              name="ExecutarTreinoDuracao"
              component={ExecutarTreinoDuracaoScreen}
              options={{ title: 'Treino de duração' }}
            />
            <Stack.Screen
              name="EncerrarSessao"
              component={EncerrarSessaoScreen}
              options={{ title: 'Encerrar sessão' }}
            />
            <Stack.Screen
              name="HistoricoSessoes"
              component={HistoricoSessoesScreen}
              options={{ title: 'Histórico de sessões' }}
            />
            <Stack.Screen
              name="SessaoDetail"
              component={SessaoDetailScreen}
              options={{ title: 'Registro da sessão' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default AppNavigator;
