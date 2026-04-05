## Why

Não existe ferramenta visual e agradável para acompanhar quanto será recebido por desempenho em partidas de Valorant. Uma interface dedicada e bem construída elimina erros de cálculo manual e transforma o controle financeiro do jogo numa experiência premium, motivadora e profissional.

## What Changes

- Criação de um web app single-page (SPA) completo em React + TypeScript + Tailwind CSS
- Interface dark-mode com glassmorphism, gradientes e animações suaves
- Quatro contadores independentes: Wins, Elos, MVP Equipe e MVP Partida
- Cálculo em tempo real do total geral e subtotais por categoria
- Histórico de ações com timestamp e suporte a desfazer (undo)
- Persistência automática no `localStorage` sem necessidade de backend
- Exportação e importação de estado via arquivo JSON
- Reset global com confirmação elegante e notificações via toast

## Capabilities

### New Capabilities

- `earnings-counter`: Contadores de wins, elos, MVP equipe e MVP partida com cálculo de subtotal e total geral em tempo real; regras: 1 win = R$ 3, 1 elo = R$ 10, MVP equipe = R$ 1, MVP partida = R$ 2; botões +1, -1, +5 (onde aplicável); impede valores negativos; destaque visual para maior contribuinte
- `action-history-undo`: Registro cronológico das ações realizadas (+1 Win, -1 Elo, etc.) com timestamp local; suporte a desfazer a última ação via botão e atalho Ctrl/Cmd+Z; limite de exibição no painel mas mantém stack completa para undo
- `data-persistence`: Auto-save do estado completo no `localStorage` a cada mutação; carregamento do estado salvo na inicialização da aplicação
- `data-import-export`: Exportação do estado (contadores + histórico + totais + data) como arquivo JSON; importação com validação de estrutura e exibição de erro amigável em caso de JSON inválido ou estrutura incorreta

### Modified Capabilities

## Impact

- **Novo projeto**: nenhum código existente é modificado; toda a implementação é greenfield
- **Dependências**: React 18, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, lucide-react
- **Sem backend**: dados persistidos exclusivamente via `localStorage` do navegador
- **Sem autenticação**: aplicação puramente client-side
- **Arquivos gerados**: estrutura de componentes React em `src/`, configuração Vite, `package.json`, `tailwind.config`, `tsconfig`
