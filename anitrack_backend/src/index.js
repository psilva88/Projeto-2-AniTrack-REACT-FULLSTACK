require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const animeRoutes = require('./routes/animeRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Conectar ao MongoDB Atlas
connectDB();

// ===== Middlewares globais =====
app.use(helmet());              // segurança nos headers
app.use(cors());                // libera requisições do frontend
app.use(express.json());        // parse de JSON no body
app.use(morgan('dev'));         // logs das requisições

// ===== Rotas =====
app.get('/', (req, res) => res.send('API AniTrack (Node + Mongo) funcionando 🎌'));
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/animes', animeRoutes);

// ===== Error handler =====
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
