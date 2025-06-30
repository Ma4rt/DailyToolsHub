import React, { useState } from "react";
import axios from "axios";

const CONVERSIONS = [
  { label: "PDF → DOCX", value: "pdf-to-docx", icon: "📄➡️📝" },
  { label: "DOCX → PDF", value: "docx-to-pdf", icon: "📝➡️📄" },
  { label: "TXT → PDF", value: "txt-to-pdf", icon: "📃➡️📄" },
  { label: "Imagens → PDF", value: "images-to-pdf", icon: "🖼️➡️📄" },
];

const API_URL = import.meta.env.VITE_API_FLASK_URL || "http://localhost:5000";

export default function Converter() {
  const [selected, setSelected] = useState(CONVERSIONS[0].value);
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
    setDownloadUrl(null);
    setError(null);
  };

  const handleConversion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!files || files.length === 0) {
      setError("Selecione um arquivo.");
      return;
    }
    setLoading(true);
    setError(null);
    setDownloadUrl(null);
    const formData = new FormData();
    if (selected === "images-to-pdf") {
      Array.from(files).forEach((file) => formData.append("files", file));
    } else {
      formData.append("file", files[0]);
    }
    try {
      const res = await axios.post(
        `${API_URL}/convert/${selected}`,
        formData,
        { responseType: "blob" }
      );
      // Tenta obter o nome sugerido pelo backend
      let filename = "arquivo_convertido.pdf";
      if (selected === "pdf-to-docx") {
        filename = "arquivo_convertido.docx";
      }
      const disposition = res.headers["content-disposition"];
      if (disposition && disposition.indexOf("filename=") !== -1) {
        const match = disposition.match(/filename="?([^";]+)"?/);
        if (match && match[1]) filename = match[1];
      }
      // Define o tipo MIME correto
      let mimeType = "application/pdf";
      if (selected === "pdf-to-docx") {
        mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      }
      const url = window.URL.createObjectURL(new Blob([res.data], { type: mimeType }));
      // Cria o link e faz o download automático
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setDownloadUrl(url); // opcional, caso queira mostrar o link
    } catch (err: any) {
      // Tenta extrair mensagem de erro do blob
      if (err.response && err.response.data) {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const json = JSON.parse(reader.result as string);
            setError(json.error || "Erro ao converter arquivo.");
          } catch {
            setError("Erro ao converter arquivo.");
          }
        };
        reader.readAsText(err.response.data);
      } else {
        setError("Erro ao converter arquivo.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-3">
              <span role="img" aria-label="converter" className="text-4xl animate-spin">🔄</span>
              Conversor de Documentos
            </h1>
            <p className="text-lg text-gray-600">
              Converta PDF, DOCX, TXT e imagens em outros formatos facilmente
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <form onSubmit={handleConversion} className="space-y-6">
              {/* Seleção de Conversão */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Tipo de Conversão
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {CONVERSIONS.map((conv) => (
                    <button
                      type="button"
                      key={conv.value}
                      className={`flex items-center gap-2 p-4 rounded-lg border-2 transition-all duration-200 focus:outline-none w-full justify-center text-lg font-medium ${
                        selected === conv.value
                          ? "border-blue-500 bg-blue-50 text-blue-700 scale-105 shadow-lg"
                          : "border-gray-200 bg-gray-50 text-gray-700 hover:border-blue-300 hover:bg-blue-25"
                      }`}
                      onClick={() => setSelected(conv.value)}
                      aria-pressed={selected === conv.value}
                    >
                      <span className="text-2xl">{conv.icon}</span>
                      {conv.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Upload de Arquivo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selecione o arquivo
                </label>
                <input
                  type="file"
                  multiple={selected === "images-to-pdf"}
                  accept={selected === "images-to-pdf" ? "image/*" : undefined}
                  onChange={handleFileChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 bg-white"
                />
              </div>

              {/* Botão de Conversão */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="animate-spin text-xl">🔄</span>
                    Convertendo...
                  </>
                ) : (
                  <>
                    <span className="text-xl">⚡</span>
                    Converter
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

              {/* Sucesso/Download */}
              {downloadUrl && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🎉</div>
                    <h3 className="text-lg font-semibold text-green-800 mb-2">
                      Conversão Concluída!
                    </h3>
                    <a
                      href={downloadUrl}
                      download
                      className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <span className="text-xl">⬇️</span>
                      Baixar arquivo convertido
                    </a>
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
                <li>Escolha o tipo de conversão desejado</li>
                <li>Selecione o(s) arquivo(s) para converter</li>
                <li>Clique em "Converter"</li>
                <li>Baixe o arquivo convertido</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 