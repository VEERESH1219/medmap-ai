import { useState } from 'react';

export default function OCRPassDebugger({ ocrResult, compact = false }) {
    const [open, setOpen] = useState(false);

    if (!ocrResult) return null;

    const qualityColors = {
        HIGH_CONFIDENCE: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5',
        MEDIUM_CONFIDENCE: 'text-amber-400 border-amber-500/20 bg-amber-500/5',
        LOW_QUALITY: 'text-red-400 border-red-500/20 bg-red-500/5',
    };

    const qualityLabels = {
        HIGH_CONFIDENCE: 'High Confidence',
        MEDIUM_CONFIDENCE: 'Medium Confidence',
        LOW_QUALITY: 'Low Quality',
    };

    if (compact) {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase display-font">Consensus Qual.</span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-lg border ${qualityColors[ocrResult.quality_tag] || qualityColors.LOW_QUALITY}`}>
                        {ocrResult.consensus_score.toFixed(1)}%
                    </span>
                </div>
                <div className="p-4 rounded-xl bg-black/40 border border-white/5 shadow-inner">
                    <p className="text-[11px] text-slate-300 mono-font leading-relaxed whitespace-pre-wrap">
                        {ocrResult.final_text || '(OCR Bypassed)'}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full animate-fade-in-up">
            <div className="rounded-[1.5rem] glass-panel border-white/5 p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500/20 to-transparent" />

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div>
                        <h3 className="text-sm font-black text-white display-font uppercase tracking-[0.2em] mb-2">
                            OCR Intelligence Console
                        </h3>
                        <div className="flex items-center gap-3">
                            <span className="text-xs text-slate-500 mono-font">
                                {ocrResult.passes_completed > 0
                                    ? `Parallel Passes: ${ocrResult.passes_completed}`
                                    : 'Static Input Session'}
                            </span>
                            {ocrResult.passes_agreed > 0 && (
                                <span className="text-[10px] font-bold text-cyan-500/80 mono-font bg-cyan-500/10 px-2 py-0.5 rounded italic">
                                    {ocrResult.passes_agreed} Agreed
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="text-right">
                            <p className="text-[10px] uppercase font-black tracking-widest text-slate-600 mb-1 display-font">Consensus Score</p>
                            <div className="text-4xl font-black text-white display-font tracking-tighter">
                                {ocrResult.consensus_score.toFixed(1)}<span className="text-lg opacity-30 ml-1">%</span>
                            </div>
                        </div>
                        <div className={`px-4 py-2 rounded-2xl border text-[10px] font-black uppercase tracking-widest display-font shadow-lg
                            ${qualityColors[ocrResult.quality_tag] || qualityColors.LOW_QUALITY}`}
                        >
                            {qualityLabels[ocrResult.quality_tag] || ocrResult.quality_tag}
                        </div>
                    </div>
                </div>

                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/10 to-transparent rounded-[1.2rem] blur opacity-50 group-hover:opacity-100 transition duration-1000" />
                    <div className="relative rounded-[1rem] bg-black/60 border border-white/5 p-6 shadow-inner">
                        <p className="text-[10px] text-slate-500 mono-font mb-3 uppercase tracking-widest font-bold">Consensus Extraction Output</p>
                        <p className="text-sm text-slate-200 mono-font whitespace-pre-wrap leading-relaxed">
                            {ocrResult.final_text || '(Static data input, no OCR generated)'}
                        </p>
                    </div>
                </div>

                {ocrResult.pass_results && ocrResult.pass_results.length > 0 && (
                    <div className="mt-8">
                        <button
                            onClick={() => setOpen(!open)}
                            className="flex items-center gap-2 group transition-all"
                        >
                            <div className={`w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center transition-transform ${open ? 'rotate-90 bg-cyan-500/20 text-cyan-400 border-cyan-500/30' : 'text-slate-500'}`}>
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                            <span className="text-[10px] font-black text-slate-500 group-hover:text-slate-300 uppercase tracking-widest display-font">
                                {open ? 'Collapse' : 'Inspect'} Metadata Vectors
                            </span>
                        </button>

                        {open && (
                            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 animate-fade-in-up">
                                {ocrResult.pass_results.map((pass, idx) => (
                                    <div
                                        key={idx}
                                        className="rounded-2xl glass-panel border-white/5 p-4 relative overflow-hidden group/pass"
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-[9px] font-black text-cyan-400/70 uppercase tracking-tighter mono-font truncate pr-2">
                                                {pass.variant}
                                            </span>
                                            <span className="text-[8px] font-bold text-slate-600 mono-font">
                                                {pass.confidence.toFixed(0)}%
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-slate-500 mono-font line-clamp-3 leading-tight group-hover/pass:text-slate-300 transition-colors">
                                            {pass.text || '(No signals)'}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
