-- ═══════════════════════════════════════════════════════
-- VAIDYADRISHTI AI — 02: Create Tables
-- ═══════════════════════════════════════════════════════

-- Medicines master table
CREATE TABLE medicines (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_name      TEXT NOT NULL,
  generic_name    TEXT NOT NULL,
  strength        TEXT NOT NULL,
  form            TEXT NOT NULL,
  category        TEXT,
  is_combination  BOOLEAN DEFAULT FALSE,
  manufacturer    TEXT,
  embedding       VECTOR(1536),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Extraction audit log
CREATE TABLE extraction_logs (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id       TEXT,
  input_type       TEXT,          -- 'image' or 'text'
  raw_ocr_text     TEXT,
  consensus_score  FLOAT,
  structured_json  JSONB,
  matches_json     JSONB,
  processing_ms    INT,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);
