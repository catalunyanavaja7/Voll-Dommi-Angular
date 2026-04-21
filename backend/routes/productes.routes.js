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

// Confirmar compra y guardar historial
router.post('/checkout', async (req, res) => {
  const { items } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No hi ha productes per confirmar.',
    });
  }

  let connection;

  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    for (const item of items) {
      const producte = item.producto || {};
      const mysqlId = item.mysqlId || null;
      const quantitat = Number(item.cantidad) || 0;

      if (!producte.nombre || quantitat <= 0) {
        throw new Error('Hi ha productes amb dades incompletes al checkout.');
      }

      await connection.query(
        `INSERT INTO historial_productes (
          firebase_uid,
          user_email,
          producte_id,
          producte_nom,
          preu,
          quantitat,
          en_oferta,
          data_compra
        ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          req.userId,
          req.userEmail,
          producte.id || null,
          producte.nombre,
          Number(producte.precio) || 0,
          quantitat,
          item.enOferta ? 1 : 0,
        ]
      );

      if (mysqlId) {
        await connection.query(
          'DELETE FROM productes WHERE id = ? AND firebase_uid = ?',
          [mysqlId, req.userId]
        );
      }
    }

    await connection.commit();
    res.json({ success: true, message: 'Compra registrada correctament.' });
  } catch (err) {
    if (connection) {
      await connection.rollback();
    }
    res.status(500).json({ success: false, message: err.message });
  } finally {
    if (connection) {
      connection.release();
    }
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
