const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
  nome: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  senha: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  idade: { type: Number },
}, { timestamps: { createdAt: 'criadoEm', updatedAt: 'atualizadoEm' } });


module.exports = mongoose.model('Usuario', UsuarioSchema);
