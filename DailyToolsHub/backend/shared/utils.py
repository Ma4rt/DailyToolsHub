import os
import time
from datetime import datetime, timedelta

def cleanup_temp_files(upload_folder, download_folder, max_age_hours=24):
    """
    Remove arquivos temporários mais antigos que max_age_hours
    """
    current_time = time.time()
    max_age_seconds = max_age_hours * 3600
    
    folders = [upload_folder, download_folder]
    
    for folder in folders:
        if not os.path.exists(folder):
            continue
            
        for filename in os.listdir(folder):
            filepath = os.path.join(folder, filename)
            
            # Verificar se é arquivo e não diretório
            if os.path.isfile(filepath):
                file_age = current_time - os.path.getmtime(filepath)
                
                if file_age > max_age_seconds:
                    try:
                        os.remove(filepath)
                        print(f"Arquivo removido: {filepath}")
                    except Exception as e:
                        print(f"Erro ao remover arquivo {filepath}: {e}")

def get_file_size_mb(filepath):
    """Retorna o tamanho do arquivo em MB"""
    if os.path.exists(filepath):
        return os.path.getsize(filepath) / (1024 * 1024)
    return 0

def is_valid_file_type(filename, allowed_extensions):
    """Verifica se o arquivo tem extensão válida"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in allowed_extensions 