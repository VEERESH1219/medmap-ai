/* ─────────────────────────────────────────────
   DosageTimeline.jsx
   Visual 7-day pill planner generated from
   extracted prescription data.
───────────────────────────────────────────── */

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const SLOT_LABELS = ['Morning', 'Afternoon', 'Evening', 'Night'];

// Map frequency → which slots get a pill
function toSlots(freqPerDay) {
    const f = Number(freqPerDay) || 1;
    if (f >= 4) return [0, 1, 2, 3];      // QID — all 4
    if (f === 3) return [0, 1, 3];         // TID — M/A/N
    if (f === 2) return [0, 3];            // BD  — M/N
    return [0];                            // OD  — Morning
}

const PALETTE = [
    { bg: 'rgba(0,200,168,0.15)', dot: '#00c8a8', text: '#34d9bc' },
    { bg: 'rgba(129,140,248,0.15)', dot: '#818cf8', text: '#a5b4fc' },
    { bg: 'rgba(56,189,248,0.15)', dot: '#38bdf8', text: '#7dd3fc' },
    { bg: 'rgba(245,158,11,0.15)', dot: '#f59e0b', text: '#fbbf24' },
    { bg: 'rgba(244,63,94,0.15)', dot: '#f43f5e', text: '#fb7185' },
    { bg: 'rgba(167,139,250,0.15)', dot: '#a78bfa', text: '#c4b5fd' },
    { bg: 'rgba(52,211,153,0.15)', dot: '#34d399', text: '#6ee7b7' },
    { bg: 'rgba(251,146,60,0.15)', dot: '#fb923c', text: '#fdba74' },
];

export default function DosageTimeline({ medicines }) {
    // Only show medicines with duration info (or default to 7 days to show schedule)
    const scheduleMeds = medicines
        .filter(m => m.matched_medicine)
        .map((m, i) => ({
            name: m.structured_data.brand_name,
            strength: m.matched_medicine?.strength || '',
            freq: m.structured_data.frequency_per_day || 1,
            duration: m.structured_data.duration_days || 7,
            slots: toSlots(m.structured_data.frequency_per_day),
            color: PALETTE[i % PALETTE.length],
        }));

    if (scheduleMeds.length === 0) return null;

    return (
        <div style={{
            background: 'rgba(13,17,23,0.8)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 20, overflow: 'hidden',
            backdropFilter: 'blur(20px)',
            animation: 'fade-up 0.4s ease-out 0.2s both',
        }}>
            {/* Header */}
            <div style={{ padding: 'clamp(20px,3vw,32px) clamp(20px,3vw,32px) 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                    <div style={{
                        width: 36, height: 36, borderRadius: 10,
                        background: 'rgba(129,140,248,0.12)', border: '1px solid rgba(129,140,248,0.2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                    }}>📅</div>
                    <div>
                        <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 17, color: '#f0f4ff', margin: 0 }}>
                            7-Day Dose Planner
                        </h3>
                        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', margin: 0 }}>
                            Visual schedule from your prescription
                        </p>
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div style={{ padding: '16px clamp(20px,3vw,32px)', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {scheduleMeds.map((m, i) => (
                    <div key={i} style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        background: m.color.bg, border: `1px solid ${m.color.dot}33`,
                        borderRadius: 999, padding: '4px 12px',
                    }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: m.color.dot, flexShrink: 0 }} />
                        <span style={{ fontSize: 12, fontWeight: 700, color: m.color.text, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            {m.name} {m.strength && <span style={{ fontWeight: 400, opacity: 0.7 }}>{m.strength}</span>}
                        </span>
                    </div>
                ))}
            </div>

            {/* Grid — slot rows × day columns */}
            <div style={{ padding: '0 clamp(20px,3vw,32px) clamp(20px,3vw,28px)', overflowX: 'auto' }}>
                <div style={{ minWidth: 480 }}>
                    {/* Day header */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '88px repeat(7, 1fr)',
                        gap: 4, marginBottom: 6,
                    }}>
                        <div /> {/* empty corner */}
                        {DAY_LABELS.map(d => (
                            <div key={d} style={{
                                textAlign: 'center', fontSize: 11, fontWeight: 700,
                                color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase',
                                letterSpacing: '0.08em', padding: '4px 0',
                            }}>{d}</div>
                        ))}
                    </div>

                    {/* Slot rows */}
                    {SLOT_LABELS.map((slot, slotIdx) => {
                        // Gather medicines that take this slot
                        const active = scheduleMeds.filter(m => m.slots.includes(slotIdx));
                        return (
                            <div key={slot} style={{
                                display: 'grid',
                                gridTemplateColumns: '88px repeat(7, 1fr)',
                                gap: 4, marginBottom: 4,
                            }}>
                                {/* Slot label */}
                                <div style={{
                                    display: 'flex', alignItems: 'center',
                                    fontSize: 11, fontWeight: 700,
                                    color: active.length ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.18)',
                                    textTransform: 'uppercase', letterSpacing: '0.08em',
                                    justifyContent: 'flex-end', paddingRight: 10,
                                }}>{slot}</div>

                                {/* Day cells */}
                                {DAY_LABELS.map((_, dayIdx) => (
                                    <div key={dayIdx} style={{
                                        minHeight: 44, borderRadius: 8,
                                        background: active.length ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.015)',
                                        border: `1px solid ${active.length ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.03)'}`,
                                        display: 'flex', flexDirection: 'column',
                                        alignItems: 'center', justifyContent: 'center',
                                        gap: 3, padding: '6px 4px',
                                    }}>
                                        {active.map((m, mi) => (
                                            dayIdx < m.duration ? (
                                                <div key={mi} style={{
                                                    width: 10, height: 10, borderRadius: '50%',
                                                    background: m.color.dot,
                                                    boxShadow: `0 0 6px ${m.color.dot}80`,
                                                    flexShrink: 0,
                                                }} title={`${m.name} — ${slot}`} />
                                            ) : (
                                                <div key={mi} style={{ width: 10, height: 10, borderRadius: '50%', background: 'transparent' }} />
                                            )
                                        ))}
                                        {active.length === 0 && (
                                            <div style={{ width: 10, height: 1, background: 'rgba(255,255,255,0.06)', borderRadius: 1 }} />
                                        )}
                                    </div>
                                ))}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Note */}
            <div style={{ padding: '12px clamp(20px,3vw,32px) clamp(16px,3vw,24px)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', margin: 0 }}>
                    ⚠️ Schedule is estimated from prescription frequency. Always follow your doctor's exact instructions.
                </p>
            </div>
        </div>
    );
}
