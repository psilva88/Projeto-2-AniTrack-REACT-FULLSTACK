const mongoose = require('mongoose');

// Conexão centralizada com o MongoDB Atlas (boa prática dos slides)
const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error('MONGO_URI não configurado em .env');

    await mongoose.connect(uri);
    console.log('✅ MongoDB Atlas conectado!');
  } catch (err) {
    console.error('❌ Erro ao conectar MongoDB:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
