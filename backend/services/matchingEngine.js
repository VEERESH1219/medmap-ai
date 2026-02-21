/**
 * MedMap AI — Strict 3-Stage Hybrid Matching Engine
 *
 * STAGE 1: Exact match (brand_name + form)
 * STAGE 2: Fuzzy match (trigram similarity)
 * STAGE 3: Vector similarity (embeddings)
 * STAGE 4: AI Knowledge Fallback (external verification)
 *
 * STRICT RULES:
 * 1. Confidence: >=90% (High), 70-89% (Medium), <70% (Low).
 * 2. Brand Variant Validation: Numeric suffixes (625, 650) must match DB record or penalize.
 * 3. Combination Integrity: Do not split combinations.
 * 4. Strength: ALWAYS from DB, never inferred from numeric tokens.
 */

import { createClient } from '@supabase/supabase-js';
import { getEmbedding, getZeroVector } from './embeddingService.js';
import { verifyMedicineRealWorld, getMedicineDescription } from './aiVerificationService.js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

/**
 * Derive confidence level from strict thresholds.
 */
function deriveConfidence(score) {
    if (score >= 90) return 'High';
    if (score >= 70) return 'Medium';
    return 'Low';
}

/**
 * Apply strict validation rules to a matched result.
 */
function applyValidationRules(extraction, dbRecord, rawScore) {
    let finalScore = rawScore;
    const warnings = [];

    // RULE: Brand Variant Specificity (e.g. 625 vs 375)
    if (extraction.brand_variant) {
        const dbBrandLower = dbRecord.brand_name.toLowerCase();
        const variantInDb = dbBrandLower.includes(extraction.brand_variant.toLowerCase());

        if (!variantInDb) {
            warnings.push('VARIANT_MISMATCH');
            // Strict penalty for variant mismatch
            finalScore *= 0.50;
        }
    }

    // RULE: Combination Integrity
    if (dbRecord.is_combination) {
        const hasPlus = dbRecord.generic_name.includes('+') || dbRecord.generic_name.includes('/');
        if (!hasPlus) {
            warnings.push('COMBINATION_INTEGRITY_VIOLATION');
        }
    }

    // RULE: Form Mismatch
    if (extraction.form && dbRecord.form) {
        if (extraction.form.toLowerCase() !== dbRecord.form.toLowerCase()) {
            warnings.push('FORM_MISMATCH');
            finalScore *= 0.60;
        }
    }

    return {
        finalScore: Math.round(finalScore * 10) / 10,
        warnings
    };
}

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
    if (error || !data || data.length === 0) return null;

    return {
        record: data[0],
        method: 'exact_match',
        rawScore: 100,
    };
}

async function fuzzyMatch(extraction) {
    const searchText = extraction.brand_variant
        ? `${extraction.brand_name} ${extraction.brand_variant}`
        : extraction.brand_name;

    const { data, error } = await supabase.rpc('hybrid_medicine_search', {
        query_text: searchText,
        query_vector: JSON.stringify(getZeroVector()),
        match_limit: 5,
        trgm_weight: 1.0,
        vector_weight: 0.0,
    });

    if (error || !data || data.length === 0) return null;

    const best = data[0];
    if (best.trgm_score > 0.25) {
        return {
            record: best,
            method: 'fuzzy_match',
            rawScore: Math.round(best.trgm_score * 100),
        };
    }
    return null;
}

async function vectorMatch(extraction) {
    const searchText = [
        extraction.brand_name,
        extraction.brand_variant,
        extraction.form,
    ].filter(Boolean).join(' ');

    let embedding;
    try {
        embedding = await getEmbedding(searchText);
    } catch (err) {
        return null;
    }

    const { data, error } = await supabase.rpc('hybrid_medicine_search', {
        query_text: searchText,
        query_vector: JSON.stringify(embedding),
        match_limit: 5,
        trgm_weight: 0.4,
        vector_weight: 0.6,
    });

    if (error || !data || data.length === 0) return null;

    const best = data[0];
    if (best.combined_score > 0.25) {
        return {
            record: best,
            method: 'vector_similarity',
            rawScore: Math.round(best.combined_score * 100),
        };
    }
    return null;
}

/**
 * Match extractions and identify those requiring fallback.
 */
export async function matchMedicines(extractions) {
    const results = await Promise.all(extractions.map(async (extraction) => {
        let matchResult = null;
        const brandQuery = extraction.brand_name;

        console.log(`[Matching] Processing: "${brandQuery}"...`);

        // STAGE 1 — Exact Match (Fast)
        const exact = await exactMatch(extraction); // Changed to use existing exactMatch
        if (exact) {
            matchResult = { record: exact.record, method: 'EXACT', rawScore: exact.rawScore / 100 }; // Adjust rawScore to be 0-1
        }

        // STAGE 2 — Trigram Similarity (Fuzzy)
        if (!matchResult) {
            const fuzzy = await fuzzyMatch(extraction); // Changed to use existing fuzzyMatch
            if (fuzzy) {
                matchResult = { record: fuzzy.record, method: 'FUZZY', rawScore: fuzzy.rawScore / 100 }; // Adjust rawScore to be 0-1
            }
        }

        // STAGE 3 — Vector Search (Semantic)
        if (!matchResult) {
            const vector = await vectorMatch(extraction); // Changed to use existing vectorMatch
            if (vector) {
                matchResult = { record: vector.record, method: 'VECTOR', rawScore: vector.rawScore / 100 }; // Adjust rawScore to be 0-1
            }
        }

        let matchedMedicine = null;
        let warnings = [];

        if (matchResult) {
            const { record, method, rawScore } = matchResult;
            const validation = applyValidationRules(extraction, record, rawScore * 100); // Pass rawScore as 0-100

            matchedMedicine = {
                id: record.id,
                brand_name: record.brand_name,
                generic_name: record.generic_name,
                strength: record.strength,
                form: record.form,
                manufacturer: record.manufacturer,
                is_combination: record.is_combination,
                similarity_percentage: validation.finalScore,
                confidence: deriveConfidence(validation.finalScore),
                match_method: method,
                verified_by: 'INTERNAL_DB',
                validation_warnings: validation.warnings
            };
            warnings = validation.warnings;
        } else {
            // STAGE 4 — AI Knowledge Fallback
            console.log(`[Matching] No DB hits for "${brandQuery}". Triggering Stage 4 AI...`);
            const aiMatch = await verifyMedicineRealWorld(
                extraction.brand_name,
                extraction.brand_variant,
                extraction.form
            );

            if (aiMatch) {
                matchedMedicine = aiMatch;
            }
        }

        // --- ENRICHMENT STAGE: OpenAI Description ---
        if (matchedMedicine) {
            const description = await getMedicineDescription(
                matchedMedicine.brand_name,
                matchedMedicine.generic_name
            );
            matchedMedicine.description = description;
        }

        if (matchedMedicine) {
            return {
                raw_input: [extraction.brand_name, extraction.brand_variant, extraction.form].filter(Boolean).join(' '),
                structured_data: extraction,
                matched_medicine: matchedMedicine
            };
        } else {
            return {
                fallback_required: true,
                raw_input: [extraction.brand_name, extraction.brand_variant, extraction.form].filter(Boolean).join(' '),
                structured_data: {
                    brand_name: extraction.brand_name,
                    brand_variant: extraction.brand_variant || "",
                    form: extraction.form || "",
                    frequency_per_day: extraction.frequency_per_day || 0,
                    duration_days: extraction.duration_days || 0
                }
            };
        }
    }));

    return results;
}
