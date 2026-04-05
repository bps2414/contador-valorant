import {
    createContext,
    useContext,
    useReducer,
    useEffect,
    type ReactNode,
} from 'react'
import type { AppState, Category, HistoryEntry } from '@/types'
import { loadState, saveState } from '@/utils/storage'

// ─── Constants ───────────────────────────────────────────────────────────────
const VISIBLE_HISTORY_LIMIT = 20
const RETAINED_HISTORY_LIMIT = 500

// ─── Actions ─────────────────────────────────────────────────────────────────
type Action =
    | { type: 'INCREMENT'; category: Category; delta: 1 | 5 }
    | { type: 'DECREMENT'; category: Category }
    | { type: 'RESET' }
    | { type: 'UNDO' }
    | { type: 'IMPORT'; payload: AppState }

// ─── Initial State ────────────────────────────────────────────────────────────
const DEFAULT_STATE: AppState = {
    wins: 0,
    elos: 0,
    mvpEquipe: 0,
    mvpPartida: 0,
    history: [],
}

function buildLabel(type: 'INCREMENT' | 'DECREMENT', category: Category, delta: number): string {
    const names: Record<Category, string> = {
        wins: 'Win',
        elos: 'Elo',
        mvpEquipe: 'MVP Equipe',
        mvpPartida: 'MVP Partida',
    }
    const sign = type === 'INCREMENT' ? '+' : '-'
    return `${sign}${delta} ${names[category]}`
}

// ─── Reducer ──────────────────────────────────────────────────────────────────
function appReducer(state: AppState, action: Action): AppState {
    switch (action.type) {
        case 'INCREMENT': {
            const { category, delta } = action
            const stateBefore = {
                wins: state.wins,
                elos: state.elos,
                mvpEquipe: state.mvpEquipe,
                mvpPartida: state.mvpPartida,
            }
            const newCounterValue = state[category] + delta
            const entry: HistoryEntry = {
                id: crypto.randomUUID(),
                action: buildLabel('INCREMENT', category, delta),
                category,
                delta,
                timestamp: new Date().toISOString(),
                stateBefore,
            }
            const newHistory = [entry, ...state.history].slice(0, RETAINED_HISTORY_LIMIT)
            return { ...state, [category]: newCounterValue, history: newHistory }
        }

        case 'DECREMENT': {
            const { category } = action
            if (state[category] <= 0) return state
            const stateBefore = {
                wins: state.wins,
                elos: state.elos,
                mvpEquipe: state.mvpEquipe,
                mvpPartida: state.mvpPartida,
            }
            const entry: HistoryEntry = {
                id: crypto.randomUUID(),
                action: buildLabel('DECREMENT', category, 1),
                category,
                delta: -1,
                timestamp: new Date().toISOString(),
                stateBefore,
            }
            const newHistory = [entry, ...state.history].slice(0, RETAINED_HISTORY_LIMIT)
            return { ...state, [category]: state[category] - 1, history: newHistory }
        }

        case 'UNDO': {
            if (state.history.length === 0) return state
            const [last, ...rest] = state.history
            return {
                ...state,
                wins: last.stateBefore.wins,
                elos: last.stateBefore.elos,
                mvpEquipe: last.stateBefore.mvpEquipe,
                mvpPartida: last.stateBefore.mvpPartida,
                history: rest,
            }
        }

        case 'RESET': {
            return { ...DEFAULT_STATE }
        }

        case 'IMPORT': {
            return { ...action.payload }
        }

        default:
            return state
    }
}

// ─── Context ──────────────────────────────────────────────────────────────────
interface AppContextValue {
    state: AppState
    dispatch: React.Dispatch<Action>
    visibleHistoryLimit: number
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(appReducer, undefined, loadState)

    useEffect(() => {
        saveState(state)
    }, [state])

    return (
        <AppContext.Provider value={{ state, dispatch, visibleHistoryLimit: VISIBLE_HISTORY_LIMIT }}>
            {children}
        </AppContext.Provider>
    )
}

export function useAppContext(): AppContextValue {
    const ctx = useContext(AppContext)
    if (!ctx) {
        throw new Error('useAppContext must be used within AppProvider')
    }
    return ctx
}
