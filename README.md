# Contador de Ganhos Valorant

> Registre e acompanhe suas vitórias e resultados no Valorant de forma rápida e visual.

[![Live Demo](https://img.shields.io/badge/🎮_Live_Demo-contador--valorant.vercel.app-7c3aed?style=for-the-badge)](https://contador-valorant.vercel.app)

---

## Sobre o Projeto

Aplicação web para acompanhar ganhos e resultados em partidas de Valorant. Registre vitórias (W), derrotas (L), empates (D) e rounds por agente, com histórico de ações e desfazer ilimitado.

## Tech Stack

| Tecnologia | Versão |
|---|---|
| React | 18 |
| TypeScript | 5 |
| Vite | 6 |
| Tailwind CSS | 3 |
| Framer Motion | 11 |
| Radix UI | latest |

## Instalação Local

```bash
# 1. Clone o repositório
git clone https://github.com/bps2414/contador-valorant.git
cd contador-valorant

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev
```

Acesse `http://localhost:5173` no navegador.

## Scripts

| Comando | Descrição |
|---|---|
| `npm run dev` | Servidor de desenvolvimento com HMR |
| `npm run build` | Build de produção |
| `npm run preview` | Visualizar build localmente |

## Atalhos de Teclado

| Tecla | Ação |
|---|---|
| `W` | Registrar vitória |
| `E` | Registrar empate |
| `Q` | Registrar derrota |
| `R` | Resetar contador atual |
| `Ctrl + Z` | Desfazer última ação |

## Deploy

O projeto é automaticamente implantado no [Vercel](https://vercel.com) a cada push para `main`.
