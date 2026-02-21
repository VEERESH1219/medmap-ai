import ConfidenceBadge from './ConfidenceBadge';
import SimilarityBar from './SimilarityBar';

export default function ResultCard({ extraction, index }) {
    const { raw_input, structured_data, matched_medicine } = extraction;

    const warningColors = {
        VARIANT_MISMATCH: 'bg-amber-500/10 text-amber-400 ring-amber-500/30',
        FORM_MISMATCH: 'bg-red-500/10 text-red-400 ring-red-500/30',
        COMBINATION_INTEGRITY_VIOLATION: 'bg-orange-500/10 text-orange-400 ring-orange-500/30',
    };

    return (
        <div className="rounded-2xl bg-slate-800/50 border border-slate-700/40 overflow-hidden
      animate-slide-up hover:border-slate-600/60 transition-all"
            style={{ animationDelay: `${index * 100}ms` }}
        >
            {/* Card Header */}
            <div className="px-6 py-4 border-b border-slate-700/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm
            ${matched_medicine
                            ? 'bg-cyan-500/20 text-cyan-400'
                            : 'bg-slate-700/50 text-slate-500'
                        }`}
                    >
                        {matched_medicine ? '✓' : '?'}
                    </span>
                    <div>
                        <h3 className="text-sm font-bold text-slate-100 display-font">
                            {structured_data.brand_name}
                            {structured_data.brand_variant && (
                                <span className="text-cyan-400 ml-1">{structured_data.brand_variant}</span>
                            )}
                        </h3>
                        <p className="text-xs text-slate-500 mono-font">
                            {structured_data.form || 'Unknown form'}
                            {structured_data.frequency_per_day && ` · ${structured_data.frequency_per_day}x/day`}
                            {structured_data.duration_days && ` · ${structured_data.duration_days} days`}
                        </p>
                    </div>
                </div>

                {matched_medicine && (
                    <ConfidenceBadge confidence={matched_medicine.confidence} />
                )}
            </div>

            {/* Card Body — Two Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-700/30">
                {/* LEFT — Extracted Data */}
                <div className="p-5 space-y-3">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider display-font mb-3">
                        Extracted Data
                    </h4>

                    <div className="rounded-xl bg-slate-900/40 p-3">
                        <p className="text-xs text-slate-500 mono-font mb-1">Raw Input</p>
                        <p className="text-sm text-slate-300 mono-font">{raw_input}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <p className="text-xs text-slate-500 mono-font">Brand</p>
                            <p className="text-sm text-slate-200 font-medium">{structured_data.brand_name}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 mono-font">Variant</p>
                            <p className="text-sm text-cyan-400 font-medium">
                                {structured_data.brand_variant || '—'}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 mono-font">Form</p>
                            <p className="text-sm text-slate-200">{structured_data.form || '—'}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 mono-font">Frequency</p>
                            <p className="text-sm text-slate-200">
                                {structured_data.frequency_per_day ? `${structured_data.frequency_per_day}x/day` : '—'}
                            </p>
                        </div>
                    </div>

                    <p className="text-[10px] text-slate-600 mono-font italic mt-2">
                        ⓘ Strength not parsed from input — retrieved from DB
                    </p>
                </div>

                {/* RIGHT — Matched DB Record */}
                <div className="p-5 space-y-3">
                    {matched_medicine ? (
                        <>
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider display-font mb-3">
                                Matched Medicine
                            </h4>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <p className="text-xs text-slate-500 mono-font">Brand Name</p>
                                    <p className="text-sm text-slate-200 font-medium">{matched_medicine.brand_name}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 mono-font">Generic Name</p>
                                    <p className="text-sm text-slate-200">{matched_medicine.generic_name}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 mono-font">Strength</p>
                                    <p className="text-sm text-emerald-400 font-bold">{matched_medicine.strength}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 mono-font">Form</p>
                                    <p className="text-sm text-slate-200">{matched_medicine.form}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 mono-font">Category</p>
                                    <p className="text-sm text-slate-200">{matched_medicine.category || '—'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 mono-font">Manufacturer</p>
                                    <p className="text-sm text-slate-200">{matched_medicine.manufacturer || '—'}</p>
                                </div>
                            </div>

                            {/* Combination Warning */}
                            {matched_medicine.is_combination && (
                                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/5 border border-amber-500/20">
                                    <span className="text-amber-400 text-sm">⚠</span>
                                    <span className="text-xs text-amber-400 mono-font">
                                        Fixed-Dose Combination — Do Not Split
                                    </span>
                                </div>
                            )}

                            {/* Similarity Bar */}
                            <SimilarityBar
                                percentage={matched_medicine.similarity_percentage}
                                method={matched_medicine.match_method}
                                confidence={matched_medicine.confidence}
                            />

                            {/* Validation Warnings */}
                            {matched_medicine.validation_warnings?.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {matched_medicine.validation_warnings.map((w, i) => (
                                        <span
                                            key={i}
                                            className={`text-[10px] px-2 py-1 rounded-full ring-1 mono-font font-semibold
                        ${warningColors[w] || 'bg-slate-700/50 text-slate-400 ring-slate-600/30'}`}
                                        >
                                            {w.replace(/_/g, ' ')}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center py-8">
                            <div className="w-12 h-12 rounded-full bg-slate-700/30 flex items-center justify-center mb-3">
                                <span className="text-2xl">🔍</span>
                            </div>
                            <p className="text-sm text-slate-400 display-font font-semibold">No Match Found</p>
                            <p className="text-xs text-slate-600 mono-font mt-1">
                                Medicine not in database
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
