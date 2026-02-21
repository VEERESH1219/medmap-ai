export default function ConfidenceBadge({ confidence }) {
    const config = {
        High: {
            bg: 'bg-emerald-500/10',
            text: 'text-emerald-400',
            border: 'border-emerald-500/20',
            dot: 'bg-emerald-400',
            shadow: 'shadow-emerald-500/10',
        },
        Medium: {
            bg: 'bg-amber-500/10',
            text: 'text-amber-400',
            border: 'border-amber-500/20',
            dot: 'bg-amber-400',
            shadow: 'shadow-amber-500/10',
        },
        Low: {
            bg: 'bg-red-500/10',
            text: 'text-red-400',
            border: 'border-red-500/20',
            dot: 'bg-red-400',
            shadow: 'shadow-red-500/10',
        },
    };

    const c = config[confidence] || config.Low;

    return (
        <span
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest display-font border shadow-lg
        ${c.bg} ${c.text} ${c.border} ${c.shadow}`}
        >
            <span className={`w-1.5 h-1.5 rounded-full ${c.dot} shadow-[0_0_8px_currentColor] animate-pulse`} />
            {confidence}
        </span>
    );
}
