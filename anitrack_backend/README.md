# AniTrack — Backend (API REST)

API REST do AniTrack desenvolvida em **Node.js + Express + MongoDB**, com autenticação JWT, autorização por perfil e CRUD de 2 entidades relacionadas (Usuário e Anime).

## 🛠️ Tecnologias

- **Node.js + Express** — servidor e API REST
- **MongoDB Atlas + Mongoose** — banco de dados NoSQL
- **JWT (jsonwebtoken)** — autenticação por token
- **bcryptjs** — criptografia de senhas
- **express-validator** — validação de dados
- **helmet, cors, morgan** — segurança e logs

## 📁 Estrutura

```
backend/
├── src/
│   ├── index.js              # ponto de entrada (servidor + middlewares)
│   ├── config/db.js          # conexão com MongoDB Atlas
│   ├── models/
│   │   ├── Usuario.js        # entidade Usuário (com role e senha hash)
│   │   └── Anime.js          # entidade Anime (relacionada ao Usuário)
│   ├── controllers/
│   │   ├── authController.js     # register + login (JWT)
│   │   ├── usuarioController.js  # CRUD de usuários
│   │   └── animeController.js    # CRUD da lista de animes
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── usuarioRoutes.js
│   │   └── animeRoutes.js
│   ├── middlewares/
│   │   ├── authMiddleware.js     # valida token JWT
│   │   ├── roleMiddleware.js     # autorização por role
│   │   ├── errorHandler.js       # tratamento central de erros
│   │   └── validate.js           # checa validações
│   ├── validators/usuarioValidator.js
│   └── seeds/seedUsers.js        # popular banco com admin + exemplos
├── .env                          # variáveis (NÃO subir no GitHub)
├── .env.example                  # modelo do .env
└── package.json
```

## 🗄️ Modelagem do Banco (Entidades e Relacionamento)

**Usuário**
| Campo | Tipo | Detalhe |
|---|---|---|
| nome | String | obrigatório |
| email | String | obrigatório, único |
| senha | String | obrigatório (hash bcrypt) |
| role | String | 'user' ou 'admin' |
| idade | Number | opcional |

**Anime** (relacionado ao Usuário)
| Campo | Tipo | Detalhe |
|---|---|---|
| nome | String | obrigatório |
| totalEps | Number | obrigatório |
| assistidos | Number | padrão 0 |
| status | String | Assistindo / Pausado / Finalizado |
| favorito | Boolean | padrão false |
| capa | String | URL da imagem |
| **usuario** | ObjectId | **referência ao Usuário dono** |

> Relacionamento: **1 Usuário → N Animes** (um para muitos). Cada anime guarda o `ObjectId` do usuário dono.

## 🔌 Endpoints da API

### Autenticação (`/api/auth`)
| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/auth/register` | Cria usuário e retorna token |
| POST | `/api/auth/login` | Faz login e retorna token |

### Usuários (`/api/usuarios`) — protegido por token
| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/usuarios` | Lista usuários (paginação + busca) |
| GET | `/api/usuarios/:id` | Busca por ID |
| PUT | `/api/usuarios/:id` | Atualiza usuário |
| DELETE | `/api/usuarios/:id` | Remove usuário (**só admin**) |

### Animes (`/api/animes`) — protegido por token
| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/animes` | Lista os animes do usuário logado |
| GET | `/api/animes/stats` | Estatísticas do usuário |
| GET | `/api/animes/:id` | Busca um anime |
| POST | `/api/animes` | Cria um anime |
| PUT | `/api/animes/:id` | Atualiza um anime |
| DELETE | `/api/animes/:id` | Remove um anime |

> Rotas protegidas exigem o header: `Authorization: Bearer {token}`

## 🚀 Como Rodar

### 1. Instalar dependências
```bash
cd backend
npm install
```

### 2. Configurar o `.env`
Copie o `.env.example` para `.env` e preencha com sua connection string do MongoDB Atlas:
```
MONGO_URI=mongodb+srv://usuario:senha@cluster0.xxxxx.mongodb.net/anitrack
JWT_SECRET=sua_chave_secreta_forte
JWT_EXPIRES_IN=1h
```

### 3. (Opcional) Popular o banco com dados de exemplo
```bash
npm run seed
```
Cria `admin@aula.com / admin123` e `arthur@aula.com / user123` com animes de exemplo.

### 4. Iniciar o servidor
```bash
npm run dev    # com nodemon (reinicia automaticamente)
# ou
npm start      # modo normal
```

O servidor sobe em `http://localhost:3000`. Se conectar certo, aparece:
```
✅ MongoDB Atlas conectado!
🚀 Servidor rodando na porta 3000
```

## 🧪 Testar com Postman

1. **Registrar:** `POST http://localhost:3000/api/auth/register` → Body raw JSON:
```json
{ "nome": "Teste", "email": "teste@email.com", "senha": "123456" }
```
2. **Login:** `POST http://localhost:3000/api/auth/login` → copie o `token` retornado.
3. **Listar animes:** `GET http://localhost:3000/api/animes` → aba Authorization → Bearer Token → cole o token.
