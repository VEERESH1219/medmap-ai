-- ═══════════════════════════════════════════════════════
-- MedMap AI — 03: Create Indexes
-- ═══════════════════════════════════════════════════════

-- Trigram index for fuzzy brand name search
CREATE INDEX idx_medicines_brand_trgm
  ON medicines USING GIN (brand_name gin_trgm_ops);

-- IVFFlat index for approximate nearest-neighbor vector search
-- NOTE: This index requires at least 100 rows to function optimally.
-- If you have fewer rows, create this AFTER running the import script.
CREATE INDEX idx_medicines_embedding
  ON medicines USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);
