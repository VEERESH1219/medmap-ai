/**
 * MedMap AI — AI Verification Service (Stage 4 Fallback)
 *
 * Uses OpenAI GPT-4o to verify real-world medicine existence and retrieve clinical metadata
 * when the internal database fails to find a high-confidence match.
 */

import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Verify medicine existence and fetch metadata from AI knowledge base.
 * 
 * @param {string} brandName - extracted brand name
 * @param {string} variant - (optional) brand variant
 * @param {string} form - (optional) normalized form
 * @returns {Promise<Object|null>} - returns clinical details if verified, else null.
 */
export async function verifyMedicineRealWorld(brandName, variant = '', form = '') {
    const query = [brandName, variant, form].filter(Boolean).join(' ');

    const systemPrompt = `You are a professional pharmaceutical knowledge engine. 
Your task is to verify if a medicine exists in the real-world market (specifically focusing on Indian and global markets).

RULES:
1. ONLY return a result if you are 95%+ confident the medicine name exists.
2. If it exists, provide its standard Generic Name (Active Ingredients), typical Strength, and Form.
3. If it looks like a typo of a common medicine, suggest the correction.
4. If it is NOT a medicine or you are unsure, return {"exists": false}.
5. Return ONLY clean JSON. No markdown.

JSON SCHEMA:
{
  "exists": boolean,
  "confidence_score": number (0-100),
  "brand_name_official": "string",
  "generic_name": "string",
  "standard_strength": "string",
  "standard_form": "string"
}`;

    try {
        console.log(`[AI-Verify] Verifying existence of: "${query}"...`);

        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            temperature: 0,
            response_format: { type: 'json_object' },
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `Verify this medicine: "${query}"` },
            ],
        });

        const content = response.choices[0]?.message?.content || '{"exists": false}';
        const parsed = JSON.parse(content);

        if (parsed.exists && parsed.confidence_score >= 90) {
            return {
                id: `ai_v_${Date.now()}`,
                brand_name: parsed.brand_name_official,
                generic_name: parsed.generic_name,
                strength: parsed.standard_strength,
                form: parsed.standard_form,
                similarity_percentage: parsed.confidence_score,
                confidence: 'High',
                verified_by: 'AI_KNOWLEDGE'
            };
        }

        return null; // Not found or low confidence
    } catch (err) {
        console.error('[AI-Verify] Error:', err.message);
        return null;
    }
}
