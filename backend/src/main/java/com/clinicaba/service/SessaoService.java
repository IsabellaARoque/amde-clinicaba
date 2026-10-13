package com.clinicaba.service;

import com.clinicaba.dto.request.*;
import com.clinicaba.dto.response.*;
import com.clinicaba.entity.*;
import com.clinicaba.enums.TipoMedicao;
import com.clinicaba.exception.BusinessException;
import com.clinicaba.exception.ResourceNotFoundException;
import com.clinicaba.exception.UnauthorizedException;
import com.clinicaba.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SessaoService {

    private final SessaoRepository sessaoRepository;
    private final TreinoSessaoRepository treinoSessaoRepository;
    private final RegistroTreinoFrequenciaRepository freqRepository;
    private final RegistroTreinoDuracaoRepository durRepository;
    private final ScorePorCategoriaRepository scoreRepository;
    private final PlanoIntervencaoService planoService;
    private final ProfissionalService profissionalService;
    private final AssistidoService assistidoService;
    private final TreinoService treinoService;

    public SessaoResponse iniciarSessao(Long assistidoId, IniciarSessaoRequest request) {
        Assistido assistido = assistidoService.findById(assistidoId);
        PlanoIntervencao plano = planoService.findById(request.getPlanoIntervencaoId());
        Profissional profissional = profissionalService.getCurrentUser();

        Sessao sessao = Sessao.builder()
                .assistido(assistido)
                .planoIntervencao(plano)
                .profissional(profissional)
                .data(LocalDate.now())
                .horaInicio(LocalTime.now())
                .score(0)
                .build();
        return mapToResponse(sessaoRepository.save(sessao));
    }

    public void configurarSessao(Long sessaoId, ConfigurarSessaoRequest request) {
        Sessao sessao = findById(sessaoId);
        validarPropriedade(sessao);
        
        for (Long treinoId : request.getTreinoIds()) {
            Treino treino = treinoService.findById(treinoId);
            TreinoSessao ts = TreinoSessao.builder()
                    .sessao(sessao)
                    .treino(treino)
                    .build();
            treinoSessaoRepository.save(ts);
        }
    }

    public TreinoSessaoResponse iniciarTreinoSessao(Long sessaoId, Long treinoId) {
        Sessao sessao = findById(sessaoId);
        validarPropriedade(sessao);
        if (sessao.getHoraFim() != null) {
            throw new BusinessException("Não é possível adicionar treinos a uma sessão encerrada");
        }

        Treino treino = treinoService.findById(treinoId);
        if (!treino.getPlanoIntervencao().getId().equals(sessao.getPlanoIntervencao().getId())) {
            throw new BusinessException("O treino não pertence ao plano desta sessão");
        }

        TreinoSessao treinoSessao = treinoSessaoRepository
                .findBySessaoIdAndTreinoId(sessaoId, treinoId)
                .orElseGet(() -> treinoSessaoRepository.save(TreinoSessao.builder()
                        .sessao(sessao)
                        .treino(treino)
                        .build()));
        return mapToTreinoSessaoResponse(treinoSessao);
    }

    public void registrarFrequencia(Long treinoSessaoId, RegistroFrequenciaRequest request) {
        TreinoSessao ts = treinoSessaoRepository.findById(treinoSessaoId)
                .orElseThrow(() -> new ResourceNotFoundException("Treino Sessão não encontrado"));
        validarPropriedade(ts.getSessao());
        if (ts.getTreino().getMedicao() != TipoMedicao.FREQUENCIA) {
            throw new BusinessException("Treino não é do tipo FREQUENCIA");
        }
        
        RegistroTreinoFrequencia reg = freqRepository.findByTreinoSessaoId(treinoSessaoId)
                .orElseGet(() -> RegistroTreinoFrequencia.builder().treinoSessao(ts).build());
        reg.setExecSemAjuda(request.getExecSemAjuda());
        reg.setExecComAjuda(request.getExecComAjuda());
        reg.setNaoExecutado(request.getNaoExecutado());
        freqRepository.save(reg);
    }

    public void registrarDuracao(Long treinoSessaoId, RegistroDuracaoRequest request) {
        TreinoSessao ts = treinoSessaoRepository.findById(treinoSessaoId)
                .orElseThrow(() -> new ResourceNotFoundException("Treino Sessão não encontrado"));
        validarPropriedade(ts.getSessao());
        if (ts.getTreino().getMedicao() != TipoMedicao.DURACAO) {
            throw new BusinessException("Treino não é do tipo DURACAO");
        }
        
        RegistroTreinoDuracao reg = durRepository.findByTreinoSessaoId(treinoSessaoId)
                .orElseGet(() -> RegistroTreinoDuracao.builder().treinoSessao(ts).build());
        reg.setDuracao(request.getDuracao());
        durRepository.save(reg);
    }

    public void encerrarTreinoSessao(Long treinoSessaoId, EncerrarTreinoSessaoRequest request) {
        TreinoSessao ts = treinoSessaoRepository.findById(treinoSessaoId)
                .orElseThrow(() -> new ResourceNotFoundException("Treino Sessão não encontrado"));
        validarPropriedade(ts.getSessao());
        
        Integer previousScore = ts.getScore();
        ts.setScore(request.getScore());
        ts.setObservacoes(request.getObservacoes());
        treinoSessaoRepository.save(ts);
        
        // Update ScorePorCategoria
        Categoria cat = ts.getTreino().getCategoriaTreino();
        if (cat != null && request.getScore() != null) {
            Optional<ScorePorCategoria> scoreOpt = scoreRepository.findByAssistidoIdAndCategoriaId(
                    ts.getSessao().getAssistido().getId(), cat.getId());
            ScorePorCategoria scoreCat = scoreOpt.orElse(ScorePorCategoria.builder()
                    .assistido(ts.getSessao().getAssistido())
                    .categoria(cat)
                    .valor(0.0)
                    .build());
            scoreCat.setValor(scoreCat.getValor() + request.getScore() - (previousScore != null ? previousScore : 0));
            scoreRepository.save(scoreCat);
        }
    }

    public void encerrarSessao(Long sessaoId, EditarSessaoRequest request) {
        Sessao sessao = findById(sessaoId);
        validarPropriedade(sessao);
        sessao.setHoraFim(LocalTime.now());
        sessao.setObservacoes(request.getObservacoes());
        if (request.getScore() != null) {
            sessao.setScore(request.getScore());
        }
        sessaoRepository.save(sessao);
    }

    public void editarSessao(Long sessaoId, EditarSessaoRequest request) {
        Sessao sessao = findById(sessaoId);
        validarPropriedade(sessao);
        
        if (sessao.getHoraFim() != null) {
            LocalDate yesterday = LocalDate.now().minusDays(1);
            if (sessao.getData().isBefore(yesterday)) {
                throw new BusinessException("Sessão só pode ser editada até 24h após encerrada");
            }
        }
        
        sessao.setObservacoes(request.getObservacoes());
        if(request.getScore() != null) sessao.setScore(request.getScore());
        sessaoRepository.save(sessao);
    }

    public Sessao findById(Long id) {
        return sessaoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sessão não encontrada"));
    }

    public SessaoResponse buscarPorId(Long id) {
        return mapToResponse(findById(id));
    }

    public List<SessaoResumoResponse> listarPorAssistido(Long assistidoId) {
        return sessaoRepository.findByAssistidoId(assistidoId).stream()
                .map(this::mapToResumoResponse).collect(Collectors.toList());
    }

    private void validarPropriedade(Sessao sessao) {
        Profissional atual = profissionalService.getCurrentUser();
        if (!sessao.getProfissional().getId().equals(atual.getId())) {
            throw new UnauthorizedException("Apenas o profissional responsável pode modificar esta sessão");
        }
    }

    private SessaoResponse mapToResponse(Sessao s) {
        SessaoResponse r = new SessaoResponse();
        r.setId(s.getId());
        r.setData(s.getData());
        r.setHoraInicio(s.getHoraInicio());
        r.setHoraFim(s.getHoraFim());
        r.setScore(s.getScore());
        r.setObservacoes(s.getObservacoes());
        r.setAssistidoId(s.getAssistido().getId());
        r.setAssistidoNome(s.getAssistido().getNome());
        r.setPlanoIntervencaoId(s.getPlanoIntervencao().getId());
        r.setPlanoNome(s.getPlanoIntervencao().getNome());

        ProfissionalResponse profissional = new ProfissionalResponse();
        profissional.setId(s.getProfissional().getId());
        profissional.setCpf(s.getProfissional().getCpf());
        profissional.setNome(s.getProfissional().getNome());
        profissional.setEmail(s.getProfissional().getEmail());
        r.setProfissional(profissional);

        PlanoIntervencaoResponse plano = new PlanoIntervencaoResponse();
        plano.setId(s.getPlanoIntervencao().getId());
        plano.setNome(s.getPlanoIntervencao().getNome());
        plano.setDataCriacao(s.getPlanoIntervencao().getDataCriacao());
        plano.setObjetivo(s.getPlanoIntervencao().getObjetivo());
        plano.setStatus(s.getPlanoIntervencao().getStatus());
        plano.setProfissionalCriador(profissional);
        r.setPlanoIntervencao(plano);

        AssistidoResumoResponse assistido = new AssistidoResumoResponse();
        assistido.setId(s.getAssistido().getId());
        assistido.setNome(s.getAssistido().getNome());
        assistido.setCpf(s.getAssistido().getCpf());
        r.setAssistido(assistido);

        List<TreinoSessaoResponse> treinos = treinoSessaoRepository.findBySessaoId(s.getId()).stream()
                .map(this::mapToTreinoSessaoResponse)
                .collect(Collectors.toList());
        r.setTreinos(treinos);
        r.setTreinosSessao(treinos);
        return r;
    }

    private TreinoSessaoResponse mapToTreinoSessaoResponse(TreinoSessao treinoSessao) {
        TreinoSessaoResponse response = new TreinoSessaoResponse();
        response.setId(treinoSessao.getId());
        response.setTreino(treinoService.mapToResponse(treinoSessao.getTreino()));
        response.setScore(treinoSessao.getScore());
        response.setObservacoes(treinoSessao.getObservacoes());

        freqRepository.findByTreinoSessaoId(treinoSessao.getId()).ifPresent(registro -> {
            RegistroFrequenciaResponse registroResponse = new RegistroFrequenciaResponse();
            registroResponse.setId(registro.getId());
            registroResponse.setExecSemAjuda(registro.getExecSemAjuda());
            registroResponse.setExecComAjuda(registro.getExecComAjuda());
            registroResponse.setNaoExecutado(registro.getNaoExecutado());
            response.setRegistroFrequencia(registroResponse);
        });

        durRepository.findByTreinoSessaoId(treinoSessao.getId()).ifPresent(registro -> {
            RegistroDuracaoResponse registroResponse = new RegistroDuracaoResponse();
            registroResponse.setId(registro.getId());
            registroResponse.setDuracao(registro.getDuracao());
            response.setRegistroDuracao(registroResponse);
        });
        return response;
    }

    private SessaoResumoResponse mapToResumoResponse(Sessao s) {
        SessaoResumoResponse r = new SessaoResumoResponse();
        r.setId(s.getId());
        r.setAssistidoId(s.getAssistido().getId());
        r.setAssistidoNome(s.getAssistido().getNome());
        r.setPlanoIntervencaoId(s.getPlanoIntervencao().getId());
        r.setPlanoNome(s.getPlanoIntervencao().getNome());
        r.setData(s.getData());
        r.setHoraInicio(s.getHoraInicio());
        r.setHoraFim(s.getHoraFim());
        r.setScore(s.getScore());
        r.setProfissionalNome(s.getProfissional().getNome());
        return r;
    }

    public byte[] exportarPdf(Long sessaoId) {
        Sessao sessao = findById(sessaoId);
        String relatorio = "=== CLINICABA - RELATORIO DE SESSAO ===\n"
                + "ID da Sessao: " + sessao.getId() + "\n"
                + "Data: " + sessao.getData() + "\n"
                + "Horario: " + sessao.getHoraInicio() + " - " + (sessao.getHoraFim() != null ? sessao.getHoraFim() : "Em andamento") + "\n"
                + "Assistido: " + sessao.getAssistido().getNome() + " (CPF: " + sessao.getAssistido().getCpf() + ")\n"
                + "Profissional: " + sessao.getProfissional().getNome() + "\n"
                + "Score Final: " + sessao.getScore() + "\n"
                + "Observacoes: " + (sessao.getObservacoes() != null ? sessao.getObservacoes() : "Nenhuma") + "\n";

        // Minimal valid PDF structure embedding the text
        String streamContent = "BT /F1 12 Tf 50 750 Td (" + relatorio.replace("\n", ") ' (").replace("(", "\\(").replace(")", "\\)") + ") Tj ET";
        String pdf = "%PDF-1.4\n"
                + "1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj\n"
                + "2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj\n"
                + "3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj\n"
                + "4 0 obj << /Length " + streamContent.getBytes(java.nio.charset.StandardCharsets.UTF_8).length + " >> stream\n"
                + streamContent + "\nendstream\nendobj\n"
                + "5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj\n"
                + "xref\n0 6\n0000000000 65535 f \n0000000010 00000 n \n0000000060 00000 n \n0000000117 00000 n \n0000000234 00000 n \n0000000350 00000 n \n"
                + "trailer << /Size 6 /Root 1 0 R >>\nstartxref\n420\n%%EOF";
        return pdf.getBytes(java.nio.charset.StandardCharsets.UTF_8);
    }
}
