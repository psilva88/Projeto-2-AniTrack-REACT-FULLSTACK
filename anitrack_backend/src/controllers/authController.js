const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

// Gera um token JWT assinado com o id e a role do usuário
const gerarToken = (usuario) => {
  const payload = { id: usuario._id, role: usuario.role };
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  });
};

// POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { nome, email, senha, role, idade } = req.body;
    if (!nome || !email || !senha) {
      return res.status(400).json({ mensagem: 'nome, email e senha são obrigatórios' });
    }

    // Criptografa a senha com bcrypt antes de salvar
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(senha, salt);

    const novo = await Usuario.create({ nome, email, senha: hash, role, idade });
    const token = gerarToken(novo);

    res.status(201).json({
      token,
      usuario: { id: novo._id, nome: novo.nome, email: novo.email, role: novo.role },
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ mensagem: 'Email já cadastrado' });
    }
    next(err);
  }
};

// POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) {
      return res.status(400).json({ mensagem: 'email e senha são obrigatórios' });
    }

    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(401).json({ mensagem: 'Credenciais inválidas' });
    }

    // Compara a senha enviada com o hash salvo
    const isMatch = await bcrypt.compare(senha, usuario.senha);
    if (!isMatch) {
      return res.status(401).json({ mensagem: 'Credenciais inválidas' });
    }

    const token = gerarToken(usuario);
    res.json({
      token,
      usuario: { id: usuario._id, nome: usuario.nome, email: usuario.email, role: usuario.role },
    });
  } catch (err) {
    next(err);
  }
};
