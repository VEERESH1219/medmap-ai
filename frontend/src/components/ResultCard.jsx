import ConfidenceBadge from './ConfidenceBadge';
import SimilarityBar from './SimilarityBar';

export default function ResultCard({ extraction, index }) {
    const { raw_input, structured_data, matched_medicine } = extraction;

    const warningColors = {
        VARIANT_MISMATCH: 'bg-amber-500/10 text-amber-400 ring-amber-500/20',
        FORM_MISMATCH: 'bg-red-500/10 text-red-400 ring-red-500/20',
        COMBINATION_INTEGRITY_VIOLATION: 'bg-orange-500/10 text-orange-400 ring-orange-500/20',
    };

    return (
        <div
            className="group glass-panel rounded-3xl overflow-hidden border-white/5 hover:border-white/10 transition-all duration-500 shadow-xl hover:shadow-cyan-500/10 animate-fade-in-up"
            style={{ animationDelay: `${index * 150}ms` }}
        >
            {/* ── CARD HEADER ──────────────────────── */}
            <div className="px-8 py-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-inner transition-transform group-hover:scale-110 duration-500
                        ${matched_medicine
                            ? 'bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 text-cyan-400 border border-cyan-500/20'
                            : 'bg-slate-800/50 text-slate-500 border border-white/5'
                        }`}
                    >
                        {matched_medicine ? '💊' : '❓'}
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-white display-font tracking-tight">
                            {structured_data.brand_name}
                            {structured_data.brand_variant && (
                                <span className="text-cyan-400 ml-2 font-medium">({structured_data.brand_variant})</span>
                            )}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mono-font bg-white/5 px-2 py-0.5 rounded">
                                {structured_data.form || 'GENERIC'}
                            </span>
                            {structured_data.frequency_per_day && (
                                <span className="text-[10px] font-medium text-indigo-400 mono-font">
                                    · {structured_data.frequency_per_day}x daily
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {matched_medicine && (
                    <div className="flex flex-col items-end">
                        <ConfidenceBadge confidence={matched_medicine.confidence} />
                        <span className="text-[8px] text-slate-600 mono-font mt-1 uppercase tracking-tighter">AI Consensus</span>
                    </div>
                )}
            </div>

            {/* ── CARD BODY ───────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-white/5">

                {/* LEFT: Raw Extraction (4 cols) */}
                <div className="lg:col-span-4 p-6 bg-black/10">
                    <div className="flex items-center gap-2 mb-4 opacity-60">
                        <div className="w-1 h-3 bg-slate-500 rounded-full" />
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest display-font">Prescription Input</h4>
                    </div>

                    <div className="space-y-5">
                        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                            <p className="text-[9px] text-slate-500 mono-font mb-2 uppercase tracking-tight">OCR Segment</p>
                            <p className="text-xs text-slate-300 mono-font leading-relaxed italic">"{raw_input}"</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-[9px] text-slate-600 uppercase tracking-widest font-bold">Frequency</p>
                                <p className="text-sm text-white font-medium display-font">
                                    {structured_data.frequency_per_day ? `${structured_data.frequency_per_day} times` : '—'}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[9px] text-slate-600 uppercase tracking-widest font-bold">Duration</p>
                                <p className="text-sm text-white font-medium display-font">
                                    {structured_data.duration_days ? `${structured_data.duration_days} days` : '—'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT: Matched Metadata (8 cols) */}
                <div className="lg:col-span-8 p-6 relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-[60px] rounded-full pointer-events-none" />

                    {matched_medicine ? (
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 mb-2">
                                <div className={`w-1 h-3 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.5)] 
                                    ${(matched_medicine.verified_by?.includes('AI Knowledge') || matched_medicine.verified_by?.includes('Web Source'))
                                        ? 'bg-purple-500 shadow-purple-500/50'
                                        : 'bg-cyan-500 shadow-cyan-500/50'}`}
                                />
                                <h4 className={`text-[10px] font-black uppercase tracking-widest display-font 
                                    ${(matched_medicine.verified_by?.includes('AI Knowledge') || matched_medicine.verified_by?.includes('Web Source'))
                                        ? 'text-purple-400'
                                        : 'text-cyan-400/80'}`}>
                                    {matched_medicine.verified_by || 'Database Registry Match'}
                                </h4>
                                {(matched_medicine.verified_by?.includes('AI Knowledge') || matched_medicine.verified_by?.includes('Web Source')) && (
                                    <span className="text-[8px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded-full border border-purple-500/30 font-bold ml-auto animate-pulse">STAGE 4</span>
                                )}
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                <div className="space-y-1">
                                    <p className="text-[9px] text-slate-600 uppercase tracking-widest font-bold">Generic Molecule</p>
                                    <p className="text-sm text-white font-semibold leading-tight">{matched_medicine.generic_name}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[9px] text-slate-600 uppercase tracking-widest font-bold">Standard Strength</p>
                                    <p className="text-sm text-emerald-400 font-black display-font">{matched_medicine.strength}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[9px] text-slate-600 uppercase tracking-widest font-bold">Manufacturer</p>
                                    <p className="text-sm text-slate-300 font-medium truncate">{matched_medicine.manufacturer || '—'}</p>
                                </div>
                            </div>

                            {/* Status Indicators */}
                            <div className="flex flex-wrap gap-3">
                                {matched_medicine.is_combination && (
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 shadow-inner">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                                        <span className="text-[9px] text-indigo-300 font-bold uppercase tracking-wider">Fixed-Dose Combo</span>
                                    </div>
                                )}

                                {matched_medicine.validation_warnings?.map((w, i) => (
                                    <div
                                        key={i}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border shadow-inner ${warningColors[w] || 'bg-slate-800/50 text-slate-400 border-white/5'}`}
                                    >
                                        <span className="text-[9px] font-bold uppercase tracking-wider">{w.replace(/_/g, ' ')}</span>
                                    </div>
                                ))}
                            </div>

                            {/* AI Matching Logic */}
                            <div className="pt-2 border-t border-white/5">
                                <SimilarityBar
                                    percentage={matched_medicine.similarity_percentage}
                                    method={matched_medicine.match_method}
                                    confidence={matched_medicine.confidence}
                                />
                            </div>

                            {/* --- MEDICINE USAGE SECTION --- */}
                            {matched_medicine.description && (
                                <div className="mt-4 p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/10 relative overflow-hidden group/usage">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500/40" />
                                    <h5 className="text-[10px] font-black uppercase tracking-widest text-cyan-400/60 mb-1.5 display-font">Usage & Indication (AI)</h5>
                                    <p className="text-sm text-slate-200 leading-relaxed font-medium italic">
                                        "{matched_medicine.description}"
                                    </p>
                                </div>
                            )}
                        </div>
                    ) : extraction.fallback_required ? (
                        <div className="flex flex-col items-start justify-center py-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                                    <span className="text-lg">🔍</span>
                                </div>
                                <div>
                                    <h5 className="text-white font-bold tracking-tight display-font">Manual Search Required</h5>
                                    <p className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Not in Registry or AI Knowledge</p>
                                </div>
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed mb-6">
                                We couldn't verify this medicine against our local database or global knowledge base. It might be a shorthand, a major typo, or a non-drug item.
                            </p>
                            <a
                                href={`https://www.google.com/search?q=${extraction.structured_data.brand_name}+medicine`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-5 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-300 hover:bg-white/10 hover:text-white transition-all shadow-inner"
                            >
                                Search on Google
                            </a>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-10 text-center">
                            <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-4 border border-white/5 shadow-inner">
                                <span className="text-2xl grayscale opacity-30">🔍</span>
                            </div>
                            <h5 className="text-white font-bold tracking-tight display-font">Record Not Indexed</h5>
                            <p className="text-xs text-slate-500 max-w-[200px] mt-2 leading-relaxed">
                                This extraction did not meet the similarity threshold for a verified match.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
