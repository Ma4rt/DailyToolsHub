# DailyToolsHub - Frontend

Frontend do projeto DailyToolsHub usando React + Vite + TypeScript + Tailwind CSS.

## Instalação

1. Navegue até a pasta client:
   ```bash
   cd client
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure variáveis de ambiente em `.env`:
   ```
   VITE_API_DJANGO_URL=http://localhost:8000
   VITE_API_FLASK_URL=http://localhost:5000
   ```
4. Rode o frontend:
   ```bash
   npm run dev
   ```
5. Acesse em `http://localhost:5173`.

## Estrutura

```
client/
  app/                # Componentes e páginas principais
  public/             # Arquivos estáticos
  src/                # (opcional, para componentes reutilizáveis)
  tailwind.config.js  # Configuração Tailwind
  vite.config.ts      # Configuração Vite
  package.json        # Dependências
```

## Funcionalidades
- Conversão de documentos (PDF, DOCX, TXT, imagens)
- Conversão de vídeo para áudio
- Download de vídeos do YouTube
- Utilidades via API Invertexto (CNPJ, CEP, IP, QR Code, FIPE, etc)
- Interface moderna, responsiva e intuitiva

## Dependências
- react
- react-dom
- vite
- typescript
- tailwindcss
- axios

# Welcome to React Router!

A modern, production-ready template for building full-stack React applications using React Router.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/remix-run/react-router-templates/tree/main/default)

## Features

- 🚀 Server-side rendering
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling
- 📖 [React Router docs](https://reactrouter.com/)

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.
