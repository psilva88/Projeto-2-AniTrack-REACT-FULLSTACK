<p align="center">
  <img src="https://github.com/user-attachments/assets/18770a10-ca78-4628-a203-70790f7d3354" alt="AniTrack Logo" width="400"/>
</p>
<p align="center">
  Seu catálogo pessoal de animes. Acompanhe episódios, marque favoritos e organize sua jornada.
</p>
<p align="center">
  <img src="https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat-square&logo=react" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb" />
  <img src="https://img.shields.io/badge/JWT-Auth-000000?style=flat-square&logo=jsonwebtokens" />
</p>

## 👥 Integrantes do Grupo

- Arthur Pereira Silva
- Bernardo Ramos dos Santos
- Rodrigo Lira Rodrigues
- Luiz Gustavo Barbosa Machado

---

## 💡 Descrição da Aplicação

O AniTrack resolve a dificuldade que os fãs de cultura pop têm em organizar seu progresso em obras longas. O sistema evita que o usuário se perca em quais episódios já foram assistidos, centralizando tudo em um único lugar.

Nesta **Fase 2**, a aplicação evoluiu para um sistema **full stack** completo: o frontend React agora se conecta a uma **API REST própria** em Node.js, com autenticação real via **JWT**, senhas criptografadas e dados persistidos em um banco **MongoDB**. Cada usuário possui sua própria lista pessoal de animes, salva de verdade no banco de dados.

O usuário pode criar uma conta, fazer login ou entrar como visitante. Dentro do sistema, ele gerencia sua lista: adiciona títulos (manualmente ou buscando direto no **MyAnimeList**), atualiza episódios com botões `+` e `−`, edita, favorita, ordena, busca e alterna entre visualização em lista e grade.

---

## 🛠️ Tecnologias Utilizadas

### Frontend
| Tecnologia | Uso |
|---|---|
| **React** | Biblioteca principal — componentes funcionais |
| **React Router DOM** | Navegação SPA com rotas básicas, dinâmicas e aninhadas |
| **Context API** | Gerenciamento de estado global (tema, animes, autenticação) |
| **React Hooks** | `useState`, `useEffect`, `useContext`, `useRef` |
| **Fetch API** | Comunicação com o backend e APIs externas |
| **API do MyAnimeList (Jikan)** | Busca de animes e destaques populares (extra) |

### Backend
| Tecnologia | Uso |
|---|---|
| **Node.js + Express** | Servidor e API REST |
| **MongoDB + Mongoose** | Banco de dados NoSQL e modelagem |
| **JWT (jsonwebtoken)** | Autenticação por token |
| **bcryptjs** | Criptografia de senhas |
| **express-validator** | Validação de dados |
| **helmet, cors, morgan** | Segurança e logs |
| **dotenv** | Variáveis de ambiente |

---

## 🗄️ Modelagem do Banco de Dados

O sistema possui **duas entidades relacionadas**: `Usuário` e `Anime`.

### Entidade: Usuário
| Campo | Tipo | Detalhe |
|---|---|---|
| nome | String | Obrigatório |
| email | String | Obrigatório, único |
| senha | String | Obrigatório (armazenada com hash bcrypt) |
| role | String | `user` ou `admin` (padrão: user) |
| idade | Number | Opcional |

### Entidade: Anime
| Campo | Tipo | Detalhe |
|---|---|---|
| nome | String | Obrigatório |
| totalEps | Number | Obrigatório |
| assistidos | Number | Padrão: 0 |
| status | String | Assistindo / Pausado / Finalizado |
| favorito | Boolean | Padrão: false |
| capa | String | URL da imagem |
| **usuario** | ObjectId | **Referência ao Usuário dono** |

### Relacionamento
**Um Usuário → Vários Animes** (um para muitos). Cada documento de anime guarda o `ObjectId` do usuário dono, garantindo que cada pessoa veja apenas a sua própria lista.

---

## 🔌 Endpoints da API

### 🔑 Autenticação — `/api/auth`
| Método | Rota | Descrição | Protegida |
|---|---|---|---|
| POST | `/api/auth/register` | Cria um usuário e retorna o token | ❌ |
| POST | `/api/auth/login` | Faz login e retorna o token | ❌ |

