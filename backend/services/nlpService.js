/**
 * MedMap AI — NLP Extraction Service
 *
 * Uses OpenAI GPT-4o for clinical Named Entity Recognition.
 * Strictly follows extraction rules for brand names, variants, and dosage.
 */

import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are a strict medical data extraction engine. Your task is to extract medicine-related entities from the given text.

RULES:
1. Extract ONLY medicines, tablets, injections, capsules, and syrups.
2. Normalize medicine names and forms.
3. Focus on brand names and their numeric variants (suffixes like 625, 650, 500).
4. Extract numeric suffixes as "brand_variant".
5. Normalize frequency: BD=2, OD=1, TDS=3, SOS=1, HS=1, QID=4.
6. Extract duration as an integer.
7. Ignore header text, clinic details, patient names, and dates.
8. Explicitly ignore non-drug orders: X-rays, MRI, blood tests, Physiotherapy, exercise, or lifestyle advice.
9. If no medicines are found, return {"medicines": []}.

JSON SCHEMA:
{
  "medicines": [
    {
      "brand_name": "string",
      "brand_variant": "string or null",
      "form_normalized": "Tablet | Capsule | Injection | Syrup | null",
      "frequency_per_day": integer or null,
      "duration_days": integer or null
    }
  ]
}

EXAMPLE:
Input: "Amoxiclav 625 Tab BD x 5 days"
Output: {
  "medicines": [
    {
      "brand_name": "Amoxiclav",
      "brand_variant": "625",
      "form_normalized": "Tablet",
      "frequency_per_day": 2,
      "duration_days": 5
    }
  ]
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
      const userMessage = `Process the following prescription text:\n\n${ocrText}`;

      console.log('[NLP] Input Length:', ocrText.length);
      console.log('[NLP] Full Input Text:\n', ocrText);

      response = await openai.chat.completions.create({
        model: 'gpt-4o',
        temperature: 0,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userMessage },
        ],
      });

      const content = response.choices[0]?.message?.content || '{"medicines": []}';
      console.log('[NLP] Raw OpenAI Content:', content);
      const parsed = JSON.parse(content);
      const medicines = Array.isArray(parsed.medicines) ? parsed.medicines : [];

      return medicines.map((med, idx) => ({
        id: `ext_${String(idx + 1).padStart(3, '0')}`,
        brand_name: med.brand_name || '',
        brand_variant: med.brand_variant || null,
        form: med.form_normalized || null,
        frequency_per_day: typeof med.frequency_per_day === 'number' ? med.frequency_per_day : null,
        duration_days: typeof med.duration_days === 'number' ? med.duration_days : null,
      }));
    } catch (err) {
      retries++;
      if (retries > maxRetries) {
        console.error('[NLP] All retries failed:', err.message);
        throw err;
      }
      console.warn(`[NLP] Attempt ${retries} failed, retrying...`);
    }
  }

  return [];
}
