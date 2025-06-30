# Prompt para Desenvolvimento do DailyToolsHub

Este documento contém um prompt detalhado e estruturado para criar o projeto **DailyToolsHub** do zero, utilizando **Python** (com **Django** e **Flask**), **React** com **Vite**, e a **API Invertexto** (chave: `20296|zSXF4wf5WUQn2wVUnV7xYwljGmFC8pnr`). O prompt é dividido em **duas etapas** para uso no **Cursor**, com foco em modularidade, boas práticas, e conformidade com o README fornecido.

## Etapa 1: Desenvolvimento do Backend (Python com Django/Flask)

### Objetivo
Criar um backend robusto para o **DailyToolsHub**, utilizando **Django** para utilidades gerais e download de vídeos, e **Flask** para conversão de arquivos. O backend deve integrar a API Invertexto e gerenciar arquivos de upload/download.

### Prompt

```markdown
Crie um backend para o projeto **DailyToolsHub**, um site de utilidades diárias, utilizando **Python** com **Django** para a estrutura principal e **Flask** para endpoints específicos de conversão de arquivos (PDF, DOCX, TXT, imagens, vídeo para áudio). O backend deve integrar a **API Invertexto** com a chave `20296|zSXF4wf5WUQn2wVUnV7xYwljGmFC8pnr` e suportar as funcionalidades descritas abaixo. Siga a estrutura do projeto fornecida e garanta que o código seja modular, com tratamento de erros e documentação.

**Funcionalidades do Backend:**
1. **Conversão de Documentos (usando Flask):**
   - PDF → DOCX: Extrai texto de PDF e gera DOCX limpo (sem layout/imagens).
   - DOCX → PDF: Extrai texto de DOCX e gera PDF limpo.
   - TXT → PDF: Converte texto puro em PDF.
   - Imagens → PDF: Converte uma ou mais imagens em um PDF.
   - Use bibliotecas como `PyPDF2`, `python-docx`, `reportlab`, e `Pillow`.
2. **Conversor de Vídeo para Áudio (Flask):**
   - Recebe um vídeo via upload, extrai o áudio e retorna como arquivo (use `moviepy`).
3. **Download de Vídeos (Django):**
   - Baixa vídeos do YouTube em diferentes qualidades usando `pytube`.
   - Retorna o arquivo para download.
4. **Utilidades via API Invertexto (Django):**
   - Integre as seguintes rotas da API Invertexto com a chave fornecida:
     - Consulta de CNPJ: `https://api.invertexto.com/v1/cnpj/{cnpj}`
     - Geração de pessoas fake: `https://api.invertexto.com/v1/faker?fields=name,cpf&locale=pt_BR`
     - Consulta de IP: `https://api.invertexto.com/v1/geoip/{ip}`
     - Consulta de marcas FIPE: `https://api.invertexto.com/v1/fipe/brands/{id}`
     - Geração de código de barras: `https://api.invertexto.com/v1/barcode?text={text}&type=code39&font=arial`
   - Adicione endpoints para QR Code, consulta de CEP, feriados, validação de CPF/CNPJ, conversão de moedas, validação de e-mail, e número por extenso (use a documentação da API Invertexto para as rotas correspondentes).
5. **Gerenciamento de Arquivos:**
   - Crie pastas `uploads/` para arquivos enviados e `downloads/` para arquivos gerados.
   - Implemente limpeza automática de arquivos temporários.

**Estrutura do Projeto:**
```
DailyToolsHub/
  backend/
    django_app/         # Aplicação Django
      urls.py           # Rotas Django
      views.py          # Views para utilidades e download de vídeos
      models.py         # Modelos (se necessário)
    flask_app/          # Aplicação Flask
      routes.py         # Rotas para conversão de arquivos
    uploads/            # Arquivos enviados
    downloads/          # Arquivos convertidos/baixados
    shared/             # Schemas e utilitários compartilhados
  requirements.txt      # Dependências
```

**Requisitos:**
- Python 3.10+
- Dependências: `django`, `flask`, `requests`, `PyPDF2`, `python-docx`, `reportlab`, `Pillow`, `moviepy`, `pytube`.
- Configure o Django na porta 8000 e o Flask na porta 5000.
- Use `cross-env` para variáveis de ambiente (ex.: `INVERTEXTO_TOKEN`).
- Inclua tratamento de erros para falhas na API Invertexto, uploads inválidos, e portas em uso (`EADDRINUSE`).
- Crie um `README.md` com instruções de instalação e execução.

**Instruções de Instalação:**
1. Clone o repositório: `git clone <url>`
2. Crie um ambiente virtual: `python -m venv venv`
3. Ative o ambiente: `source venv/bin/activate` (Linux/Mac) ou `venv\Scripts\activate` (Windows)
4. Instale dependências: `pip install -r requirements.txt`
5. Configure variáveis de ambiente em um arquivo `.env`:
   ```
   INVERTEXTO_TOKEN=20296|zSXF4wf5WUQn2wVUnV7xYwljGmFC8pnr
   DJANGO_PORT=8000
   FLASK_PORT=5000
   ```
6. Rode o Django: `python backend/django_app/manage.py runserver`
7. Rode o Flask: `python backend/flask_app/app.py`

