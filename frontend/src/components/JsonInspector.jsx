import { useState } from 'react';

export default function JsonInspector({ data }) {
    const [copied, setCopied] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const jsonString = JSON.stringify(data, null, 2);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(jsonString);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
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
        <div className="group/json">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 rounded-xl glass-panel border-white/5 hover:bg-white/5 transition-all"
            >
                <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all ${isOpen ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-500'}`}>
                        {'{ }'}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 display-font">Metadata Tree</span>
                </div>
                <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-white' : 'text-slate-700'}`}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </button>

            {isOpen && (
                <div className="mt-4 relative animate-fade-in-up">
                    <div className="absolute top-4 right-4 z-20">
                        <button
                            onClick={handleCopy}
                            className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest display-font transition-all shadow-xl
                                ${copied
                                    ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                                    : 'glass-panel border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                                }`}
                        >
                            {copied ? 'Copied' : 'Copy Payload'}
                        </button>
                    </div>

                    <div className="relative group/pre">
                        <div className="absolute inset-0 bg-indigo-500/5 blur-2xl rounded-3xl opacity-0 group-hover/pre:opacity-100 transition-opacity" />
                        <pre className="relative p-6 rounded-[1.5rem] bg-black/60 border border-white/5 overflow-auto max-h-[400px] text-[11px] text-slate-400 mono-font leading-relaxed shadow-inner">
                            {jsonString}
                        </pre>
                    </div>
                </div>
            )}
        </div>
    );
}
