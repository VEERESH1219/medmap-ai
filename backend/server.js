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
// Log requests for debugging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - Origin: ${req.headers.origin}`);
    next();
});

app.use(
    cors({
        origin: (origin, callback) => {
            // Sanitize origin: remove non-ASCII characters
            const sanitizedOrigin = (origin || '').replace(/[^\x20-\x7E]/g, '');

            const allowedOrigins = [
                process.env.FRONTEND_URL,
                'https://vaidyadrishti-ai.vercel.app',
                'http://localhost:5173',
                'http://localhost:3000'
            ].map(o => (o || '').replace(/[^\x20-\x7E]/g, ''));

            if (!origin || allowedOrigins.includes(sanitizedOrigin)) {
                callback(null, true);
            } else {
                console.warn(`[CORS] Blocked origin: ${sanitizedOrigin}`);
                callback(new Error('Not allowed by CORS'));
            }
        },
        methods: ['GET', 'POST', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
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
        version: '1.0.1', // Bumped version
    });
});

// ── Routes ────────────────────────────────────────
app.use('/api', prescriptionRouter);

// ── 404 Handler ───────────────────────────────────
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        code: 'NOT_FOUND',
        message: `Route ${req.method} ${req.path} not found.`,
    });
});

// ── Global Error Handler ──────────────────────────
app.use((err, req, res, next) => {
    console.error('[Server] Unhandled error:', err);

    // Ensure CORS headers are present even in error responses
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Credentials', 'true');

    res.status(500).json({
        status: 'error',
        code: 'SERVER_ERROR',
        message: err.message || 'Internal server error.',
    });
});

// ── Start Server ──────────────────────────────────
app.listen(PORT, () => {
    console.log(`\n  ╔══════════════════════════════════════╗`);
    console.log(`  ║  🧬 VAIDYADRISHTI AI Server v1.0.0          ║`);
    console.log(`  ║  Port: ${PORT}                          ║`);
    console.log(`  ║  Health: http://localhost:${PORT}/health ║`);
    console.log(`  ╚══════════════════════════════════════╝\n`);
});
