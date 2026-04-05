import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import type { ToastType } from '@/hooks/useToast'

const TYPE_STYLES: Record<ToastType, string> = {
    success: 'bg-green-900/80 border-green-500/40 text-green-200',
    error: 'bg-red-900/80 border-red-500/40 text-red-200',
    info: 'bg-[#2e1065]/80 border-[#7c3aed]/40 text-[#c4b5fd]',
}

interface ToastProps {
    message: string | null
    type: ToastType
    onDismiss: () => void
}

export function Toast({ message, type, onDismiss }: ToastProps) {
    return (
        <div
            className="fixed bottom-6 right-6 z-50 pointer-events-none"
            aria-live="polite"
        >
            <AnimatePresence>
                {message && (
                    <motion.div
                        key={message}
                        initial={{ opacity: 0, y: 16, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 16, scale: 0.95 }}
                        transition={{ duration: 0.22, ease: 'easeOut' }}
                        className={[
                            'pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-sm shadow-xl max-w-xs text-sm font-medium',
                            TYPE_STYLES[type],
                        ].join(' ')}
                    >
                        <span className="flex-1">{message}</span>
                        <button
                            onClick={onDismiss}
                            aria-label="Fechar notificação"
                            className="opacity-60 hover:opacity-100 transition-opacity"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
