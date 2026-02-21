/**
 * MedMap AI — NLP Extraction Service
 *
 * Uses OpenAI GPT-4o for clinical Named Entity Recognition.
 * Extracts structured medicine data from OCR text following strict
 * Indian prescription parsing rules.
 */

import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are a clinical Named Entity Recognition (NER) engine specialized in Indian prescription parsing.

Your ONLY job: extract structured medicine information from OCR text.

ABSOLUTE RULES — violating any rule is a critical failure:

RULE 1 — OUTPUT FORMAT:
Return ONLY a valid JSON array. No markdown. No prose. No explanation.
If no medicines found, return empty array [].

RULE 2 — BRAND VARIANT IS NOT STRENGTH:
Numeric suffixes attached to brand names (e.g., "625" in "Amoxiclav 625", "650" in "Dolo 650", "500" in "Calpol 500") are BRAND VARIANTS — product line qualifiers used by manufacturers.
They are NOT pharmacological doses or strengths.
- brand_variant field: put the numeric suffix here
- strength field: ALWAYS leave as null — strength comes from database
- NEVER place a numeric suffix into any strength-related field

RULE 3 — FORM NORMALIZATION:
Map all abbreviations to full form:
Tab / T. / Tb → Tablet
Syp / Syr / S. → Syrup
Cap / C. → Capsule
Inj / I. → Injection
Cr / Oint → Cream
Susp → Suspension
Drop / Gtt → Drops
If form is ambiguous, infer from context or set null.

RULE 4 — FREQUENCY NORMALIZATION:
Convert to frequency_per_day as integer:
OD / 1-0-0 / Once daily → 1
BD / BID / 1-0-1 / Twice daily → 2
TDS / TID / 1-1-1 / Three times → 3
QID / 1-1-1-1 / Four times → 4
If frequency cannot be determined, set null.

RULE 5 — DURATION NORMALIZATION:
Convert to duration_days as integer:
"5 days" → 5, "1 week" → 7, "2 weeks" → 14
If not found, set null.

RULE 6 — COMBINATION PRODUCTS:
Never split a combination medicine into separate entries.
"Combiflam" is ONE medicine, not Ibuprofen + Paracetamol separately.
"Augmentin 625" is ONE medicine, not Amoxicillin + Clavulanate separately.

RULE 7 — SPELLING CORRECTION:
Correct obvious OCR/handwriting errors in brand names:
"Amoxyclav" → "Amoxiclav"
"Augmentin" → "Augmentin" (already correct)
"Calpoll" → "Calpol"
Use your clinical knowledge to normalize spelling.
Put the corrected name in brand_name, original in raw_brand_token.

RULE 8 — NON-MEDICINE TOKENS:
Ignore all non-medicine text: patient name, date, doctor name, hospital name, "Rx", dosage instructions in plain language, diagnostic test orders, etc.

OUTPUT SCHEMA (one object per medicine):
{
  "brand_name": "string (corrected)",
  "raw_brand_token": "string (original OCR token)",
  "brand_variant": "string | null (e.g. '625', '500' — NOT strength)",
  "form": "Tablet | Syrup | Capsule | Injection | Cream | string | null",
  "frequency_per_day": "integer | null",
  "duration_days": "integer | null"
}`;

/**
 * Extract structured medicine entities from OCR text using OpenAI GPT-4o.
 *
 * @param {string} ocrText — raw OCR text from the consensus engine
 * @returns {Promise<Array>} — array of StructuredMedicine objects
 */
export async function runNLPExtraction(ocrText) {
    if (!ocrText || ocrText.trim().length === 0) {
        return [];
    }

    let response;
    let retries = 0;
    const maxRetries = 2;

    while (retries <= maxRetries) {
        try {
            const userMessage =
                retries === 0
                    ? `Extract all medicines from this prescription text:\n\n${ocrText}`
                    : `Your previous response was not valid JSON. Return ONLY a valid JSON array with no markdown fences, no prose. Extract medicines from:\n\n${ocrText}`;

            response = await openai.chat.completions.create({
                model: 'gpt-4o',
                temperature: 0.1,
                max_tokens: 2048,
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    { role: 'user', content: userMessage },
                ],
            });

            let content = response.choices[0]?.message?.content || '[]';

            // Strip markdown fences if present
            content = content
                .replace(/^```json\s*/i, '')
                .replace(/^```\s*/i, '')
                .replace(/\s*```$/i, '')
                .trim();

            const parsed = JSON.parse(content);

            // Ensure it's an array
            const medicines = Array.isArray(parsed) ? parsed : [parsed];

            // Add auto-generated IDs and normalize
            return medicines.map((med, idx) => ({
                id: `ext_${String(idx + 1).padStart(3, '0')}`,
                brand_name: med.brand_name || '',
                raw_brand_token: med.raw_brand_token || med.brand_name || '',
                brand_variant: med.brand_variant || null,
                form: med.form || null,
                frequency_per_day:
                    typeof med.frequency_per_day === 'number' ? med.frequency_per_day : null,
                duration_days:
                    typeof med.duration_days === 'number' ? med.duration_days : null,
            }));
        } catch (err) {
            retries++;
            if (retries > maxRetries) {
                console.error('[NLP] All retries failed:', err.message);
                throw new Error(`NLP extraction failed after ${maxRetries + 1} attempts: ${err.message}`);
            }
            console.warn(`[NLP] Attempt ${retries} failed, retrying...`);
        }
    }

    return [];
}
