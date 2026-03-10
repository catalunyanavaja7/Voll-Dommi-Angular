
const bcrypt = require('bcryptjs');
const { db, NODES } = require('../config/firebase');


const getProfile = async (req, res) => {
  try {
    const uid = req.userId;


    const snapshot = await db.ref(`${NODES.USERS}/${uid}`).once('value');

    if (!snapshot.exists()) {
      return res.status(404).json({ success: false, message: 'Usuari no trobat.' });
    }

    const { password, ...userPublic } = snapshot.val();

    return res.status(200).json({ success: true, user: userPublic });

  } catch (err) {
    console.error('Error a getProfile:', err);
    return res.status(500).json({ success: false, message: 'Error intern del servidor.' });
  }
};

// PUT /api/user/profile
const updateProfile = async (req, res) => {
  try {
    const uid = req.userId;
    const { nom, cognoms, telefon, adreca, passwordActual, passwordNova } = req.body;

    // 1. Obtenir dades actuals
    const snapshot = await db.ref(`${NODES.USERS}/${uid}`).once('value');
    if (!snapshot.exists()) {
      return res.status(404).json({ success: false, message: 'Usuari no trobat.' });
    }

    const userData = snapshot.val();

    // 2. Construir objecte d'actualització
    const updates = { updatedAt: new Date().toISOString() };

    if (nom     !== undefined) updates.nom     = nom.trim();
    if (cognoms !== undefined) updates.cognoms = cognoms.trim();
    if (telefon !== undefined) updates.telefon = telefon.trim();
    if (adreca  !== undefined) updates.adreca  = adreca.trim();

    // 3. Canvi de contrasenya
    if (passwordNova) {
      if (!passwordActual) {
        return res.status(400).json({
          success: false,
          message: 'Cal proporcionar la contrasenya actual per canviar-la.',
        });
      }

      const passwordOk = await bcrypt.compare(passwordActual, userData.password);
      if (!passwordOk) {
        return res.status(401).json({
          success: false,
          message: 'La contrasenya actual és incorrecta.',
        });
      }

      if (passwordNova.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'La nova contrasenya ha de tenir mínim 6 caràcters.',
        });
      }

      updates.password = await bcrypt.hash(passwordNova, 12);
    }

    await db.ref(`${NODES.USERS}/${uid}`).update(updates);


    const updatedUser = { ...userData, ...updates };
    const { password: _, ...userPublic } = updatedUser;

    return res.status(200).json({
      success: true,
      message: 'Perfil actualitzat correctament.',
      user: userPublic,
    });

  } catch (err) {
    console.error('Error a updateProfile:', err);
    return res.status(500).json({ success: false, message: 'Error intern del servidor.' });
  }
};

module.exports = { getProfile, updateProfile };
