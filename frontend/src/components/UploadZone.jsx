import { useState, useRef, useCallback } from 'react';

export default function UploadZone({ onSubmit, disabled }) {
    const [inputMode, setInputMode] = useState('image'); // 'image' | 'text'
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [rawText, setRawText] = useState('');
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB

    const handleFile = useCallback((selectedFile) => {
        if (!selectedFile) return;

        if (!ACCEPTED_TYPES.includes(selectedFile.type)) {
            alert('Please upload a JPG, PNG, or WebP image.');
            return;
        }

        if (selectedFile.size > MAX_SIZE) {
            alert('File size must be under 10MB.');
            return;
        }

        setFile(selectedFile);

        // Image preview
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target.result);
        reader.readAsDataURL(selectedFile);
    }, []);

    const handleDrop = useCallback(
        (e) => {
            e.preventDefault();
            setDragActive(false);
            if (e.dataTransfer.files?.[0]) {
                handleFile(e.dataTransfer.files[0]);
            }
        },
        [handleFile]
    );

    const fileToBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });

    const handleSubmit = async () => {
        if (inputMode === 'image' && file) {
            const base64 = await fileToBase64(file);
            onSubmit({ image: base64 });
        } else if (inputMode === 'text' && rawText.trim()) {
            onSubmit({ raw_text: rawText.trim() });
        }
    };

    const clearFile = () => {
        setFile(null);
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const canSubmit =
        !disabled &&
        ((inputMode === 'image' && file) || (inputMode === 'text' && rawText.trim()));

    return (
        <div className="w-full max-w-2xl mx-auto animate-slide-up">
            {/* Tab Toggle */}
            <div className="flex mb-6 p-1 rounded-xl bg-slate-800/50 border border-slate-700/40">
                <button
                    onClick={() => setInputMode('image')}
                    className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all display-font
            ${inputMode === 'image'
                            ? 'bg-cyan-500/20 text-cyan-400 shadow-lg shadow-cyan-500/10'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                >
                    📸 Upload Image
                </button>
                <button
                    onClick={() => setInputMode('text')}
                    className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all display-font
            ${inputMode === 'text'
                            ? 'bg-cyan-500/20 text-cyan-400 shadow-lg shadow-cyan-500/10'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                >
                    ⌨️ Paste Text
                </button>
            </div>

            {/* Image Upload Mode */}
            {inputMode === 'image' && (
                <div>
                    {!preview ? (
                        <div
                            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                            onDragLeave={() => setDragActive(false)}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-12
                flex flex-col items-center justify-center gap-4 transition-all
                ${dragActive
                                    ? 'border-cyan-400 bg-cyan-500/5 scale-[1.02]'
                                    : 'border-slate-600/60 bg-slate-800/30 hover:border-slate-500 hover:bg-slate-800/50'
                                }`}
                        >
                            <div className="w-16 h-16 rounded-2xl bg-slate-700/50 flex items-center justify-center">
                                <svg className="w-8 h-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                </svg>
                            </div>
                            <div className="text-center">
                                <p className="text-slate-200 font-semibold display-font">
                                    Drop prescription image here
                                </p>
                                <p className="text-slate-500 text-sm mt-1 mono-font">
                                    or click to browse · JPG, PNG, WebP · Max 10MB
                                </p>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".jpg,.jpeg,.png,.webp"
                                onChange={(e) => handleFile(e.target.files[0])}
                                className="hidden"
                            />
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-slate-700/40 bg-slate-800/30 overflow-hidden">
                            <div className="relative">
                                <img
                                    src={preview}
                                    alt="Prescription preview"
                                    className="w-full max-h-64 object-contain bg-slate-900/50 p-2"
                                />
                                <button
                                    onClick={clearFile}
                                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-900/80
                    flex items-center justify-center text-slate-400 hover:text-red-400
                    transition-colors border border-slate-600/40"
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="px-4 py-3 border-t border-slate-700/30">
                                <p className="text-sm text-slate-400 mono-font truncate">
                                    {file?.name} · {(file?.size / 1024).toFixed(1)} KB
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Text Input Mode */}
            {inputMode === 'text' && (
                <textarea
                    value={rawText}
                    onChange={(e) => setRawText(e.target.value)}
                    placeholder="Paste prescription text here...&#10;&#10;Example:&#10;Amoxiclav 625 Tab BD x 5 days&#10;Pantop 40 Tab OD x 7 days&#10;Dolo 650 Tab TDS x 3 days"
                    rows={8}
                    className="w-full rounded-2xl border border-slate-700/40 bg-slate-800/30 px-5 py-4
            text-sm text-slate-200 mono-font placeholder-slate-600 resize-none
            focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20
            transition-all"
                />
            )}

            {/* Submit Button */}
            <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className={`mt-6 w-full py-3.5 rounded-xl font-bold text-sm display-font
          transition-all duration-300
          ${canSubmit
                        ? 'bg-gradient-to-r from-cyan-500 to-cyan-400 text-slate-950 hover:shadow-lg hover:shadow-cyan-500/25 hover:scale-[1.01] active:scale-[0.99]'
                        : 'bg-slate-800/50 text-slate-600 cursor-not-allowed'
                    }`}
            >
                {disabled ? (
                    <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Processing...
                    </span>
                ) : (
                    'Process Prescription →'
                )}
            </button>
        </div>
    );
}
