

const jwt = require('jsonwebtoken');
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

module.exports = { verifyToken };
