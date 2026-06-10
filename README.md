<p align="center">
  <img src="https://github.com/user-attachments/assets/24bdd29e-a6bf-41c1-9f1e-4a3b90592e32" alt="AniTrack Logo" width="400"/>
</p>
<p align="center">
  Seu catálogo pessoal de animes. Acompanhe episódios, marque favoritos e organize sua jornada.
</p>
<p align="center">
  <img src="https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat-square&logo=react" />
  <img src="https://img.shields.io/badge/React_Router-v6-CA4245?style=flat-square&logo=react-router" />
  <img src="https://img.shields.io/badge/Context_API-Hooks-7C3AED?style=flat-square" />
</p>

## 👥 Integrantes do Grupo

- Arthur Pereira Silva
- Bernardo Ramos dos Santos
- Rodrigo Lira Rodrigues
- Luiz Gustavo Barbosa Machado
 
---
 
## 💡 Ideia do Sistema
 
O AniTrack resolve a dificuldade que os fãs de cultura pop têm em organizar seu progresso em obras longas. O sistema evita que o usuário se perca em quais episódios já foram assistidos, centralizando tudo em um único lugar.
 
O usuário pode fazer login, criar uma conta ou entrar como visitante. Dentro do sistema, ele gerencia sua lista pessoal de animes: adiciona títulos, atualiza episódios assistidos com botões `+` e `−`, edita informações, favorita obras e alterna entre visualização em lista e em grade com capas.
 
---
 
## 🛠️ Tecnologias Utilizadas

| Tecnologia | Uso |
|---|---|
| **React** | Biblioteca principal — componentes funcionais |
| **React Router DOM** | Navegação SPA com rotas básicas, dinâmicas e aninhadas |
| **Context API** | Gerenciamento de estado global (tema, animes, autenticação) |
| **React Hooks** | `useState`, `useEffect`, `useContext`, `useRef` |
| **Hook Customizado** | `useResponsive` para layout responsivo |
| **Google Fonts** | Inter + Plus Jakarta Sans |
| **CSS-in-JS** | Estilização via `style` props inline |
 
---
 
## 🖥️ Explicação das Telas
 
### 🔐 Login (`/`)
Tela inicial da aplicação. O usuário pode entrar com e-mail e senha (mockado), criar uma conta ou continuar como visitante. Possui validação de formulário com `e.preventDefault()` e toggle de visibilidade da senha.
 
### 📝 Cadastro (`/cadastro`)
Formulário de criação de conta com campos de nome, e-mail e senha. Após o cadastro, o usuário é redirecionado automaticamente para o sistema com os dados salvos no `AuthContext`.
 
### 🏠 Home (`/home`)
Página pública de boas-vindas. Apresenta o sistema com um hero, estatísticas e uma grade de destaques com capas de animes populares. Possui botão de chamada para ação levando ao Dashboard.
 
### 📺 Minha Lista (`/dashboard/minha-lista`)
Rota filha do Dashboard. É o núcleo do sistema:
- **Formulário controlado** para adicionar novos animes (nome, episódios, status, URL da capa)
- **Contador de episódios** com botões `+` e `−` que atualizam em tempo real
- **Botão Editar** que abre um modal com todos os campos preenchidos para alteração
- **Filtros** por status: Todos / Assistindo / Pausado / Finalizado / Favoritos
- **Toggle de visualização**: Lista com miniaturas ou Grade com capas em destaque
### 👤 Perfil (`/dashboard/perfil`)
Rota filha do Dashboard. Exibe estatísticas em tempo real calculadas diretamente do `AnimeContext`: total de animes, episódios assistidos, finalizados e favoritos. Mostra também as informações do usuário logado (vindas do `AuthContext`) e o histórico de atividades atualizado automaticamente.
 
### ❌ Página 404 (`*`)
Exibida para qualquer rota inexistente, com botão de retorno para a Home.
 
---

## 📁 Organização das Pastas
 
```
anitrack/
├── public/
│   ├── index.html
│   └── images/              ← Logo e imagens dos animes
│       ├── logo.png
│       ├── attack-on-titan.jpg
│       ├── demon-slayer.jpg
│       └── ...
├── src/
│   ├── context/
│   │   ├── ThemeContext.js  ← Dark / Light Mode global
│   │   ├── AnimeContext.js  ← Lista de animes + estatísticas em tempo real
│   │   └── AuthContext.js   ← Autenticação e dados do usuário
│   ├── components/
│   │   ├── Navbar.js        ← Barra de navegação superior
│   │   ├── Sidebar.js       ← Menu lateral do Dashboard
│   │   ├── BottomNav.js     ← Navegação inferior para mobile
│   │   └── Footer.js        ← Rodapé
│   ├── hooks/
│   │   └── useResponsive.js ← Hook customizado para responsividade
│   ├── pages/
│   │   ├── Login.js
│   │   ├── Cadastro.js
│   │   ├── Home.js
│   │   ├── Dashboard.js     ← Layout com <Outlet /> para rotas aninhadas
│   │   ├── MinhaLista.js
│   │   ├── Perfil.js
│   │   └── NotFound.js
│   ├── App.js               ← Configuração de rotas e Providers
│   └── index.js             ← Ponto de entrada
└── package.json
```
 
---
 
## 🚀 Como Rodar o Projeto

### Pré-requisitos
- [Node.js](https://nodejs.org/) instalado
- [VS Code](https://code.visualstudio.com/) instalado

### Passo a passo

**1. Baixar o código pelo GitHub**
- Acesse o repositório no GitHub
- Clique no botão verde **`<> Code`**
- Clique em **Download ZIP**
- Extraia o arquivo ZIP baixado

**2. Abrir no VS Code**
- Abra o VS Code
- Vá em **File → Open Folder**
- Selecione a pasta `anitrack` que foi extraída

**3. Abrir o terminal e navegar até a pasta**
- No VS Code, abra o terminal (`Ctrl + '`)
-  Digite o comando abaixo, **substituindo `SeuUsuario` pelo seu nome de usuário do Windows**:

```bash
cd C:\Users\SeuUsuario\Downloads\anitrack
```

> 💡 Exemplos: `cd C:\Users\Benicio\Downloads\anitrack` ou `cd C:\Users\XXXXX\Downloads\anitrack`

**4. Instalar as dependências (apenas na primeira vez)**

```bash
npm install
```

**5. Iniciar o projeto**

```bash
npm start
```

---

> Ou, se preferir usar o **Git** pelo terminal:

**1. Clone o repositório**
```bash
git clone https://github.com/psilva88/anitrack.git
```

**2. Entrar na pasta**
```bash
cd anitrack
```

**3. Instalar as dependências (apenas na primeira vez)**
```bash
npm install
```

**4. Iniciar o projeto**
```bash
npm start
```

O projeto abrirá automaticamente em [http://localhost:3000](http://localhost:3000)

> Para encerrar, pressione `Ctrl + C` no terminal.

<p align="center">© 2026 AniTrack</p>

mongodb+srv://Arthur:<db_password>@banana8.gf9qu3r.mongodb.net/?appName=Banana8
