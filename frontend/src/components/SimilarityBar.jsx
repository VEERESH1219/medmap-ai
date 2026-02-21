import { useEffect, useState } from 'react';

export default function SimilarityBar({ percentage, method, confidence }) {
    const [width, setWidth] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => setWidth(percentage), 200);
        return () => clearTimeout(timer);
    }, [percentage]);

    const colorMap = {
        High: 'from-emerald-500 via-emerald-400 to-cyan-400 shadow-[0_0_12px_rgba(16,185,129,0.3)]',
        Medium: 'from-amber-600 via-amber-500 to-orange-400 shadow-[0_0_12px_rgba(245,158,11,0.3)]',
        Low: 'from-red-600 via-red-500 to-rose-400 shadow-[0_0_12px_rgba(239,68,68,0.3)]',
    };

    const gradientClass = colorMap[confidence] || colorMap.Low;

    const methodIcons = {
        exact_match: '⚡',
        fuzzy_match: '〰️',
        vector_similarity: '🧠',
    };

    const methodLabels = {
        exact_match: 'Exact Matched',
        fuzzy_match: 'Fuzzy Token Match',
        vector_similarity: 'Semantic Similarity',
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] display-font">Confidence Score</span>
                    <span className="text-xs font-black text-white display-font tracking-tight">{percentage.toFixed(1)}%</span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 border border-white/5">
                    <span className="text-[10px]">{methodIcons[method] || '🔍'}</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mono-font">
                        {methodLabels[method] || method}
                    </span>
                </div>
            </div>

            <div className="w-full h-2 rounded-full bg-white/[0.03] overflow-hidden p-[1px] border border-white/5 relative">
                {/* Background flow effect */}
                <div className="absolute inset-0 bg-white/5 opacity-20" />

                <div
                    className={`h-full rounded-full bg-gradient-to-r ${gradientClass} transition-all duration-1000 cubic-bezier(0.2, 0.8, 0.2, 1) relative`}
                    style={{ width: `${width}%` }}
                >
                    {/* Animated shine */}
                    <div className="absolute top-0 left-0 w-full h-full bg-white/20 animate-pulse" />
                </div>
            </div>

            <p className="text-[8px] text-slate-600 uppercase tracking-[0.2em] mono-font text-right italic font-medium">
                Verification threshold met: 0.25
            </p>
        </div>
    );
}
