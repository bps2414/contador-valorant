## Capability: action-history-undo

### Requirements

#### REQ-AH-001: Registro de histórico de ações
O sistema SHALL registrar cada ação de incremento e decremento no histórico com: id único, descrição legível (ex: "+1 Win"), categoria, delta, timestamp ISO 8601 e snapshot do estado anterior (`stateBefore`) para possibilitar undo.

**Scenarios:**
- Dado que o usuário incrementa Wins, uma entrada com `action: "+1 Win"` é adicionada ao topo do histórico

#### REQ-AH-002: Desfazer a última ação (undo)
O sistema SHALL permitir desfazer a última ação registrada via botão "Desfazer" e via atalho `Ctrl+Z` (Windows/Linux) ou `Cmd+Z` (macOS). Ao desfazer, o estado dos contadores SHALL ser restaurado ao snapshot `stateBefore` da entrada removida.

**Scenarios:**
- Dado `wins=3` e histórico com entrada `stateBefore: {wins:2}`, quando undo é executado, `wins` volta a `2`
- Dado histórico vazio, o botão "Desfazer" SHALL estar desabilitado
- Undo por atalho de teclado: dado foco fora de campo editável, quando `Ctrl+Z` é pressionado e histórico não vazio, a última ação é desfeita

#### REQ-AH-003: Reset é irreversível via undo
A ação de reset (zerar tudo) SHALL limpar completamente o histórico, de modo que não é possível desfazê-la via undo.

**Scenarios:**
- Dado `wins=5` e histórico com 3 entradas, quando reset é confirmado, contadores vão a zero e histórico fica vazio
- Após reset, botão "Desfazer" está desabilitado e `Ctrl+Z` não produz efeito; o reset não pode ser revertido por undo

#### REQ-AH-004: Limites de histórico como constantes internas
O sistema SHALL manter no máximo `RETAINED_HISTORY_LIMIT = 500` entradas no histórico em memória e SHALL exibir no painel apenas as últimas `VISIBLE_HISTORY_LIMIT = 20` entradas. Ambos os limites SHALL ser definidos como constantes internas de código e SHALL não ser configuráveis por usuário.

**Scenarios:**
- Dado 501 ações, o histórico em memória mantém apenas as 500 mais recentes
- O painel de histórico exibe no máximo 20 itens independentemente do tamanho do stack retido
- Limites internos não configuráveis: `VISIBLE_HISTORY_LIMIT = 20` e `RETAINED_HISTORY_LIMIT = 500` existem como constantes no código-fonte; não há UI ou configuração para alterá-los
