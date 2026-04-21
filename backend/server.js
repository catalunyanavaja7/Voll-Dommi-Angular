// server.js
// ─────────────────────────────────────────────────────────────────────────────
// Entry point del backend Node.js – Projecte Botiga Virtual A3
// ─────────────────────────────────────────────────────────────────────────────

// Puerto de escucha predeterminado: 8080

require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
require('./config/firebase');
const productesRoutes = require('./routes/productes.routes');

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const adminRoutes = require('./routes/admin.routes');

const app  = express();
const PORT = process.env.PORT || 8080;


app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/productes', productesRoutes);
app.use('/api/admin', adminRoutes);

// MySQL Workbench
const pool = require('./config/mysql');
pool.query('SELECT 1')
  .then(() => console.log('Connectat a MySQL!'))
  .catch(err => console.error('Error MySQL:', err.message));


app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    message: ' Backend Voll Dommi operatiu',
    timestamp: new Date().toISOString(),
  });
});

// POSIBLES ERRORES

app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint no trobat.' });
});

app.use((err, _req, res, _next) => {
  console.error('Error no controlat:', err);
  res.status(500).json({ success: false, message: 'Error intern del servidor.' });
});

// MENSAJE DEL PUERTO (3000)

app.listen(PORT, () => {
  console.log('');
  console.log(`Servidor escoltant al port ${PORT}`);
});

module.exports = app;
