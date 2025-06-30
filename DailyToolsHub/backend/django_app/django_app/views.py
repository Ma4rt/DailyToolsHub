from django.http import JsonResponse, FileResponse
from django.views.decorators.http import require_GET, require_POST
from django.views.decorators.csrf import csrf_exempt
import requests
import json
import os
from pytube import YouTube
import qrcode
import base64
from io import BytesIO

INVERTEXTO_TOKEN = "20296|zSXF4wf5WUQn2wVUnV7xYwljGmFC8pnr"
BASE_URL = "https://api.invertexto.com/v1"
DOWNLOAD_FOLDER = os.path.abspath(os.path.join(os.path.dirname(__file__), '../downloads'))

os.makedirs(DOWNLOAD_FOLDER, exist_ok=True)

def make_invertexto_request(endpoint, params=None):
    """Faz requisição para a API Invertexto"""
    headers = {"Authorization": f"Bearer {INVERTEXTO_TOKEN}"}
    url = f"{BASE_URL}/{endpoint}"
    try:
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        
        # Verificar se a resposta é JSON válido
        try:
            return response.json()
        except json.JSONDecodeError as e:
            # Se não for JSON válido, retornar o conteúdo da resposta para debug
            return {
                "error": f"Resposta inválida da API: {str(e)}",
                "response_text": response.text[:200],  # Primeiros 200 caracteres
                "status_code": response.status_code
            }
            
    except requests.exceptions.RequestException as e:
        return {"error": f"Erro na requisição: {str(e)}"}
    except Exception as e:
        return {"error": f"Erro inesperado: {str(e)}"}

@require_GET
def utilities(request):
    return JsonResponse({'message': 'Endpoint de utilidades funcionando.'})

@require_GET
def download_video(request):
    url = request.GET.get('url')
    quality = request.GET.get('quality', 'highest')
    
    if not url:
        return JsonResponse({'error': 'URL do YouTube não fornecida'}, status=400)
    
    try:
        yt = YouTube(url)
        
        if quality == 'highest':
            video = yt.streams.get_highest_resolution()
        elif quality == 'lowest':
            video = yt.streams.get_lowest_resolution()
        else:
            # Tentar encontrar a qualidade específica
            video = yt.streams.filter(res=quality).first()
            if not video:
                video = yt.streams.get_highest_resolution()
        
        # Download do vídeo
        filename = f"{yt.title.replace(' ', '_')}.mp4"
        filepath = os.path.join(DOWNLOAD_FOLDER, filename)
        video.download(output_path=DOWNLOAD_FOLDER, filename=filename)
        
        # Retornar o arquivo para download
        response = FileResponse(open(filepath, 'rb'))
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        return response
        
    except Exception as e:
        return JsonResponse({'error': f'Erro ao baixar vídeo: {str(e)}'}, status=400)

# API Invertexto endpoints
@require_GET
def consulta_cnpj(request):
    cnpj = request.GET.get('cnpj')
    if not cnpj:
        return JsonResponse({'error': 'CNPJ não fornecido'}, status=400)
    result = make_invertexto_request(f"cnpj/{cnpj}")
    return JsonResponse(result)

@require_GET
def gerar_pessoa_fake(request):
    fields = request.GET.get('fields', 'name,cpf')
    locale = request.GET.get('locale', 'pt_BR')
    params = {'fields': fields, 'locale': locale}
    result = make_invertexto_request("faker", params)
    return JsonResponse(result)

@require_GET
def consulta_ip(request):
    ip = request.GET.get('ip')
    if not ip:
        return JsonResponse({'error': 'IP não fornecido'}, status=400)
    result = make_invertexto_request(f"geoip/{ip}")
    return JsonResponse(result)

@require_GET
def consulta_marcas_fipe(request):
    brand_id = request.GET.get('id')
    if not brand_id:
        return JsonResponse({'error': 'ID da marca não fornecido'}, status=400)
    result = make_invertexto_request(f"fipe/brands/{brand_id}")
    return JsonResponse(result, safe=False)

@require_GET
def gerar_qr_code(request):
    text = request.GET.get('text')
    if not text:
        return JsonResponse({'error': 'Texto não fornecido'}, status=400)
    
    try:
        # Gerar QR Code localmente
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(text)
        qr.make(fit=True)

        # Criar imagem
        img = qr.make_image(fill_color="black", back_color="white")
        
        # Converter para base64
        buffer = BytesIO()
        img.save(buffer, 'PNG')
        img_str = base64.b64encode(buffer.getvalue()).decode()
        
        return JsonResponse({
            'url': f'data:image/png;base64,{img_str}',
            'text': text
        })
        
    except Exception as e:
        return JsonResponse({'error': f'Erro ao gerar QR Code: {str(e)}'}, status=500)

