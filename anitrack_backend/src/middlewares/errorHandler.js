// Middleware centralizado de tratamento de erros (deve ser o último no index.js)
module.exports = (err, req, res, next) => {
  console.error(err.stack);

  // Erro de ID inválido do Mongoose
  if (err.name === 'CastError') {
    return res.status(400).json({ mensagem: 'ID inválido' });
  }

  // Erro de validação do Mongoose
  if (err.name === 'ValidationError') {
    const erros = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ mensagem: 'Erro de validação', erros });
  }

  res.status(500).json({ mensagem: 'Algo deu errado no servidor' });
};
