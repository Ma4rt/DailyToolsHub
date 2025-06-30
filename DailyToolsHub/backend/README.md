# DailyToolsHub - Backend

Backend do projeto DailyToolsHub com Django (utilidades e download de vídeos) e Flask (conversão de arquivos).

## Estrutura

```
backend/
  django_app/         # Aplicação Django (porta 8000)
    django_app/
      urls.py         # Rotas Django
      views.py        # Views para utilidades e download de vídeos
    manage.py
  flask_app/          # Aplicação Flask (porta 5000)
    app.py            # Aplicação Flask
    routes.py         # Rotas para conversão de arquivos
  uploads/            # Arquivos enviados
  downloads/          # Arquivos convertidos/baixados
  shared/             # Schemas e utilitários compartilhados
    utils.py          # Utilitários para limpeza de arquivos
  requirements.txt    # Dependências
```

## Instalação

1. **Criar ambiente virtual:**
   ```bash
   python -m venv venv
   ```

2. **Ativar ambiente virtual:**
   - Windows: `venv\Scripts\activate`
   - Linux/Mac: `source venv/bin/activate`

3. **Instalar dependências:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configurar variáveis de ambiente:**
   Criar arquivo `.env` na raiz do backend:
   ```
   INVERTEXTO_TOKEN=20296|zSXF4wf5WUQn2wVUnV7xYwljGmFC8pnr
   DJANGO_PORT=8000
   FLASK_PORT=5000
   ```

## Execução

### Django (Porta 8000)
```bash
cd DailyToolsHub/backend/django_app
python manage.py runserver 8000
```

### Flask (Porta 5000)
```bash
cd DailyToolsHub/backend/flask_app
python app.py
```

## Endpoints

### Django (Utilidades e Download de Vídeos)

#### Download de Vídeos
- `GET /api/download_video/?url=<youtube_url>&quality=<highest|lowest|720p>`

#### API Invertexto
- `GET /api/cnpj/?cnpj=<cnpj>`
- `GET /api/faker/?fields=name,cpf&locale=pt_BR`
- `GET /api/geoip/?ip=<ip>`
- `GET /api/fipe/brands/?id=<brand_id>`
- `GET /api/qrcode/?text=<text>`
- `GET /api/cep/?cep=<cep>`
- `GET /api/holidays/?year=<year>`
- `GET /api/validator/cpf/?cpf=<cpf>`
- `GET /api/validator/cnpj/?cnpj=<cnpj>`
- `GET /api/currency/?from=<from>&to=<to>&amount=<amount>`
- `GET /api/validator/email/?email=<email>`
- `GET /api/number/?number=<number>`
- `GET /api/barcode/?text=<text>&type=code39&font=arial`

### Flask (Conversão de Arquivos)

#### Conversão de Documentos
- `POST /convert/pdf-to-docx` - PDF → DOCX
- `POST /convert/docx-to-pdf` - DOCX → PDF
- `POST /convert/txt-to-pdf` - TXT → PDF
- `POST /convert/images-to-pdf` - Imagens → PDF
- `POST /convert/video-to-audio` - Vídeo → Áudio

## Funcionalidades

### Django
- **Download de Vídeos:** Baixa vídeos do YouTube em diferentes qualidades
- **API Invertexto:** Integração completa com todas as funcionalidades da API

### Flask
- **Conversão de Documentos:** Conversão entre formatos PDF, DOCX, TXT
- **Conversão de Imagens:** Múltiplas imagens para PDF
- **Extração de Áudio:** Extrai áudio de vídeos

### Utilitários
- **Limpeza Automática:** Remove arquivos temporários antigos
- **Validação de Arquivos:** Verifica tipos de arquivo permitidos
- **Gerenciamento de Pastas:** Criação automática de pastas necessárias

## Tratamento de Erros

- Validação de parâmetros obrigatórios
- Tratamento de erros da API Invertexto
- Validação de tipos de arquivo
- Limpeza automática de arquivos temporários

## Dependências

- django
- flask
- requests
- PyPDF2
- python-docx
- reportlab
- Pillow
- moviepy
- pytube 