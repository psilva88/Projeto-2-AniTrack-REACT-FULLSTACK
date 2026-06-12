const Usuario = require('../models/Usuario');

// GET /api/usuarios  — lista com paginação e busca
exports.listar = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const busca = req.query.busca || '';

    const filtro = busca
      ? { $or: [{ nome: new RegExp(busca, 'i') }, { email: new RegExp(busca, 'i') }] }
      : {};

    const total = await Usuario.countDocuments(filtro);
    const usuarios = await Usuario.find(filtro)
      .select('-senha')
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ criadoEm: -1 });

    res.json({
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      usuarios,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/usuarios/:id
exports.buscarPorId = async (req, res, next) => {
  try {
    const usuario = await Usuario.findById(req.params.id).select('-senha');
    if (!usuario) return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    res.json(usuario);
  } catch (err) {
    next(err);
  }
};

// PUT /api/usuarios/:id
exports.atualizar = async (req, res, next) => {
  try {
    const { senha, ...dados } = req.body;
    const atualizado = await Usuario.findByIdAndUpdate(req.params.id, dados, {
      new: true,
      runValidators: true,
    }).select('-senha');

    if (!atualizado) return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    res.json(atualizado);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ mensagem: 'Email já cadastrado' });
    }
    next(err);
  }
};

// DELETE /api/usuarios/:id  — protegido por roleMiddleware('admin')
exports.deletar = async (req, res, next) => {
  try {
    const apagado = await Usuario.findByIdAndDelete(req.params.id);
    if (!apagado) return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