**Observações:**
- A conversão de documentos deve ser simplificada (apenas texto, sem layout/imagens/tabelas).
- Garanta que as portas 8000 e 5000 estejam livres.
- Para Windows, inclua instruções para lidar com erros de porta.

**Saída Esperada:**
- Código completo para o backend com Django e Flask.
- Arquivo `requirements.txt`.
- README com instruções claras.
- Estrutura de pastas conforme especificado.
```

## Etapa 2: Desenvolvimento do Frontend (React com Vite)

### Objetivo
Criar um frontend moderno e responsivo para o **DailyToolsHub**, utilizando **React** com **Vite**, **TypeScript**, e **Tailwind CSS**. O frontend deve consumir o backend da Etapa 1 e oferecer uma interface intuitiva para todas as funcionalidades.

### Prompt

```markdown
Crie um frontend para o projeto **DailyToolsHub**, um site de utilidades diárias, utilizando **React** com **Vite**. O frontend deve consumir o backend desenvolvido na Etapa 1 (Django na porta 8000, Flask na porta 5000) e implementar uma interface moderna, responsiva e intuitiva para as funcionalidades descritas. Use **TypeScript** para tipagem e **Tailwind CSS** para estilização.

**Funcionalidades do Frontend:**
1. **Conversão de Documentos:**
   - Interface para upload de um arquivos (PDF, DOCX, TXT, ou imagens).
   - - Botões para selecionar o tipo de conversão (PDF → DOCX, DOCX → PDF, TXT → PDF, ou Imagens → PDF).
   - Exibe link para download do arquivo convertido.
2. **Conversor de Vídeo para Áudio:**
   - Upload de vídeo e botão para extrair áudio.
   - Link para download do áudio gerado.
3. **Download de Vídeos:**
   - Campo para inserir URL do YouTube.
   - Seleção de qualidade do vídeo.
   - Botão para iniciar download.
4. **Utilidades via API Invertexto:**
   - Formulários para:
     - Consulta de CNPJ, CEP, IP, feriados, validação de CPF/CNPJ, conversão de moedas, validação de e-mail, número por extenso.
     - Geração de QR Code (exibe imagem gerada).
     - Geração de pessoas fake (exibe nome e CPF).
     - Geração de código de barras (exibe imagem).
     - Consulta de marcas FIPE.
   - Exiba resultados em tempo real com feedback visual (ex.: loading, erro, sucesso).
5. **Navegação e Layout:**
   - Crie uma barra de navegação com links para cada funcionalidade.
   - Use um layout em grid ou cards para organizar as ferramentas.
   - Inclua um footer com informações de licença (open-source).

**Estrutura do Projeto:**
```
DailyToolsHub/
  client/                   # Frontend React + Vite
    src/
      components/           # Componentes reutilizáveis (ex.: FileUploader, QRCodeDisplay)
      pages/                # Páginas para cada funcionalidade
      services/             # Funções para chamadas à API (axios/fetch)
      types/                # Tipos TypeScript
      styles/               # Arquivos Tailwind CSS
    public/                 # Arquivos estáticos
    vite.config.ts          # Configuração Vite
    package.json            # Dependências
```

**Requisitos:**
- Node.js 18+, npm 9+.
- Dependências: `react`, `react-dom`, `vite`, `typescript`, `tailwindcss`, `axios`.
- Configure o frontend na porta 5173.
- Use `axios` para chamadas ao backend (Django: `http://localhost:8000`, Flask: `http://localhost:5000`).
- Implemente tratamento de erros para falhas de API e uploads inválidos.
- Garanta responsividade com Tailwind CSS.
- Crie um `README.md` com instruções de instalação e execução.

**Instruções de Instalação:**
1. Navegue até a pasta `client`: `cd client`
2. Instale dependências: `npm install`
3. Configure variáveis de ambiente em `.env`:
   ```
   VITE_API_DJANGO_URL=http://localhost:8000
   VITE_API_FLASK_URL=http://localhost:5000
   ```
4. Rode o frontend: `npm run dev`
5. Acesse em `http://localhost:5173`.

**Observações:**
- Exiba mensagens claras para o usuário (ex.: "Arquivo convertido com sucesso" ou "URL inválida").
- Garanta que a porta 5173 esteja livre.
- Para Windows, inclua instruções para lidar com erros de porta.

**Saída Esperada:**
- Código completo para o frontend com React, Vite, TypeScript, e Tailwind CSS.
- Arquivo `package.json` com dependências.
- README com instruções claras.
- Estrutura de pastas conforme especificado.
```

## Notas Adicionais
- Os prompts são otimizados para uso no **Cursor**, garantindo código modular e boas práticas.
- A divisão em duas etapas facilita o desenvolvimento incremental: backend primeiro, depois frontend.
- As rotas da API Invertexto fornecidas foram incorporadas, com suporte para funcionalidades adicionais (ex.: QR Code, CEP) conforme a documentação implícita.
- O código gerado deve respeitar o README original, adaptado para Python (Django/Flask) e React.
- Tratamento de erros e suporte para Windows (ex.: portas em uso) estão inclusos.