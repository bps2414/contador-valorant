## Capability: earnings-counter

### Requirements

#### REQ-EC-001: Contadores independentes por categoria
O sistema SHALL manter quatro contadores independentes: `wins`, `elos`, `mvpEquipe` e `mvpPartida`. Cada contador SHALL iniciar em zero e SHALL aceitar operações de incremento e decremento. Nenhum contador SHALL assumir valor negativo — decrementar quando valor é zero SHALL ser ignorado.

**Scenarios:**
- Dado que `wins = 0`, quando o usuário decrementa, então `wins` permanece `0`
- Dado que `elos = 5`, quando o usuário incrementa +1, então `elos = 6`

#### REQ-EC-002: Cálculo em tempo real
O sistema SHALL calcular subtotais e total geral em tempo real após cada mutação de contador, usando a fórmula:
- `subtotalWins = wins × 3`
- `subtotalElos = elos × 10`
- `subtotalMvpEquipe = mvpEquipe × 1`
- `subtotalMvpPartida = mvpPartida × 2`
- `total = subtotalWins + subtotalElos + subtotalMvpEquipe + subtotalMvpPartida`

**Scenarios:**
- Dado `wins=2, elos=1, mvpEquipe=0, mvpPartida=1`, o total SHALL ser `2×3 + 1×10 + 0×1 + 1×2 = 18`

#### REQ-EC-003: Botões de incremento por categoria
O sistema SHALL oferecer botões +1 e -1 para todas as categorias. O botão +5 SHALL existir apenas para Wins e Elos. MVP Equipe e MVP Partida SHALL suportar somente ações de `+1` e `-1`.

**Scenarios:**
- Wins e Elos exibem botões +1, -1, +5
- MVP Equipe exibe apenas +1 e -1
- MVP Partida exibe apenas +1 e -1
- MVP não oferece incremento em 5: dado que `mvpEquipe = 3`, quando o usuário tenta +5, a ação não existe na interface

#### REQ-EC-004: Destaque do maior contribuinte
O sistema SHALL calcular qual categoria tem o maior subtotal e SHALL aplicar destaque visual especial (borda glow) nesse card. Em caso de empate, SHALL prevalecer a categoria de maior posição na ordem de exibição (Wins > Elos > MVP Equipe > MVP Partida).

**Scenarios:**
- Dado `subtotalWins=30`, `subtotalElos=20`, o card Wins SHALL ter borda glow especial

#### REQ-EC-005: Atalhos de teclado para incremento rápido
O sistema SHALL suportar atalhos de teclado globais para incremento +1 das categorias principais. Os atalhos SHALL ser ignorados quando o foco estiver em um campo editável (input, textarea, [contenteditable]).

**Mapa de atalhos**:
- `W` → +1 Win
- `E` → +1 Elo
- `Q` → +1 MVP Equipe
- `R` → +1 MVP Partida

**Scenarios:**
- Dado que nenhum campo de texto tem foco, quando o usuário pressiona `W`, então `wins` incrementa em +1
- Dado que nenhum campo de texto tem foco, quando o usuário pressiona `E`, então `elos` incrementa em +1
- Dado que nenhum campo de texto tem foco, quando o usuário pressiona `Q`, então `mvpEquipe` incrementa em +1
- Dado que nenhum campo de texto tem foco, quando o usuário pressiona `R`, então `mvpPartida` incrementa em +1
- Dado que um input tem foco, quando o usuário pressiona `W`, nenhuma ação de contador é disparada
