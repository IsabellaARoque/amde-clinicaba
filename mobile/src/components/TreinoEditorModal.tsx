import React, { useEffect, useRef, useState } from 'react';
import { Modal, View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Categoria, Treino } from '../types';
import { planoService } from '../services/planoService';
import { categoriaService } from '../services/categoriaService';
import { getApiErrorMessage } from '../services/getApiErrorMessage';
import { FormScreen, FormField } from './FormScreen';
import { AppButton, ErrorNotice } from './ScreenUI';
import { Icon } from './Icon';
import { Colors } from '../theme/colors';
import { UI } from '../theme/styles';
interface EditorProps {
  planoId: number;
  onClose: () => void;
  onCreated: (treino: Treino) => void;
  closeRef?: { current: (() => void) | null };
}
export const TreinoEditor = ({ planoId, onClose, onCreated, closeRef }: EditorProps) => {
  const [nome, setNome] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [atividade, setAtividade] = useState('');
  const [medicao, setMedicao] = useState<'FREQUENCIA' | 'DURACAO'>('FREQUENCIA');
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaId, setCategoriaId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [categoryError, setCategoryError] = useState(false);
  const loadCategorias = async () => {
    setCategoryError(false);
    try {
      setCategorias(await categoriaService.getCategorias());
    } catch {
      setCategoryError(true);
    }
  };
  useEffect(() => {
    void loadCategorias();
  }, []);
  const close = () => {
    if (saving) return;
    if (nome.trim() || objetivo.trim() || atividade.trim())
      Alert.alert('Descartar novo treino?', 'O treino ainda não foi salvo.', [
        { text: 'Continuar editando', style: 'cancel' },
        { text: 'Descartar', style: 'destructive', onPress: onClose },
      ]);
    else onClose();
  };
  useEffect(() => {
    if (closeRef) closeRef.current = close;
    return () => {
      if (closeRef) closeRef.current = null;
    };
  });
  const save = async () => {
    if (saving) return;
    if (!nome.trim()) {
      setError('Informe um nome para o treino.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const treino = await planoService.criarTreino(planoId, {
        nome: nome.trim(),
        objetivo: objetivo.trim(),
        atividade: atividade.trim(),
        medicao,
        categoriaId,
      });
      onCreated(treino);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Não foi possível criar o treino.'));
    } finally {
      setSaving(false);
    }
  };
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={[UI.heading, { flex: 1 }]}>Criar novo treino</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Fechar criação de treino"
          onPress={close}
          disabled={saving}
          style={styles.close}
        >
          <Icon name="close" size={28} />
        </Pressable>
      </View>
      <FormScreen headerOffset={0}>
        <Text style={UI.body}>
          O treino será adicionado ao plano e poderá ser usado nas próximas sessões.
        </Text>
        {!!error && <ErrorNotice message={error} />}
        <FormField
          label="Nome do treino *"
          value={nome}
          onChangeText={setNome}
          editable={!saving}
          placeholder="Ex.: Comunicação verbal"
          maxLength={150}
        />
        <FormField
          label="Objetivo"
          value={objetivo}
          onChangeText={setObjetivo}
          editable={!saving}
          multiline
          placeholder="Qual habilidade será trabalhada?"
        />
        <FormField
          label="Atividade"
          value={atividade}
          onChangeText={setAtividade}
          editable={!saving}
          multiline
          placeholder="Descreva como executar o treino"
        />
        <View>
          <Text style={UI.label}>Tipo de medição</Text>
          <View style={UI.wrap}>
            {(['FREQUENCIA', 'DURACAO'] as const).map((tipo) => (
              <Pressable
                key={tipo}
                accessibilityRole="radio"
                accessibilityState={{ checked: medicao === tipo, disabled: saving }}
                disabled={saving}
                onPress={() => setMedicao(tipo)}
                style={[styles.choice, medicao === tipo && styles.selected]}
              >
                <Text style={styles.choiceText}>
                  {tipo === 'FREQUENCIA' ? 'Frequência' : 'Duração'}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
        <View>
          <Text style={UI.label}>Categoria (opcional)</Text>
          {categoryError ? (
            <ErrorNotice
              message="As categorias não foram carregadas. Você pode tentar novamente ou salvar sem categoria."
              onRetry={loadCategorias}
            />
          ) : (
            <View style={UI.wrap}>
              {[{ id: null, nome: 'Sem categoria' }, ...categorias].map((categoria) => (
                <Pressable
                  key={String(categoria.id)}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: categoriaId === categoria.id, disabled: saving }}
                  disabled={saving}
                  onPress={() => setCategoriaId(categoria.id)}
                  style={[styles.choice, categoriaId === categoria.id && styles.selected]}
                >
                  <Text style={styles.choiceText}>{categoria.nome}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>
        <AppButton
          title={saving ? 'Salvando...' : 'Salvar treino'}
          loading={saving}
          onPress={save}
        />
        <AppButton title="Cancelar" tone="ghost" disabled={saving} onPress={close} />
      </FormScreen>
    </View>
  );
};
export const TreinoEditorModal = ({ visible, ...props }: EditorProps & { visible: boolean }) => {
  const closeRef = useRef<(() => void) | null>(null);
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={() => closeRef.current?.()}
    >
      <SafeAreaView style={styles.overlay} edges={['top']}>
        <View style={styles.sheet} accessibilityViewIsModal>
          {visible && <TreinoEditor {...props} closeRef={closeRef} />}
        </View>
      </SafeAreaView>
    </Modal>
  );
};
const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: '#17324680', justifyContent: 'flex-end' },
  sheet: {
    height: '94%',
    backgroundColor: Colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  close: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: Colors.lightGray,
  },
  choice: {
    minHeight: 46,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  selected: { borderColor: Colors.primaryDark, backgroundColor: Colors.primarySoft },
  choiceText: { color: Colors.text, fontSize: 14, fontWeight: '600' },
});
