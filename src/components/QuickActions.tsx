import { Undo2, RotateCcw, Download, Upload } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { useState, useRef } from 'react'

interface QuickActionsProps {
  canUndo: boolean
  onUndo: () => void
  onReset: () => void
  onExport: () => void
  onImport: (file: File) => void
}

export function QuickActions({
  canUndo,
  onUndo,
  onReset,
  onExport,
  onImport,
}: QuickActionsProps) {
  const [resetOpen, setResetOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleConfirmReset() {
    setResetOpen(false)
    onReset()
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      onImport(file)
      // reset file input so the same file can be re-imported
      e.target.value = ''
    }
  }

  return (
    <>
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          title="Desfazer (Ctrl+Z)"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-white/5 hover:bg-white/10 text-[#cbd5e1] border border-white/8 transition-colors duration-150 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
        >
          <Undo2 className="w-4 h-4" />
          Desfazer
        </button>

        <button
          onClick={() => setResetOpen(true)}
          title="Resetar todos os contadores"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-[#ef4444]/10 hover:bg-[#ef4444]/20 text-[#f87171] border border-[#ef4444]/20 transition-colors duration-150 active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          Resetar Tudo
        </button>

        <button
          onClick={onExport}
          title="Exportar dados como JSON"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-white/5 hover:bg-white/10 text-[#cbd5e1] border border-white/8 transition-colors duration-150 active:scale-95"
        >
          <Download className="w-4 h-4" />
          Exportar
        </button>

        <button
          onClick={() => fileInputRef.current?.click()}
          title="Importar dados de arquivo JSON"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-white/5 hover:bg-white/10 text-[#cbd5e1] border border-white/8 transition-colors duration-150 active:scale-95"
        >
          <Upload className="w-4 h-4" />
          Importar
        </button>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          className="hidden"
          onChange={handleFileChange}
          aria-hidden
        />
      </div>

      {/* Reset confirmation dialog */}
      <Dialog open={resetOpen} onOpenChange={setResetOpen}>
        <DialogContent className="bg-[#12121a] border border-white/10 rounded-2xl max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-[#f1f5f9] text-lg font-bold">
              Resetar todos os dados?
            </DialogTitle>
            <DialogDescription className="text-[#94a3b8] text-sm mt-1">
              Esta ação irá zerar todos os contadores e apagar o histórico. Ela é
              irreversível e não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 justify-end mt-4">
            <DialogClose asChild>
              <button className="px-4 py-2 rounded-xl text-sm font-semibold bg-white/5 hover:bg-white/10 text-[#94a3b8] border border-white/8 transition-colors">
                Cancelar
              </button>
            </DialogClose>
            <button
              onClick={handleConfirmReset}
              className="px-4 py-2 rounded-xl text-sm font-bold bg-[#ef4444] hover:bg-[#dc2626] text-white transition-colors"
            >
              Resetar
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
