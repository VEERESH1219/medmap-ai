import { useState } from 'react';

export default function JsonInspector({ data }) {
    const [copied, setCopied] = useState(false);

    const jsonString = JSON.stringify(data, null, 2);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(jsonString);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback
            const textarea = document.createElement('textarea');
            textarea.value = jsonString;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <details className="mt-6 group">
            <summary className="cursor-pointer select-none flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 transition-colors">
                <svg
                    className="w-4 h-4 transition-transform group-open:rotate-90"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
                <span className="mono-font">View Raw JSON Response</span>
            </summary>

            <div className="mt-3 relative">
                <button
                    onClick={handleCopy}
                    className="absolute top-3 right-3 px-3 py-1.5 text-xs rounded-lg
            bg-slate-700/60 text-slate-300 hover:bg-slate-600/60 hover:text-cyan-400
            transition-all mono-font z-10"
                >
                    {copied ? '✓ Copied' : 'Copy'}
                </button>

                <pre className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/40
          overflow-auto max-h-96 text-xs text-slate-300 mono-font leading-relaxed">
                    {jsonString}
                </pre>
            </div>
        </details>
    );
}
