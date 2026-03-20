# AgendaPro AI

Sistema SaaS para saloes de beleza, barbearias e profissionais autonomos gerenciarem clientes, agenda e uma base futura para automacao via WhatsApp.

## Stack

- Backend: Node.js + Express
- Banco: PostgreSQL
- ORM: Prisma
- Frontend: React + Vite
- Autenticacao: JWT
- Estilos: TailwindCSS

## Estrutura

```text
agendapro-ai/
  backend/
  frontend/
  render.yaml
```

## Como rodar localmente

### 1. Requisitos

- Node.js 20+
- PostgreSQL instalado e rodando
- Git instalado

### 2. Clone ou abra o projeto

```bash
git clone <url-do-seu-repositorio>
cd agendapro-ai
```

### 3. Instale as dependencias

```bash
npm run install:all
```

Ou, se preferir:

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 4. Configure o backend

Copie o arquivo de exemplo:

```bash
cd backend
cp .env.example .env
```

No Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Edite o `.env` com sua conexao PostgreSQL:

```env
DATABASE_URL="postgresql://postgres:senha@localhost:5432/agendapro_ai?schema=public"
JWT_SECRET="coloque-uma-chave-segura-aqui"
PORT=4000
CLIENT_URL="http://localhost:5173"
WHATSAPP_PROVIDER="disabled"
WHATSAPP_API_URL=""
WHATSAPP_API_TOKEN=""
```

### 5. Gere o Prisma e crie as tabelas

```bash
cd backend
npx prisma generate
npx prisma db push
```

Se quiser abrir o painel visual do Prisma:

```bash
npx prisma studio
```

### 6. Rode o backend

```bash
cd backend
npm run dev
```

O backend sobe em `http://localhost:4000`.

### 7. Configure e rode o frontend

Copie o arquivo de exemplo:

```bash
cd frontend
cp .env.example .env
```

No Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Depois rode:

```bash
cd frontend
npm run dev
```

O frontend sobe em `http://localhost:5173`.

## Scripts importantes

### Backend

- `npm run dev`: ambiente de desenvolvimento com `nodemon`
- `npm start`: usado no deploy
- `npm run prisma:generate`: gera o client do Prisma
- `npm run prisma:push`: cria/atualiza tabelas no banco

### Frontend

- `npm run dev`: ambiente de desenvolvimento
- `npm run build`: build de producao
- `npm run preview`: visualizacao local do build

## Como subir no GitHub

### 1. Criar repositorio no GitHub

- Entre em [GitHub](https://github.com)
- Clique em `New repository`
- Dê um nome, por exemplo: `agendapro-ai`
- Crie o repositorio sem subir arquivos automaticamente

### 2. Conectar este projeto ao GitHub

No terminal, dentro da pasta raiz do projeto:

```bash
git init
git add .
git commit -m "feat: initial AgendaPro AI"
git branch -M main
git remote add origin <url-do-repositorio>
git push -u origin main
```

Exemplo de URL:

```bash
git remote add origin https://github.com/seu-usuario/agendapro-ai.git
```

Se voce quiser, eu posso fazer essa parte com voce no proximo passo, inclusive revisando cada comando antes de rodar.

## Como fazer deploy no Render

Voce pode fazer o deploy de duas partes:

### Backend no Render

1. Crie uma conta em [Render](https://render.com)
2. Clique em `New +` > `Web Service`
3. Conecte o repositorio do GitHub
4. Escolha a pasta `backend`
5. Configure:
   - Build Command: `npm install && npx prisma generate`
   - Start Command: `npm start`
6. Adicione as variaveis de ambiente:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `PORT`
   - `CLIENT_URL`
   - `WHATSAPP_PROVIDER`
   - `WHATSAPP_API_URL`
   - `WHATSAPP_API_TOKEN`

### Banco PostgreSQL no Render

1. Clique em `New +` > `PostgreSQL`
2. Crie o banco
3. Copie a `External Database URL`
4. Cole no `DATABASE_URL` do backend

Depois rode uma vez no shell do Render:

```bash
npx prisma db push
```

### Frontend no Render

1. Clique em `New +` > `Static Site`
2. Escolha o mesmo repositorio
3. Selecione a pasta `frontend`
4. Configure:
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
5. Adicione:
   - `VITE_API_URL` = URL publica do backend

## Funcionalidades entregues

- Cadastro e login com JWT
- Rotas protegidas
- CRUD de clientes
- CRUD de agendamentos
- Dashboard com resumo do dia e proximos agendamentos
- Estrutura inicial para WhatsApp com `whatsappService.sendMessage(phone, message)`

## Proximos upgrades que combinam com esse projeto

- Confirmacao automatica por WhatsApp
- Lembretes antes do horario agendado
- Multiempresa com assinatura mensal
- Relatorios financeiros
- Pagamento online
- Tela publica para autoagendamento

## Observacao

Este projeto esta preparado para crescer sem ficar baguncado. Se voce quiser, no proximo passo eu posso:

1. instalar as dependencias aqui no ambiente
2. subir o banco e testar tudo
3. te ajudar a publicar no GitHub de forma guiada e simples
