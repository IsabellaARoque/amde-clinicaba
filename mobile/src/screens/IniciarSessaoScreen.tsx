import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { planoService } from '../services/planoService';
import { assistidoService } from '../services/assistidoService';
import { sessaoService } from '../services/sessaoService';
import { getApiErrorMessage } from '../services/getApiErrorMessage';
import { PlanoIntervencao, Treino } from '../types';
import { Colors } from '../theme/colors';
import { UI } from '../theme/styles';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { TreinoCard } from '../components/TreinoCard';
import { TreinoPickerModal } from '../components/TreinoPickerModal';
import { AppButton, EmptyState, ErrorNotice, SectionHeading } from '../components/ScreenUI';
import { useUnsavedChanges } from '../hooks/useUnsavedChanges';
const IniciarSessaoScreen = ({ route, navigation }: any) => {
  const { assistidoId } = route.params;
  const insets = useSafeAreaInsets();
  const [nome, setNome] = useState('');
  const [planos, setPlanos] = useState<PlanoIntervencao[]>([]);
  const [selectedPlano, setSelectedPlano] = useState<number | null>(null);
  const [treinos, setTreinos] = useState<Treino[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [draftIds, setDraftIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingTreinos, setLoadingTreinos] = useState(false);
  const [error, setError] = useState('');
  const [treinosError, setTreinosError] = useState('');
  const [starting, setStarting] = useState(false);
  const [createdSessionId, setCreatedSessionId] = useState<number | null>(null);
  const [modal, setModal] = useState<'pick' | 'create' | null>(null);
  const lock = useRef(false);
  const permitExit = useUnsavedChanges(
    selectedIds.length > 0 || createdSessionId !== null,
    starting,
  );
  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [paciente, data] = await Promise.all([
        assistidoService.getAssistido(assistidoId),
        planoService.getPlanosByAssistido(assistidoId),
      ]);
      setNome(paciente.nome);
      const ativos = data.filter((p) => p.status === 'ATIVO');
      setPlanos(ativos);
      setSelectedPlano(ativos[0]?.id ?? null);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Não foi possível carregar os planos.'));
    } finally {
      setLoading(false);
    }
  }, [assistidoId]);
  useEffect(() => {
    void load();
  }, [load]);
  useEffect(() => {
    let active = true;
    setTreinos([]);
    setSelectedIds([]);
    setTreinosError('');
    if (selectedPlano === null) return;
    setLoadingTreinos(true);
    planoService
      .getTreinosByPlano(selectedPlano)
      .then((data) => {
        if (active) setTreinos(data);
      })
      .catch((err) => {
        if (active)
          setTreinosError(getApiErrorMessage(err, 'Não foi possível carregar os treinos.'));
      })
      .finally(() => {
        if (active) setLoadingTreinos(false);
      });
    return () => {
      active = false;
    };
  }, [selectedPlano]);
  const iniciar = async () => {
    if (lock.current || !selectedPlano || !selectedIds.length) return;
    lock.current = true;
    setStarting(true);
    let id = createdSessionId;
    try {
      if (id === null) {
        const sessao = await sessaoService.iniciar(assistidoId, selectedPlano);
        id = sessao.id;
        setCreatedSessionId(id);
      }
      // Retry configuration on the same session; never create another session after a partial failure.
      const current = await sessaoService.getSessao(id);
      const configured = new Set(current.treinosSessao?.map((item) => item.treino.id) ?? []);
      const missing = selectedIds.filter((treinoId) => !configured.has(treinoId));
      if (missing.length) await sessaoService.configurar(id, missing);
      permitExit();
      navigation.replace('SessaoEmAndamento', { sessaoId: id });
    } catch (err) {
      Alert.alert(
        'Não foi possível iniciar',
        getApiErrorMessage(
          err,
          id !== null
            ? 'A sessão foi criada. Tente novamente para concluir sua configuração.'
            : 'Não foi possível iniciar a sessão.',
        ),
      );
    } finally {
      lock.current = false;
      setStarting(false);
    }
  };
  const changePlano = (id: number) => {
    if (id === selectedPlano || createdSessionId !== null || starting) return;
    if (selectedIds.length)
      Alert.alert('Trocar plano?', 'Os treinos selecionados serão removidos desta configuração.', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Trocar plano', onPress: () => setSelectedPlano(id) },
      ]);
    else setSelectedPlano(id);
  };
  const selected = treinos.filter((treino) => selectedIds.includes(treino.id));
  const plano = planos.find((item) => item.id === selectedPlano);
  if (loading) return <LoadingSpinner />;
  return (
    <View style={UI.screen}>
      <ScrollView
        contentContainerStyle={[UI.content, { paddingBottom: 24 }]}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={UI.eyebrow}>PREPARAR ATENDIMENTO</Text>
        <Text style={UI.title}>Nova sessão</Text>
        <View style={[UI.card, { backgroundColor: Colors.primarySoft, gap: 8 }]}>
          <Text style={UI.label}>Paciente</Text>
          <Text style={UI.heading}>{nome || 'Paciente'}</Text>
          <Text style={UI.body}>A data e o horário serão registrados ao iniciar a sessão.</Text>
        </View>
        {!!error && <ErrorNotice message={error} onRetry={load} />}
        <SectionHeading title="Plano de intervenção" />
        {!planos.length && !error && (
          <EmptyState
            title="Nenhum plano ativo"
            description="Ative ou cadastre um plano antes de iniciar uma sessão."
          />
        )}
        {planos.map((item) => (
          <Pressable
            key={item.id}
            accessibilityRole="radio"
            accessibilityState={{
              checked: selectedPlano === item.id,
              disabled: starting || createdSessionId !== null,
            }}
            disabled={starting || createdSessionId !== null}
            onPress={() => changePlano(item.id)}
            style={[styles.plan, selectedPlano === item.id && styles.planSelected]}
          >
            <View
              style={[
                styles.radio,
                selectedPlano === item.id && { borderColor: Colors.primaryDark },
              ]}
            >
              {selectedPlano === item.id && <View style={styles.radioDot} />}
            </View>
            <Text style={[UI.label, { flex: 1, marginBottom: 0 }]}>{item.nome}</Text>
          </Pressable>
        ))}
        {plano && (
          <View style={UI.card}>
            <Text style={UI.label}>Objetivo do plano</Text>
            <Text style={UI.body}>{plano.objetivo || 'Não informado'}</Text>
          </View>
        )}
        <SectionHeading title="Treinos da sessão" count={selectedIds.length} />
        {loadingTreinos ? (
          <Text style={UI.body}>Carregando treinos...</Text>
        ) : treinosError ? (
          <ErrorNotice
            message={treinosError}
            onRetry={async () => {
              if (!selectedPlano) return;
              setLoadingTreinos(true);
              try {
                setTreinos(await planoService.getTreinosByPlano(selectedPlano));
                setTreinosError('');
              } catch (err) {
                setTreinosError(getApiErrorMessage(err, 'Não foi possível carregar os treinos.'));
              } finally {
                setLoadingTreinos(false);
              }
            }}
          />
        ) : selected.length ? (
          selected.map((treino) => <TreinoCard key={treino.id} treino={treino} selected />)
        ) : (
          <EmptyState
            title="Nenhum treino selecionado"
            description="Adicione os treinos que serão trabalhados neste atendimento."
          />
        )}
        {selectedPlano !== null && (
          <AppButton
            title="Adicionar ou alterar treinos +"
            disabled={starting || loadingTreinos || !!treinosError || createdSessionId !== null}
            onPress={() => {
              setDraftIds([...selectedIds]);
              setModal('pick');
            }}
          />
        )}
        {createdSessionId !== null && (
          <Text style={UI.body}>
            Sua sessão já foi criada. Toque em iniciar para concluir a configuração.
          </Text>
        )}
      </ScrollView>
      <View style={[UI.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <AppButton
          title={starting ? 'Iniciando...' : 'Iniciar sessão'}
          tone="success"
          loading={starting}
          disabled={!selectedPlano || !selectedIds.length || loadingTreinos || !!treinosError}
          onPress={iniciar}
        />
      </View>
      {selectedPlano !== null && (
        <TreinoPickerModal
          visible={modal !== null}
          creating={modal === 'create'}
          planoId={selectedPlano}
          treinos={treinos}
          selectedIds={draftIds}
          onToggle={(id) =>
            setDraftIds((prev) =>
              prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
            )
          }
          onClose={() => setModal(null)}
          onConfirm={() => {
            setSelectedIds([...draftIds]);
            setModal(null);
          }}
          onCreate={() => setModal('create')}
          onBack={() => setModal('pick')}
          onCreated={(treino) => {
            setTreinos((prev) => [...prev, treino]);
            setDraftIds((prev) => [...prev, treino.id]);
            setModal('pick');
          }}
        />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  plan: {
    padding: 18,
    borderRadius: 18,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 60,
  },
  planSelected: { backgroundColor: '#F0F9FF', borderColor: Colors.primaryDark },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.gray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.primaryDark },
});
export default IniciarSessaoScreen;