### 👤 Usuários — `/api/usuarios`
| Método | Rota | Descrição | Protegida |
|---|---|---|---|
| GET | `/api/usuarios` | Lista usuários (com paginação e busca) | ✅ |
| GET | `/api/usuarios/:id` | Busca um usuário por ID | ✅ |
| PUT | `/api/usuarios/:id` | Atualiza um usuário | ✅ |
| DELETE | `/api/usuarios/:id` | Remove um usuário | ✅ (apenas admin) |

### 🎌 Animes — `/api/animes`
| Método | Rota | Descrição | Protegida |
|---|---|---|---|
| GET | `/api/animes` | Lista os animes do usuário logado | ✅ |
| GET | `/api/animes/stats` | Retorna estatísticas do usuário | ✅ |
| GET | `/api/animes/:id` | Busca um anime por ID | ✅ |
| POST | `/api/animes` | Cria um anime | ✅ |
| PUT | `/api/animes/:id` | Atualiza um anime | ✅ |
| DELETE | `/api/animes/:id` | Remove um anime | ✅ |

> As rotas protegidas exigem o header: `Authorization: Bearer {token}`

---

## 📁 Estrutura do Projeto

O projeto está organizado em duas pastas: `anitrack_backend` (API) e `anitrack_frontend` (interface).

```
AniTrack/
│
├── anitrack_backend/              ← API REST (Node.js + Express + MongoDB)
│   ├── src/
│   │   ├── index.js               ← Ponto de entrada (servidor + middlewares)
│   │   ├── config/
│   │   │   └── db.js              ← Conexão com o MongoDB Atlas
│   │   ├── models/
│   │   │   ├── Usuario.js         ← Entidade Usuário (role + senha hash)
│   │   │   └── Anime.js           ← Entidade Anime (relacionada ao Usuário)
│   │   ├── controllers/
│   │   │   ├── authController.js     ← Register + Login (JWT)
│   │   │   ├── usuarioController.js  ← CRUD de usuários
│   │   │   └── animeController.js    ← CRUD da lista de animes
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── usuarioRoutes.js
│   │   │   └── animeRoutes.js
│   │   ├── middlewares/
│   │   │   ├── authMiddleware.js     ← Valida o token JWT
│   │   │   ├── roleMiddleware.js     ← Autorização por perfil
│   │   │   ├── errorHandler.js       ← Tratamento central de erros
│   │   │   └── validate.js           ← Verifica as validações
│   │   ├── validators/
│   │   │   └── usuarioValidator.js   ← Regras de validação
│   │   └── seeds/
│   │       └── seedUsers.js          ← Popular o banco com dados iniciais
│   ├── .env                          ← Variáveis (MONGO_URI + JWT_SECRET)
│   └── package.json
│
└── anitrack_frontend/             ← Interface (React)
    ├── public/
    │   └── images/                ← Logo e imagens dos animes
    ├── src/
    │   ├── context/
    │   │   ├── ThemeContext.js    ← Dark / Light Mode global
    │   │   ├── AnimeContext.js    ← Lista de animes (consome a API)
    │   │   └── AuthContext.js     ← Autenticação (login real + token)
    │   ├── services/
    │   │   └── api.js             ← Camada de comunicação com o backend
    │   ├── components/
    │   │   ├── Navbar.js
    │   │   ├── Sidebar.js
    │   │   ├── BottomNav.js
    │   │   └── Footer.js
    │   ├── hooks/
    │   │   └── useResponsive.js   ← Hook customizado para responsividade
    │   ├── pages/
    │   │   ├── Login.js
    │   │   ├── Cadastro.js
    │   │   ├── Home.js
    │   │   ├── Dashboard.js       ← Layout com <Outlet />
    │   │   ├── MinhaLista.js
    │   │   ├── Perfil.js
    │   │   └── NotFound.js
    │   ├── App.js                 ← Rotas e Providers
    │   └── index.js
    └── package.json
```

---

## 🖥️ Explicação das Telas

### 🔐 Login (`/`)
Tela inicial. O usuário entra com e-mail e senha (autenticação real via API), ou continua como visitante. Mostra mensagens de erro vindas do backend (ex: "Credenciais inválidas").

