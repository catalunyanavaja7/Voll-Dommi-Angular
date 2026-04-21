const { Router } = require('express');
const db = require('../config/mysql');
const { verifyToken, requireAdmin } = require('../middleware/auth.middleware');

const router = Router();

router.use(verifyToken, requireAdmin);

router.get('/historial', async (_req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT
        id,
        firebase_uid,
        user_email,
        producte_id,
        producte_nom,
        preu,
        quantitat,
        en_oferta,
        data_compra
      FROM historial_productes
      ORDER BY data_compra DESC, id DESC`
    );

    res.json({ success: true, historial: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
