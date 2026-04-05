## 1. Setup do Projeto

- [x] 1.1 Inicializar projeto Vite com template React + TypeScript (`npm create vite@latest . -- --template react-ts`)
- [x] 1.2 Instalar dependências: `tailwindcss`, `postcss`, `autoprefixer`, `framer-motion`, `lucide-react`
- [x] 1.3 Configurar Tailwind CSS (`tailwind.config.ts` e `postcss.config.js`) com dark mode fixo e paleta de cores customizada
- [x] 1.4 Instalar e configurar shadcn/ui (`npx shadcn-ui@latest init`) com tema dark
- [x] 1.5 Adicionar componentes shadcn/ui necessários: `button`, `card`, `dialog`, `toast`
- [x] 1.6 Configurar fonte Inter via Google Fonts no `index.html`
- [x] 1.7 Criar estrutura de pastas: `src/components/`, `src/context/`, `src/hooks/`, `src/types/`, `src/utils/`
- [x] 1.8 Limpar arquivos boilerplate do Vite (App.css, logo, etc.) e configurar `index.css` com variáveis CSS do design system

## 2. Tipos e Utilitários

- [x] 2.1 Criar `src/types/index.ts` com interfaces: `AppState`, `HistoryEntry`, `Counters`, `Category`, `ExportSchema`
- [x] 2.2 Criar `src/utils/calculations.ts` com função `calculateTotals(state)` que retorna subtotais e total geral, e utilitário para calcular maior contribuinte com desempate pela ordem de exibição
- [x] 2.3 Criar `src/utils/formatters.ts` com `formatCurrency(value)` usando `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })` e `formatTimestamp(iso)` para exibição local
- [x] 2.4 Criar `src/utils/storage.ts` com `saveState(state)`, `loadState()` (com validação e fallback) usando chave `"contador-ganhos-valorant-state"`

## 3. Context e Reducer

- [x] 3.1 Criar `src/context/AppContext.tsx` com o `AppState` inicial (todos os contadores em 0, histórico vazio)
- [x] 3.2 Implementar reducer com actions: `INCREMENT`, `DECREMENT`, `RESET`, `UNDO`, `IMPORT`
- [x] 3.3 No action `INCREMENT`: atualizar contador, criar `HistoryEntry` com snapshot do estado anterior, adicionar ao topo do histórico, aplicar limite interno `RETAINED_HISTORY_LIMIT = 500`
- [x] 3.4 No action `DECREMENT`: checar se valor > 0 antes de decrementar; criar `HistoryEntry` e adicionar ao histórico
- [x] 3.5 No action `UNDO`: verificar histórico não vazio; restaurar `stateBefore` da última entrada; remover entrada do histórico
- [x] 3.6 No action `RESET`: zerar todos os contadores e limpar histórico
- [x] 3.7 No action `IMPORT`: substituir estado completo pelo payload importado
- [x] 3.8 Criar `AppProvider` que envolve o reducer com `useReducer`, expõe o contexto e sincroniza com localStorage via `useEffect` a cada mudança de estado
- [x] 3.9 Criar hook `useAppContext()` que retorna o contexto e lança erro se usado fora do provider

## 4. Hooks

- [x] 4.1 Criar `src/hooks/useToast.tsx` com estado de toast (mensagem, tipo: success/error/info), funções `showToast(msg, type)` e `dismissToast()`, e auto-dismiss após 3 segundos

## 5. Componentes de UI

- [x] 5.1 Criar `src/components/Header.tsx` com título "Contador de Ganhos" e subtítulo "Acompanhe wins, elos, bônus e total recebido" — layout hero com gradiente de fundo e tipografia forte
- [x] 5.2 Criar `src/components/TotalCard.tsx` com total geral em destaque usando `motion.div` e animação spring quando valor muda; formatar em BRL; visual glassmorphism com glow accent
- [x] 5.3 Criar `src/components/CategoryCard.tsx` reutilizável com props: `category`, `value`, `unitValue`, `onIncrement`, `onDecrement`, `onIncrementFive`, `isTopContributor`; incluir subtotal calculado, botões +1/-1 em todas as categorias, botão +5 apenas para Wins e Elos, disable quando value=0 para decremento; destaque visual quando `isTopContributor=true` com borda glow especial
- [x] 5.4 Instanciar quatro `CategoryCard` em grid responsivo (2 colunas em mobile, 4 em desktop) para Wins, Elos, MVP Equipe e MVP Partida
- [x] 5.5 Criar `src/components/QuickActions.tsx` com botões: "Desfazer" (disabled quando histórico vazio), "Resetar Tudo" (abre diálogo de confirmação), "Exportar" e "Importar" (input file hidden + trigger)
- [x] 5.6 Implementar diálogo de confirmação de reset usando shadcn/ui `Dialog` com mensagem clara e botões "Cancelar" e "Resetar"
- [x] 5.7 Criar `src/components/ActionHistory.tsx` com lista dos últimos `VISIBLE_HISTORY_LIMIT = 20` itens do histórico usando `AnimatePresence` + `motion.li` para animação de entrada; cada item mostra ação e timestamp; estado vazio elegante
- [x] 5.8 Criar `src/components/Toast.tsx` que renderiza notificação no canto inferior direito usando `AnimatePresence` + `motion.div` com variantes de entrada/saída; cores distintas por tipo (success=verde, error=vermelho, info=roxo)

