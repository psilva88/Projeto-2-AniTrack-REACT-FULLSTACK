const mongoose = require('mongoose');

const AnimeSchema = new mongoose.Schema({
  nome: { type: String, required: true, trim: true },
  totalEps: { type: Number, required: true, min: 1 },
  assistidos: { type: Number, default: 0, min: 0 },
  status: {
    type: String,
    enum: ['Assistindo', 'Pausado', 'Finalizado'],
    default: 'Assistindo',
  },
  favorito: { type: Boolean, default: false },
  capa: { type: String, default: '' },

  // ===== RELACIONAMENTO =====
  // Cada anime pertence a um Usuário (relação entre as 2 entidades)
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
  },
}, { timestamps: { createdAt: 'criadoEm', updatedAt: 'atualizadoEm' } });

module.exports = mongoose.model('Anime', AnimeSchema);
