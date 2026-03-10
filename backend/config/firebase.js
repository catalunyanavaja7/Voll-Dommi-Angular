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
