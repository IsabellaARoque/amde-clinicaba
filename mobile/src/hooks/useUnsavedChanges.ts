import { useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
export function useUnsavedChanges(dirty: boolean, saving: boolean) {
  const navigation = useNavigation();
  const allowExit = useRef(false);
  useEffect(
    () =>
      navigation.addListener('beforeRemove', (event) => {
        if (allowExit.current || (!dirty && !saving)) return;
        event.preventDefault();
        if (saving) {
          Alert.alert('Salvando registro', 'Aguarde a conclusão antes de sair desta tela.');
          return;
        }
        Alert.alert('Sair sem salvar?', 'As informações preenchidas nesta tela serão perdidas.', [
          { text: 'Continuar preenchendo', style: 'cancel' },
          {
            text: 'Descartar e sair',
            style: 'destructive',
            onPress: () => {
              allowExit.current = true;
              navigation.dispatch(event.data.action);
            },
          },
        ]);
      }),
    [navigation, dirty, saving],
  );
  return () => {
    allowExit.current = true;
  };
}
