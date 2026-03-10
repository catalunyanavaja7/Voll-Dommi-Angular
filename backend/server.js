// server.js
// ─────────────────────────────────────────────────────────────────────────────
// Entry point del backend Node.js – Projecte Botiga Virtual A3
// ─────────────────────────────────────────────────────────────────────────────

require('dotenv').config();
const express    = require('express');
const cors       = require('cors');

require('./config/firebase');

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    message: ' Backend Voll Dommi operatiu',
    timestamp: new Date().toISOString(),
  });
});

app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint no trobat.' });
});

app.use((err, _req, res, _next) => {
  console.error('Error no controlat:', err);
  res.status(500).json({ success: false, message: 'Error intern del servidor.' });
});

app.listen(PORT, () => {
  console.log('');
  console.log(`Servidor escoltant al port ${PORT}`);
});

module.exports = app;
