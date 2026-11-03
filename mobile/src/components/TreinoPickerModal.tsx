import React, { useRef } from 'react';
import { Modal, View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Treino } from '../types';
import { Colors } from '../theme/colors';
import { UI } from '../theme/styles';
import { Icon } from './Icon';
import { AppButton, EmptyState } from './ScreenUI';
import { TreinoEditor } from './TreinoEditorModal';
interface Props {
  visible: boolean;
  creating: boolean;
  planoId: number;
  treinos: Treino[];
  selectedIds: number[];
  onToggle: (id: number) => void;
  onConfirm: () => void;
  onClose: () => void;
  onCreate: () => void;
  onBack: () => void;
  onCreated: (treino: Treino) => void;
}
export const TreinoPickerModal = ({
  visible,
  creating,
  planoId,
  treinos,
  selectedIds,
  onToggle,
  onConfirm,
  onClose,
  onCreate,
  onBack,
  onCreated,
}: Props) => {
  const insets = useSafeAreaInsets();
  const editorClose = useRef<(() => void) | null>(null);
  return (
    <Modal
      transparent
      animationType="slide"
      visible={visible}
      onRequestClose={() => {
        if (creating) editorClose.current?.();
        else onClose();
      }}
    >
      <SafeAreaView edges={['top']} style={styles.overlay}>
        <View accessibilityViewIsModal style={styles.sheet}>
          {creating ? (
            <TreinoEditor
              planoId={planoId}
              onClose={onBack}
              onCreated={onCreated}
              closeRef={editorClose}
            />
          ) : (
            <>
              <View style={styles.header}>
                <Text style={[UI.heading, { flex: 1 }]}>Adicionar treinos</Text>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Cancelar seleção de treinos"
                  onPress={onClose}
                  style={styles.close}
                >
                  <Icon name="close" size={28} />
                </Pressable>
              </View>
              <ScrollView contentContainerStyle={UI.content}>
                <Text style={UI.body}>
                  Escolha os treinos deste plano que deseja trabalhar na sessão.
                </Text>
                {treinos.map((treino) => {
                  const selected = selectedIds.includes(treino.id);
                  return (
                    <Pressable
                      key={treino.id}
                      accessibilityRole="checkbox"
                      accessibilityState={{ checked: selected }}
                      accessibilityLabel={treino.nome}
                      onPress={() => onToggle(treino.id)}
                      style={[styles.option, selected && styles.selected]}
                    >
                      <View
                        style={[
                          styles.checkbox,
                          selected && {
                            backgroundColor: Colors.primaryDark,
                            borderColor: Colors.primaryDark,
                          },
                        ]}
                      >
                        {selected && <Icon name="check" size={18} color={Colors.surface} />}
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.name}>{treino.nome}</Text>
                        <Text style={UI.body}>
                          {treino.medicao === 'FREQUENCIA' ? 'Frequência' : 'Duração'}
                        </Text>
                      </View>
                    </Pressable>
                  );
                })}
                {!treinos.length && (
                  <EmptyState
                    title="Nenhum treino no plano"
                    description="Crie o primeiro treino para preparar esta sessão."
                  />
                )}
                <AppButton title="Criar novo treino +" tone="ghost" onPress={onCreate} />
              </ScrollView>
              <View style={[UI.footer, { paddingBottom: Math.max(insets.bottom, 16), gap: 10 }]}>
                <AppButton
                  title={'Confirmar seleção (' + selectedIds.length + ')'}
                  onPress={onConfirm}
                />
                <AppButton title="Cancelar" tone="ghost" onPress={onClose} />
              </View>
            </>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
};
const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: '#17324680', justifyContent: 'flex-end' },
  sheet: {
    height: '90%',
    backgroundColor: Colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  close: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 18,
    padding: 16,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  selected: { borderColor: Colors.primaryDark, backgroundColor: '#EFF9FF' },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: Colors.gray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: { fontSize: 16, lineHeight: 23, color: Colors.text, fontWeight: '600' },
});
