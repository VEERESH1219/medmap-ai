import React from 'react';

export default function PrescriptionTextViewer({ text }) {
    if (!text) return null;

    return (
        <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-slate-900/50 border border-white/5 shadow-inner relative group">
                {/* Decoration */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 blur-3xl rounded-full" />

                <div className="relative z-10">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                        Cleaned OCR Transcript
                    </p>

                    <div className="text-sm text-slate-300 mono-font leading-relaxed whitespace-pre-wrap break-words">
                        {text}
                    </div>
                </div>

                {/* Subtle Hover Glow */}
                <div className="absolute inset-0 border border-cyan-500/0 group-hover:border-cyan-500/10 transition-colors duration-500 rounded-2xl pointer-events-none" />
            </div>

            <p className="text-[9px] text-slate-600 italic px-2">
                * This represents the unified consensus text used for AI extraction.
            </p>
        </div>
    );
}