@require_GET
def consulta_cep(request):
    cep = request.GET.get('cep')
    if not cep:
        return JsonResponse({'error': 'CEP não fornecido'}, status=400)
    result = make_invertexto_request(f"cep/{cep}")
    return JsonResponse(result)

@require_GET
def consulta_feriados(request):
    year = request.GET.get('year')
    if not year:
        return JsonResponse({'error': 'Ano não fornecido'}, status=400)
    result = make_invertexto_request(f"holidays/{year}")
    return JsonResponse(result, safe=False)

@require_GET
def validar_cpf(request):
    cpf = request.GET.get('cpf')
    if not cpf:
        return JsonResponse({'error': 'CPF não fornecido'}, status=400)
    params = {'token': INVERTEXTO_TOKEN, 'value': cpf}
    url = "https://api.invertexto.com/v1/validator"
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        return JsonResponse(response.json())
    except Exception as e:
        return JsonResponse({'error': f'Erro na requisição: {str(e)}'}, status=400)

@require_GET
def validar_cnpj(request):
    cnpj = request.GET.get('cnpj')
    if not cnpj:
        return JsonResponse({'error': 'CNPJ não fornecido'}, status=400)
    params = {'token': INVERTEXTO_TOKEN, 'value': cnpj}
    url = "https://api.invertexto.com/v1/validator"
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        return JsonResponse(response.json())
    except Exception as e:
        return JsonResponse({'error': f'Erro na requisição: {str(e)}'}, status=400)

@require_GET
def converter_moeda(request):
    from_currency = request.GET.get('from')
    to_currency = request.GET.get('to')
    amount = request.GET.get('amount')
    if not all([from_currency, to_currency, amount]):
        return JsonResponse({'error': 'Parâmetros from, to e amount são obrigatórios'}, status=400)
    try:
        # Tenta AwesomeAPI
        url = f"https://economia.awesomeapi.com.br/json/last/{from_currency}-{to_currency}"
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        pair = f"{from_currency}{to_currency}"
        if pair in data:
            rate = float(data[pair]['bid'])
            converted = float(amount) * rate
            return JsonResponse({
                'from': from_currency,
                'to': to_currency,
                'amount': amount,
                'rate': rate,
                'converted': converted,
                'source': 'AwesomeAPI'
            })
        # Se não encontrar na AwesomeAPI, tenta ExchangeRate-API (gratuita, mas precisa de chave se for produção)
        url2 = f"https://api.exchangerate.host/convert?from={from_currency}&to={to_currency}&amount={amount}"
        response2 = requests.get(url2)
        response2.raise_for_status()
        data2 = response2.json()
        if data2.get('success'):
            return JsonResponse({
                'from': from_currency,
                'to': to_currency,
                'amount': amount,
                'rate': data2['info']['rate'],
                'converted': data2['result'],
                'source': 'ExchangeRate-API'
            })
        return JsonResponse({'error': 'Par de moedas não encontrado em nenhuma API'}, status=400)
    except Exception as e:
        return JsonResponse({'error': f'Erro na requisição: {str(e)}'}, status=400)

@require_GET
def numero_por_extenso(request):
    number = request.GET.get('number')
    if not number:
        return JsonResponse({'error': 'Número não fornecido'}, status=400)
    params = {
        'token': INVERTEXTO_TOKEN,
        'number': number,
        'language': 'pt',
        'currency': 'BRL',
    }
    url = f"{BASE_URL}/number-to-words"
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        return JsonResponse(response.json())
    except Exception as e:
        return JsonResponse({'error': f'Erro na requisição: {str(e)}'}, status=400)

@require_GET
def gerar_codigo_barras(request):
    text = request.GET.get('text')
    barcode_type = request.GET.get('type', 'code39')
    font = request.GET.get('font', 'arial')
    if not text:
        return JsonResponse({'error': 'Texto não fornecido'}, status=400)
    params = {
        'token': INVERTEXTO_TOKEN,
        'text': text,
        'type': barcode_type,
        'font': font
    }
    url = f"{BASE_URL}/barcode"
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        content_type = response.headers.get('Content-Type', '')
        if content_type.startswith('image/'):
            # Retorna imagem em base64
            img_base64 = base64.b64encode(response.content).decode()
            return JsonResponse({'image_base64': img_base64, 'content_type': content_type})
        else:
            # Tenta retornar JSON normalmente
            return JsonResponse(response.json())
    except Exception as e:
        return JsonResponse({'error': f'Erro na requisição: {str(e)}'}, status=400) 