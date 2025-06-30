import React, { useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_FLASK_URL || "http://localhost:5000";

export default function VideoConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setDownloadUrl(null);
      setError(null);
      setProgress(0);
    }
  };

  const handleConversion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Selecione um arquivo de vídeo.");
      return;
    }
    
    setLoading(true);
    setError(null);
    setDownloadUrl(null);
    setProgress(0);

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Simular progresso
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      const res = await axios.post(
        `${API_URL}/convert/video-to-audio`,
        formData,
        { 
          responseType: "blob",
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setProgress(percentCompleted);
            }
          }
        }
      );

      clearInterval(progressInterval);
      setProgress(100);
      
      const url = window.URL.createObjectURL(new Blob([res.data]));
      setDownloadUrl(url);
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao converter vídeo.");
      setProgress(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-3">
              <span role="img" aria-label="video" className="text-4xl animate-pulse">🎬</span>
              Conversor de Vídeo para Áudio
            </h1>
            <p className="text-lg text-gray-600">
              Extraia o áudio de seus vídeos favoritos com facilidade
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <form onSubmit={handleConversion} className="space-y-6">
              {/* Área de Upload */}
              <div className="border-2 border-dashed border-purple-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
                <div className="text-6xl mb-4">📁</div>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="video-upload"
                />
                <label
                  htmlFor="video-upload"
                  className="cursor-pointer inline-flex items-center gap-2 bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors"
                >
                  <span className="text-xl">🎥</span>
                  Selecionar Vídeo
                </label>
                {file && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <p className="text-green-700 flex items-center gap-2">
                      <span className="text-xl">✅</span>
                      {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  </div>
                )}
              </div>

              {/* Barra de Progresso */}
              {loading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Convertendo vídeo...</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-purple-500 h-3 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <div className="text-center text-sm text-gray-500">
                    <span className="animate-spin inline-block mr-2">🔄</span>
                    Processando...
                  </div>
                </div>
              )}

              {/* Botão de Conversão */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-3 bg-purple-600 text-white py-4 px-6 rounded-lg hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold"
                disabled={loading || !file}
              >
                {loading ? (
                  <>
                    <span className="animate-spin text-xl">🔄</span>
                    Convertendo...
                  </>
                ) : (
                  <>
                    <span className="text-xl">⚡</span>
                    Extrair Áudio
                  </>
                )}
              </button>

              {/* Mensagens de Erro */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-red-700">
                    <span className="text-xl">❌</span>
                    <span>{error}</span>
                  </div>
                </div>
              )}

              {/* Link de Download */}
              {downloadUrl && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🎉</div>
                    <h3 className="text-lg font-semibold text-green-800 mb-2">
                      Conversão Concluída!
                    </h3>
                    <a
                      href={downloadUrl}
                      download="audio_extraido.mp3"
                      className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <span className="text-xl">⬇️</span>
                      Baixar Áudio
                    </a>
                  </div>
                </div>
              )}
            </form>

            {/* Dicas */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                <span>💡</span>
                Dicas
              </h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Formatos suportados: MP4, AVI, MOV, MKV</li>
                <li>• O áudio será extraído em formato MP3</li>
                <li>• Arquivos grandes podem demorar mais para processar</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 