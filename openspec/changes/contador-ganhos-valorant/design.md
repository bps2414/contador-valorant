## Context

Aplicação greenfield — não há código existente. O objetivo é construir um web app single-page para controle financeiro de partidas de Valorant, executável inteiramente no browser sem qualquer backend. O usuário precisa de uma interface premium, rápida e intuitiva que calcule ganhos em tempo real com base em wins, elos e bônus de MVP.

Constraints:
- Sem backend, sem autenticação, sem banco de dados remoto
- Stack definida: React 18 + TypeScript + Tailwind CSS + shadcn/ui + Framer Motion + lucide-react
- Build via Vite
- Persistência exclusiva via `localStorage`

## Goals / Non-Goals

**Goals:**
- SPA production-ready com visual premium (dark mode, glassmorphism, animações suaves)
- Cálculo em tempo real: `total = wins*3 + elos*10 + mvpEquipe*1 + mvpPartida*2`
- Histórico de ações com undo, exportação/importação JSON, auto-save no localStorage
- Código limpo, componentizado e tipado com TypeScript
- Responsivo em mobile e desktop

**Non-Goals:**
- Backend, API ou autenticação
- Suporte a múltiplos usuários ou sessões
- Sincronização entre dispositivos
- Modo claro (light mode)
- Internacionalização além do português do Brasil

## Decisions

### 1. Vite como bundler

**Decisão**: Usar Vite em vez de Create React App ou Next.js.

**Rationale**: Vite oferece startup quase instantâneo e HMR muito mais rápido. CRA está descontinuado e Next.js adiciona complexidade de SSR desnecessária para uma SPA pura.

**Alternativas consideradas**: Next.js (overkill), CRA (deprecado), Parcel (menos ecossistema).

---

### 2. Estado global com React Context + useReducer

**Decisão**: Gerenciar o estado com um único `AppContext` usando `useReducer`.

**Estrutura de estado**:
```ts
interface AppState {
  wins: number;
  elos: number;
  mvpEquipe: number;
  mvpPartida: number;
  history: HistoryEntry[];
}

interface HistoryEntry {
  id: string;
  action: string;        // ex: "+1 Win"
  category: Category;
  delta: number;
  timestamp: string;     // ISO 8601
  stateBefore: Counters; // snapshot para undo
}
```

**Actions do reducer**: `INCREMENT`, `DECREMENT`, `RESET`, `UNDO`, `IMPORT`.

**Constantes internas de histórico**:
- `VISIBLE_HISTORY_LIMIT = 20`
- `RETAINED_HISTORY_LIMIT = 500`

As constantes SHALL permanecer internas de código (não configuráveis via UI).

---

### 3. Persistência com localStorage + serialização JSON

**Decisão**: Salvar o estado completo no `localStorage` a cada dispatch.

**Chave utilizada**: `"contador-ganhos-valorant-state"`

---

### 4. Estrutura de componentes

```
src/
├── main.tsx
├── App.tsx
├── context/
│   └── AppContext.tsx
├── components/
│   ├── Header.tsx
│   ├── TotalCard.tsx
│   ├── CategoryCard.tsx
│   ├── QuickActions.tsx
│   ├── ActionHistory.tsx
│   └── Toast.tsx
├── hooks/
│   └── useToast.tsx
├── types/
│   └── index.ts
└── utils/
    ├── calculations.ts
    ├── formatters.ts
    └── storage.ts
```

---

### 5. Design System: Dark Mode com Glassmorphism

**Paleta**:
- Background base: `#0a0a0f`
- Cards: `rgba(255,255,255,0.04)` + border `rgba(255,255,255,0.08)`
- Accent primário: `#7c3aed` (violeta)
- Accent secundário: `#ef4444` (vermelho Valorant)
- Texto primário: `#f1f5f9`
- Texto secundário: `#94a3b8`

**Tipografia**: Inter (via Google Fonts) — weights 400, 500, 600, 700, 800.

---

### 6. Animações com Framer Motion

**Princípio**: Animações devem ser < 300ms, suaves (`ease-out`), e discretas.

**Casos de uso**:
- `AnimatePresence` + `motion.div` para itens do histórico
- `motion.span` com `key={value}` para flip de número nos counters
- `motion.div` com spring para card de total quando valor muda
- `AnimatePresence` para toast notifications

---

### 7. Exportação/Importação JSON

**Schema do arquivo exportado**:
```json
{
  "version": 1,
  "exportedAt": "2026-04-05T12:00:00.000Z",
  "state": {
    "wins": 10,
    "elos": 2,
    "mvpEquipe": 5,
    "mvpPartida": 3,
    "history": [...]
  },
  "totals": {
    "wins": 30,
    "elos": 20,
    "mvpEquipe": 5,
    "mvpPartida": 6,
    "total": 61
  }
}
```

**Regra de recomputação obrigatória**: mesmo que o arquivo importado contenha `totals`, a aplicação SHALL sempre recalcular subtotais, total geral, maior contribuinte e demais estados derivados a partir dos contadores/histórico importados, sem confiar em totais persistidos.

---

### 8. Atalhos de teclado (requisito formal)

**Mapa de atalhos**:
- `W` incrementa Wins em +1
- `E` incrementa Elos em +1
- `Q` incrementa MVP Equipe em +1
- `R` incrementa MVP Partida em +1
- `Ctrl+Z` (Windows/Linux) e `Cmd+Z` (macOS) executam undo

**Regras de interação**:
- Atalhos não SHALL disparar quando o foco estiver em campo de texto/editável
- Reset é irreversível via undo
- +5 EXISTS apenas para Wins e Elos; MVP apenas +1/-1

## Risks / Trade-offs

- **localStorage wipe pelo browser** → Risco baixo; mitigado pela exportação JSON.
- **Limite de localStorage (~5MB)** → Mitigação: máximo 500 entradas; exibir 20 no painel.
- **Framer Motion bundle size (~50KB gzip)** → Trade-off consciente; experiência visual premium justifica.
- **Atalhos de teclado globais** → Risco de conflito com atalhos do browser/SO; mitigado ignorando eventos com foco em campos editáveis.
