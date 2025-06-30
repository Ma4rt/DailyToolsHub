# DailyToolsHub

DailyToolsHub é uma plataforma de utilidades online que oferece:
- Conversão de arquivos (PDF, DOCX, TXT, imagens, vídeo para áudio)
- Download de vídeos do YouTube em várias qualidades
- Utilidades via API Invertexto (CNPJ, CEP, IP, QR Code, FIPE, etc)
- Interface moderna, responsiva e intuitiva

## Arquitetura

- **Frontend:** React + Vite + TypeScript + Tailwind CSS (pasta `client/`)
- **Backend:**
  - Flask (conversão de arquivos, download de vídeos)
  - Django (utilidades e integração com API Invertexto)

## Estrutura de Pastas

```
DailyToolsHub/
  backend/
    django_app/         # Aplicação Django
    flask_app/          # Aplicação Flask
    shared/             # Utilitários compartilhados
    requirements.txt    # Dependências Python
  client/               # Frontend React
    app/                # Componentes e páginas principais
    public/             # Arquivos estáticos
    package.json        # Dependências JS
  ffmpeg/               # Binários do ffmpeg (Windows)
  README.md             # Este arquivo
```

## Instalação

### 1. Backend (Flask/Django)

```bash
cd DailyToolsHub/backend
python -m venv venv
# Ative o ambiente virtual:
# Windows:
venv\Scripts\activate
# Linux/Mac:
# source venv/bin/activate
pip install -r requirements.txt
```

#### Variáveis de ambiente (opcional)
Crie um arquivo `.env` na pasta backend se precisar configurar tokens ou portas.

#### Executando o Flask
```bash
cd flask_app
python app.py
```

#### Executando o Django
```bash
cd django_app
django_app\manage.py runserver 8000
```

### 2. Frontend (React)

```bash
cd DailyToolsHub/client
npm install
npm run dev
```
Acesse em [http://localhost:5173](http://localhost:5173)

#### Variáveis de ambiente do frontend
Crie um arquivo `.env` na pasta `client` com:
```
VITE_API_DJANGO_URL=http://localhost:8000
VITE_API_FLASK_URL=http://localhost:5000
```

## Funcionalidades

- Conversão de documentos (PDF, DOCX, TXT, imagens)
- Conversão de vídeo para áudio
- Download de vídeos do YouTube (qualidade alta, média, baixa)
- Utilidades via API Invertexto (CNPJ, CEP, IP, QR Code, FIPE, etc)
- Limpeza automática de arquivos temporários

## Dependências principais

### Backend (Python)
```
django
flask
requests
PyPDF2
python-docx
reportlab
Pillow
moviepy
pytube
qrcode
django-cors-headers
flask-cors
```

### Frontend (JS/TS)
```
react
react-dom
vite
typescript
tailwindcss
axios
react-router
```

## Observações para Deploy
- O backend Flask **não é compatível com Vercel**. Use Render, Railway, Heroku, Fly.io, etc.
- O frontend pode ser hospedado no Vercel, Netlify, etc.
- O backend precisa de ffmpeg e yt-dlp instalados no ambiente de produção.

## Licença
MIT 