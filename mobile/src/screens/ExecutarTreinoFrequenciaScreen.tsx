
import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { treinoService } from '../services/treinoService';
import { getApiErrorMessage } from '../services/getApiErrorMessage';
import { Colors } from '../theme/colors';

type ResultadoTentativa = 'semAjuda' | 'comAjuda' | 'naoExecutado';

const ExecutarTreinoFrequenciaScreen = ({ route, navigation }: any) => {
  const { sessaoId, treinoId } = route.params;

  const [tentativas, setTentativas] = useState<ResultadoTentativa[]>([]);

  const [observacoes, setObservacoes] = useState('');
  const [score, setScore] = useState('');
  const [saving, setSaving] = useState(false);

  const numeroTentativa = tentativas.length + 1;
  const handleRegistrarTentativa = (resultado: ResultadoTentativa) => {
    setTentativas(prev => [...prev, resultado]);
  };

  const handleSalvar = async () => {
    if (tentativas.length === 0) {
      Alert.alert('Atenção', 'Registre pelo menos uma tentativa.');
      return;
    }

    if (!score.trim() || isNaN(Number(score))) {
      Alert.alert('Erro', 'Informe um score numérico válido.');
      return;
    }

    if (
      !Number.isInteger(Number(score)) ||
      Number(score) < 0 ||
      Number(score) > 100
    ) {
      Alert.alert(
        'Erro',
        'O score deve ser um número inteiro entre 0 e 100.',
      );
      return;
    }
    const execSemAjuda = tentativas.filter(
      resultado => resultado === 'semAjuda',
    ).length;

    const execComAjuda = tentativas.filter(
      resultado => resultado === 'comAjuda',
    ).length;

    const naoExecutado = tentativas.filter(
      resultado => resultado === 'naoExecutado',
    ).length;

    setSaving(true);

    try {
      const ts = await treinoService.iniciarTreinoSessao(
        sessaoId,
        treinoId,
      );

      await treinoService.registroFrequencia(
        ts.id,
        execSemAjuda,
        execComAjuda,
        naoExecutado,
      );

      await treinoService.encerrarTreinoSessao(
        ts.id,
        observacoes,
        Number(score),
      );

      Alert.alert('Sucesso', 'Treino finalizado e salvo!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert(
        'Erro',
        getApiErrorMessage(error, 'Não foi possível salvar o treino.'),
      );
    } finally {
      setSaving(false);
    }
  };

  const opcoes = [
    {
      resultado: 'semAjuda' as const,
      texto: 'Executou sem ajuda',
      estilo: styles.btnGreen,
    },
    {
      resultado: 'comAjuda' as const,
      texto: 'Executou com ajuda',
      estilo: styles.btnYellow,
    },
    {
      resultado: 'naoExecutado' as const,
      texto: 'Não executou',
      estilo: styles.btnRed,
    },
  ];

  const nomeResultado = (resultado: ResultadoTentativa) => {
    switch (resultado) {
      case 'semAjuda':
        return 'Executou sem ajuda';
      case 'comAjuda':
        return 'Executou com ajuda';
      case 'naoExecutado':
        return 'Não executou';
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Registro de Frequência</Text>

        <View style={styles.attemptCard}>
          <Text style={styles.attemptLabel}>Tentativa atual</Text>
          <Text style={styles.attemptNumber}>{numeroTentativa}</Text>
          <Text style={styles.description}>
            Selecione o resultado para avançar para a próxima tentativa.
          </Text>
        </View>

        <View style={styles.buttonsContainer}>
          {opcoes.map(opcao => (
            <TouchableOpacity
              key={opcao.resultado}
              style={[styles.btn, opcao.estilo]}
              onPress={() => handleRegistrarTentativa(opcao.resultado)}
              disabled={saving}
              activeOpacity={0.75}
            >
              <Text style={styles.btnText}>{opcao.texto}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.summary}>
          <Text style={styles.sectionTitle}>
            Tentativas registradas: {tentativas.length}
          </Text>

          {tentativas.length === 0 ? (
            <Text style={styles.emptyText}>
              Nenhuma tentativa registrada ainda.
            </Text>
          ) : (
            tentativas.map((resultado, index) => (
              <View key={index} style={styles.historyItem}>
                <Text style={styles.historyNumber}>
                  Tentativa {index + 1}
                </Text>
                <Text style={styles.historyResult}>
                  {nomeResultado(resultado)}
                </Text>
              </View>
            ))
          )}
        </View>

        <TextInput
          style={[styles.input, styles.observationsInput]}
          placeholder="Observações do treino"
          value={observacoes}
          onChangeText={setObservacoes}
          multiline
        />

        <TextInput
          style={styles.input}
          placeholder="Score (%)"
          value={score}
          onChangeText={setScore}
          keyboardType="numeric"
        />

        <TouchableOpacity
          style={[styles.saveBtn, saving && styles.disabledButton]}
          onPress={handleSalvar}
          disabled={saving}
          activeOpacity={0.8}
        >
          <Text style={styles.saveText}>
            {saving ? 'SALVANDO...' : 'FINALIZAR TREINO'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flexGrow: 1,
    backgroundColor: Colors.background,
    padding: 16,
    paddingBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  attemptCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  attemptLabel: {
    fontSize: 16,
    color: Colors.text,
  },
  attemptNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.primary,
    marginVertical: 4,
  },
  description: {
    fontSize: 13,
    color: Colors.text,
    textAlign: 'center',
  },
  buttonsContainer: {
    gap: 10,
    marginBottom: 20,
  },
  btn: {
    paddingVertical: 13,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  btnGreen: {
    backgroundColor: Colors.success,
  },
  btnYellow: {
    backgroundColor: Colors.warning,
  },
  btnRed: {
    backgroundColor: Colors.danger,
  },
  btnText: {
    fontSize: 16,
    color: Colors.surface,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  summary: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.text,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 9,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 8,
  },
  historyNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  historyResult: {
    fontSize: 13,
    color: Colors.text,
    flexShrink: 1,
    textAlign: 'right',
  },
  input: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    fontSize: 16,
    color: Colors.text,
  },
  observationsInput: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  saveBtn: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  disabledButton: {
    opacity: 0.55,
  },
  saveText: {
    color: Colors.surface,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ExecutarTreinoFrequenciaScreen;