### 📝 Cadastro (`/cadastro`)
Cria uma conta de verdade no banco de dados, com a senha criptografada. Após o cadastro, o usuário já entra logado.

### 🏠 Home (`/home`)
Página de boas-vindas com um hero e a seção **Destaques do Catálogo** — os animes mais populares puxados em tempo real do MyAnimeList. Ao passar o mouse num card, é possível adicionar o anime direto à sua lista.

### 📺 Minha Lista (`/dashboard/minha-lista`)
Núcleo do sistema. Permite:
- **Buscar animes no MyAnimeList** e preencher os dados automaticamente
- **Adicionar** animes manualmente (formulário controlado)
- **Atualizar episódios** com botões `+` e `−`
- **Editar** qualquer anime por um modal
- **Remover** com confirmação de segurança
- **Filtrar** por status e favoritos
- **Buscar e ordenar** a própria lista
- Alternar entre visualização em **Lista** ou **Grade**

### 👤 Perfil (`/dashboard/perfil`)
Estatísticas em tempo real (total de animes, episódios, finalizados, favoritos) e os dados do usuário logado.

### ❌ Página 404 (`*`)
Exibida para qualquer rota inexistente.

---

## 🚀 Como Rodar o Projeto

O projeto tem duas partes que rodam ao mesmo tempo: o **backend** (API) e o **frontend** (interface). Você vai precisar de **dois terminais abertos**.

### Pré-requisitos
- [Node.js](https://nodejs.org/) instalado
- [VS Code](https://code.visualstudio.com/) instalado
- Conta no [MongoDB Atlas](https://www.mongodb.com/atlas) (gratuita)

### 📥 Passo 1 — Baixar o código pelo GitHub
- Acesse o repositório no GitHub
- Clique no botão verde **`<> Code`**
- Clique em **Download ZIP**
- Extraia o arquivo ZIP baixado

> Ou, se preferir usar o **Git** pelo terminal:
> ```bash
> git clone https://github.com/psilva88/anitrack.git
> ```

### 💻 Passo 2 — Abrir no VS Code
- Abra o VS Code
- Vá em **File → Open Folder**
- Selecione a pasta `AniTrack` que foi extraída (a que contém as pastas `anitrack_backend` e `anitrack_frontend`)

### 🗄️ Passo 3 — Configurar o Banco (MongoDB Atlas)
1. Crie uma conta no MongoDB Atlas e um cluster gratuito (M0)
2. Crie um usuário do banco e libere o acesso de rede (`0.0.0.0/0`)
3. Copie a connection string e cole no arquivo `.env` do backend, no campo `MONGO_URI`

### 🖥️ Passo 4 — Rodar o Backend (Terminal 1)
No VS Code, abra o terminal (`Ctrl + '`) e digite, **substituindo `SeuUsuario` pelo seu nome de usuário**:

```bash
cd C:\Users\SeuUsuario\Downloads\anitrack_backend
npm install          # apenas na primeira vez
npm run seed         # (opcional) cria usuários e dados de exemplo
npm run dev
```

> 💡 Exemplo: `cd C:\Users\Arthur\Downloads\anitrack_backend`

Deve aparecer: `✅ MongoDB Atlas conectado!` e `🚀 Servidor rodando na porta 3000`

### 🖥️ Passo 5 — Rodar o Frontend (Terminal 2)
Abra um **segundo terminal** (deixe o backend rodando) e digite:

```bash
cd C:\Users\SeuUsuario\Downloads\anitrack_frontend
npm install          # apenas na primeira vez
npm start
```

> Quando perguntar sobre rodar em outra porta, responda **`Y`** (o backend já usa a 3000).

O frontend abrirá automaticamente em [http://localhost:3001](http://localhost:3001).

### 👥 Usuários de Teste (criados pelo seed)
| Email | Senha | Perfil |
|---|---|---|
| admin@aula.com | admin123 | admin |
| arthur@aula.com | user123 | user |
| bernardo@aula.com | user123 | user |
| rodrigo@aula.com | user123 | user |
| luiz@aula.com | user123 | user |

> Para encerrar qualquer um dos servidores, pressione `Ctrl + C` no terminal.

---

<p align="center">© 2026 AniTrack</p>
