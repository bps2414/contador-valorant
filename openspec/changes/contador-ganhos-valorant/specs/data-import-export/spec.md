## Capability: data-import-export

### Requirements

#### REQ-DE-001: Exportação do estado como JSON
O sistema SHALL permitir exportar o estado atual como arquivo JSON com schema versionado. O arquivo SHALL ser baixado com nome `contador-ganhos-YYYY-MM-DD.json`. O schema SHALL incluir: `version`, `exportedAt`, `state` (contadores + histórico), `totals` (calculados no momento da exportação).

**Scenarios:**
- Dado estado com `wins=5`, quando exportar é acionado, um arquivo JSON válido é baixado
- O nome do arquivo SHALL seguir o padrão `contador-ganhos-YYYY-MM-DD.json`

#### REQ-DE-002: Importação com validação e recomputação
O sistema SHALL permitir importar um arquivo JSON previamente exportado. Antes de aceitar, SHALL validar presença e tipos de campos obrigatórios: `version`, `state.wins`, `state.elos`, `state.mvpEquipe`, `state.mvpPartida` — todos números não-negativos. Em caso de erro de validação, SHALL exibir toast de erro descritivo sem alterar o estado atual.

Após importação bem-sucedida, a aplicação SHALL sempre recomputar subtotais, total geral, maior contribuinte e demais estados derivados a partir dos contadores/histórico importados, sem confiar em `totals` persistidos no arquivo.

**Scenarios:**
- Dado um JSON válido, quando importado, o estado é substituído e totais derivados são recalculados localmente
- Dado JSON malformado, quando o usuário tenta importar, um toast de erro é exibido e estado não muda
- Dado JSON com valores negativos, a importação é rejeitada com mensagem descritiva
- Totais persistidos divergentes não são confiados: dado um arquivo com `totals.total = 999` incorreto, após importação os totais são recalculados corretamente a partir de `state.wins`, `state.elos`, etc.

#### REQ-DE-003: Reset com confirmação
O sistema SHALL exigir confirmação explícita antes de executar o reset, via diálogo modal com botões "Cancelar" e "Resetar". O reset SHALL zerar todos os contadores e limpar o histórico completamente.

**Scenarios:**
- Dado o diálogo aberto, quando "Cancelar" é clicado, o estado permanece inalterado
- Dado o diálogo aberto, quando "Resetar" é clicado, contadores vão a zero e histórico é limpo