## 6. Exportação e Importação

- [x] 6.1 Implementar função `exportToJson(state)` em `src/utils/storage.ts`: montar o `ExportSchema`, serializar, criar Blob, gerar URL e acionar download com nome `contador-ganhos-YYYY-MM-DD.json`
- [x] 6.2 Implementar função `importFromJson(file)` em `src/utils/storage.ts`: ler arquivo como texto, fazer `JSON.parse`, validar presença e tipos dos campos obrigatórios (`version`, `state.wins`, `state.elos`, `state.mvpEquipe`, `state.mvpPartida`), rejeitar valores negativos; retornar `AppState` válido ou lançar erro descritivo
- [x] 6.3 Garantir que a importação nunca confie em `totals` persistidos: sempre recomputar subtotais, total geral, maior contribuinte e demais estados derivados com base em contadores/histórico importados
- [x] 6.4 Conectar botão "Exportar" ao `exportToJson` e exibir toast de sucesso
- [x] 6.5 Conectar input de arquivo ao `importFromJson` dentro do `try/catch`; em caso de sucesso: dispatch `IMPORT` e toast de sucesso; em caso de erro: toast de erro com mensagem descritiva

## 7. Integração

- [x] 7.1 Montar `App.tsx` com `AppProvider`, layout geral (background escuro, max-width, padding), instanciando todos os componentes na ordem: Header, TotalCard, grid de CategoryCards, QuickActions, ActionHistory, Toast
- [x] 7.2 Calcular `topContributor` (categoria com maior subtotal) em `App.tsx` ou em hook derivado e passar como prop para os `CategoryCard`
- [x] 7.3 Conectar todos os botões dos `CategoryCard` aos dispatches do context
- [x] 7.4 Conectar botão "Desfazer" ao dispatch `UNDO` com toast informativo
- [x] 7.5 Implementar atalhos globais: `W` (+1 Win), `E` (+1 Elo), `Q` (+1 MVP Equipe), `R` (+1 MVP Partida), `Ctrl/Cmd+Z` (undo), ignorando eventos com foco em campos editáveis
- [x] 7.6 Conectar reset: após confirmação no diálogo, dispatch `RESET` e exibir toast de sucesso; garantir que reset seja irreversível via undo
- [x] 7.7 Verificar responsividade em mobile (375px), tablet (768px) e desktop (1280px)
- [x] 7.8 Verificar acessibilidade básica: todos os botões com `aria-label`, contraste de cores adequado, foco visível nos elementos interativos

## 8. Polish e Animações

- [x] 8.1 Aplicar glassmorphism consistente nos cards: `backdrop-blur`, `bg-white/4`, border `rgba(255,255,255,0.08)`
- [x] 8.2 Adicionar glow animado no card de total usando `box-shadow` com accent color
- [x] 8.3 Implementar flip de número nos contadores: usar `motion.span` com `key={value}` e animation `y: -10 → 0` para dar sensação de contagem
- [x] 8.4 Adicionar hover states nos botões de categoria com scale e glow suave via Framer Motion
- [x] 8.5 Garantir que todas as animações sejam `< 300ms` e usem curvas `ease-out` ou spring com stiffness moderada

## 9. Verificação

- [ ] 9.1 Testar fluxo completo: incrementar, decrementar, undo, reset com confirmação e comportamento irreversível após reset
- [ ] 9.2 Testar exportação: verificar estrutura do JSON gerado e nome do arquivo
- [ ] 9.3 Testar importação: arquivo válido, JSON inválido, estrutura incorreta, valores negativos
- [ ] 9.4 Testar atalhos de teclado: `W`, `E`, `Q`, `R` e `Ctrl/Cmd+Z`, incluindo bloqueio quando foco estiver em elementos editáveis
- [ ] 9.5 Testar persistência: fechar e reabrir o browser e verificar que estado foi restaurado
- [ ] 9.6 Verificar localStorage: inspecionar chave `"contador-ganhos-valorant-state"` e confirmar atualização após cada ação
- [ ] 9.7 Testar em mobile: verificar layout do grid 2x2 e usabilidade dos botões em touch
- [x] 9.8 Rodar `npm run build` e verificar ausência de erros TypeScript e avisos críticos do bundler
