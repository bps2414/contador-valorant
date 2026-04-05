import type { AppState, Category, Totals } from '@/types'

const UNIT_VALUES: Record<Category, number> = {
    wins: 3,
    elos: 10,
    mvpEquipe: 1,
    mvpPartida: 2,
}

export function calculateTotals(state: AppState): Totals {
    const wins = state.wins * UNIT_VALUES.wins
    const elos = state.elos * UNIT_VALUES.elos
    const mvpEquipe = state.mvpEquipe * UNIT_VALUES.mvpEquipe
    const mvpPartida = state.mvpPartida * UNIT_VALUES.mvpPartida
    const total = wins + elos + mvpEquipe + mvpPartida
    return { wins, elos, mvpEquipe, mvpPartida, total }
}

// Returns the category with the highest subtotal.
// Tiebreaker: display order wins > elos > mvpEquipe > mvpPartida
const DISPLAY_ORDER: Category[] = ['wins', 'elos', 'mvpEquipe', 'mvpPartida']

export function getTopContributor(state: AppState): Category {
    const totals = calculateTotals(state)
    let top: Category = 'wins'
    let topValue = -1

    for (const cat of DISPLAY_ORDER) {
        const val = totals[cat]
        if (val > topValue) {
            topValue = val
            top = cat
        }
    }

    return top
}
