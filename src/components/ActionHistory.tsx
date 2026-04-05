import { motion, AnimatePresence } from 'framer-motion'
import { formatTimestamp } from '@/utils/formatters'
import type { HistoryEntry } from '@/types'

const ACTION_LABELS: Record<string, string> = {
    INCREMENT: '+',
    DECREMENT: '−',
}

const CATEGORY_LABELS: Record<string, string> = {
    wins: 'Vitória',
    elos: 'Elo',
    mvpEquipe: 'MVP Equipe',
    mvpPartida: 'MVP Partida',
}

interface ActionHistoryProps {
    entries: HistoryEntry[]
}

export function ActionHistory({ entries }: ActionHistoryProps) {
    return (
        <div className="glass-card rounded-2xl p-5">
            <h2 className="text-[#94a3b8] text-xs font-semibold uppercase tracking-widest mb-4">
                Histórico de Ações
            </h2>

            {entries.length === 0 ? (
                <p className="text-[#475569] text-sm text-center py-6">
                    Nenhuma ação registrada ainda.
                </p>
            ) : (
                <ul className="flex flex-col gap-2">
                    <AnimatePresence initial={false}>
                        {entries.map((entry) => {
                            const isPositive = entry.action === 'INCREMENT'
                            const deltaStr = `${ACTION_LABELS[entry.action] ?? ''}${Math.abs(entry.delta)}`
                            return (
                                <motion.li
                                    key={entry.id}
                                    initial={{ opacity: 0, x: -12 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 12 }}
                                    transition={{ duration: 0.18 }}
                                    className="flex items-center justify-between gap-3 text-sm"
                                >
                                    <span
                                        className={[
                                            'font-bold text-base w-8 text-center',
                                            isPositive ? 'text-[#a78bfa]' : 'text-[#f87171]',
                                        ].join(' ')}
                                    >
                                        {deltaStr}
                                    </span>
                                    <span className="flex-1 text-[#cbd5e1]">
                                        {CATEGORY_LABELS[entry.category] ?? entry.category}
                                    </span>
                                    <span className="text-[#475569] text-[11px] whitespace-nowrap">
                                        {formatTimestamp(entry.timestamp)}
                                    </span>
                                </motion.li>
                            )
                        })}
                    </AnimatePresence>
                </ul>
            )}
        </div>
    )
}
