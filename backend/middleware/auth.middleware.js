

const jwt = require('jsonwebtoken');
const { db, NODES } = require('../config/firebase');
require('dotenv').config();

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Accés denegat. Cal proporcionar un token d\'autenticació.',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded  = jwt.verify(token, process.env.JWT_SECRET);
    req.userId     = decoded.uid;
    req.userEmail  = decoded.email;
    next();
  } catch (err) {
    const msg = err.name === 'TokenExpiredError'
      ? 'El token ha caducat. Inicia sessió de nou.'
      : 'Token invàlid.';
    return res.status(401).json({ success: false, message: msg });
  }
};

const requireAdmin = async (req, res, next) => {
  try {
    const snapshot = await db.ref(`${NODES.USERS}/${req.userId}`).once('value');

    if (!snapshot.exists()) {
      return res.status(404).json({
        success: false,
        message: 'Usuari no trobat.',
      });
    }

    const user = snapshot.val();

    if (user.rol !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No tens permisos d administrador.',
      });
    }

    req.userRole = user.rol;
    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Error comprovant permisos d administrador.',
    });
  }
};

module.exports = { verifyToken, requireAdmin };
