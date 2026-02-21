# 🧬 MedMap AI — Intelligent Medicine Extraction & Matching System

MedMap AI accepts prescription images — including messy, overlapping, or handwritten text — or raw medical text, extracts structured medicine data, and maps it to a trusted internal medicine database using hybrid matching. It returns structured JSON with similarity percentages and confidence scores.

The system's core innovation is a **5-pass multi-pass OCR consensus engine** that runs five different image preprocessing variants through Tesseract.js in parallel, then uses a token-level voting algorithm to build a consensus result that dramatically outperforms single-pass OCR on degraded or handwritten prescriptions.

## Architecture

```
┌─────────────┐     ┌──────────────────────────────────────────────┐
│   Frontend   │     │                   Backend                    │
│  React 18    │────▶│  Express + Node.js 20 (ESM)                 │
│  Vite        │     │                                              │
│  Tailwind    │     │  ┌─────────────┐  ┌────────────────────┐    │
│              │     │  │ 5-Pass OCR  │  │  Claude NER (NLP)  │    │
└─────────────┘     │  │ (tesseract  │──│  (Anthropic API)   │    │
                     │  │  + sharp)   │  └─────────┬──────────┘    │
                     │  └─────────────┘            │               │
                     │         │              ┌────▼─────────┐     │
                     │  ┌──────▼──────┐       │ 3-Stage      │     │
                     │  │  Consensus  │       │ Matching:    │     │
                     │  │  Algorithm  │       │ Exact→Fuzzy  │     │
                     │  └─────────────┘       │ →Vector      │     │
                     │                        └────┬─────────┘     │
                     └─────────────────────────────┼───────────────┘
                                                   │
                     ┌─────────────────────────────▼───────────────┐
                     │             Supabase (PostgreSQL)            │
                     │   pgvector + pg_trgm + hybrid_medicine_search│
                     │   medicines table + extraction_logs          │
                     └─────────────────────────────────────────────┘
```

## Tech Stack

| Layer       | Technology                                    |
|-------------|-----------------------------------------------|
| Frontend    | React 18 + Vite + Tailwind CSS               |
| Backend     | Node.js 20 + Express (ESM)                   |
| Database    | Supabase (PostgreSQL + pgvector + pg_trgm)   |
| OCR         | tesseract.js + sharp (5-pass preprocessing)  |
| NLP/NER     | Anthropic Claude API (claude-opus-4-6)       |
| Embeddings  | OpenAI text-embedding-3-small (1536d)        |
| Matching    | Supabase RPC hybrid_medicine_search          |

## Setup — Step by Step

### 1. Clone the repository
```bash
git clone <repo-url>
cd medmap-ai
```

### 2. Install backend dependencies
```bash
cd backend
npm install
```

### 3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

### 4. Create environment file
```bash
cd ../backend
cp .env.example .env
# Edit .env with your real API keys:
#   ANTHROPIC_API_KEY   — from console.anthropic.com
#   OPENAI_API_KEY      — from platform.openai.com
#   SUPABASE_URL        — from your Supabase project settings
#   SUPABASE_SERVICE_KEY — from Supabase project settings → API
```

### 5. Run database SQL (Supabase SQL Editor)
Run files in this exact order:
1. `database/01_extensions.sql` — enables pgvector + pg_trgm
2. `database/02_tables.sql` — creates medicines + extraction_logs tables
3. `database/03_indexes.sql` — creates trigram + vector indexes
4. `database/04_functions.sql` — creates hybrid_medicine_search() function
5. `database/05_seed.sql` — inserts 20 real Indian medicines

### 6. Generate embeddings
```bash
cd backend
node scripts/generateEmbeddings.js
```

### 7. (Optional) Import more medicines from CSV
```bash
node scripts/importMedicines.js path/to/indian_medicines.csv
node scripts/generateEmbeddings.js  # re-run for new records
```

### 8. Start the backend
```bash
cd backend
npm run dev     # development (nodemon)
# or
npm start       # production
```

### 9. Start the frontend
```bash
cd frontend
npm run dev
```

### 10. Open in browser
Navigate to **http://localhost:5173**

## API Documentation

### `POST /api/process-prescription`

| Field        | Type   | Required | Description                        |
|-------------|--------|----------|------------------------------------|
| `image`     | string | Either   | Base64 data URI of prescription    |
| `raw_text`  | string | Either   | Raw prescription text              |
| `options`   | object | No       | OCR config overrides               |

**Options:**
- `ocr_passes` (int, default 5) — number of OCR passes (3–5)
- `min_consensus` (int, default 3) — minimum passes to agree
- `debug_passes` (bool, default false) — include per-pass results

**Response:** See implementation plan for full response schemas.

### `GET /health`
Returns `{ "status": "ok", "timestamp": "...", "version": "1.0.0" }`

## How Multi-Pass OCR Works

1. **5 Image Variants** are generated using sharp:
   - Standard (normalize + sharpen)
   - High Contrast (40% contrast boost)
   - Binarized (Otsu-style threshold)
   - Deskewed (auto-rotate + denoise)
   - Inverted (for light ink on dark backgrounds)

2. **Parallel OCR** — All 5 variants run through Tesseract.js simultaneously via `Promise.all`.

3. **Token Consensus** — Results are tokenized and aligned by position. For each position, the most frequent token across all passes is selected. A token is "confirmed" only if ≥3 passes agree.

4. **Quality Scoring** — `consensus_score = (confirmed / total) × 100`
   - ≥ 70% → HIGH_CONFIDENCE
   - ≥ 40% → MEDIUM_CONFIDENCE
   - < 40% → LOW_QUALITY (rejected)

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `LOW_IMAGE_QUALITY` error | Upload a clearer image with better lighting |
| Embedding generation fails | Check OPENAI_API_KEY is valid and has credits |
| NLP extraction returns empty | Check ANTHROPIC_API_KEY is valid |
| IVFFlat index creation fails | Ensure you have ≥100 rows. Create index after import. |
| CORS errors in browser | Ensure FRONTEND_URL in .env matches your frontend URL |
| `require is not defined` error | Ensure all imports use ESM syntax (import/export) |
| Sharp build errors on Windows | Run `npm rebuild sharp` or install VS Build Tools |

## License

MIT
