import { useEffect, useCallback } from 'react'
import { Header } from '@/components/Header'
import { TotalCard } from '@/components/TotalCard'
import { CategoryCard } from '@/components/CategoryCard'
import { QuickActions } from '@/components/QuickActions'
import { ActionHistory } from '@/components/ActionHistory'
import { Toast } from '@/components/Toast'
import { useAppContext } from '@/context/AppContext'
import { useToast } from '@/hooks/useToast'
import { calculateTotals, getTopContributor } from '@/utils/calculations'
import { exportToJson, importFromJson } from '@/utils/storage'
import type { Category, CategoryConfig } from '@/types'

const CATEGORY_CONFIGS: CategoryConfig[] = [
    { key: 'wins', label: 'Vitórias', unitValue: 3, hasIncrementFive: true, icon: 'trophy' },
    { key: 'elos', label: 'Elos', unitValue: 10, hasIncrementFive: true, icon: 'chevron-up' },
    { key: 'mvpEquipe', label: 'MVP Equipe', unitValue: 1, hasIncrementFive: false, icon: 'users' },
    { key: 'mvpPartida', label: 'MVP Partida', unitValue: 2, hasIncrementFive: false, icon: 'star' },
]

const SHORTCUT_KEYS: Record<string, Category> = {
    w: 'wins',
    e: 'elos',
    q: 'mvpEquipe',
    r: 'mvpPartida',
}

export default function App() {
    const { state, dispatch, visibleHistoryLimit } = useAppContext()
    const { toast, showToast, dismissToast } = useToast()

    const totals = calculateTotals(state)
    const topContributor = getTopContributor(state)
    const visibleHistory = state.history.slice(0, visibleHistoryLimit)

    const handleIncrement = useCallback(
        (category: Category, delta: 1 | 5) => {
            dispatch({ type: 'INCREMENT', category, delta })
        },
        [dispatch],
    )

    const handleDecrement = useCallback(
        (category: Category) => {
            dispatch({ type: 'DECREMENT', category })
        },
        [dispatch],
    )

    const handleUndo = useCallback(() => {
        dispatch({ type: 'UNDO' })
    }, [dispatch])

    const handleReset = useCallback(() => {
        dispatch({ type: 'RESET' })
        showToast('Dados resetados com sucesso.', 'info')
    }, [dispatch, showToast])

    const handleExport = useCallback(() => {
        try {
            exportToJson(state)
            showToast('Exportação concluída!', 'success')
        } catch {
            showToast('Erro ao exportar dados.', 'error')
        }
    }, [state, showToast])

    const handleImport = useCallback(
        async (file: File) => {
            try {
                const importedState = await importFromJson(file)
                dispatch({ type: 'IMPORT', payload: importedState })
                showToast('Dados importados com sucesso!', 'success')
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Erro ao importar arquivo.'
                showToast(message, 'error')
            }
        },
        [dispatch, showToast],
    )

    // Keyboard shortcuts
    useEffect(() => {
        function onKeyDown(e: KeyboardEvent) {
            // Ignore if typing in an input/textarea
            const tag = (e.target as HTMLElement).tagName
            if (tag === 'INPUT' || tag === 'TEXTAREA') return

            // Ctrl/Cmd + Z → Undo
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
                e.preventDefault()
                if (state.history.length > 0) {
                    dispatch({ type: 'UNDO' })
                }
                return
            }

            // W / E / Q / R → increment +1
            const category = SHORTCUT_KEYS[e.key.toLowerCase()]
            if (category && !e.ctrlKey && !e.metaKey && !e.altKey) {
                e.preventDefault()
                dispatch({ type: 'INCREMENT', category, delta: 1 })
            }
        }

        window.addEventListener('keydown', onKeyDown)
        return () => window.removeEventListener('keydown', onKeyDown)
    }, [dispatch, state.history.length])

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-[#f1f5f9] font-sans">
            <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col gap-8">
                {/* Header */}
                <Header />

                {/* Total card */}
                <TotalCard total={totals.total} />

                {/* Category grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {CATEGORY_CONFIGS.map((cfg) => (
                        <CategoryCard
                            key={cfg.key}
                            category={cfg.key}
                            label={cfg.label}
                            value={state[cfg.key]}
                            unitValue={cfg.unitValue}
                            hasIncrementFive={cfg.hasIncrementFive}
                            isTopContributor={topContributor === cfg.key}
                            onIncrement={(delta) => handleIncrement(cfg.key, delta)}
                            onDecrement={() => handleDecrement(cfg.key)}
                        />
                    ))}
                </div>

                {/* Quick actions */}
                <QuickActions
                    canUndo={state.history.length > 0}
                    onUndo={handleUndo}
                    onReset={handleReset}
                    onExport={handleExport}
                    onImport={handleImport}
                />

                {/* Action history */}
                <ActionHistory entries={visibleHistory} />

                {/* Keyboard shortcuts helper */}
                <p className="text-center text-[#334155] text-xs pb-4">
                    Atalhos: <kbd className="font-mono bg-white/5 px-1 rounded">W</kbd> Vitória &nbsp;
                    <kbd className="font-mono bg-white/5 px-1 rounded">E</kbd> Elo &nbsp;
                    <kbd className="font-mono bg-white/5 px-1 rounded">Q</kbd> MVP Equipe &nbsp;
                    <kbd className="font-mono bg-white/5 px-1 rounded">R</kbd> MVP Partida &nbsp;
                    <kbd className="font-mono bg-white/5 px-1 rounded">Ctrl+Z</kbd> Desfazer
                </p>
            </div>

            {/* Toast */}
            <Toast
                message={toast?.message ?? null}
                type={toast?.type ?? 'info'}
                onDismiss={dismissToast}
            />
        </div>
    )
}
