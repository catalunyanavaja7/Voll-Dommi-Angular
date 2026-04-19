const { Router } = require('express');
const { verifyToken } = require('../middleware/auth.middleware');
const db = require('../config/mysql');

const router = Router();
router.use(verifyToken); // todas las rutas requieren token Firebase

// Obtener productos del usuario logueado
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM productes WHERE firebase_uid = ?',
      [req.userId] // viene del middleware verifyToken
    );
    res.json({ success: true, productes: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Guardar producto para el usuario logueado
router.post('/', async (req, res) => {
  const { nom, preu, quantitat } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO productes (firebase_uid, nom, preu, quantitat) VALUES (?, ?, ?, ?)',
      [req.userId, nom, preu, quantitat ?? 1]
    );
    res.json({ success: true, id: result.insertId });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Actualizar cantidad
router.put('/:id', async (req, res) => {
  const { quantitat } = req.body;
  try {
    await db.query(
      'UPDATE productes SET quantitat = ? WHERE id = ? AND firebase_uid = ?',
      [quantitat, req.params.id, req.userId]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Eliminar producto
router.delete('/:id', async (req, res) => {
  try {
    await db.query(
      'DELETE FROM productes WHERE id = ? AND firebase_uid = ?',
      [req.params.id, req.userId]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
