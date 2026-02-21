import { useState } from 'react';
import { speak, stop, isSpeaking, isSupported } from '../services/SpeechService';

export default function SummaryCard({ result }) {
    const [speaking, setSpeaking] = useState(false);
    const { medical_condition, processing_time_ms, extracted_medicines, ocr_result } = result;
    const matched = extracted_medicines?.filter(e => e.matched_medicine).length ?? 0;
    const total = extracted_medicines?.length ?? 0;
    const score = ocr_result?.consensus_score ?? 0;

    const speakSummary = () => {
        if (speaking) { stop(); setSpeaking(false); return; }
        const names = extracted_medicines?.filter(e => e.matched_medicine).map(e => e.structured_data.brand_name).join(', ');
        speak(`Prescription diagnosed as ${medical_condition || 'unknown condition'}. ${total} medicines detected: ${names || 'none'}.`);
        setSpeaking(true);
        const p = setInterval(() => { if (!isSpeaking()) { setSpeaking(false); clearInterval(p); } }, 500);
    };

    const scoreColor = score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444';

    return (
        <div style={{
            background: 'rgba(13,17,23,0.85)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 24,
            overflow: 'hidden',
            backdropFilter: 'blur(24px)',
            animation: 'fade-up 0.35s ease-out both',
        }}>
            {/* Premium Emerald top stripe */}
            <div style={{ height: 3, background: 'linear-gradient(90deg, #10b981, #06b6d4, #34d399)', width: '100%' }} />

            <div style={{ padding: 'clamp(24px, 4vw, 48px)' }}>
                {/* Label row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
                    <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        background: 'rgba(16,185,129,0.1)', color: '#10b981',
                        border: '1px solid rgba(16,185,129,0.2)', borderRadius: 999,
                        padding: '4px 12px', fontSize: 10, fontWeight: 700,
                        letterSpacing: '0.1em', textTransform: 'uppercase',
                    }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block', animation: 'pulse-dot 1.6s ease-in-out infinite' }} />
                        Prescription Diagnosis
                    </span>

                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: 5,
                            background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)',
                            border: '1px solid rgba(255,255,255,0.08)', borderRadius: 999,
                            padding: '4px 12px', fontSize: 11, fontWeight: 600,
                        }}>⚡ {processing_time_ms}ms</span>

                        {isSupported() && (
                            <button onClick={speakSummary} title={speaking ? 'Stop' : 'Read aloud'} style={{
                                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                                background: speaking ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.05)',
                                border: `1px solid ${speaking ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.08)'}`,
                                color: speaking ? '#10b981' : 'rgba(255,255,255,0.4)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', transition: 'all 0.2s',
                            }}>
                                {speaking ? '⏸' : '🔊'}
                            </button>
                        )}
                    </div>
                </div>

                {/* Condition */}
                <h2 style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.15,
                    fontSize: 'clamp(28px, 5vw, 48px)', color: '#f0f4ff',
                    marginBottom: 32,
                }}>
                    {medical_condition || <span style={{ color: 'rgba(255,255,255,0.2)' }}>No condition detected</span>}
                </h2>

                {/* Stats — inline pills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                    <StatPill value={total} label="Medicines" color="#10b981" />
                    <StatPill
                        value={`${matched}/${total}`}
                        label="Matched"
                        color={matched === total && total > 0 ? '#10b981' : '#f59e0b'}
                    />
                    <StatPill
                        value={`${score.toFixed(0)}%`}
                        label="OCR Score"
                        color={scoreColor}
                    />
                    {ocr_result?.fallback_used === 'gpt4o_vision' && (
                        <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: 5,
                            padding: '8px 16px', borderRadius: 12,
                            background: 'rgba(16,185,129,0.1)', color: '#6ee7b7',
                            border: '1px solid rgba(16,185,129,0.2)',
                            fontSize: 12, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif",
                        }}>🤖 GPT-4o Vision</span>
                    )}
                </div>
            </div>
        </div>
    );
}

function StatPill({ value, label, color }) {
    return (
        <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '8px 20px', borderRadius: 12,
            background: `${color}11`, border: `1px solid ${color}22`,
        }}>
            <span style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 800, fontSize: 18, color,
            }}>{value}</span>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>
                {label}
            </span>
        </div>
    );
}
