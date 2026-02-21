import { useState } from 'react';

export default function OCRPassDebugger({ ocrResult }) {
    const [open, setOpen] = useState(false);

    if (!ocrResult) return null;

    const qualityColors = {
        HIGH_CONFIDENCE: 'text-emerald-400 bg-emerald-500/10 ring-emerald-500/30',
        MEDIUM_CONFIDENCE: 'text-amber-400 bg-amber-500/10 ring-amber-500/30',
        LOW_QUALITY: 'text-red-400 bg-red-500/10 ring-red-500/30',
    };

    const qualityLabels = {
        HIGH_CONFIDENCE: 'High Confidence',
        MEDIUM_CONFIDENCE: 'Medium Confidence',
        LOW_QUALITY: 'Low Quality',
    };

    return (
        <div className="w-full max-w-5xl mx-auto mb-8 animate-slide-up">
            {/* Consensus Score Hero */}
            <div className="rounded-2xl bg-slate-800/50 border border-slate-700/40 p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-sm font-bold text-slate-300 display-font uppercase tracking-wider">
                            OCR Consensus Result
                        </h3>
                        <p className="text-xs text-slate-500 mono-font mt-1">
                            {ocrResult.passes_completed > 0
                                ? `${ocrResult.passes_completed} passes · ${ocrResult.passes_agreed} agreed`
                                : 'Direct text input — OCR bypassed'}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ring-1
                ${qualityColors[ocrResult.quality_tag] || qualityColors.LOW_QUALITY}`}
                        >
                            {qualityLabels[ocrResult.quality_tag] || ocrResult.quality_tag}
                        </span>

                        <div className="text-right">
                            <div className="text-3xl font-extrabold text-slate-100 display-font">
                                {ocrResult.consensus_score.toFixed(1)}
                                <span className="text-sm text-slate-500 ml-1">%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Consensus Text */}
                <div className="rounded-xl bg-slate-900/60 border border-slate-700/30 p-4">
                    <p className="text-xs text-slate-500 mono-font mb-2">Final Consensus Text</p>
                    <p className="text-sm text-slate-200 mono-font whitespace-pre-wrap leading-relaxed">
                        {ocrResult.final_text || '(empty)'}
                    </p>
                </div>

                {/* Pass Results (if available) */}
                {ocrResult.pass_results && ocrResult.pass_results.length > 0 && (
                    <>
                        <button
                            onClick={() => setOpen(!open)}
                            className="mt-4 flex items-center gap-2 text-xs text-slate-400 hover:text-cyan-400
                transition-colors mono-font"
                        >
                            <svg
                                className={`w-3 h-3 transition-transform ${open ? 'rotate-90' : ''}`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                            {open ? 'Hide' : 'Show'} Individual Pass Results
                        </button>

                        {open && (
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {ocrResult.pass_results.map((pass, idx) => (
                                    <div
                                        key={idx}
                                        className="rounded-xl bg-slate-900/40 border border-slate-700/30 p-3"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-semibold text-cyan-400 display-font">
                                                {pass.variant}
                                            </span>
                                            <span className="text-xs text-slate-500 mono-font">
                                                {pass.confidence.toFixed(1)}% conf
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-400 mono-font line-clamp-4 whitespace-pre-wrap">
                                            {pass.text || '(empty)'}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
