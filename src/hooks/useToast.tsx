import { useState, useCallback, useRef } from 'react'

export type ToastType = 'success' | 'error' | 'info'

interface Toast {
    id: string
    message: string
    type: ToastType
}

export function useToast() {
    const [toast, setToast] = useState<Toast | null>(null)
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const showToast = useCallback((message: string, type: ToastType = 'info') => {
        if (timerRef.current) clearTimeout(timerRef.current)
        setToast({ id: crypto.randomUUID(), message, type })
        timerRef.current = setTimeout(() => setToast(null), 3000)
    }, [])

    const dismissToast = useCallback(() => {
        if (timerRef.current) clearTimeout(timerRef.current)
        setToast(null)
    }, [])

    return { toast, showToast, dismissToast }
}
