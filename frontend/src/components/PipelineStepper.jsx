const STEPS = [
    { id: 1, label: 'Upload', icon: '☁️', desc: 'Securely receiving prescription stream' },
    { id: 2, label: 'Preprocessing', icon: '🎨', desc: 'Optimizing 5 imaging vectors (Sharp)' },
    { id: 3, label: 'Neural OCR', icon: '👁️', desc: 'Parallel Vision Logic + Consensus' },
    { id: 4, label: 'GPT-4o NER', icon: '🧠', desc: 'Intelligent Clinical Entity Parsing' },
    { id: 5, label: 'VDB Matching', icon: '🎯', desc: '3-Stage Hybrid Search Engine' },
];

export default function PipelineStepper({ currentStep }) {
    return (
        <div className="w-full max-w-3xl mx-auto py-4">
            {/* ── Status Text ──────────────────────── */}
            <div className="text-center mb-12">
                <h2 className="text-2xl font-black text-white display-font mb-2 uppercase tracking-tighter">
                    {currentStep < STEPS.length ? 'Decoding Healthcare...' : 'Analysis Complete'}
                </h2>
                <div className="flex items-center justify-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <p className="text-xs text-slate-500 mono-font uppercase tracking-widest font-medium">
                        {STEPS.find((s) => s.id === currentStep)?.desc || 'Ready for next stream'}
                    </p>
                </div>
            </div>

            {/* ── Visual Timeline ──────────────────── */}
            <div className="flex items-center justify-between relative px-4">

                {/* Connecting Glow Line */}
                <div className="absolute top-7 left-12 right-12 h-[2px] bg-white/5 z-0" />
                <div
                    className="absolute top-7 left-12 h-[2px] bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 z-0 transition-all duration-1000 ease-in-out shadow-[0_0_12px_rgba(34,211,238,0.3)]"
                    style={{
                        width: `${((Math.min(currentStep, STEPS.length) - 1) / (STEPS.length - 1)) * 100}%`,
                        maxWidth: 'calc(100% - 6rem)'
                    }}
                />

                {STEPS.map((step) => {
                    const isDone = step.id < currentStep;
                    const isActive = step.id === currentStep;
                    const isPending = step.id > currentStep;

                    return (
                        <div key={step.id} className="flex flex-col items-center relative z-10 w-20">
                            {/* Node Icon */}
                            <div
                                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl
                                    transition-all duration-700 border-2 shadow-2xl relative
                                    ${isDone
                                        ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400 opacity-100 scale-100'
                                        : isActive
                                            ? 'bg-white/10 border-white/40 text-white scale-110 shadow-cyan-500/20 glow-effect'
                                            : 'bg-black/40 border-white/5 text-slate-700 opacity-40 scale-90 grayscale'
                                    }`}
                            >
                                {isActive && (
                                    <div className="absolute inset-[-4px] rounded-[1.2rem] border border-cyan-400/30 animate-ping opacity-20" />
                                )}

                                {isDone ? (
                                    <svg className="w-6 h-6 animate-fade-in-up" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    <span className={isActive ? 'animate-pulse' : ''}>{step.icon}</span>
                                )}
                            </div>

                            {/* Node Label */}
                            <div className="mt-5 flex flex-col items-center">
                                <span
                                    className={`text-[9px] font-black uppercase tracking-widest display-font transition-all duration-500
                                        ${isActive ? 'text-white' : isDone ? 'text-cyan-400/60' : 'text-slate-800'}`}
                                >
                                    {step.label}
                                </span>
                                {isActive && (
                                    <div className="mt-1 w-1 h-1 rounded-full bg-cyan-400 animate-glow" />
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .glow-effect {
                    box-shadow: 0 0 20px rgba(34, 211, 238, 0.2), inset 0 0 10px rgba(255, 255, 255, 0.05);
                }
            `}} />
        </div>
    );
}
