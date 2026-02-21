import { useState, useRef, useCallback } from 'react';

export default function Home({ onSubmit, disabled }) {
    const [mode, setMode] = useState('image');
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [text, setText] = useState('');
    const [drag, setDrag] = useState(false);
    const fileRef = useRef(null);

    const pickFile = useCallback((f) => {
        if (!f) return;
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(f.type)) {
            alert('Please upload a JPG, PNG, or WEBP file.'); return;
        }
        if (f.size > 10 * 1024 * 1024) { alert('Max file size is 10 MB.'); return; }
        setFile(f);
        const fr = new FileReader();
        fr.onload = e => setPreview(e.target.result);
        fr.readAsDataURL(f);
    }, []);

    const onDrop = useCallback(e => {
        e.preventDefault(); setDrag(false);
        if (e.dataTransfer.files[0]) pickFile(e.dataTransfer.files[0]);
    }, [pickFile]);

    const clear = () => { setFile(null); setPreview(null); if (fileRef.current) fileRef.current.value = ''; };

    const handleSubmit = () => {
        if (mode === 'image' && file) {
            const fr = new FileReader();
            fr.onload = () => onSubmit({ image: fr.result });
            fr.readAsDataURL(file);
        } else if (mode === 'text' && text.trim()) {
            onSubmit({ raw_text: text.trim() });
        }
    };

    const canGo = !disabled && ((mode === 'image' && !!file) || (mode === 'text' && text.trim().length > 4));

    return (
        <div style={{ minHeight: '85dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'clamp(24px, 5vw, 60px) 16px' }}>
            <div style={{ width: '100%', maxWidth: 680 }}>

                {/* ── Hero ── */}
                <div style={{ textAlign: 'center', marginBottom: 'clamp(36px, 6vw, 60px)', animation: 'fade-up 0.4s ease-out both' }}>

                    <h1 style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.08,
                        fontSize: 'clamp(42px, 8vw, 80px)', color: '#f0f4ff',
                        marginBottom: 20,
                    }}>
                        Analyze any<br />
                        <span style={{ background: 'linear-gradient(135deg, #10b981, #06b6d4, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                            Prescription.
                        </span>
                    </h1>

                    <p style={{ fontSize: 'clamp(15px, 2vw, 18px)', color: 'rgba(255,255,255,0.45)', maxWidth: 440, margin: '0 auto', lineHeight: 1.75 }}>
                        Upload any handwritten or printed prescription — VAIDYADRISHTI AI reads, identifies, and verifies every medicine in seconds.
                    </p>
                </div>

                {/* ── Input Card ── */}
                <div style={{
                    background: 'rgba(13,17,23,0.85)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 24, overflow: 'hidden',
                    backdropFilter: 'blur(24px)',
                    animation: 'fade-up 0.4s ease-out 0.1s both',
                }}>
                    {/* Mode tabs */}
                    <div style={{ display: 'flex', padding: '10px 10px 0', gap: 4, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        {[{ id: 'image', icon: '📷', label: 'Upload Image' }, { id: 'text', icon: '✏️', label: 'Paste Text' }].map(m => (
                            <button key={m.id} onClick={() => setMode(m.id)} style={{
                                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                padding: '11px 16px',
                                borderRadius: '12px 12px 0 0',
                                border: 'none', cursor: 'pointer',
                                fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: 14,
                                background: mode === m.id ? 'rgba(255,255,255,0.06)' : 'transparent',
                                color: mode === m.id ? '#f0f4ff' : 'rgba(255,255,255,0.3)',
                                transition: 'all 0.2s',
                            }}>
                                <span>{m.icon}</span> {m.label}
                            </button>
                        ))}
                    </div>

                    {/* Image mode */}
                    {mode === 'image' && (
                        <div style={{ padding: 24 }}>
                            {!preview ? (
                                <div
                                    onClick={() => fileRef.current?.click()}
                                    onDragOver={e => { e.preventDefault(); setDrag(true); }}
                                    onDragLeave={() => setDrag(false)}
                                    onDrop={onDrop}
                                    style={{
                                        border: `2px dashed ${drag ? '#10b981' : 'rgba(255,255,255,0.1)'}`,
                                        borderRadius: 16,
                                        padding: 'clamp(40px, 8vw, 80px) 24px',
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
                                        cursor: 'pointer', textAlign: 'center',
                                        background: drag ? 'rgba(0,200,168,0.05)' : 'transparent',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    <div style={{
                                        width: 72, height: 72, borderRadius: 20,
                                        background: drag ? 'rgba(0,200,168,0.15)' : 'rgba(255,255,255,0.04)',
                                        border: `1px solid ${drag ? 'rgba(0,200,168,0.4)' : 'rgba(255,255,255,0.08)'}`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 30, transition: 'transform 0.2s',
                                        transform: drag ? 'scale(1.1)' : 'scale(1)',
                                    }}>
                                        {drag ? '⬇️' : '🏥'}
                                    </div>
                                    <div>
                                        <p style={{ fontSize: 16, fontWeight: 700, color: '#f0f4ff', fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 6 }}>
                                            {drag ? 'Release to upload' : 'Drop prescription here'}
                                        </p>
                                        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)' }}>
                                            or <span style={{ color: '#10b981', fontWeight: 600 }}>click to browse</span>
                                        </p>
                                        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', marginTop: 8 }}>
                                            JPG · PNG · WEBP · max 10 MB
                                        </p>
                                    </div>
                                    <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.webp"
                                        onChange={e => pickFile(e.target.files[0])} style={{ display: 'none' }} />
                                </div>
                            ) : (
                                <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)' }}>
                                    <div style={{ background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, minHeight: 200, position: 'relative' }}>
                                        <img src={preview} alt="Preview"
                                            style={{ maxWidth: '100%', maxHeight: 280, borderRadius: 12, objectFit: 'contain', boxShadow: '0 16px 48px rgba(0,0,0,0.5)' }} />
                                        {/* Ready badge */}
                                        <span style={{
                                            position: 'absolute', top: 14, right: 14,
                                            background: 'rgba(34,197,94,0.15)', color: '#4ade80',
                                            border: '1px solid rgba(34,197,94,0.3)',
                                            borderRadius: 999, padding: '4px 12px', fontSize: 11, fontWeight: 700,
                                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                                        }}>✓ Ready</span>
                                    </div>
                                    <div style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        padding: '12px 16px', background: 'rgba(255,255,255,0.03)',
                                        borderTop: '1px solid rgba(255,255,255,0.06)',
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <span style={{ fontSize: 20 }}>🖼️</span>
                                            <div>
                                                <p style={{ fontSize: 13, fontWeight: 600, color: '#f0f4ff', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{file?.name}</p>
                                                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{(file?.size / 1024).toFixed(0)} KB</p>
                                            </div>
                                        </div>
                                        <button onClick={clear} style={{
                                            background: 'rgba(244,63,94,0.1)', color: '#fb7185',
                                            border: '1px solid rgba(244,63,94,0.2)', borderRadius: 8,
                                            padding: '6px 14px', fontSize: 12, fontWeight: 700,
                                            cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
                                        }}>Remove</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Text mode */}
                    {mode === 'text' && (
                        <div style={{ padding: 24 }}>
                            <textarea
                                value={text} onChange={e => setText(e.target.value)}
                                placeholder={"Paste prescription text here...\n\nExample:\n  Amoxiclav 625 mg  BD × 5 days\n  Pantop 40 mg  OD before food"}
                                style={{
                                    width: '100%', minHeight: 240,
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    borderRadius: 14, padding: '20px',
                                    color: '#f0f4ff', fontSize: 15, lineHeight: 1.8,
                                    fontFamily: 'Inter, sans-serif', resize: 'vertical',
                                    outline: 'none', transition: 'border-color 0.2s',
                                }}
                                onFocus={e => e.target.style.borderColor = 'rgba(16,185,129,0.4)'}
                                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                            />
                            {text && <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', marginTop: 6 }}>
                                {text.trim().split(/\s+/).filter(Boolean).length} words
                            </p>}
                        </div>
                    )}

                    {/* Submit */}
                    <div style={{ padding: '0 24px 24px' }}>
                        <button onClick={handleSubmit} disabled={!canGo} style={{
                            width: '100%', padding: '17px 24px', borderRadius: 14, border: 'none',
                            background: canGo
                                ? 'linear-gradient(135deg, #10b981, #059669)'
                                : 'rgba(255,255,255,0.05)',
                            color: canGo ? '#052c22' : 'rgba(255,255,255,0.2)',
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            fontWeight: 800, fontSize: 15, cursor: canGo ? 'pointer' : 'not-allowed',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                            boxShadow: canGo ? '0 8px 32px rgba(16,185,129,0.3)' : 'none',
                            transition: 'all 0.25s cubic-bezier(0.34,1.2,0.64,1)',
                            transform: canGo ? 'none' : 'none',
                        }}
                            onMouseEnter={e => { if (canGo) e.currentTarget.style.boxShadow = '0 12px 40px rgba(16,185,129,0.45)'; }}
                            onMouseLeave={e => { if (canGo) e.currentTarget.style.boxShadow = '0 8px 32px rgba(16,185,129,0.3)'; }}
                        >
                            {disabled ? (
                                <>
                                    <span style={{ display: 'inline-block', animation: 'spin 0.8s linear infinite', fontSize: 18 }}>⟳</span>
                                    Analyzing…
                                </>
                            ) : (
                                <>Analyze Prescription →</>
                            )}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
