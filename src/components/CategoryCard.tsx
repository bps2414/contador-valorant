import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'
import { formatCurrency } from '@/utils/formatters'
import type { Category } from '@/types'

interface CategoryCardProps {
    category: Category
    label: string
    value: number
    unitValue: number
    hasIncrementFive: boolean
    isTopContributor: boolean
    onIncrement: (delta: 1 | 5) => void
    onDecrement: () => void
}

export function CategoryCard({
    label,
    value,
    unitValue,
    hasIncrementFive,
    isTopContributor,
    onIncrement,
    onDecrement,
}: CategoryCardProps) {
    const subtotal = value * unitValue

    return (
        <div
            className={[
                'glass-card rounded-2xl p-5 flex flex-col gap-4 transition-all duration-300',
                isTopContributor ? 'ring-1 ring-[#7c3aed]/60 glow-violet-sm' : '',
            ].join(' ')}
        >
            {/* Label & subtotal */}
            <div className="flex items-center justify-between">
                <span className="text-[#94a3b8] text-xs font-semibold uppercase tracking-widest">
                    {label}
                </span>
                {isTopContributor && (
                    <span className="text-[10px] font-bold text-[#7c3aed] uppercase tracking-wider bg-[#7c3aed]/10 px-2 py-0.5 rounded-full">
                        Top
                    </span>
                )}
            </div>

            {/* Counter value */}
            <div className="text-center">
                <AnimatePresence mode="wait">
                    <motion.span
                        key={value}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.2 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className="text-5xl font-extrabold text-[#f1f5f9] tabular-nums"
                    >
                        {value}
                    </motion.span>
                </AnimatePresence>
                <p className="text-[#64748b] text-xs mt-1">
                    {formatCurrency(subtotal)}
                </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                    <button
                        onClick={() => onIncrement(1)}
                        aria-label={`Incrementar ${label} em 1`}
                        className="flex-1 flex items-center justify-center gap-1 bg-[#7c3aed]/20 hover:bg-[#7c3aed]/40 text-[#a78bfa] font-bold rounded-xl py-2 text-sm transition-colors duration-150 active:scale-95"
                    >
                        <Plus className="w-4 h-4" />
                        +1
                    </button>
                    {hasIncrementFive && (
                        <button
                            onClick={() => onIncrement(5)}
                            aria-label={`Incrementar ${label} em 5`}
                            className="flex-1 flex items-center justify-center gap-1 bg-[#7c3aed]/10 hover:bg-[#7c3aed]/30 text-[#c4b5fd] font-bold rounded-xl py-2 text-sm transition-colors duration-150 active:scale-95"
                        >
                            <Plus className="w-4 h-4" />
                            +5
                        </button>
                    )}
                </div>
                <button
                    onClick={onDecrement}
                    disabled={value === 0}
                    aria-label={`Decrementar ${label}`}
                    className="w-full flex items-center justify-center gap-1 bg-[#ef4444]/10 hover:bg-[#ef4444]/25 text-[#f87171] font-bold rounded-xl py-2 text-sm transition-colors duration-150 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    <Minus className="w-4 h-4" />
                    -1
                </button>
            </div>

            {/* Unit value label */}
            <p className="text-center text-[#475569] text-[11px]">
                {formatCurrency(unitValue)} / unidade
            </p>
        </div>
    )
}
