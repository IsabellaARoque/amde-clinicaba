import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { Colors } from '../theme/colors';
export const LoadingSpinner = () => (
  <View
    style={{
      flex: 1,
      backgroundColor: Colors.background,
      justifyContent: 'center',
      alignItems: 'center',
      gap: 14,
    }}
    accessibilityRole="progressbar"
    accessibilityLabel="Carregando"
  >
    <ActivityIndicator size="large" color={Colors.primaryDark} />
    <Text style={{ fontSize: 14, color: Colors.textSecondary }}>Carregando...</Text>
  </View>
);
