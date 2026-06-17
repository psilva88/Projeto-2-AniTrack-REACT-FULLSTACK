const Anime = require('../models/Anime');

// GET /api/animes  — lista só os animes do usuário logado (com filtros)
exports.listar = async (req, res, next) => {
  try {
    const { status, favorito } = req.query;

    // Sempre filtra pelo dono (req.user vem do authMiddleware)
    const filtro = { usuario: req.user.id };
    if (status) filtro.status = status;
    if (favorito === 'true') filtro.favorito = true;

    const animes = await Anime.find(filtro).sort({ criadoEm: -1 });
    res.json(animes);
  } catch (err) {
    next(err);
  }
};

// GET /api/animes/stats  — estatísticas do usuário (total, eps, finalizados, favoritos)
exports.estatisticas = async (req, res, next) => {
  try {
    const animes = await Anime.find({ usuario: req.user.id });
    const stats = {
      total: animes.length,
      episodiosAssistidos: animes.reduce((s, a) => s + a.assistidos, 0),
      finalizados: animes.filter((a) => a.status === 'Finalizado').length,
      favoritos: animes.filter((a) => a.favorito).length,
    };
    res.json(stats);
  } catch (err) {
    next(err);
  }
};

// GET /api/animes/:id
exports.buscarPorId = async (req, res, next) => {
  try {
    const anime = await Anime.findOne({ _id: req.params.id, usuario: req.user.id });
    if (!anime) return res.status(404).json({ mensagem: 'Anime não encontrado' });
    res.json(anime);
  } catch (err) {
    next(err);
  }
};

// POST /api/animes  — cria um anime vinculado ao usuário logado
exports.criar = async (req, res, next) => {
  try {
    const { nome, totalEps, assistidos, status, favorito, capa } = req.body;
    if (!nome || !totalEps) {
      return res.status(400).json({ mensagem: 'nome e totalEps são obrigatórios' });
    }

    const novo = await Anime.create({
      nome,
      totalEps,
      assistidos: assistidos || 0,
      status: status || 'Assistindo',
      favorito: favorito || false,
      capa: capa || '',
      usuario: req.user.id, // relacionamento com o dono
    });

    res.status(201).json(novo);
  } catch (err) {
    next(err);
  }
};

// PUT /api/animes/:id  — atualiza um anime do usuário
exports.atualizar = async (req, res, next) => {
  try {
    const atualizado = await Anime.findOneAndUpdate(
      { _id: req.params.id, usuario: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!atualizado) return res.status(404).json({ mensagem: 'Anime não encontrado' });
    res.json(atualizado);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/animes/:id
exports.remover = async (req, res, next) => {
  try {
    const apagado = await Anime.findOneAndDelete({ _id: req.params.id, usuario: req.user.id });
    if (!apagado) return res.status(404).json({ mensagem: 'Anime não encontrado' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
