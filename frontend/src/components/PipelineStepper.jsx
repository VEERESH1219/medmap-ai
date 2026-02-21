const STEPS = [
    { id: 1, label: 'Upload', icon: '📤', desc: 'Receiving prescription input' },
    { id: 2, label: 'Preprocessing', icon: '🔧', desc: 'Running 5 image variants (sharp)' },
    { id: 3, label: 'OCR Consensus', icon: '👁️', desc: '5-pass Tesseract + token voting' },
    { id: 4, label: 'NLP Extraction', icon: '🧬', desc: 'Claude clinical NER parsing' },
    { id: 5, label: 'Hybrid Matching', icon: '🎯', desc: '3-stage DB matching engine' },
];

export default function PipelineStepper({ currentStep }) {
    return (
        <div className="w-full max-w-3xl mx-auto py-12 animate-slide-up">
            {/* Stepper Header */}
            <h2 className="text-center text-lg font-bold text-slate-200 display-font mb-2">
                Processing Pipeline
            </h2>
            <p className="text-center text-sm text-slate-500 mono-font mb-10">
                {STEPS.find((s) => s.id === currentStep)?.desc || 'Initializing...'}
            </p>

            {/* Steps */}
            <div className="flex items-center justify-between relative">
                {/* Connecting line */}
                <div className="absolute top-6 left-0 right-0 h-0.5 bg-slate-700/60 z-0" />
                <div
                    className="absolute top-6 left-0 h-0.5 bg-gradient-to-r from-cyan-500 to-cyan-400 z-0 transition-all duration-700 ease-out"
                    style={{
                        width: `${((Math.min(currentStep, STEPS.length) - 1) / (STEPS.length - 1)) * 100}%`,
                    }}
                />

                {STEPS.map((step) => {
                    const isDone = step.id < currentStep;
                    const isActive = step.id === currentStep;
                    const isPending = step.id > currentStep;

                    return (
                        <div key={step.id} className="flex flex-col items-center relative z-10">
                            {/* Circle */}
                            <div
                                className={`w-12 h-12 rounded-full flex items-center justify-center text-lg
                  transition-all duration-500 border-2
                  ${isDone
                                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400 scale-100'
                                        : isActive
                                            ? 'bg-cyan-500/10 border-cyan-400 text-cyan-300 animate-pulse-cyan scale-110'
                                            : 'bg-slate-800/50 border-slate-600/40 text-slate-600 scale-90'
                                    }`}
                            >
                                {isDone ? (
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    <span>{step.icon}</span>
                                )}
                            </div>

                            {/* Label */}
                            <span
                                className={`mt-3 text-xs font-semibold display-font transition-colors
                  ${isDone ? 'text-cyan-400' : isActive ? 'text-cyan-300' : 'text-slate-600'}`}
                            >
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
