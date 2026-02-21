-- ═══════════════════════════════════════════════════════
-- MedMap AI — 04: Create RPC Functions
-- ═══════════════════════════════════════════════════════

-- Hybrid search: combines trigram similarity + vector cosine similarity
-- Weighted scoring: combined = trgm_weight * trigram + vector_weight * cosine
CREATE OR REPLACE FUNCTION hybrid_medicine_search(
  query_text    TEXT,
  query_vector  VECTOR(1536),
  match_limit   INT     DEFAULT 5,
  trgm_weight   FLOAT   DEFAULT 0.4,
  vector_weight FLOAT   DEFAULT 0.6
)
RETURNS TABLE (
  id              UUID,
  brand_name      TEXT,
  generic_name    TEXT,
  strength        TEXT,
  form            TEXT,
  category        TEXT,
  is_combination  BOOLEAN,
  manufacturer    TEXT,
  trgm_score      FLOAT,
  vector_score    FLOAT,
  combined_score  FLOAT
)
LANGUAGE SQL STABLE AS $$
  SELECT
    m.id,
    m.brand_name,
    m.generic_name,
    m.strength,
    m.form,
    m.category,
    m.is_combination,
    m.manufacturer,
    similarity(m.brand_name, query_text)               AS trgm_score,
    1 - (m.embedding <=> query_vector)                 AS vector_score,
    (
      trgm_weight   * similarity(m.brand_name, query_text) +
      vector_weight * (1 - (m.embedding <=> query_vector))
    )                                                  AS combined_score
  FROM medicines m
  WHERE m.embedding IS NOT NULL
  ORDER BY combined_score DESC
  LIMIT match_limit;
$$;
