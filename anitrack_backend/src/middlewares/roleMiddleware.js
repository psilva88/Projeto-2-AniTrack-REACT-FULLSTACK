// Garante que apenas usuários com a role exigida acessem a rota
module.exports = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ mensagem: 'Não autenticado' });
    if (req.user.role !== requiredRole) {
      return res.status(403).json({ mensagem: 'Acesso negado' });
    }
    next();
  };
};
