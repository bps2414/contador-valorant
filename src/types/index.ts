export type Category = 'wins' | 'elos' | 'mvpEquipe' | 'mvpPartida'

export interface Counters {
    wins: number
    elos: number
    mvpEquipe: number
    mvpPartida: number
}

export interface HistoryEntry {
    id: string
    action: string
    category: Category
    delta: number
    timestamp: string
    stateBefore: Counters
}

export interface AppState extends Counters {
    history: HistoryEntry[]
}

export interface Totals {
    wins: number
    elos: number
    mvpEquipe: number
    mvpPartida: number
    total: number
}

export interface ExportSchema {
    version: number
    exportedAt: string
    state: AppState
    totals: Totals
}

export interface CategoryConfig {
    key: Category
    label: string
    unitValue: number
    hasIncrementFive: boolean
    icon: string
}
