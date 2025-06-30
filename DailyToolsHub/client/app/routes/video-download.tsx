import React, { useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_FLASK_URL || "http://localhost:5000";

const QUALITIES = [
  { label: "Alta", value: "alta", icon: "⭐", resolution: "1080p Full HD" },
  { label: "Média", value: "media", icon: "📺", resolution: "720p HD" },
  { label: "Baixa", value: "baixa", icon: "📱", resolution: "480p/360p SD" },
];

const FORMATS = [
  { label: "Vídeo (MP4)", value: "video", icon: "🎬" },
  { label: "Áudio (MP3)", value: "audio", icon: "🎵" },
];

export default function VideoDownload() {
  const [url, setUrl] = useState("");
  const [quality, setQuality] = useState("highest");
  const [format, setFormat] = useState("video");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [videoInfo, setVideoInfo] = useState<any>(null);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    setError(null);
    setVideoInfo(null);
  };

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setError("Digite uma URL do YouTube válida.");
      return;
    }

    setLoading(true);
    setProgress(0);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/download/video`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, tipo: format, qualidade: quality }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao baixar vídeo/áudio. Verifique a URL.");
      }
      const contentLength = response.headers.get("content-length");
      const total = contentLength ? parseInt(contentLength, 10) : 0;
      let loaded = 0;
      const reader = response.body?.getReader();
      const chunks = [];
      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;
        chunks.push(value);
        loaded += value.length;
        if (total) {
          setProgress(Math.round((loaded / total) * 100));
        }
      }
      // Monta o blob
      const blob = new Blob(chunks);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download =
        format === "audio"
          ? `audio_${Date.now()}.mp3`
          : `video_${Date.now()}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      setVideoInfo({
        title:
          format === "audio"
            ? "Áudio baixado com sucesso!"
            : "Vídeo baixado com sucesso!",
      });
    } catch (err: any) {
      setError(err.message || "Erro ao baixar vídeo/áudio. Verifique a URL.");
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-3">
              <span role="img" aria-label="download" className="text-4xl animate-bounce">📥</span>
              Download de Vídeos
            </h1>
            <p className="text-lg text-gray-600">
              Baixe vídeos do YouTube em diferentes qualidades
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <form onSubmit={handleDownload} className="space-y-6">
              {/* Campo URL */}
              <div>
                <label htmlFor="youtube-url" className="block text-sm font-medium text-gray-700 mb-2">
                  URL do YouTube
                </label>
                <div className="relative">
                  <input
                    type="url"
                    id="youtube-url"
                    value={url}
                    onChange={handleUrlChange}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-gray-400 text-xl">🎬</span>
                  </div>
                </div>
              </div>

              {/* Seletor de Formato */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Formato do Download
                </label>
                <div className="flex justify-center">
                  <div className="grid grid-cols-2 gap-10 mb-4">
                    {FORMATS.map((f) => (
                      <button
                        key={f.value}
                        type="button"
                        onClick={() => setFormat(f.value)}
                        className={`p-2 w-[170px] rounded-lg border-2 transition-all duration-200 focus:outline-none flex items-center gap-2 justify-center text-base font-medium
                          ${format === f.value
                            ? "border-red-500 bg-red-50 text-red-700 scale-105 shadow-lg"
                            : "border-gray-200 bg-gray-50 text-gray-700 hover:border-red-300 hover:bg-red-25"}
                        `}
                        aria-pressed={format === f.value}
                        style={{ transform: format === f.value ? 'scale(1.05)' : 'scale(1)', minHeight: '36px', minWidth: '0', fontSize: '0.85rem' }}
                      >
                        <span className="text-xl">{f.icon}</span>
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Seleção de Qualidade */}
              {format === "video" && (
                <>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Qualidade do Vídeo
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {QUALITIES.map((q) => (
                      <button
                        key={q.value}
                        type="button"
                        onClick={() => setQuality(q.value)}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 focus:outline-none ${
                          quality === q.value
                            ? "border-red-500 bg-red-50 text-red-700 scale-105 shadow-lg"
                            : "border-gray-200 bg-gray-50 text-gray-700 hover:border-red-300 hover:bg-red-25"
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-2xl mb-2">{q.icon}</div>
                          <div className="text-sm font-medium">{q.label}</div>
                          <div className="text-xs text-gray-500 mt-1">{q.resolution}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {/* Botão de Download */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-3 bg-red-600 text-white py-4 px-6 rounded-lg hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold"
                disabled={loading || !url.trim()}
              >
                {loading ? (
                  <>
                    <span className="animate-spin text-xl">🔄</span>
                    Baixando...
                  </>
                ) : (
                  <>
                    <span className="text-xl">⬇️</span>
                    Baixar Vídeo
                  </>
                )}
              </button>

              {/* Barra de Progresso */}
              {loading && (
                progress > 0 ? (
                  <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
                    <div
                      className="bg-red-500 h-4 rounded-full transition-all duration-200"
                      style={{ width: `${progress}%` }}
                    ></div>
                    <div className="text-center text-xs text-gray-700 mt-1">{progress}%</div>
                  </div>
                ) : (
                  <div className="w-full bg-gray-200 rounded-full h-4 mt-2 overflow-hidden">
                    <div className="bg-red-500 h-4 animate-pulse w-1/2"></div>
                    <div className="text-center text-xs text-gray-700 mt-1">Preparando download...</div>
                  </div>
                )
              )}

              {/* Mensagens de Erro */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-red-700">
                    <span className="text-xl">❌</span>
                    <span>{error}</span>
                  </div>
                </div>
              )}

              {/* Sucesso */}
              {videoInfo && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-700">
                    <span className="text-xl">✅</span>
                    <span>{videoInfo.title}</span>
                  </div>
                </div>
              )}
            </form>

            {/* Instruções */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                <span>📋</span>
                Como usar
              </h3>
              <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                <li>Cole a URL do vídeo do YouTube no campo acima</li>
                <li>Selecione o formato desejado</li>
                <li>Clique em "Baixar Vídeo"</li>
                <li>O arquivo será salvo automaticamente</li>
              </ol>
            </div>

            {/* Aviso Legal */}
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-2 text-yellow-800">
                <span className="text-lg">⚠️</span>
                <div className="text-sm">
                  <strong>Aviso:</strong> Use apenas para vídeos que você tem permissão para baixar. 
                  Respeite os direitos autorais e termos de uso do YouTube.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 