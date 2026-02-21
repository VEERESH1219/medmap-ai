export default function ConfidenceBadge({ confidence }) {
    const config = {
        High: {
            bg: 'bg-emerald-500/20',
            text: 'text-emerald-400',
            ring: 'ring-emerald-500/30',
            dot: 'bg-emerald-400',
        },
        Medium: {
            bg: 'bg-amber-500/20',
            text: 'text-amber-400',
            ring: 'ring-amber-500/30',
            dot: 'bg-amber-400',
        },
        Low: {
            bg: 'bg-red-500/20',
            text: 'text-red-400',
            ring: 'ring-red-500/30',
            dot: 'bg-red-400',
        },
    };

    const c = config[confidence] || config.Low;

    return (
        <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold
        ${c.bg} ${c.text} ring-1 ${c.ring}`}
        >
            <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
            {confidence}
        </span>
    );
}
