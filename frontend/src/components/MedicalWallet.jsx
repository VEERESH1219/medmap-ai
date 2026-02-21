import { useRef, useState } from 'react';
import { toPng } from 'html-to-image';

/* ─────────────────────────────────────────────────────────────
   MedicalWallet — Premium modal with real PDF download.
   - Download PDF: uses jsPDF + html-to-image (actual .pdf file)
   - Save as Image: downloads card as .png
   No WhatsApp. No Print button.
──────────────────────────────────────────────────────────────── */

const COLORS = ['#10b981', '#06b6d4', '#34d399', '#059669', '#2dd4bf', '#14b8a6', '#0f766e', '#6ee7b7'];

export default function MedicalWallet({ result, onClose }) {
    const cardRef = useRef(null);
    const [savingImg, setSavingImg] = useState(false);
    const [savingPdf, setSavingPdf] = useState(false);

    const { medical_condition, processing_time_ms, extracted_medicines } = result;
    const medicines = extracted_medicines ?? [];
    const matched = medicines.filter(m => m.matched_medicine);

    /* ── Save as PNG ── */
    const saveAsPng = async () => {
        if (!cardRef.current || savingImg) return;
        setSavingImg(true);
        try {
            await new Promise(r => setTimeout(r, 80)); // let react settle
            const png = await toPng(cardRef.current, { pixelRatio: 2.5, cacheBust: true });
            const a = Object.assign(document.createElement('a'), { href: png, download: 'MedMap-Wallet.png' });
            document.body.appendChild(a); a.click(); document.body.removeChild(a);
        } catch (e) { console.error(e); }
        finally { setSavingImg(false); }
    };

    /* ── Download as actual PDF ── */
    const downloadAsPdf = async () => {
        if (!cardRef.current || savingPdf) return;
        setSavingPdf(true);
        try {
            await new Promise(r => setTimeout(r, 80));
            const png = await toPng(cardRef.current, { pixelRatio: 2.5, cacheBust: true });
            // Dynamic import so jspdf doesn't bloat initial bundle
            const { jsPDF } = await import('jspdf');
            const img = new Image();
            img.src = png;
            await new Promise(r => { img.onload = r; });
            const W = 148; // A5 width mm
            const H = (img.naturalHeight / img.naturalWidth) * W;
            const pdf = new jsPDF({ orientation: H > W ? 'portrait' : 'landscape', unit: 'mm', format: [W, H] });
            pdf.addImage(png, 'PNG', 0, 0, W, H);
            pdf.save('MedMap-Wallet.pdf');
        } catch (e) { console.error(e); }
        finally { setSavingPdf(false); }
    };

    const busy = savingImg || savingPdf;

    return (
        <>
            {/* Backdrop */}
            <div onClick={onClose} style={{
                position: 'fixed', inset: 0, zIndex: 100,
                background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)', animation: 'fade-in 0.2s ease both',
            }} />

            {/* Modal shell — scrollable, starts below navbar */}
            <div style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 101,
                overflowY: 'auto',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                padding: '76px 16px 40px',   /* 76px = navbar(60) + 16 gap */
            }}>
                <div style={{
                    width: '100%', maxWidth: 580,
                    background: 'rgba(6,6,18,0.98)', backdropFilter: 'blur(40px)',
                    WebkitBackdropFilter: 'blur(40px)',
                    border: '1px solid rgba(16,185,129,0.18)',
                    borderRadius: 24,
                    animation: 'scale-in 0.3s cubic-bezier(0.34,1.1,0.64,1) both',
                    boxShadow: '0 40px 100px rgba(0,0,0,0.8), 0 0 0 1px rgba(16,185,129,0.1), 0 0 80px rgba(16,185,129,0.06)',
                }}>

                    {/* ── Modal top bar ── */}
                    <div style={{
                        padding: '18px 22px',
                        borderBottom: '1px solid rgba(255,255,255,0.06)',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        background: 'rgba(16,185,129,0.04)',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                            <div style={{
                                width: 38, height: 38, borderRadius: 11,
                                background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                                boxShadow: '0 4px 16px rgba(16,185,129,0.4)',
                            }}>💊</div>
                            <div>
                                <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 15, color: '#eef0ff', lineHeight: 1.2 }}>Medical Wallet</p>
                                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 2, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Prescription Summary Card</p>
                            </div>
                        </div>
                        <button onClick={onClose} style={{
                            width: 34, height: 34, borderRadius: 9,
                            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                            color: 'rgba(255,255,255,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', fontSize: 18, lineHeight: 1, transition: 'all 0.15s',
                        }}>×</button>
                    </div>

                    {/* ── THE EXPORTABLE CARD ── */}
                    <div style={{ padding: '20px 22px 0' }}>
                        <div ref={cardRef} style={{
                            borderRadius: 18, overflow: 'hidden',
                            background: '#ffffff', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                            boxShadow: '0 2px 24px rgba(0,0,0,0.15)',
                        }}>
                            {/* Card header — dark gradient */}
                            <div style={{ background: 'linear-gradient(135deg, #022c22 0%, #064e3b 100%)', padding: '22px 24px 18px', position: 'relative', overflow: 'hidden' }}>
                                {/* Decorative glow */}
                                <div style={{ position: 'absolute', right: -30, top: -30, width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />

                                {/* Brand row */}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                                        <div style={{ width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(135deg, #10b981, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 16, color: '#fff' }}>V</div>
                                        <div>
                                            <p style={{ color: '#eef0ff', fontWeight: 800, fontSize: 13, margin: 0 }}>VAIDYADRISHTI AI</p>
                                            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 9, margin: '1px 0 0', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Medical Wallet Card</p>
                                        </div>
                                    </div>
                                    {/* Match rate badge */}
                                    <div style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 9, padding: '4px 10px' }}>
                                        <p style={{ color: '#6ee7b7', fontSize: 10, fontWeight: 800, margin: 0, letterSpacing: '0.04em' }}>{matched.length}/{medicines.length} Verified</p>
                                    </div>
                                </div>

                                {/* Diagnosis */}
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.22)', borderRadius: 8, padding: '4px 10px', marginBottom: 10 }}>
                                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 6px rgba(16,185,129,0.8)' }} />
                                    <span style={{ fontSize: 9, fontWeight: 800, color: '#6ee7b7', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Diagnosis</span>
                                </div>
                                <h2 style={{ color: '#eef0ff', fontWeight: 800, fontSize: 22, margin: '0 0 4px', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                                    {medical_condition || <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 18 }}>Not detected</span>}
                                </h2>
                                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, margin: 0 }}>
                                    {processing_time_ms}ms · Analyzed by AI
                                </p>
                            </div>

                            {/* Card body — white */}
                            <div style={{ background: '#f8fafc', padding: '18px 24px 20px' }}>
                                <p style={{ fontSize: 9, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 14px' }}>
                                    Prescribed Medicines
                                </p>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    {medicines.length === 0 && (
                                        <p style={{ color: '#94a3b8', fontSize: 13, fontStyle: 'italic' }}>No medicines detected</p>
                                    )}
                                    {medicines.map((m, i) => {
                                        const sd = m.structured_data;
                                        const mm = m.matched_medicine;
                                        const color = COLORS[i % COLORS.length];
                                        return (
                                            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, paddingBottom: 10, borderBottom: i < medicines.length - 1 ? '1px solid #e2e8f0' : 'none' }}>
                                                {/* Color stripe */}
                                                <div style={{ width: 3, minHeight: 40, background: color, borderRadius: 2, flexShrink: 0, marginTop: 2 }} />
                                                {/* Info */}
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 7, flexWrap: 'wrap' }}>
                                                        <span style={{ fontWeight: 800, fontSize: 14, color: '#0f172a' }}>{sd.brand_name}</span>
                                                        {mm?.strength && <span style={{ fontSize: 11, color: '#22c55e', fontWeight: 700 }}>{mm.strength}</span>}
                                                        {!mm && <span style={{ fontSize: 9, color: '#f59e0b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', background: 'rgba(245,158,11,0.1)', padding: '1px 6px', borderRadius: 4 }}>Unverified</span>}
                                                    </div>
                                                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 3 }}>
                                                        {sd.form && <span style={{ fontSize: 11, color: '#64748b' }}>{sd.form}</span>}
                                                        {sd.frequency_per_day && <span style={{ fontSize: 11, color: '#64748b' }}>· {sd.frequency_per_day}× daily</span>}
                                                        {sd.duration_days && <span style={{ fontSize: 11, color: '#64748b' }}>· {sd.duration_days} days</span>}
                                                    </div>
                                                    {mm?.generic_name && <p style={{ fontSize: 10, color: '#94a3b8', margin: '2px 0 0' }}>{mm.generic_name}</p>}
                                                </div>
                                                {mm?.similarity_percentage && (
                                                    <span style={{ fontSize: 11, fontWeight: 800, color, flexShrink: 0 }}>{mm.similarity_percentage.toFixed(0)}%</span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Footer */}
                                <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <p style={{ fontSize: 9, color: '#cbd5e1', margin: 0 }}>Generated by VAIDYADRISHTI AI · For reference only · Not a substitute for medical advice</p>
                                    <div style={{ display: 'flex', gap: 3 }}>
                                        {COLORS.slice(0, Math.min(matched.length, 8)).map((c, i) => (
                                            <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Action buttons ── */}
                    <div style={{ padding: '18px 22px 22px', display: 'flex', gap: 10 }}>
                        {/* Download PDF — teal gradient, primary action */}
                        <button
                            onClick={downloadAsPdf}
                            disabled={busy}
                            style={{
                                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                padding: '13px 20px', borderRadius: 13, border: 'none',
                                cursor: busy ? 'wait' : 'pointer',
                                background: busy ? 'rgba(16,185,129,0.3)' : 'linear-gradient(135deg, #10b981, #06b6d4)',
                                color: '#fff',
                                fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 14,
                                boxShadow: busy ? 'none' : '0 4px 24px rgba(16,185,129,0.4)',
                                transition: 'all 0.2s',
                            }}
                        >
                            {savingPdf ? (
                                <><Spinner /> Generating PDF…</>
                            ) : (
                                <>
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                        <polyline points="14 2 14 8 20 8" />
                                        <line x1="12" y1="12" x2="12" y2="18" /><polyline points="9 15 12 18 15 15" />
                                    </svg>
                                    Download PDF
                                </>
                            )}
                        </button>

                        {/* Save as Image — ghost */}
                        <button
                            onClick={saveAsPng}
                            disabled={busy}
                            style={{
                                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                padding: '13px 20px', borderRadius: 13,
                                border: '1px solid rgba(255,255,255,0.1)',
                                cursor: busy ? 'wait' : 'pointer',
                                background: 'rgba(255,255,255,0.05)',
                                color: busy ? 'rgba(255,255,255,0.3)' : '#eef0ff',
                                fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: 14,
                                transition: 'all 0.2s',
                            }}
                        >
                            {savingImg ? (
                                <><Spinner /> Saving…</>
                            ) : (
                                <>
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                        <circle cx="8.5" cy="8.5" r="1.5" />
                                        <polyline points="21 15 16 10 5 21" />
                                    </svg>
                                    Save as Image
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

function Spinner() {
    return (
        <div style={{
            width: 14, height: 14, borderRadius: '50%',
            border: '2px solid rgba(255,255,255,0.3)',
            borderTopColor: '#fff',
            animation: 'spin 0.7s linear infinite',
            flexShrink: 0,
        }} />
    );
}
