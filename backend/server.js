/**
 * VAIDYADRISHTI AI — Express Server Entry Point
 *
 * CORS-enabled Express server with JSON body parsing (25MB limit),
 * health check endpoint, and prescription processing route.
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import prescriptionRouter from './routes/prescription.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ─────────────────────────────────────
// ── Middleware ─────────────────────────────────────
// Enhanced Request Logging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    console.log(`  - Origin: ${req.headers.origin}`);
    console.log(`  - UA: ${req.headers['user-agent']}`);
    next();
});

app.use(
    cors({
        origin: (origin, callback) => {
            // Always allow for debugging, echo origin back
            callback(null, true);
        },
        methods: ['GET', 'POST', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
        credentials: true,
    })
);

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// ── Health Check ──────────────────────────────────
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        version: '1.0.2',
        env: {
            frontend_url: process.env.FRONTEND_URL ? 'set' : 'not set',
            supabase_url: process.env.SUPABASE_URL ? 'set' : 'not set'
        }
    });
});

// ── Routes ────────────────────────────────────────
app.use('/api', prescriptionRouter);

// ── 404 Handler ───────────────────────────────────
app.use((req, res) => {
    console.warn(`[404] ${req.method} ${req.path}`);
    res.status(404).json({
        status: 'error',
        code: 'NOT_FOUND',
        message: `Route ${req.method} ${req.path} not found.`,
    });
});

// ── Global Error Handler ──────────────────────────
app.use((err, req, res, next) => {
    console.error('[Server Error Handled]:', err);

    // Robust CORS header fallback
    const origin = req.headers.origin || 'https://vaidyadrishti-ai.vercel.app';
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    res.status(500).json({
        status: 'error',
        code: 'SERVER_ERROR',
        message: err.message || 'Internal server error.',
    });
});

// ── Start Server ──────────────────────────────────
app.listen(PORT, () => {
    console.log(`\n  ╔══════════════════════════════════════╗`);
    console.log(`  ║  🧬 VAIDYADRISHTI AI Server v1.0.2          ║`); // Updated version
    console.log(`  ║  Port: ${PORT}                          ║`);
    console.log(`  ║  Status: LIVE & HEALTHY              ║`);
    console.log(`  ╚══════════════════════════════════════╝\n`);
});
