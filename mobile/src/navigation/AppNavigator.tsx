import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { AuthContext } from '../contexts/AuthContext';
import { Colors } from '../theme/colors';

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
  ExecutarTreinoFrequencia: { sessaoId: number, treinoId: number };
  ExecutarTreinoDuracao: { sessaoId: number, treinoId: number };
  EncerrarSessao: { sessaoId: number };
  HistoricoSessoes: { assistidoId: number };
  SessaoDetail: { sessaoId: number };
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const MainTabs = () => (
  <Tab.Navigator screenOptions={{ headerTintColor: Colors.surface, headerStyle: { backgroundColor: Colors.primary }, tabBarActiveTintColor: Colors.primary }}>
    <Tab.Screen name="Assistidos" component={AssistidosScreen} options={{ title: 'Assistidos' }} />
    <Tab.Screen name="Perfil" component={PerfilScreen} options={{ title: 'Meu Perfil' }} />
  </Tab.Navigator>
);

const AppNavigator = () => {
  const { signed, loading } = useContext(AuthContext);

  if (loading) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerTintColor: Colors.surface, headerStyle: { backgroundColor: Colors.primary } }}>
        {!signed ? (
          <Stack.Screen name="Auth" component={LoginScreen} options={{ headerShown: false }} />
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
            <Stack.Screen name="AssistidoDetail" component={AssistidoDetailScreen} options={{ title: 'Detalhes' }} />
            <Stack.Screen name="PlanoDetail" component={PlanoDetailScreen} options={{ title: 'Plano de Intervenção' }} />
            <Stack.Screen name="IniciarSessao" component={IniciarSessaoScreen} options={{ title: 'Configurar Sessão' }} />
            <Stack.Screen name="SessaoEmAndamento" component={SessaoEmAndamentoScreen} options={{ title: 'Sessão em Andamento', headerLeft: () => null }} />
            <Stack.Screen name="ExecutarTreinoFrequencia" component={ExecutarTreinoFrequenciaScreen} options={{ title: 'Executar Treino' }} />
            <Stack.Screen name="ExecutarTreinoDuracao" component={ExecutarTreinoDuracaoScreen} options={{ title: 'Executar Treino' }} />
            <Stack.Screen name="EncerrarSessao" component={EncerrarSessaoScreen} options={{ title: 'Encerrar Sessão' }} />
            <Stack.Screen name="HistoricoSessoes" component={HistoricoSessoesScreen} options={{ title: 'Histórico de Sessões' }} />
            <Stack.Screen name="SessaoDetail" component={SessaoDetailScreen} options={{ title: 'Detalhes da Sessão' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
