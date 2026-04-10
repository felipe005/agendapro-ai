# Catwalk AI Studio

Plataforma focada em moda para transformar a foto de uma roupa em um video de modelo desfilando com qualidade premium.

## O que este projeto entrega

- frontend novo com identidade visual de produto de moda/IA
- upload da foto da roupa
- formulario de direcao criativa para campanha, ecommerce e social
- backend com fila de geracao integrada a `fal.ai`
- suporte a dois perfis de modelo:
  - `Veo 3.1 Fast` para uma saida mais premium
  - `Vidu Q1` para uma opcao mais rapida
- polling de status e visualizacao do video final
- modo demonstracao automatico quando `FAL_KEY` nao estiver configurada

## Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Upload: Multer em memoria
- Provedor de video: fal.ai

## Estrutura

```text
backend/
frontend/
render.yaml
```

## Como rodar

### 1. Instalar dependencias

```bash
npm run install:all
```

### 2. Configurar ambiente do backend

```powershell
Copy-Item backend\.env.example backend\.env
```

Variaveis:

```env
PORT=4000
CLIENT_URL=http://localhost:5173
FAL_KEY=
```

Se `FAL_KEY` ficar vazio, a aplicacao entra em modo demonstracao e usa um video oficial de exemplo da fal.ai para a experiencia de ponta a ponta.

### 3. Configurar ambiente do frontend

```powershell
Copy-Item frontend\.env.example frontend\.env
```

```env
VITE_API_URL=http://localhost:4000
```

### 4. Rodar em desenvolvimento

Terminal 1:

```bash
npm run dev:backend
```

Terminal 2:

```bash
npm run dev:frontend
```

Frontend: `http://localhost:5173`

Backend: `http://localhost:4000`

## Integracao real com fal.ai

Este projeto usa a documentacao oficial da fal.ai para `image-to-video`:

- `fal-ai/veo3.1/fast/image-to-video`
- `fal-ai/vidu/q1/image-to-video`

O backend envia a imagem como `data URI`, monta um prompt otimizado para moda e acompanha o status da fila ate receber a URL final do video.

## Endpoints

- `GET /api/health`
- `GET /api/meta`
- `GET /api/generations`
- `POST /api/generations`
- `GET /api/generations/:id`

## Deploy no Render

O arquivo [`render.yaml`](C:\Users\User\Desktop\projeto S\render.yaml) ja foi atualizado com:

- API Node em `backend/`
- site estatico em `frontend/`
- variaveis `CLIENT_URL`, `FAL_KEY` e `VITE_API_URL`

## Ideias de evolucao

1. autenticacao e creditos por geracao
2. biblioteca de assets por marca
3. variacoes automaticas de cenario e camera
4. exportacao de multiplos formatos por campanha
5. fila persistente com banco de dados e webhook
