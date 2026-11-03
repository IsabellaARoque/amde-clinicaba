import React, { useCallback, useContext, useEffect, useState } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AuthContext } from '../contexts/AuthContext';
import { sessaoService } from '../services/sessaoService';
import { getApiErrorMessage } from '../services/getApiErrorMessage';
import { Sessao } from '../types';
import { Colors } from '../theme/colors';
import { UI } from '../theme/styles';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { AppButton, Badge, EmptyState, ErrorNotice, SectionHeading } from '../components/ScreenUI';
import { formatClock, formatDate } from '../utils/presentation';
const SessaoDetailScreen = ({ route, navigation }: any) => {
  const { sessaoId } = route.params;
  const { user } = useContext(AuthContext);
  const insets = useSafeAreaInsets();
  const [sessao, setSessao] = useState<Sessao | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setSessao(await sessaoService.getSessao(sessaoId));
    } catch (err) {
      setError(getApiErrorMessage(err, 'Não foi possível carregar a sessão.'));
    } finally {
      setLoading(false);
    }
  }, [sessaoId]);
  useEffect(() => {
    void load();
  }, [load]);
  if (loading && !sessao) return <LoadingSpinner />;
  if (!sessao)
    return (
      <View style={[UI.screen, UI.content]}>
        <EmptyState title="Não foi possível abrir o registro" description={error} onRetry={load} />
      </View>
    );
  const treinos = sessao.treinosSessao ?? [];
  const done = treinos.filter((item) => item.score != null);
  return (
    <ScrollView
      style={UI.screen}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
      contentContainerStyle={[UI.content, { paddingBottom: 28 + insets.bottom }]}
    >
      <View style={[UI.card, { backgroundColor: Colors.primarySoft, gap: 12 }]}>
        <Badge tone={sessao.horaFim ? 'success' : 'warning'}>
          {sessao.horaFim ? 'Sessão encerrada' : 'Em aberto'}
        </Badge>
        <Text style={UI.title}>{sessao.assistidoNome}</Text>
        <Text style={UI.heading}>{formatDate(sessao.data)}</Text>
        <Text style={UI.body}>
          {sessao.horaInicio?.slice(0, 5)} — {sessao.horaFim?.slice(0, 5) || 'Em andamento'}
        </Text>
        <Text style={UI.body}>{sessao.planoNome}</Text>
        <Text style={UI.body}>Profissional: {sessao.profissional?.nome || 'Não informado'}</Text>
      </View>
      {!!error && <ErrorNotice message={error} onRetry={load} />}
      {!sessao.horaFim && sessao.profissional?.id === user?.id && (
        <AppButton
          title="Retomar sessão →"
          tone="accent"
          onPress={() => navigation.replace('SessaoEmAndamento', { sessaoId })}
        />
      )}
      <View style={[UI.card, { gap: 10 }]}>
        <Text style={UI.label}>Score geral</Text>
        <Text style={[UI.title, { color: Colors.primaryDark }]}>
          {sessao.horaFim && sessao.score != null ? sessao.score : 'Ainda não finalizado'}
        </Text>
        <View style={UI.divider} />
        <Text style={UI.label}>Observações gerais</Text>
        <Text style={UI.body}>{sessao.observacoes || 'Nenhuma observação registrada.'}</Text>
      </View>
      <SectionHeading title="Treinos" count={treinos.length} />
      <Text style={UI.body}>{done.length} treino(s) com resultado registrado.</Text>
      {!treinos.length && <EmptyState title="Nenhum treino registrado" />}
      {treinos.map((item) => (
        <View key={item.id} style={[UI.card, { gap: 12 }]}>
          <Text style={UI.heading}>{item.treino.nome}</Text>
          <View style={UI.wrap}>
            <Badge>{item.treino.medicao === 'FREQUENCIA' ? 'Frequência' : 'Duração'}</Badge>
            <Badge tone={item.score != null ? 'success' : 'warning'}>
              {item.score != null ? 'Concluído' : 'Sem resultado final'}
            </Badge>
          </View>
          {item.registroFrequencia && (
            <View style={{ gap: 10 }}>
              <Text style={UI.body}>
                Executou sem ajuda: {item.registroFrequencia.execSemAjuda}
              </Text>
              <Text style={UI.body}>
                Executou com ajuda: {item.registroFrequencia.execComAjuda}
              </Text>
              <Text style={UI.body}>Não executou: {item.registroFrequencia.naoExecutado}</Text>
              <Text style={UI.label}>
                Total de tentativas:{' '}
                {item.registroFrequencia.execSemAjuda +
                  item.registroFrequencia.execComAjuda +
                  item.registroFrequencia.naoExecutado}
              </Text>
            </View>
          )}
          {item.registroDuracao && (
            <Text style={UI.heading}>Duração: {formatClock(item.registroDuracao.duracao)}</Text>
          )}
          <View style={UI.divider} />
          <Text style={UI.label}>Score: {item.score != null ? item.score : 'Não informado'}</Text>
          <Text style={UI.body}>{item.observacoes || 'Nenhuma observação registrada.'}</Text>
        </View>
      ))}
    </ScrollView>
  );
};
export default SessaoDetailScreen;
