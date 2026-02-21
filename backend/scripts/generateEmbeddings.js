/**
 * MedMap AI — Embedding Generator
 *
 * Populates the `embedding` column for all medicines in Supabase
 * using OpenAI text-embedding-3-small.
 *
 * Usage: node scripts/generateEmbeddings.js
 */

import { createClient } from '@supabase/supabase-js';
import { getEmbedding } from '../services/embeddingService.js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

async function main() {
    console.log('\n🔢 Fetching medicines without embeddings...\n');

    // Fetch all medicines where embedding IS NULL
    const { data: medicines, error } = await supabase
        .from('medicines')
        .select('id, brand_name, generic_name, form')
        .is('embedding', null);

    if (error) {
        throw new Error(`Failed to fetch medicines: ${error.message}`);
    }

    if (!medicines || medicines.length === 0) {
        console.log('✅ All medicines already have embeddings. Nothing to do.\n');
        return;
    }

    console.log(`📊 Found ${medicines.length} medicines without embeddings.\n`);

    // Process in batches of 20 (rate limit safety)
    const BATCH_SIZE = 20;
    let processed = 0;

    for (let i = 0; i < medicines.length; i += BATCH_SIZE) {
        const batch = medicines.slice(i, i + BATCH_SIZE);

        await Promise.all(
            batch.map(async (med) => {
                try {
                    const text = `${med.brand_name} ${med.generic_name} ${med.form}`;
                    const embedding = await getEmbedding(text);

                    const { error: updateError } = await supabase
                        .from('medicines')
                        .update({ embedding: JSON.stringify(embedding) })
                        .eq('id', med.id);

                    if (updateError) {
                        console.error(`❌ Failed to update ${med.brand_name}:`, updateError.message);
                    } else {
                        processed++;
                        console.log(`🔢 Generated embedding ${processed}/${medicines.length} — ${med.brand_name}`);
                    }
                } catch (err) {
                    console.error(`❌ Embedding error for ${med.brand_name}:`, err.message);
                }
            })
        );

        // Brief pause between batches for rate limiting
        if (i + BATCH_SIZE < medicines.length) {
            await new Promise((resolve) => setTimeout(resolve, 500));
        }
    }

    console.log(`\n🎉 All embeddings generated! Total: ${processed}/${medicines.length}\n`);
}

main().catch((err) => {
    console.error('❌ Embedding generation failed:', err);
    process.exit(1);
});
