/**
 * MedMap AI — Multi-Pass OCR Consensus Algorithm
 *
 * Aligns tokens from multiple OCR passes by position and selects
 * the most-frequent token at each position. Minimum `minPasses`
 * must agree for a token to be "confirmed."
 */

/**
 * Build consensus text from multiple OCR pass results.
 *
 * @param {Array<{text: string, confidence: number, variant: string}>} passResults
 * @param {number} minPasses — minimum passes that must agree on a token
 * @returns {{ text: string, score: number, agreed_count: number }}
 */
export function buildConsensus(passResults, minPasses = 3) {
    if (!passResults || passResults.length === 0) {
        return { text: '', score: 0, agreed_count: 0 };
    }

    // If only one pass, return it directly
    if (passResults.length === 1) {
        return {
            text: passResults[0].text.trim(),
            score: 100,
            agreed_count: 1,
        };
    }

    // Tokenize each pass into word arrays (preserving line breaks as tokens)
    const tokenizedPasses = passResults.map((pass) => {
        const tokens = pass.text
            .replace(/\n+/g, ' \n ')
            .split(/\s+/)
            .filter((t) => t.length > 0);
        return {
            tokens,
            confidence: pass.confidence || 0,
            variant: pass.variant,
        };
    });

    // Use the longest pass as the reference length
    const maxLen = Math.max(...tokenizedPasses.map((p) => p.tokens.length));

    if (maxLen === 0) {
        return { text: '', score: 0, agreed_count: 0 };
    }

    const confirmedTokens = [];
    let agreedCount = 0;

    for (let pos = 0; pos < maxLen; pos++) {
        // Collect tokens at this position from all passes
        const tokenVotes = new Map(); // token → { count, maxConfidence }

        for (const pass of tokenizedPasses) {
            if (pos < pass.tokens.length) {
                const token = pass.tokens[pos].toLowerCase().trim();
                if (!token) continue;

                const existing = tokenVotes.get(token) || { count: 0, maxConfidence: 0 };
                existing.count += 1;
                existing.maxConfidence = Math.max(existing.maxConfidence, pass.confidence);
                tokenVotes.set(token, existing);
            }
        }

        if (tokenVotes.size === 0) continue;

        // Find the token with the highest count (tiebreaker: highest confidence)
        let bestToken = '';
        let bestCount = 0;
        let bestConfidence = 0;

        for (const [token, data] of tokenVotes) {
            if (
                data.count > bestCount ||
                (data.count === bestCount && data.maxConfidence > bestConfidence)
            ) {
                bestToken = token;
                bestCount = data.count;
                bestConfidence = data.maxConfidence;
            }
        }

        // Use the original-cased version from the first pass that had this token
        let originalCaseToken = bestToken;
        for (const pass of tokenizedPasses) {
            if (pos < pass.tokens.length) {
                if (pass.tokens[pos].toLowerCase().trim() === bestToken) {
                    originalCaseToken = pass.tokens[pos];
                    break;
                }
            }
        }

        // A token is "confirmed" if it appears in >= minPasses passes
        if (bestCount >= minPasses) {
            agreedCount++;
        }

        confirmedTokens.push(originalCaseToken);
    }

    // Build final text — collapse \n tokens back to newlines
    const finalText = confirmedTokens
        .join(' ')
        .replace(/ \n /g, '\n')
        .replace(/\n /g, '\n')
        .replace(/ \n/g, '\n')
        .trim();

    const score =
        confirmedTokens.length > 0
            ? Math.round((agreedCount / confirmedTokens.length) * 10000) / 100
            : 0;

    return {
        text: finalText,
        score,
        agreed_count: agreedCount,
    };
}

/**
 * Derive quality tag from consensus score.
 *
 * @param {number} score — consensus score 0–100
 * @returns {'HIGH_CONFIDENCE' | 'MEDIUM_CONFIDENCE' | 'LOW_QUALITY'}
 */
export function deriveQualityTag(score) {
    if (score >= 70) return 'HIGH_CONFIDENCE';
    if (score >= 40) return 'MEDIUM_CONFIDENCE';
    return 'LOW_QUALITY';
}
