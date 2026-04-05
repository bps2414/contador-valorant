## Capability: data-persistence

### Requirements

#### REQ-DP-001: Auto-save no localStorage
O sistema SHALL persistir o estado completo (contadores + histórico) no `localStorage` sob a chave `"contador-ganhos-valorant-state"` a cada mutação de estado. A gravação SHALL ocorrer via `useEffect` observando o estado do reducer.

**Scenarios:**
- Dado que o usuário incrementa wins, o `localStorage` SHALL conter o novo estado imediatamente após a mutação

#### REQ-DP-002: Carregamento do estado salvo
Na inicialização, o sistema SHALL tentar carregar o estado do `localStorage`. Caso exista um estado válido, SHALL usá-lo como estado inicial. Caso não exista ou seja inválido/corrompido, SHALL usar o estado padrão (todos contadores em zero, histórico vazio).

**Scenarios:**
- Dado um estado salvo válido no `localStorage`, ao abrir o app, contadores e histórico são restaurados
- Dado dados corrompidos no `localStorage`, o app inicia com estado padrão sem erros
