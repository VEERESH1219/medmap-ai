/**
 * SpeechService — Text-to-Speech for medicine descriptions
 * Uses the Web Speech API (works on all modern browsers)
 */

const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
let utterance = null;

/**
 * Speak the given text aloud.
 * @param {string} text
 * @param {{ rate?: number, pitch?: number, lang?: string }} opts
 */
export function speak(text, opts = {}) {
    if (!synth) return;
    stop();
    utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = opts.rate ?? 0.95;
    utterance.pitch = opts.pitch ?? 1;
    utterance.lang = opts.lang ?? 'en-US';
    // Prefer a natural English voice if available
    const voices = synth.getVoices();
    const preferred = voices.find(v => v.lang === 'en-US' && v.name.includes('Google'))
        || voices.find(v => v.lang.startsWith('en'));
    if (preferred) utterance.voice = preferred;
    synth.speak(utterance);
}

/** Stop any active speech. */
export function stop() {
    if (synth) synth.cancel();
    utterance = null;
}

/** Returns true if the browser is currently speaking. */
export function isSpeaking() {
    return synth ? synth.speaking : false;
}

/** Returns true if the Web Speech API is available. */
export function isSupported() {
    return !!synth;
}
