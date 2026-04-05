import { motion, AnimatePresence } from 'framer-motion'
import { formatCurrency } from '@/utils/formatters'

interface TotalCardProps {
    total: number
}

export function TotalCard({ total }: TotalCardProps) {
    return (
        <div className="glass-card rounded-2xl p-6 md:p-8 text-center relative overflow-hidden glow-violet mx-4 md:mx-0">
            {/* Decorative background blob */}
            <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(124,58,237,0.12) 0%, transparent 70%)',
                }}
            />
            <p className="text-[#94a3b8] text-sm font-medium uppercase tracking-widest mb-3">
                Total Geral
            </p>
            <div className="flex items-center justify-center">
                <AnimatePresence mode="wait">
                    <motion.span
                        key={total}
                        initial={{ opacity: 0, y: -12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 12 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="text-5xl md:text-6xl font-extrabold text-[#f1f5f9]"
                    >
                        {formatCurrency(total)}
                    </motion.span>
                </AnimatePresence>
            </div>
        </div>
    )
}
