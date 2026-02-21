/**
 * MedMap AI — Prescription Processing Route
 *
 * POST /api/process-prescription
 * Orchestrates: Input → OCR → NLP → Matching → Log → Response
 */

import { Router } from 'express';
import { runMultiPassOCR, runRawTextInput } from '../services/ocrService.js';
import { runNLPExtraction } from '../services/nlpService.js';
import { matchMedicines } from '../services/matchingEngine.js';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

router.post('/process-prescription', async (req, res) => {
    const startTime = Date.now();
    const sessionId = randomUUID();

    try {
        const { image, raw_text, options = {} } = req.body;

        // Validate: at least one of image or raw_text must be present
        if (!image && !raw_text) {
            return res.status(400).json({
                status: 'error',
                code: 'MISSING_INPUT',
                message: 'Either "image" (base64) or "raw_text" must be provided.',
            });
        }

        // ── Step 1: OCR ──────────────────────────────────
        let ocrResult;

        if (image) {
            ocrResult = await runMultiPassOCR(image, {
                passes: options.ocr_passes || 5,
                minConsensus: options.min_consensus || 3,
                debug: options.debug_passes || false,
            });
        } else {
            ocrResult = runRawTextInput(raw_text);
        }

        // ── Step 2: NLP Extraction ───────────────────────
        const extractions = await runNLPExtraction(ocrResult.final_text);

        // No medicines found — return success with empty array
        if (extractions.length === 0) {
            const processingTime = Date.now() - startTime;

            // Log to audit table
            await logExtraction(sessionId, image ? 'image' : 'text', ocrResult, [], [], processingTime);

            return res.json({
                status: 'success',
                processing_time_ms: processingTime,
                ocr_result: sanitizeOCRResult(ocrResult, options.debug_passes),
                extracted_medicines: [],
                message: 'No medicine entities detected in the prescription.',
            });
        }

        // ── Step 3: Database Matching ────────────────────
        const matchedResults = await matchMedicines(extractions);

        const processingTime = Date.now() - startTime;

        // ── Step 4: Audit Log ────────────────────────────
        await logExtraction(
            sessionId,
            image ? 'image' : 'text',
            ocrResult,
            extractions,
            matchedResults,
            processingTime
        );

        // ── Step 5: Response ─────────────────────────────
        return res.json({
            status: 'success',
            processing_time_ms: processingTime,
            ocr_result: sanitizeOCRResult(ocrResult, options.debug_passes),
            extracted_medicines: matchedResults,
        });
    } catch (err) {
        const processingTime = Date.now() - startTime;

        console.error('[Process Prescription] Error:', err);
        return res.status(500).json({
            status: 'error',
            code: 'SERVER_ERROR',
            message: err.message || 'An unexpected error occurred.',
        });
    }
});

/**
 * Sanitize OCR result for API response.
 */
function sanitizeOCRResult(ocrResult, includeDebug = false) {
    return {
        final_text: ocrResult.final_text,
        consensus_score: ocrResult.consensus_score,
        quality_tag: ocrResult.quality_tag,
        passes_completed: ocrResult.passes_completed,
        passes_agreed: ocrResult.passes_agreed,
        pass_results: includeDebug ? ocrResult.pass_results : undefined,
    };
}

/**
 * Log extraction to Supabase audit table.
 */
async function logExtraction(sessionId, inputType, ocrResult, extractions, matches, processingMs) {
    try {
        await supabase.from('extraction_logs').insert({
            session_id: sessionId,
            input_type: inputType,
            raw_ocr_text: ocrResult.final_text,
            consensus_score: ocrResult.consensus_score,
            structured_json: extractions,
            matches_json: matches,
            processing_ms: processingMs,
        });
    } catch (err) {
        console.error('[Audit Log] Error:', err.message);
        // Non-fatal — don't fail the request
    }
}

export default router;
