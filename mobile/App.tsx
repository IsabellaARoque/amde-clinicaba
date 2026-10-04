import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'react-native';
import { AuthProvider } from './src/contexts/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import { Colors } from './src/theme/colors';

const App = () => {
  return (
    <AuthProvider>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <AppNavigator />
    </AuthProvider>
  );
};

export default App;
