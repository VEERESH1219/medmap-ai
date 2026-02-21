import { useState } from 'react';
import UploadZone from './components/UploadZone';
import PipelineStepper from './components/PipelineStepper';
import OCRPassDebugger from './components/OCRPassDebugger';
import ResultCard from './components/ResultCard';
import JsonInspector from './components/JsonInspector';
import PrescriptionTextViewer from './components/PrescriptionTextViewer';

const API_URL = '/api/process-prescription';

const PHASE_STEPS = {
  idle: 0,
  uploading: 1,
  preprocessing: 2,
  ocr: 3,
  nlp: 4,
  matching: 5,
  done: 5,
  error: 0,
};

export default function App() {
  const [phase, setPhase] = useState('idle');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const runPipeline = async (input) => {
    setError(null);
    setResult(null);

    try {
      setPhase('uploading');
      await delay(400);

      setPhase('preprocessing');
      await delay(600);

      setPhase('ocr');

      const body = {
        ...input,
        options: {
          ocr_passes: 5,
          min_consensus: 3,
          debug_passes: true,
        },
      };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.suggestion || 'Processing failed.');
      }

      setPhase('nlp');
      await delay(500);

      setPhase('matching');
      await delay(400);

      setResult(data);
      setPhase('done');
    } catch (err) {
      console.error('[Pipeline Error]', err);
      setError(err.message || 'An unexpected error occurred.');
      setPhase('error');
    }
  };

  const reset = () => {
    setPhase('idle');
    setResult(null);
    setError(null);
  };

  const isProcessing = !['idle', 'done', 'error'].includes(phase);

  return (
    <div className="min-h-screen relative flex flex-col body-font">
      {/* ── Background Elements ─────────────────── */}
      <div className="bg-mesh" />
      <div className="bg-grid" />

      {/* ── Header ──────────────────────────────── */}
      <header className="sticky top-0 z-50 w-full glass-panel border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4 group cursor-pointer" onClick={reset}>
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-500/20 blur-lg rounded-full animate-pulse" />
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-500
                flex items-center justify-center text-slate-950 font-black text-xl display-font shadow-lg shadow-cyan-500/20 relative">
                M
              </div>
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white display-font tracking-tight">
                MedMap <span className="text-cyan-400">AI</span>
              </h1>
              <p className="text-[10px] text-slate-400 mono-font tracking-widest uppercase">
                Intelligent Analysis
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-8 mr-4">
              {['Dashboard', 'History', 'Medicines', 'Settings'].map(item => (
                <a key={item} href="#" className="text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors uppercase tracking-widest">
                  {item}
                </a>
              ))}
            </nav>
            {phase === 'done' && (
              <button
                onClick={reset}
                className="px-5 py-2 rounded-full glass-panel text-xs font-bold
                  text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/10
                  transition-all active:scale-95 shadow-lg shadow-cyan-500/5"
              >
                + New Analysis
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ── Main Content ────────────────────────── */}
      <main className="flex-1 flex flex-col items-center justify-start px-6 py-12 md:py-20 relative z-10">

        {/* IDLE — Show upload zone */}
        {phase === 'idle' && (
          <div className="w-full max-w-3xl text-center animate-fade-in-up">
            <div className="mb-12">
              <span className="px-4 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-bold tracking-[0.2em] uppercase border border-cyan-500/20 mb-6 inline-block">
                Powered by GPT-4o Vision
              </span>
              <h2 className="text-5xl md:text-6xl font-black text-white display-font mb-6 tracking-tight leading-tight">
                Understand your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400">Prescriptions</span> instantly.
              </h2>
              <p className="text-lg text-slate-400 max-w-xl mx-auto leading-relaxed">
                Upload image, extract names, and match with our database of 250k+ medicines.
              </p>
            </div>

            <div className="relative group p-1 rounded-[2.2rem] bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-indigo-500/20 max-w-2xl mx-auto">
              <UploadZone onSubmit={runPipeline} disabled={false} />
            </div>

            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto opacity-50">
              {[
                { label: 'Medicines', val: '250K+' },
                { label: 'Confidence', val: '95%' },
                { label: 'Time', val: '< 2s' },
                { label: 'Model', val: 'GPT-4o' }
              ].map(stat => (
                <div key={stat.label} className="text-center">
                  <div className="text-xl font-bold text-white display-font">{stat.val}</div>
                  <div className="text-[10px] uppercase tracking-widest text-slate-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROCESSING ────────────────────────────── */}
        {isProcessing && (
          <div className="w-full flex flex-col items-center mt-20 animate-fade-in-up">
            <div className="w-full max-w-3xl glass-panel p-10 rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 animate-glow" />
              <PipelineStepper currentStep={PHASE_STEPS[phase]} />
              <div className="mt-12 text-center text-slate-400 text-sm mono-font flex items-center justify-center gap-3">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-bounce" />
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-bounce [animation-delay:0.4s]" />
                </div>
                Analyzing data patterns...
              </div>
            </div>
          </div>
        )}

        {/* ERROR ─────────────────────────────────── */}
        {phase === 'error' && (
          <div className="w-full max-w-2xl animate-fade-in-up mt-10">
            <div className="glass-panel border-red-500/20 p-10 rounded-3xl text-center">
              <div className="w-20 h-20 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">⚠️</span>
              </div>
              <h3 className="text-2xl font-bold text-red-500 display-font mb-4">
                Analysis Interrupted
              </h3>
              <p className="text-slate-400 leading-relaxed mb-8 max-w-md mx-auto">{error}</p>
              <button
                onClick={reset}
                className="btn-primary px-10 py-4 rounded-2xl text-base"
              >
                Back to Upload
              </button>
            </div>
          </div>
        )}

        {/* DONE — Show results ────────────────────── */}
        {phase === 'done' && result && (
          <div className="w-full max-w-6xl space-y-8 animate-fade-in-up">
            <div className="flex flex-col md:flex-row gap-8 items-start">

              {/* Left Column: Debug & Text */}
              <div className="w-full md:w-1/3 space-y-6">
                <div className="glass-panel p-6 rounded-2xl">
                  <h4 className="text-[10px] uppercase tracking-[0.2em] text-cyan-400 font-bold mb-4">OCR Consensus</h4>
                  <OCRPassDebugger ocrResult={result?.ocr_result} compact={true} />
                </div>
                <div className="glass-panel p-6 rounded-2xl">
                  <h4 className="text-[10px] uppercase tracking-[0.2em] text-indigo-400 font-bold mb-4">Prescription Text</h4>
                  <PrescriptionTextViewer text={result?.ocr_result?.final_text} />
                </div>
                <div className="glass-panel p-6 rounded-2xl">
                  <h4 className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mb-4">Raw Metadata</h4>
                  <JsonInspector data={result} />
                </div>
              </div>

              {/* Right Column: Matched List */}
              <div className="flex-1 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white display-font flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-sm">💊</span>
                    Detected Medicines
                  </h3>
                  <span className="text-[10px] mono-font text-slate-500 bg-slate-800/50 px-3 py-1 rounded-full border border-white/5">
                    Analyzed in {result.processing_time_ms}ms
                  </span>
                </div>

                {result.extracted_medicines?.length > 0 ? (
                  <div className="space-y-4">
                    {result.extracted_medicines.map((ext, idx) => (
                      <ResultCard key={idx} extraction={ext} index={idx} />
                    ))}
                  </div>
                ) : (
                  <div className="glass-panel py-20 rounded-3xl text-center border-dashed">
                    <p className="text-slate-400 display-font font-semibold text-xl">
                      No medicines detected
                    </p>
                    <p className="text-sm text-slate-600 mono-font mt-2">
                      {result.suggestion || 'Try a clearer image or handwritten text.'}
                    </p>
                    <button onClick={reset} className="mt-8 text-cyan-400 text-sm font-bold border-b border-cyan-400/30 hover:border-cyan-400 transition-all">
                      Try New Scan
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ── Footer ──────────────────────────────── */}
      <footer className="w-full border-t border-white/5 py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-slate-500 mono-font uppercase tracking-widest">
            MedMap AI Framework v2.0 — Secure Medical Processing
          </p>
          <div className="flex gap-6">
            {['Privacy', 'Security', 'Models'].map(l => (
              <a key={l} href="#" className="text-[10px] text-slate-600 hover:text-slate-400 mono-font transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
