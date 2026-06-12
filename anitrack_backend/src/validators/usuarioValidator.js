const { body } = require('express-validator');

// Regras de validação para registro de usuário
exports.registerRules = [
  body('nome').notEmpty().withMessage('O nome é obrigatório').trim(),
  body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
  body('senha').isLength({ min: 6 }).withMessage('A senha deve ter no mínimo 6 caracteres'),
];

// Regras de validação para login
exports.loginRules = [
  body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
  body('senha').notEmpty().withMessage('A senha é obrigatória'),
];
