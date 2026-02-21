/**
 * MedMap AI — 3-Stage Hybrid Matching Engine
 *
 * STAGE 1: Exact match (brand_name + form)
 * STAGE 2: Fuzzy match (trigram similarity via hybrid_medicine_search)
 * STAGE 3: Vector similarity (cosine via embeddings)
 *
 * Validation rules:
 *   A — Variant mismatch (×0.70 penalty)
 *   B — Combination integrity check
 *   C — Form mismatch (×0.60 penalty)
 *   D — Strength ALWAYS from DB
 */

import { createClient } from '@supabase/supabase-js';
import { getEmbedding, getZeroVector } from './embeddingService.js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

/**
 * Derive confidence level from final score.
 */
function deriveConfidence(score) {
    if (score >= 85) return 'High';
    if (score >= 60) return 'Medium';
    return 'Low';
}

/**
 * Apply validation rules to a matched result.
 *
 * @param {object} extraction — extracted medicine data
 * @param {object} dbRecord — matched database record
 * @param {number} rawScore — raw match score (0–100)
 * @returns {{ finalScore: number, warnings: string[] }}
 */
function applyValidationRules(extraction, dbRecord, rawScore) {
    let finalScore = rawScore;
    const warnings = [];

    // RULE A — Brand Variant Specificity
    if (extraction.brand_variant) {
        const dbBrandLower = dbRecord.brand_name.toLowerCase();
        const variantInDb = dbBrandLower.includes(extraction.brand_variant.toLowerCase());
        if (!variantInDb) {
            warnings.push('VARIANT_MISMATCH');
            finalScore *= 0.70;
        }
    }

    // RULE B — Combination Integrity
    if (dbRecord.is_combination) {
        const hasPlus = dbRecord.generic_name.includes('+') || dbRecord.generic_name.includes('/');
        if (!hasPlus) {
            warnings.push('COMBINATION_INTEGRITY_VIOLATION');
            // Do not penalize score, but flag prominently
        }
    }

    // RULE C — Form Mismatch
    if (extraction.form && dbRecord.form) {
        if (extraction.form.toLowerCase() !== dbRecord.form.toLowerCase()) {
            warnings.push('FORM_MISMATCH');
            finalScore *= 0.60;
        }
    }

    return { finalScore: Math.round(finalScore * 100) / 100, warnings };
}

/**
 * Stage 1: Exact match by brand_name and form.
 */
async function exactMatch(extraction) {
    const searchName = extraction.brand_variant
        ? `${extraction.brand_name} ${extraction.brand_variant}`
        : extraction.brand_name;

    let query = supabase
        .from('medicines')
        .select('*')
        .ilike('brand_name', searchName);

    if (extraction.form) {
        query = query.ilike('form', extraction.form);
    }

    const { data, error } = await query.limit(1);

    if (error) {
        console.error('[Exact Match] Error:', error.message);
        return null;
    }

    if (data && data.length > 0) {
        return {
            record: data[0],
            method: 'exact_match',
            rawScore: 99.0,
        };
    }

    return null;
}

/**
 * Stage 2: Fuzzy match using trigram similarity only.
 */
async function fuzzyMatch(extraction) {
    const searchText = extraction.brand_variant
        ? `${extraction.brand_name} ${extraction.brand_variant}`
        : extraction.brand_name;

    const zeroVec = getZeroVector();

    const { data, error } = await supabase.rpc('hybrid_medicine_search', {
        query_text: searchText,
        query_vector: JSON.stringify(zeroVec),
        match_limit: 5,
        trgm_weight: 1.0,
        vector_weight: 0.0,
    });

    if (error) {
        console.error('[Fuzzy Match] Error:', error.message);
        return null;
    }

    if (data && data.length > 0) {
        // Filter by form if available
        let filtered = data;
        if (extraction.form) {
            const formFiltered = data.filter(
                (r) => r.form.toLowerCase() === extraction.form.toLowerCase()
            );
            if (formFiltered.length > 0) filtered = formFiltered;
        }

        const best = filtered[0];
        if (best.trgm_score > 0.50) {
            return {
                record: best,
                method: 'fuzzy_match',
                rawScore: best.trgm_score * 100,
            };
        }
    }

    return null;
}

/**
 * Stage 3: Vector similarity using embeddings.
 */
async function vectorMatch(extraction) {
    const searchText = [
        extraction.brand_name,
        extraction.brand_variant,
        extraction.form,
    ]
        .filter(Boolean)
        .join(' ');

    let embedding;
    try {
        embedding = await getEmbedding(searchText);
    } catch (err) {
        console.error('[Vector Match] Embedding error:', err.message);
        return null;
    }

    const { data, error } = await supabase.rpc('hybrid_medicine_search', {
        query_text: searchText,
        query_vector: JSON.stringify(embedding),
        match_limit: 5,
        trgm_weight: 0.4,
        vector_weight: 0.6,
    });

    if (error) {
        console.error('[Vector Match] Error:', error.message);
        return null;
    }

    if (data && data.length > 0) {
        // Filter by form if available
        let filtered = data;
        if (extraction.form) {
            const formFiltered = data.filter(
                (r) => r.form.toLowerCase() === extraction.form.toLowerCase()
            );
            if (formFiltered.length > 0) filtered = formFiltered;
        }

        const best = filtered[0];
        if (best.combined_score > 0.50) {
            return {
                record: best,
                method: 'vector_similarity',
                rawScore: best.combined_score * 100,
            };
        }
    }

    return null;
}

/**
 * Match a list of extracted medicines through the 3-stage waterfall.
 *
 * @param {Array} extractions — StructuredMedicine[] from NLP service
 * @returns {Promise<Array>} — ExtractionResult[] with matched medicines
 */
export async function matchMedicines(extractions) {
    if (!extractions || extractions.length === 0) return [];

    const results = [];

    for (const extraction of extractions) {
        const rawInput = [
            extraction.brand_name,
            extraction.brand_variant,
            extraction.form,
        ]
            .filter(Boolean)
            .join(' ');

        let matchResult = null;

        // STAGE 1 — Exact Match
        matchResult = await exactMatch(extraction);

        // STAGE 2 — Fuzzy Match
        if (!matchResult) {
            matchResult = await fuzzyMatch(extraction);
        }

        // STAGE 3 — Vector Similarity
        if (!matchResult) {
            matchResult = await vectorMatch(extraction);
        }

        // Build the result
        let matchedMedicine = null;

        if (matchResult) {
            const { record, method, rawScore } = matchResult;
            const { finalScore, warnings } = applyValidationRules(
                extraction,
                record,
                rawScore
            );

            // RULE D — Strength ALWAYS from DB
            matchedMedicine = {
                id: record.id,
                brand_name: record.brand_name,
                generic_name: record.generic_name,
                strength: record.strength,      // ALWAYS from DB, never parsed
                form: record.form,
                category: record.category || null,
                is_combination: record.is_combination || false,
                manufacturer: record.manufacturer || null,
                similarity_percentage: Math.round(finalScore * 100) / 100,
                confidence: deriveConfidence(finalScore),
                match_method: method,
                validation_warnings: warnings,
            };
        }

        results.push({
            raw_input: rawInput,
            structured_data: {
                brand_name: extraction.brand_name,
                brand_variant: extraction.brand_variant || null,
                form: extraction.form || null,
                frequency_per_day: extraction.frequency_per_day || null,
                duration_days: extraction.duration_days || null,
            },
            matched_medicine: matchedMedicine,
        });
    }

    return results;
}
