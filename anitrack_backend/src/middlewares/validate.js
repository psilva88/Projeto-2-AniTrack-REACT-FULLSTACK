const { validationResult } = require('express-validator');

// Middleware que verifica o resultado das validações do express-validator
module.exports = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      mensagem: 'Erro de validação',
      erros: errors.array().map((e) => e.msg),
    });
  }
  next();
};
