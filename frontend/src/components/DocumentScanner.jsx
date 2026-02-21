/**
 * DocumentScanner — CSS-based premium document scanning animation.
 * Replaces video with high-fidelity paper representation.
 */
export default function DocumentScanner() {
    return (
        <div style={{
            position: 'absolute', inset: 0, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden', borderRadius: 'inherit',
            zIndex: 0,
            background: 'rgba(2, 4, 10, 0.4)', // Dark depth
        }}>
            {/* Ambient emerald pulse behind document */}
            <div style={{
                position: 'absolute', width: '60%', height: '60%',
                background: 'radial-gradient(ellipse, rgba(16,185,129,0.15) 0%, transparent 70%)',
                filter: 'blur(60px)', top: '20%', left: '20%',
                animation: 'orb-float 4s ease-in-out infinite alternate',
                zIndex: 1,
            }} />

            {/* THE DOCUMENT PAPER */}
            <div style={{
                position: 'relative',
                width: 'min(220px, 45%)', aspectRatio: '3/4',
                background: 'rgba(255,255,255,0.03)',
                // The "Perfect Border": Sharp 1px solid with a subtle outer glow
                border: '1px solid rgba(16,185,129,0.3)',
                borderRadius: 12,
                overflow: 'hidden',
                boxShadow: `
                    0 20px 50px rgba(0,0,0,0.5), 
                    0 0 0 1px rgba(16,185,129,0.1),
                    inset 0 0 20px rgba(16,185,129,0.05)
                `,
                zIndex: 2,
                display: 'flex', flexDirection: 'column', padding: '24px 16px', gap: 10,
                animation: 'scale-in 0.5s cubic-bezier(0.34, 1.3, 0.64, 1) both',
            }}>
                {/* Header-like lines */}
                <DocLine width="40%" opacity={0.4} height={4} />
                <DocLine width="25%" opacity={0.25} height={3} marginBottom={14} />

                {/* Body lines (Prescription content simulation) */}
                {[70, 85, 60, 90, 45, 80, 50, 65].map((w, i) => (
                    <DocLine key={i} width={`${w}%`} opacity={0.15 + (i % 3) * 0.05} />
                ))}

                {/* Footer-like lines */}
                <div style={{ marginTop: 'auto' }}>
                    <DocLine width="30%" opacity={0.2} height={2} />
                </div>

                {/* Inner Scan Reveal Effect (Glow that follows the beam) */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(180deg, rgba(16,185,129,0.08) 0%, transparent 40%, transparent 100%)',
                    animation: 'scan-reveal 3s linear infinite',
                    pointerEvents: 'none',
                    zIndex: 1,
                }} />
            </div>

            {/* THE SCAN BEAM */}
            <div style={{
                position: 'absolute', left: 0, right: 0, height: 2,
                background: 'linear-gradient(90deg, transparent 5%, rgba(16,185,129,0.2) 20%, #10b981 50%, rgba(16,185,129,0.2) 80%, transparent 95%)',
                boxShadow: '0 0 20px 4px rgba(16,185,129,0.4), 0 0 4px 1px rgba(6,182,212,0.5)',
                animation: 'doc-scan 3s linear infinite',
                borderRadius: 9999,
                zIndex: 10,
            }} />

            {/* Corner HUD brackets */}
            <ScanBrackets />
        </div>
    );
}

function DocLine({ width, opacity, height = 3, marginBottom = 0 }) {
    return (
        <div style={{
            width, height, borderRadius: 2,
            background: `rgba(255,255,255,${opacity})`,
            marginBottom
        }} />
    );
}

function ScanBrackets() {
    const sz = 24, t = 2, c = 'rgba(16,185,129,0.4)';
    const corners = [
        { top: '10%', left: '10%', borderTop: `${t}px solid ${c}`, borderLeft: `${t}px solid ${c}` },
        { top: '10%', right: '10%', borderTop: `${t}px solid ${c}`, borderRight: `${t}px solid ${c}` },
        { bottom: '10%', left: '10%', borderBottom: `${t}px solid ${c}`, borderLeft: `${t}px solid ${c}` },
        { bottom: '10%', right: '10%', borderBottom: `${t}px solid ${c}`, borderRight: `${t}px solid ${c}` },
    ];
    return (
        <div style={{ position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none' }}>
            {corners.map((style, i) => (
                <div key={i} style={{
                    position: 'absolute', width: sz, height: sz, ...style,
                    animation: `bracket-pulse 2.5s ease-in-out ${i * 0.15}s infinite alternate`,
                }} />
            ))}
        </div>
    );
}
