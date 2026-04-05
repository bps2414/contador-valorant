export function Header() {
    return (
        <header className="text-center py-10 px-4">
            <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-[#7c3aed]/10 border border-[#7c3aed]/20 text-[#7c3aed] text-xs font-semibold tracking-widest uppercase">
                Valorant Tracker
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#f1f5f9] tracking-tight mb-2">
                Contador de{' '}
                <span className="bg-gradient-to-r from-[#7c3aed] to-[#ef4444] bg-clip-text text-transparent">
                    Ganhos
                </span>
            </h1>
            <p className="text-[#94a3b8] text-base md:text-lg max-w-md mx-auto">
                Acompanhe wins, elos, bônus e total recebido
            </p>
        </header>
    )
}
