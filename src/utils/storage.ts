import type { AppState, ExportSchema } from '@/types'
import { calculateTotals } from '@/utils/calculations'

const STORAGE_KEY = 'contador-ganhos-valorant-state'

const DEFAULT_STATE: AppState = {
    wins: 0,
    elos: 0,
    mvpEquipe: 0,
    mvpPartida: 0,
    history: [],
}

function isValidAppState(data: unknown): data is AppState {
    if (typeof data !== 'object' || data === null) return false
    const d = data as Record<string, unknown>
    return (
        typeof d['wins'] === 'number' && d['wins'] >= 0 &&
        typeof d['elos'] === 'number' && d['elos'] >= 0 &&
        typeof d['mvpEquipe'] === 'number' && d['mvpEquipe'] >= 0 &&
        typeof d['mvpPartida'] === 'number' && d['mvpPartida'] >= 0 &&
        Array.isArray(d['history'])
    )
}

export function saveState(state: AppState): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
        // Ignore write errors (e.g. storage quota exceeded)
    }
}

export function loadState(): AppState {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return DEFAULT_STATE
        const parsed: unknown = JSON.parse(raw)
        if (isValidAppState(parsed)) return parsed
    } catch {
        // Corrupted data — fall through to default
    }
    return DEFAULT_STATE
}

export function exportToJson(state: AppState): void {
    const totals = calculateTotals(state)
    const schema: ExportSchema = {
        version: 1,
        exportedAt: new Date().toISOString(),
        state,
        totals,
    }
    const blob = new Blob([JSON.stringify(schema, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    const dateStr = new Date().toISOString().slice(0, 10)
    a.href = url
    a.download = `contador-ganhos-${dateStr}.json`
    a.click()
    URL.revokeObjectURL(url)
}

export function importFromJson(file: File): Promise<AppState> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => {
            try {
                const text = e.target?.result as string
                const parsed: unknown = JSON.parse(text)
                if (typeof parsed !== 'object' || parsed === null) {
                    return reject(new Error('Arquivo JSON inválido'))
                }
                const schema = parsed as Record<string, unknown>
                if (typeof schema['version'] !== 'number') {
                    return reject(new Error('Campo "version" ausente ou inválido'))
                }
                const state = schema['state'] as Record<string, unknown> | undefined
                if (!state) {
                    return reject(new Error('Campo "state" ausente'))
                }
                const fields = ['wins', 'elos', 'mvpEquipe', 'mvpPartida'] as const
                for (const field of fields) {
                    const val = state[field]
                    if (typeof val !== 'number') {
                        return reject(new Error(`Campo "state.${field}" ausente ou inválido`))
                    }
                    if (val < 0) {
                        return reject(new Error(`Campo "state.${field}" não pode ser negativo`))
                    }
                }
                // Build clean AppState — never trust `totals` from file, always recompute
                const importedState: AppState = {
                    wins: state['wins'] as number,
                    elos: state['elos'] as number,
                    mvpEquipe: state['mvpEquipe'] as number,
                    mvpPartida: state['mvpPartida'] as number,
                    history: Array.isArray(state['history']) ? state['history'] as AppState['history'] : [],
                }
                resolve(importedState)
            } catch {
                reject(new Error('Falha ao analisar o arquivo JSON'))
            }
        }
        reader.onerror = () => reject(new Error('Falha ao ler o arquivo'))
        reader.readAsText(file)
    })
}
