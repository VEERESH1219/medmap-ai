import { useEffect, useState } from 'react';

export default function SimilarityBar({ percentage, method, confidence }) {
    const [width, setWidth] = useState(0);

    useEffect(() => {
        // Trigger animation after mount
        const timer = setTimeout(() => setWidth(percentage), 100);
        return () => clearTimeout(timer);
    }, [percentage]);

    const colorMap = {
        High: 'from-emerald-500 to-cyan-400',
        Medium: 'from-amber-500 to-orange-400',
        Low: 'from-red-500 to-rose-400',
    };

    const bgMap = {
        High: 'bg-emerald-500/10',
        Medium: 'bg-amber-500/10',
        Low: 'bg-red-500/10',
    };

    const gradientClass = colorMap[confidence] || colorMap.Low;
    const bgClass = bgMap[confidence] || bgMap.Low;

    const methodLabels = {
        exact_match: 'Exact Match',
        fuzzy_match: 'Fuzzy Match',
        vector_similarity: 'Vector Similarity',
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <span className="mono-font text-xs text-slate-400">Similarity</span>
                <div className="flex items-center gap-2">
                    <span className="mono-font text-sm font-semibold text-slate-200">
                        {percentage.toFixed(1)}%
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-700/60 text-slate-400 mono-font">
                        {methodLabels[method] || method}
                    </span>
                </div>
            </div>

            <div className={`w-full h-2 rounded-full ${bgClass} overflow-hidden`}>
                <div
                    className={`h-full rounded-full bg-gradient-to-r ${gradientClass} transition-all duration-1000 ease-out`}
                    style={{ width: `${width}%` }}
                />
            </div>
        </div>
    );
}
