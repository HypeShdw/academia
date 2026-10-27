# Academia Elite
**Nicho:** Gestão de Treinos e Fichas de Exercícios · **Grupo:** Nicho 6
**Dupla:** Samuel do Carmo (@HypeShdw) · Vitor Aride (@VitorAride)
**Sistema no ar:** https://academia-smoky-nine.vercel.app

## O que o sistema faz
A **Academia Elite** é uma plataforma SaaS de alta performance desenvolvida para gestão de treinos e fichas de exercícios em ambiente corporativo ou pessoal. O sistema oferece autenticação segura de utilizadores, isolamento de dados por conta, e um CRUD completo para criar, visualizar, atualizar e eliminar rotinas de treino, contando com um design refinado em Dark Mode com acentos em verde-lima (*Bento Box UI*), notificações em tempo real e integração contínua via CI/CD.

## Páginas para testar
- Pública: /login
- Protegida (pede login): /dashboard
- Gestão de Treinos (requer autenticação): /workouts

## Banco de dados
O sistema utiliza PostgreSQL (hospedado na Neon) gerido através do **Prisma ORM**, estruturado com as seguintes entidades principais:
- **User (Utilizador):** Gerido pelo *Better Auth*, armazena o identificador único (`id`), nome, e-mail e dados de sessão.
- **Session / Account:** Tabelas auxiliares de autenticação vinculadas ao `User`.
- **Workout (Treino):** Contém os campos `id`, `title`, `description`, `userId` (chave estrangeira que referencia o utilizador criador) e datas de criação/atualização. Garante que cada utilizador apenas acede, edita ou elimina as suas próprias fichas.

## Como rodar no computador
1. Clone o repositório:
   ```bash
   git clone [https://github.com/HypeShdw/academia.git](https://github.com/HypeShdw/academia.git)
   cd academia
Instale as dependências:

Bash
npm install
Configure o ficheiro .env.local na raiz com as variáveis de ambiente necessárias (DATABASE_URL, BETTER_AUTH_SECRET, BETTER_AUTH_URL).

Execute as migrações do Prisma e inicie o servidor de desenvolvimento:

Bash
npx prisma migrate dev
npm run dev
Aceda a http://localhost:3000 no seu navegador.

Como usamos a IA
IA usada: Gemini (Google)

Os 3 pedidos (prompts) que mais ajudaram:

“Como estruturar o layout e as Server Actions no Next.js App Router para realizar um CRUD completo de treinos associados ao ID do utilizador autenticado?”

“Como unificar o design system em Dark Mode com acentos em verde-lima utilizando Tailwind CSS, criando cartões em formato Bento Box e eliminando blocos de fundo branco indesejados?”

“Como resolver erros de conflito de branches no Git/GitHub (non-fast-forward) e configurar o fluxo de deploy automático na Vercel?”

Um erro da IA que percebemos e como corrigimos (arquivo e o que mudou):

O erro: No ficheiro app/dashboard/page.tsx, a IA sugeriu inicialmente uma importação de Server Actions (./actions) utilizando caminhos relativos incorretos (../lib/auth-client e ./actions), o que provocava um erro de Module not found durante o build de produção na Vercel.

O que mudou: Corrigimos os caminhos de importação para utilizar o alias correto do projeto (@/lib/auth-client) e separamos corretamente as ações de backend para a respetiva pasta de treinos (app/workouts/actions.ts), garantindo a compilação bem-sucedida.

O que aprendemos: Aprendemos a importância de manter a consistência nos caminhos de importação baseados em aliases do Next.js, a gerir conflitos de branches no fluxo de Git colaborativo, e a aplicar Server Actions integradas com ORM (Prisma) e autenticação segura (Better Auth) para construir aplicações web escaláveis e prontas para produção.
