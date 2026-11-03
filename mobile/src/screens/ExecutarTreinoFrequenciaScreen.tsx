import React, { useRef, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Alert, Platform } from 'react-native';
import { treinoService } from '../services/treinoService';
import { getApiErrorMessage } from '../services/getApiErrorMessage';
import { FormField, FormScreen } from '../components/FormScreen';
import { AppButton, Badge, SectionHeading } from '../components/ScreenUI';
import { useUnsavedChanges } from '../hooks/useUnsavedChanges';
import { isValidScore } from '../utils/presentation';
import { Colors } from '../theme/colors';
import { UI } from '../theme/styles';
type Resultado = 'semAjuda' | 'comAjuda' | 'naoExecutado';
const choices: { result: Resultado; label: string; color: string; background: string }[] = [
  {
    result: 'semAjuda',
    label: 'Executou sem ajuda',
    color: Colors.success,
    background: Colors.successSoft,
  },
  {
    result: 'comAjuda',
    label: 'Executou com ajuda',
    color: Colors.warning,
    background: Colors.warningSoft,
  },
  {
    result: 'naoExecutado',
    label: 'Não executou',
    color: Colors.danger,
    background: Colors.dangerSoft,
  },
];
const ExecutarTreinoFrequenciaScreen = ({ route, navigation }: any) => {
  const { sessaoId, treinoId } = route.params;
  const [tentativas, setTentativas] = useState<Resultado[]>([]);
  const [observacoes, setObservacoes] = useState('');
  const [score, setScore] = useState('');
  const [saving, setSaving] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const lock = useRef(false);
  const permitExit = useUnsavedChanges(tentativas.length > 0 || !!observacoes || !!score, saving);
  const salvar = async () => {
    if (lock.current) return;
    if (!tentativas.length) {
      Alert.alert('Registre uma tentativa', 'Selecione o resultado de pelo menos uma tentativa.');
      return;
    }
    if (!isValidScore(score)) {
      Alert.alert('Confira o score', 'Informe um número inteiro válido.');
      return;
    }
    lock.current = true;
    setSaving(true);
    try {
      const treinoSessao = await treinoService.iniciarTreinoSessao(sessaoId, treinoId);
      await treinoService.registroFrequencia(
        treinoSessao.id,
        tentativas.filter((item) => item === 'semAjuda').length,
        tentativas.filter((item) => item === 'comAjuda').length,
        tentativas.filter((item) => item === 'naoExecutado').length,
      );
      await treinoService.encerrarTreinoSessao(treinoSessao.id, observacoes.trim(), Number(score));
      permitExit();
      navigation.goBack();
    } catch (err) {
      Alert.alert(
        'Não foi possível salvar',
        getApiErrorMessage(err, 'Seus dados continuam nesta tela. Tente novamente.'),
      );
    } finally {
      lock.current = false;
      setSaving(false);
    }
  };
  const visible = showAll ? tentativas : tentativas.slice(-5);
  return (
    <FormScreen>
      <Text style={UI.eyebrow}>REGISTRO DE FREQUÊNCIA</Text>
      <Text style={UI.title}>Uma tentativa por vez</Text>
      <View style={styles.attempt}>
        <Badge>Próxima tentativa</Badge>
        <Text style={styles.number}>{tentativas.length + 1}</Text>
        <Text style={[UI.body, { textAlign: 'center' }]}>
          Toque no resultado observado para registrar.
        </Text>
      </View>
      <View style={{ gap: 10 }}>
        {choices.map((choice) => (
          <Pressable
            key={choice.result}
            accessibilityRole="button"
            disabled={saving}
            accessibilityState={{ disabled: saving }}
            onPress={() => setTentativas((prev) => [...prev, choice.result])}
            style={({ pressed }) => [
              styles.result,
              {
                backgroundColor: choice.background,
                borderColor: choice.color,
                opacity: saving ? 0.5 : pressed ? 0.75 : 1,
              },
            ]}
          >
            <View style={[styles.dot, { backgroundColor: choice.color }]} />
            <Text style={[styles.resultText, { color: choice.color }]}>{choice.label}</Text>
            <Text style={[styles.count, { color: choice.color }]}>
              {tentativas.filter((item) => item === choice.result).length}
            </Text>
          </Pressable>
        ))}
      </View>
      <SectionHeading title="Tentativas registradas" count={tentativas.length} />
      {!!tentativas.length && (
        <>
          <AppButton
            title="Desfazer última tentativa"
            tone="ghost"
            disabled={saving}
            onPress={() => setTentativas((prev) => prev.slice(0, -1))}
          />
          <View style={[UI.card, { padding: 16 }]}>
            {visible.map((result, index) => (
              <View
                key={(showAll ? 0 : Math.max(0, tentativas.length - 5)) + index}
                style={styles.history}
              >
                <Text style={UI.body}>
                  {'#' + ((showAll ? 0 : Math.max(0, tentativas.length - 5)) + index + 1)}
                </Text>
                <Text
                  style={[
                    UI.body,
                    {
                      color: choices.find((choice) => choice.result === result)?.color,
                      flex: 1,
                      textAlign: 'right',
                    },
                  ]}
                >
                  {choices.find((choice) => choice.result === result)?.label}
                </Text>
              </View>
            ))}
          </View>
          {tentativas.length > 5 && (
            <AppButton
              title={showAll ? 'Mostrar últimas 5' : 'Ver todas as tentativas'}
              tone="ghost"
              onPress={() => setShowAll((prev) => !prev)}
            />
          )}
        </>
      )}
      {!tentativas.length && <Text style={UI.body}>Nenhuma tentativa registrada ainda.</Text>}
      <FormField
        label="Observações do treino"
        placeholder="Registre respostas, dificuldades e avanços..."
        value={observacoes}
        onChangeText={setObservacoes}
        multiline
        editable={!saving}
      />
      <FormField
        label="Score do treino *"
        hint="Valor inteiro informado pela clínica."
        placeholder="Ex.: 85"
        value={score}
        onChangeText={setScore}
        keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'numeric'}
        editable={!saving}
        returnKeyType="done"
      />
      <AppButton
        title={saving ? 'Salvando...' : 'Finalizar treino'}
        loading={saving}
        onPress={salvar}
      />
    </FormScreen>
  );
};
const styles = StyleSheet.create({
  attempt: {
    backgroundColor: Colors.primarySoft,
    padding: 22,
    borderRadius: 26,
    gap: 10,
    alignItems: 'center',
  },
  number: {
    fontSize: 60,
    lineHeight: 72,
    fontWeight: '700',
    color: Colors.primaryDark,
    fontVariant: ['tabular-nums'],
  },
  result: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 17,
    minHeight: 60,
    borderRadius: 18,
    borderWidth: 1,
  },
  resultText: { fontSize: 15, lineHeight: 22, fontWeight: '700', flex: 1 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  count: { fontSize: 19, fontWeight: '700' },
  history: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 },
});
export default ExecutarTreinoFrequenciaScreen;
