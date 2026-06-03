import express  from 'express';
import process   from 'node:process';
import apiRoutes from './src/routes/index.js';
import rateLimit from 'express-rate-limit';
import helmet    from 'helmet';
import cors      from 'cors';
import rateLimit from 'express-rate-limit';

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN ?? 'http://localhost', credentials: true }));

export const authRateLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 });

const app  = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 8080;

// --- Parse JSON request bodies ---
app.use(express.json());

// --- Register API routes ---
app.use('/api', apiRoutes);

// --- 404 handler ---
app.use((_req, res) => {
    res.status(404).json({ message: 'Nenájdené' });
});

// --- Global error handler ---
app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ message: 'Interná chyba servera' });
});

// --- Start server ---
app.listen(PORT, '0.0.0.0', () => {
    console.log(`[backend] počúva na porte ${PORT}`);
});
