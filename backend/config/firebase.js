// config/firebase.js
// ─────────────────────────────────────────────────────────────────────────────
// Inicialitza Firebase Admin SDK amb Realtime Database.
//
// SETUP:
//  1. Ves a Firebase Console → Configuració → Comptes de servei
//  2. Clica "Genera clau privada nova" → es descarrega un .json
//  3. Anomena'l serviceAccountKey.json i posa'l a config/serviceAccountKey.json
//  4. Afegeix config/serviceAccountKey.json al .gitignore (MAI pujar al repo!)
// ─────────────────────────────────────────────────────────────────────────────

const admin = require('firebase-admin');
const path  = require('path');
require('dotenv').config();

const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');

if (!admin.apps.length) {
  try {
    const serviceAccount = require(serviceAccountPath);
    admin.initializeApp({
      credential:  admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    });
    console.log('inicialitzado correctamente');
  } catch (err) {
    console.error('Error inicializando');
    console.error('    Assegura\'t que config/serviceAccountKey.json existeix.');
    console.error('    Detalls:', err.message);
    process.exit(1);
  }
}

//Realtime Database
const db = admin.database();

// Nodes principals de la base de dades
const NODES = {
  USERS:         'users',
  RESET_TOKENS:  'passwordResetTokens',
  VERIFY_TOKENS: 'emailVerifyTokens',
};

module.exports = { admin, db, NODES };
