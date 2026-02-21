import { useState } from 'react';
import UploadZone from './components/UploadZone';
import PipelineStepper from './components/PipelineStepper';
import OCRPassDebugger from './components/OCRPassDebugger';
import ResultCard from './components/ResultCard';
import JsonInspector from './components/JsonInspector';

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
      // Simulate pipeline phase progression
      setPhase('uploading');
      await delay(400);

      setPhase('preprocessing');
      await delay(600);

      setPhase('ocr');

      // Build request
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
        // Handle 422 (low quality) and 500 errors
        throw new Error(data.message || data.suggestion || 'Processing failed.');
      }

      // Advance through remaining phases with small delays
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
    <div className="min-h-screen flex flex-col">
      {/* ── Header ──────────────────────────────── */}
      <header className="w-full border-b border-slate-800/60">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-400
              flex items-center justify-center text-slate-950 font-extrabold text-lg display-font">
              M
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-slate-100 display-font tracking-tight">
                MedMap AI
              </h1>
              <p className="text-[10px] text-slate-500 mono-font -mt-0.5">
                Intelligent Medicine Extraction
              </p>
            </div>
          </div>

          {phase === 'done' && (
            <button
              onClick={reset}
              className="px-4 py-2 rounded-lg text-xs font-semibold
                bg-slate-800/60 text-slate-300 hover:text-cyan-400 hover:bg-slate-700/60
                transition-all mono-font border border-slate-700/40"
            >
              ← New Scan
            </button>
          )}
        </div>
      </header>

      {/* ── Main Content ────────────────────────── */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-10">
        {/* IDLE — Show upload zone */}
        {phase === 'idle' && (
          <div className="w-full max-w-2xl text-center animate-slide-up">
            <h2 className="text-3xl font-extrabold text-slate-100 display-font mb-3">
              Extract & Match Medicines
            </h2>
            <p className="text-sm text-slate-500 mono-font mb-10 max-w-lg mx-auto">
              Upload a prescription image or paste text. Our 5-pass OCR engine
              and hybrid matching pipeline will identify medicines with strength
              and dosage — all from our trusted database.
            </p>
            <UploadZone onSubmit={runPipeline} disabled={false} />
          </div>
        )}

        {/* PROCESSING — Show stepper */}
        {isProcessing && (
          <div className="w-full flex flex-col items-center">
            <PipelineStepper currentStep={PHASE_STEPS[phase]} />
            <p className="text-xs text-slate-500 mono-font mt-4 animate-pulse">
              Please wait while we process your prescription...
            </p>
          </div>
        )}

        {/* ERROR — Show error + retry */}
        {phase === 'error' && (
          <div className="w-full max-w-2xl animate-slide-up">
            <div className="rounded-2xl bg-red-500/5 border border-red-500/20 p-8 text-center">
              <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚠️</span>
              </div>
              <h3 className="text-lg font-bold text-red-400 display-font mb-2">
                Processing Failed
              </h3>
              <p className="text-sm text-slate-400 mono-font mb-6">{error}</p>
              <button
                onClick={reset}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400
                  text-slate-950 font-bold text-sm display-font hover:shadow-lg
                  hover:shadow-cyan-500/25 transition-all"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* DONE — Show results */}
        {phase === 'done' && result && (
          <div className="w-full max-w-5xl space-y-6">
            {/* Processing time */}
            <div className="text-center mb-4">
              <span className="text-xs text-slate-500 mono-font">
                Processed in {result.processing_time_ms}ms
              </span>
            </div>

            {/* OCR Pass Debugger */}
            <OCRPassDebugger ocrResult={result.ocr_result} />

            {/* Results */}
            {result.extracted_medicines?.length > 0 ? (
              <>
                <h3 className="text-sm font-bold text-slate-400 display-font uppercase tracking-wider">
                  Matched Medicines ({result.extracted_medicines.length})
                </h3>
                <div className="space-y-4">
                  {result.extracted_medicines.map((ext, idx) => (
                    <ResultCard key={idx} extraction={ext} index={idx} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-400 display-font font-semibold">
                  No medicines detected
                </p>
                <p className="text-xs text-slate-600 mono-font mt-2">
                  {result.message || 'Try a different image or text input.'}
                </p>
              </div>
            )}

            {/* JSON Inspector */}
            <JsonInspector data={result} />

            {/* New Scan Button */}
            <div className="text-center pt-4 pb-8">
              <button
                onClick={reset}
                className="px-6 py-3 rounded-xl bg-slate-800/60 text-slate-300
                  hover:text-cyan-400 hover:bg-slate-700/60 transition-all
                  text-sm font-semibold display-font border border-slate-700/40"
              >
                ← Process Another Prescription
              </button>
            </div>
          </div>
        )}
      </main>

      {/* ── Footer ──────────────────────────────── */}
      <footer className="w-full border-t border-slate-800/40 py-4">
        <p className="text-center text-[10px] text-slate-600 mono-font">
          MedMap AI v1.0.0 — Multi-Pass OCR · Claude NER · Hybrid Matching
        </p>
      </footer>
    </div>
  );
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
