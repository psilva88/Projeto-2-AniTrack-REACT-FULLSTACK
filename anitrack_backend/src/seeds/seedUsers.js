require('dotenv').config();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Usuario = require('../models/Usuario');
const Anime = require('../models/Anime');

// Popular o banco com um admin e alguns animes de exemplo
async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado ao MongoDB para seed');

    // Limpa dados antigos (cuidado em produção!)
    await Usuario.deleteMany({});
    await Anime.deleteMany({});

    // Cria o admin
    const senhaHash = await bcrypt.hash('admin123', 10);
    const admin = await Usuario.create({
      nome: 'Administrador',
      email: 'admin@aula.com',
      senha: senhaHash,
      role: 'admin',
    });
    console.log('👤 Admin criado: admin@aula.com / admin123');

    // ===== Usuários do grupo =====
    const senhaArthur = await bcrypt.hash('user123', 10);
    const arthur = await Usuario.create({
      nome: 'Arthur Pereira',
      email: 'arthur@aula.com',
      senha: senhaArthur,
      role: 'user',
    });
    console.log('👤 Usuário criado: arthur@aula.com / user123');

    const senhaBernardo = await bcrypt.hash('user123', 10);
    await Usuario.create({
      nome: 'Bernardo Ramos',
      email: 'bernardo@aula.com',
      senha: senhaBernardo,
      role: 'user',
    });
    console.log('👤 Usuário criado: bernardo@aula.com / user123');

    const senhaRodrigo = await bcrypt.hash('user123', 10);
    await Usuario.create({
      nome: 'Rodrigo Lira',
      email: 'rodrigo@aula.com',
      senha: senhaRodrigo,
      role: 'user',
    });
    console.log('👤 Usuário criado: rodrigo@aula.com / user123');

    const senhaLuiz = await bcrypt.hash('user123', 10);
    await Usuario.create({
      nome: 'Luiz Gustavo',
      email: 'luiz@aula.com',
      senha: senhaLuiz,
      role: 'user',
    });
    console.log('👤 Usuário criado: luiz@aula.com / user123');

    // Animes de exemplo vinculados ao Arthur
    const user = arthur;

    // Animes de exemplo vinculados ao Arthur
    await Anime.create([
      { nome: 'Attack on Titan', totalEps: 87, assistidos: 87, status: 'Finalizado', favorito: true, capa: 'https://cdn.myanimelist.net/images/anime/10/47347.jpg', usuario: user._id },
      { nome: 'Demon Slayer', totalEps: 44, assistidos: 26, status: 'Assistindo', favorito: true, capa: 'https://cdn.myanimelist.net/images/anime/1286/99889.jpg', usuario: user._id },
      { nome: 'Jujutsu Kaisen', totalEps: 48, assistidos: 12, status: 'Assistindo', favorito: false, capa: 'https://cdn.myanimelist.net/images/anime/1171/109222.jpg', usuario: user._id },
    ]);
    console.log('🎌 3 animes de exemplo criados para o Arthur');

    console.log('\n✅ Seed concluído com sucesso!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Erro no seed:', err.message);
    process.exit(1);
  }
}

seed();
