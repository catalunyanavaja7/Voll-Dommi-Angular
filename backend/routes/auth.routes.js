
const { Router } = require('express');
const { body }   = require('express-validator');
const { validate } = require('../middleware/validate.middleware');
const { register, login, resetPassword, verifyEmail } = require('../controllers/auth.controller');

const router = Router();

router.post('/register', [
  body('nom')     .notEmpty().withMessage('El nom és obligatori.').trim(),
  body('cognoms') .notEmpty().withMessage('Els cognoms són obligatoris.').trim(),
  body('email')   .isEmail() .withMessage('L\'email no és vàlid.').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('La contrasenya ha de tenir mínim 6 caràcters.'),
], validate, register);

router.post('/login', [
  body('email')   .isEmail().withMessage('L\'email no és vàlid.').normalizeEmail(),
  body('password').notEmpty().withMessage('La contrasenya és obligatòria.'),
], validate, login);

router.post('/reset-password', [
  body('email').isEmail().withMessage('L\'email no és vàlid.').normalizeEmail(),
], validate, resetPassword);

router.post('/verify-email', [
  body('token').notEmpty().withMessage('El token és obligatori.'),
], validate, verifyEmail);

module.exports = router;
