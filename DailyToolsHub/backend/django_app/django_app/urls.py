"""
URL configuration for django_app project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/utilities/', views.utilities, name='utilities'),
    path('api/download_video/', views.download_video, name='download_video'),
    
    # API Invertexto endpoints
    path('api/cnpj/', views.consulta_cnpj, name='consulta_cnpj'),
    path('api/faker/', views.gerar_pessoa_fake, name='gerar_pessoa_fake'),
    path('api/geoip/', views.consulta_ip, name='consulta_ip'),
    path('api/fipe/brands/', views.consulta_marcas_fipe, name='consulta_marcas_fipe'),
    path('api/qrcode/', views.gerar_qr_code, name='gerar_qr_code'),
    path('api/cep/', views.consulta_cep, name='consulta_cep'),
    path('api/holidays/', views.consulta_feriados, name='consulta_feriados'),
    path('api/validator/cpf/', views.validar_cpf, name='validar_cpf'),
    path('api/validator/cnpj/', views.validar_cnpj, name='validar_cnpj'),
    path('api/currency/', views.converter_moeda, name='converter_moeda'),
    path('api/number/', views.numero_por_extenso, name='numero_por_extenso'),
    path('api/barcode/', views.gerar_codigo_barras, name='gerar_codigo_barras'),
]
