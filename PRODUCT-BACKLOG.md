# Product Backlog — ClinicABA

Atualizado em 2026-11-03. Não contém dados de pacientes nem credenciais.

| ID | Prioridade | Estado | Item | Critério de conclusão |
|---|---|---|---|---|
| PB-01 | P0 | Planejado | Remover credencial padrão fixa do inicializador. | Primeiro acesso usa configuração segura e nenhum segredo aparece em código ou log. |
| PB-02 | P1 | Planejado | Corrigir a janela de edição da sessão. | Regra definida pela clínica e cálculo temporal correspondem exatamente à mensagem e aos testes. |
| PB-03 | P1 | Em validação | Homologar atendimento mobile em aparelho físico. | Checklist de teclado, frequência, duração, retomada e erros executado com evidências sem dados reais. |
| PB-04 | P1 | Planejado | Adicionar testes automatizados do backend. | Regras de propriedade, score por categoria e edição temporal cobertas. |
| PB-05 | P1 | Planejado | Versionar migrações do banco. | Alterações de esquema passam a usar ferramenta de migração e ambiente novo sobe do zero. |
| PB-06 | P2 | Planejado | Configurar URL da API mobile por ambiente. | Troca de rede não exige editar arquivo versionado. |
| PB-07 | P2 | Planejado | Criar testes automatizados do portal. | Login, pesquisa, formulários e sessão possuem cobertura mínima definida. |
| PB-08 | P2 | Em validação | Homologar exportação PDF. | Conteúdo, nome do arquivo, acentuação e layout são aprovados. |
| PB-09 | P2 | Planejado | Revisar tipo persistido do score por categoria. | Decisão de migração entre `Double` e inteiro documentada e executada sem perda. |
| PB-10 | P3 | A esclarecer | Criar gráficos de evolução. | Métrica, período, público e interpretação clínica aprovados antes da implementação. |
| PB-11 | P3 | A esclarecer | Avaliar novos campos clínicos das referências. | Clínica decide quais dados são necessários e autoriza modelo, API e interface. |
| PB-12 | P2 | Planejado | Restringir CORS por ambiente. | Produção aceita apenas origens configuradas e desenvolvimento continua funcional. |
| PB-13 | P1 | A esclarecer | Definir papéis Administrador e Profissional. | Equipe decide a matriz de permissões e API e interfaces passam a aplicá-la. |
| PB-14 | P1 | Planejado | Proteger criação e edição de treinos por propriedade do plano. | Somente profissional autorizado modifica treinos do plano. |
| PB-15 | P2 | A esclarecer | Decidir observações do assistido, do plano e objetivo da sessão. | Clínica confirma os campos e, se aprovados, modelo, API e telas são atualizados. |

## Itens concluídos nesta etapa

- Modernização e acessibilidade básica do mobile.
- Modernização responsiva do portal web.
- Score inteiro manual sem semântica de porcentagem.
- Soma dos scores dos treinos apenas por categoria.
- Score final manual e separado.
- Estrutura documental e rastreabilidade inicial.
