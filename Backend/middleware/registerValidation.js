const { body, validationResult } = require('express-validator');

// Validasyonlar
const registerValidation = [
  body('name').notEmpty().withMessage('İsim boş olamaz.'),
  body('email').isEmail().withMessage('Geçerli bir e-posta adresi girin.'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Şifre en az 6 karakter olmalıdır.'),
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Şifreler eşleşmiyor.');
      }
      return true;
    }),
];

// Hata kontrolü 
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  registerValidation,
  validate,
};