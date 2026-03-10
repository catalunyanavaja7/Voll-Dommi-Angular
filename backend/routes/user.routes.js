
const { Router } = require('express');
const { body }   = require('express-validator');
const { verifyToken }   = require('../middleware/auth.middleware');
const { validate }      = require('../middleware/validate.middleware');
const { getProfile, updateProfile } = require('../controllers/user.controller');

const router = Router();

router.use(verifyToken);

router.get('/profile', getProfile);

router.put('/profile', [
  body('nom')    .optional().notEmpty().withMessage('El nom no pot estar buit.').trim(),
  body('cognoms').optional().notEmpty().withMessage('Els cognoms no poden estar buits.').trim(),
  body('telefon').optional().trim(),
  body('adreca') .optional().trim(),
  body('passwordNova')
    .optional()
    .isLength({ min: 6 })
    .withMessage('La nova contrasenya ha de tenir mínim 6 caràcters.'),
], validate, updateProfile);

module.exports = router;
