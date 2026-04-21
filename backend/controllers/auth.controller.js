// controllers/auth.controller.js
// ─────────────────────────────────────────────────────────────────────────────
// Controlador d'autenticació — Firebase Realtime Database
//   POST /api/auth/register        → Registre d'usuari
//   POST /api/auth/login           → Identificació d'usuari
//   POST /api/auth/reset-password  → Restablir contrasenya (envia correu)
//   POST /api/auth/verify-email    → Verificar correu electrònic
// ─────────────────────────────────────────────────────────────────────────────

const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { db, NODES } = require('../config/firebase');
const { sendPasswordResetEmail, sendVerificationEmail } = require('../services/email.service');
require('dotenv').config();

// Utils

const generateToken = (uid, email) =>
  jwt.sign({ uid, email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

/** contrasenya aleatòria de 10 caràcters */
const generateRandomPassword = () => {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$';
  return Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};


const findUserByEmail = async (email) => {
  const snapshot = await db.ref(NODES.USERS)
    .orderByChild('email')
    .equalTo(email.toLowerCase())
    .once('value');

  if (!snapshot.exists()) return null;


  const users = snapshot.val();
  const uid   = Object.keys(users)[0];
  return { uid, ...users[uid] };
};

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { nom, cognoms, email, password, telefon, adreca } = req.body;

    // 1. Comprovar si ja existeix l'email
    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Ja existeix un compte amb aquest correu electrònic.',
      });
    }

    // 2.  contrasenya
    const hashedPassword = await bcrypt.hash(password, 12);

    // 3. Crear node a Realtime Database
    const uid = uuidv4();
    const now = new Date().toISOString();

    const userData = {
      uid,
      nom:           nom.trim(),
      cognoms:       cognoms.trim(),
      email:         email.toLowerCase().trim(),
      rol:           'user',
      password:      hashedPassword,
      telefon:       telefon || '',
      adreca:        adreca  || '',
      emailVerificat: false,
      createdAt:     now,
      updatedAt:     now,
    };

    await db.ref(`${NODES.USERS}/${uid}`).set(userData);

    // 4. Crear token de verificació
    const verifyToken = uuidv4();
    const expiresAt   = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    await db.ref(`${NODES.VERIFY_TOKENS}/${verifyToken}`).set({
      uid,
      email: userData.email,
      expiresAt,
    });

    // 5. Enviar correu de verificació
    try {
      await sendVerificationEmail(userData.email, userData.nom, verifyToken);
    } catch (emailErr) {
      console.warn('⚠️  No s\'ha pogut enviar el correu de verificació:', emailErr.message);
    }

    // 6. Respondre amb JWT
    const token = generateToken(uid, userData.email);
    const { password: _, ...userPublic } = userData;

    return res.status(201).json({
      success: true,
      message: 'Usuari registrat correctament. Comprova el teu correu per verificar el compte.',
      token,
      user: userPublic,
    });

  } catch (err) {
    console.error('Error a register:', err);
    return res.status(500).json({ success: false, message: 'Error intern del servidor.' });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Buscar usuari per email
    const userData = await findUserByEmail(email);
    if (!userData) {
      return res.status(401).json({ success: false, message: 'Credencials incorrectes.' });
    }

    // 2. Verificar contrasenya
    const passwordOk = await bcrypt.compare(password, userData.password);
    if (!passwordOk) {
      return res.status(401).json({ success: false, message: 'Credencials incorrectes.' });
    }

    // 3. Generar JWT i respondre
    const token = generateToken(userData.uid, userData.email);
    const { password: _, ...userPublic } = userData;

    return res.status(200).json({
      success: true,
      message: 'Identificació correcta.',
      token,
      user: userPublic,
    });

  } catch (err) {
    console.error('Error a login:', err);
    return res.status(500).json({ success: false, message: 'Error intern del servidor.' });
  }
};

//Envia una nova contrasenya temporal per correu
const resetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // 1. Buscar usuari
    const userData = await findUserByEmail(email);


    if (!userData) {
      return res.status(200).json({
        success: true,
        message: 'Si l\'adreça és correcta, rebràs un correu amb la nova contrasenya.',
      });
    }

    // 2. Generar nova contrasenya temporal
    const newPassword       = generateRandomPassword();
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // 3. Actualitzar a Realtime Database
    await db.ref(`${NODES.USERS}/${userData.uid}`).update({
      password:  hashedNewPassword,
      updatedAt: new Date().toISOString(),
    });

    // 4. Enviar correu amb la nova contrasenya
    await sendPasswordResetEmail(userData.email, userData.nom, newPassword);

    return res.status(200).json({
      success: true,
      message: 'Si l\'adreça és correcta, rebràs un correu amb la nova contrasenya.',
    });

  } catch (err) {
    console.error('Error a resetPassword:', err);
    return res.status(500).json({ success: false, message: 'Error intern del servidor.' });
  }
};

//  POST /api/auth/verify-email
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ success: false, message: 'Token no proporcionat.' });
    }

    // 1. Buscar el token a Realtime Database
    const tokenSnap = await db.ref(`${NODES.VERIFY_TOKENS}/${token}`).once('value');

    if (!tokenSnap.exists()) {
      return res.status(400).json({ success: false, message: 'Token invàlid o ja utilitzat.' });
    }

    const { uid, expiresAt } = tokenSnap.val();

    // 2. Comprovar caducitat
    if (new Date() > new Date(expiresAt)) {
      await db.ref(`${NODES.VERIFY_TOKENS}/${token}`).remove();
      return res.status(400).json({ success: false, message: 'El token ha caducat. Sol·licita un de nou.' });
    }

    // 3. Marcar usuari com verificat
    await db.ref(`${NODES.USERS}/${uid}`).update({
      emailVerificat: true,
      updatedAt: new Date().toISOString(),
    });

    // 4. Eliminar el token
    await db.ref(`${NODES.VERIFY_TOKENS}/${token}`).remove();

    return res.status(200).json({
      success: true,
      message: 'Correu electrònic verificat correctament!',
    });

  } catch (err) {
    console.error('Error a verifyEmail:', err);
    return res.status(500).json({ success: false, message: 'Error intern del servidor.' });
  }
};

module.exports = { register, login, resetPassword, verifyEmail };
