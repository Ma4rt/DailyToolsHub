import React, { useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_DJANGO_URL || "http://localhost:8000";

const UTILITIES = [
  { key: "cnpj", label: "Consulta CNPJ", icon: "🏢" },
  { key: "faker", label: "Pessoa Fake", icon: "🕵️" },
  { key: "geoip", label: "Consulta IP", icon: "🌎" },
  { key: "fipe", label: "FIPE Marcas", icon: "🚗" },
  { key: "qrcode", label: "QR Code", icon: "🔳" },
  { key: "cep", label: "Consulta CEP", icon: "🏠" },
  { key: "holidays", label: "Feriados", icon: "🎉" },
  { key: "cpf", label: "Validação CPF", icon: "🧾" },
  { key: "cnpjval", label: "Validação CNPJ", icon: "📄" },
  { key: "currency", label: "Conversão Moeda", icon: "💱" },
  { key: "number", label: "Número por Extenso", icon: "🔢" },
  { key: "barcode", label: "Código de Barras", icon: "🏷️" },
];

// Componente para Consulta CNPJ
function CnpjConsult() {
  const [cnpj, setCnpj] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cnpj.trim()) {
      setError("Digite um CNPJ válido.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.get(`${API_URL}/api/cnpj/`, {
        params: { cnpj: cnpj.replace(/\D/g, "") }
      });
      setResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao consultar CNPJ.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
          <span className="text-3xl">🏢</span>
          Consulta CNPJ
        </h2>
        <p className="text-gray-600">Digite o CNPJ para obter informações da empresa</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700 mb-2">
            CNPJ
          </label>
          <input
            type="text"
            id="cnpj"
            value={cnpj}
            onChange={(e) => setCnpj(e.target.value)}
            placeholder="00.000.000/0000-00"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-gray-900 bg-white"
          />
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-all disabled:opacity-50"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="animate-spin text-xl">🔄</span>
              Consultando...
            </>
          ) : (
            <>
              <span className="text-xl">🔍</span>
              Consultar CNPJ
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-700">
            <span className="text-xl">❌</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {result && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
            <span className="text-xl">✅</span>
            Resultado da Consulta
          </h3>
          <div className="space-y-2 text-sm">
            {Object.entries(result).map(([key, value]) => (
              <div key={key} className="flex justify-between py-1 border-b border-green-100">
                <span className="font-medium text-green-700 capitalize">
                  {key.replace(/_/g, " ")}:
                </span>
                <span className="text-green-800">{String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Componente para Geração de Pessoa Fake
function FakerGenerator() {
  const [fields, setFields] = useState("name,cpf");
  const [locale, setLocale] = useState("pt_BR");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.get(`${API_URL}/api/faker/`, {
        params: { fields, locale }
      });
      setResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao gerar pessoa fake.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickGenerate = (preset: string) => {
    setFields(preset);
    setLocale("pt_BR");
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
          <span className="text-3xl">🕵️</span>
          Gerador de Pessoa Fake
        </h2>
        <p className="text-gray-600">Gere dados fictícios para testes</p>
      </div>

      {/* Presets rápidos */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Presets Rápidos</label>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleQuickGenerate("name,cpf")}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
          >
            Nome + CPF
          </button>
          <button
            type="button"
            onClick={() => handleQuickGenerate("name,email,phone")}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
          >
            Nome + Email + Telefone
          </button>
          <button
            type="button"
            onClick={() => handleQuickGenerate("name,cpf,email,phone,address")}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
          >
            Completo
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="fields" className="block text-sm font-medium text-gray-700 mb-2">
            Campos (separados por vírgula)
          </label>
          <input
            type="text"
            id="fields"
            value={fields}
            onChange={(e) => setFields(e.target.value)}
            placeholder="name,cpf,email,phone"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-gray-900 bg-white"
          />
          <p className="text-xs text-gray-500 mt-1">
            Campos disponíveis: name, cpf, email, phone, address, company, job, etc.
          </p>
        </div>

        <div>
          <label htmlFor="locale" className="block text-sm font-medium text-gray-700 mb-2">
            Localização
          </label>
          <select
            id="locale"
            value={locale}
            onChange={(e) => setLocale(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-gray-900 bg-white"
          >
            <option value="pt_BR">Português (Brasil)</option>
            <option value="en_US">English (US)</option>
            <option value="es_ES">Español (España)</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-all disabled:opacity-50"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="animate-spin text-xl">🔄</span>
              Gerando...
            </>
          ) : (
            <>
              <span className="text-xl">🎲</span>
              Gerar Pessoa Fake
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-700">
            <span className="text-xl">❌</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {result && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
            <span className="text-xl">✅</span>
            Pessoa Gerada
          </h3>
          <div className="space-y-2 text-sm">
            {Object.entries(result).map(([key, value]) => (
              <div key={key} className="flex justify-between py-1 border-b border-green-100">
                <span className="font-medium text-green-700 capitalize">
                  {key.replace(/_/g, " ")}:
                </span>
                <span className="text-green-800">{String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Componente para Consulta IP
function GeoIpConsult() {
  const [ip, setIp] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ip.trim()) {
      setError("Digite um IP válido.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.get(`${API_URL}/api/geoip/`, {
        params: { ip: ip.trim() }
      });
      setResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao consultar IP.");
    } finally {
      setLoading(false);
    }
  };

  const handleMyIp = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.get(`${API_URL}/api/geoip/`, {
        params: { ip: "me" }
      });
      setResult(response.data);
      setIp("me");
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao obter seu IP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
          <span className="text-3xl">🌎</span>
          Consulta de IP
        </h2>
        <p className="text-gray-600">Obtenha informações geográficas de um endereço IP</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="ip" className="block text-sm font-medium text-gray-700 mb-2">
            Endereço IP
          </label>
          <input
            type="text"
            id="ip"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            placeholder="192.168.1.1"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-gray-900 bg-white"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-all disabled:opacity-50"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="animate-spin text-xl">🔄</span>
                Consultando...
              </>
            ) : (
              <>
                <span className="text-xl">🔍</span>
                Consultar IP
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handleMyIp}
            className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50"
            disabled={loading}
          >
            <span className="text-xl">📍</span>
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-700">
            <span className="text-xl">❌</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {result && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
            <span className="text-xl">✅</span>
            Informações do IP
          </h3>
          <div className="space-y-2 text-sm">
            {Object.entries(result).map(([key, value]) => (
              <div key={key} className="flex justify-between py-1 border-b border-green-100">
                <span className="font-medium text-green-700 capitalize">
                  {key.replace(/_/g, " ")}:
                </span>
                <span className="text-green-800">{String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Componente para FIPE Marcas
function FipeBrands() {
  const [brandId, setBrandId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandId.trim()) {
      setError("Digite um ID de marca válido.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.get(`${API_URL}/api/fipe/brands/`, {
        params: { id: brandId.trim() }
      });
      setResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao consultar marca FIPE.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
          <span className="text-3xl">🚗</span>
          Consulta FIPE - Marcas
        </h2>
        <p className="text-gray-600">Consulte informações de marcas de veículos</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="brandId" className="block text-sm font-medium text-gray-700 mb-2">
            ID da Marca
          </label>
          <input
            type="text"
            id="brandId"
            value={brandId}
            onChange={(e) => setBrandId(e.target.value)}
            placeholder="1"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-gray-900 bg-white"
          />
          <p className="text-xs text-gray-500 mt-1">
            Digite o ID da marca (ex: 1 para Acura, 2 para Agrale, etc.)
          </p>
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-all disabled:opacity-50"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="animate-spin text-xl">🔄</span>
              Consultando...
            </>
          ) : (
            <>
              <span className="text-xl">🔍</span>
              Consultar Marca
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-700">
            <span className="text-xl">❌</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {result && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
            <span className="text-xl">✅</span>
            Informações da Marca
          </h3>
          <div className="space-y-2 text-sm">
            {Object.entries(result).map(([key, value]) => (
              <div key={key} className="flex justify-between py-1 border-b border-green-100">
                <span className="font-medium text-green-700 capitalize">
                  {key.replace(/_/g, " ")}:
                </span>
                <span className="text-green-800">{String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Componente para QR Code
function QrCodeGenerator() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      setError("Digite um texto para gerar o QR Code.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.get(`${API_URL}/api/qrcode/`, {
        params: { text: text.trim() }
      });
      console.log("QR Code API response:", response.data);
      setResult(response.data.url || response.data.qrcode || response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao gerar QR Code.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickText = (quickText: string) => {
    setText(quickText);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
          <span className="text-3xl">🔳</span>
          Gerador de QR Code
        </h2>
        <p className="text-gray-600">Crie QR Codes para qualquer texto ou URL</p>
      </div>

      {/* Textos rápidos */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Textos Rápidos</label>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleQuickText("https://www.google.com")}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
          >
            Google
          </button>
          <button
            type="button"
            onClick={() => handleQuickText("Olá, mundo!")}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
          >
            Olá Mundo
          </button>
          <button
            type="button"
            onClick={() => handleQuickText("+5511999999999")}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
          >
            Telefone
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="qrText" className="block text-sm font-medium text-gray-700 mb-2">
            Texto ou URL
          </label>
          <textarea
            id="qrText"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Digite o texto ou URL para gerar o QR Code..."
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-none text-gray-900 bg-white"
          />
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-all disabled:opacity-50"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="animate-spin text-xl">🔄</span>
              Gerando...
            </>
          ) : (
            <>
              <span className="text-xl">🔳</span>
              Gerar QR Code
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-700">
            <span className="text-xl">❌</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {result && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
            <span className="text-xl">✅</span>
            QR Code Gerado
          </h3>
          <div className="text-center">
            {typeof result === "string" ? (
              <img 
                src={result} 
                alt="QR Code" 
                className="mx-auto max-w-48 h-auto border border-gray-200 rounded-lg shadow-sm"
              />
            ) : (
              <div className="text-red-600">
                <p>Erro: Formato de resposta inválido</p>
                <p className="text-xs mt-1">Resposta: {JSON.stringify(result)}</p>
              </div>
            )}
            <p className="text-sm text-gray-600 mt-2">
              Escaneie o QR Code com seu smartphone
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Componente para Consulta CEP
function CepConsult() {
  const [cep, setCep] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cep.trim()) {
      setError("Digite um CEP válido.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.get(`${API_URL}/api/cep/`, {
        params: { cep: cep.replace(/\D/g, "") }
      });
      setResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao consultar CEP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
          <span className="text-3xl">🏠</span>
          Consulta CEP
        </h2>
        <p className="text-gray-600">Digite o CEP para obter informações do endereço</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="cep" className="block text-sm font-medium text-gray-700 mb-2">
            CEP
          </label>
          <input
            type="text"
            id="cep"
            value={cep}
            onChange={(e) => setCep(e.target.value)}
            placeholder="00000-000"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-gray-900 bg-white"
          />
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-all disabled:opacity-50"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="animate-spin text-xl">🔄</span>
              Consultando...
            </>
          ) : (
            <>
              <span className="text-xl">🔍</span>
              Consultar CEP
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-700">
            <span className="text-xl">❌</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {result && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
            <span className="text-xl">✅</span>
            Endereço Encontrado
          </h3>
          <div className="space-y-2 text-sm">
            {Object.entries(result).map(([key, value]) => (
              <div key={key} className="flex justify-between py-1 border-b border-green-100">
                <span className="font-medium text-green-700 capitalize">
                  {key.replace(/_/g, " ")}:
                </span>
                <span className="text-green-800">{String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Componente para Feriados
function HolidaysConsult() {
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!year.trim()) {
      setError("Digite um ano válido.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.get(`${API_URL}/api/holidays/`, {
        params: { year: year.trim() }
      });
      setResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao consultar feriados.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
          <span className="text-3xl">🎉</span>
          Feriados Nacionais
        </h2>
        <p className="text-gray-600">Consulte os feriados de qualquer ano</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
            Ano
          </label>
          <input
            type="number"
            id="year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="2024"
            min="1900"
            max="2100"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-gray-900 bg-white"
          />
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-all disabled:opacity-50"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="animate-spin text-xl">🔄</span>
              Consultando...
            </>
          ) : (
            <>
              <span className="text-xl">📅</span>
              Consultar Feriados
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-700">
            <span className="text-xl">❌</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {result && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
            <span className="text-xl">✅</span>
            Feriados de {year}
          </h3>
          <div className="space-y-2 text-sm">
            {Array.isArray(result) ? result.map((holiday, index) => (
              <div key={index} className="flex justify-between py-1 border-b border-green-100">
                <span className="font-medium text-green-700">{holiday.name || holiday}</span>
                <span className="text-green-800">{holiday.date || holiday}</span>
              </div>
            )) : Object.entries(result).map(([key, value]) => (
              <div key={key} className="flex justify-between py-1 border-b border-green-100">
                <span className="font-medium text-green-700 capitalize">
                  {key.replace(/_/g, " ")}:
                </span>
                <span className="text-green-800">{String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Componente para Validação CPF
function CpfValidator() {
  const [cpf, setCpf] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cpf.trim()) {
      setError("Digite um CPF válido.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.get(`${API_URL}/api/validator/cpf/`, {
        params: { cpf: cpf.replace(/\D/g, "") }
      });
      setResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao validar CPF.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
          <span className="text-3xl">🧾</span>
          Validação de CPF
        </h2>
        <p className="text-gray-600">Verifique se um CPF é válido</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-2">
            CPF
          </label>
          <input
            type="text"
            id="cpf"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            placeholder="000.000.000-00"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-gray-900 bg-white"
          />
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-all disabled:opacity-50"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="animate-spin text-xl">🔄</span>
              Validando...
            </>
          ) : (
            <>
              <span className="text-xl">✅</span>
              Validar CPF
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-700">
            <span className="text-xl">❌</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {result && (
        <div className={`mt-6 border rounded-lg p-6 ${result.valid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${result.valid ? 'text-green-800' : 'text-red-800'}`}>
            <span className="text-xl">{result.valid ? '✅' : '❌'}</span>
            {result.valid ? 'CPF Válido' : 'CPF Inválido'}
          </h3>
          <div className="space-y-2 text-sm">
            {Object.entries(result).map(([key, value]) => (
              <div key={key} className="flex justify-between py-1 border-b border-gray-100">
                <span className={`font-medium capitalize ${result.valid ? 'text-green-700' : 'text-red-700'}`}>
                  {key.replace(/_/g, " ")}:
                </span>
                <span className={result.valid ? 'text-green-800' : 'text-red-800'}>{String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Componente para Validação CNPJ
function CnpjValidator() {
  const [cnpj, setCnpj] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cnpj.trim()) {
      setError("Digite um CNPJ válido.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.get(`${API_URL}/api/validator/cnpj/`, {
        params: { cnpj: cnpj.replace(/\D/g, "") }
      });
      setResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao validar CNPJ.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
          <span className="text-3xl">📄</span>
          Validação de CNPJ
        </h2>
        <p className="text-gray-600">Verifique se um CNPJ é válido</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700 mb-2">
            CNPJ
          </label>
          <input
            type="text"
            id="cnpj"
            value={cnpj}
            onChange={(e) => setCnpj(e.target.value)}
            placeholder="00.000.000/0000-00"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-gray-900 bg-white"
          />
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-all disabled:opacity-50"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="animate-spin text-xl">🔄</span>
              Validando...
            </>
          ) : (
            <>
              <span className="text-xl">✅</span>
              Validar CNPJ
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-700">
            <span className="text-xl">❌</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {result && (
        <div className={`mt-6 border rounded-lg p-6 ${result.valid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${result.valid ? 'text-green-800' : 'text-red-800'}`}>
            <span className="text-xl">{result.valid ? '✅' : '❌'}</span>
            {result.valid ? 'CNPJ Válido' : 'CNPJ Inválido'}
          </h3>
          <div className="space-y-2 text-sm">
            {Object.entries(result).map(([key, value]) => (
              <div key={key} className="flex justify-between py-1 border-b border-gray-100">
                <span className={`font-medium capitalize ${result.valid ? 'text-green-700' : 'text-red-700'}`}>
                  {key.replace(/_/g, " ")}:
                </span>
                <span className={result.valid ? 'text-green-800' : 'text-red-800'}>{String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Componente para Conversão de Moeda
function CurrencyConverter() {
  const [fromCurrency, setFromCurrency] = useState("BRL");
  const [toCurrency, setToCurrency] = useState("USD");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const currencies = [
    { code: "BRL", name: "Real Brasileiro" },
    { code: "USD", name: "Dólar Americano" },
    { code: "EUR", name: "Euro" },
    { code: "GBP", name: "Libra Esterlina" },
    { code: "JPY", name: "Iene Japonês" },
    { code: "CAD", name: "Dólar Canadense" },
    { code: "AUD", name: "Dólar Australiano" },
    { code: "CHF", name: "Franco Suíço" },
    { code: "CNY", name: "Yuan Chinês" },
    { code: "INR", name: "Rúpia Indiana" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount.trim() || isNaN(Number(amount))) {
      setError("Digite um valor válido.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.get(`${API_URL}/api/currency/`, {
        params: { 
          from: fromCurrency,
          to: toCurrency,
          amount: amount.trim()
        }
      });
      setResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao converter moeda.");
    } finally {
      setLoading(false);
    }
  };

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
          <span className="text-3xl">💱</span>
          Conversão de Moeda
        </h2>
        <p className="text-gray-600">Converta valores entre diferentes moedas</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
              Valor
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="100.00"
              step="0.01"
              min="0"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-gray-900 bg-white"
            />
          </div>

          <div>
            <label htmlFor="fromCurrency" className="block text-sm font-medium text-gray-700 mb-2">
              De
            </label>
            <select
              id="fromCurrency"
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-gray-900 bg-white"
            >
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col items-center">
            <button
              type="button"
              onClick={handleSwapCurrencies}
              className="mb-2 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
              title="Trocar moedas"
            >
              <span className="text-xl">🔄</span>
            </button>
            <label htmlFor="toCurrency" className="block text-sm font-medium text-gray-700 mb-2">
              Para
            </label>
            <select
              id="toCurrency"
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-gray-900 bg-white"
            >
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-all disabled:opacity-50"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="animate-spin text-xl">🔄</span>
              Convertendo...
            </>
          ) : (
            <>
              <span className="text-xl">💱</span>
              Converter
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-700">
            <span className="text-xl">❌</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {result && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
            <span className="text-xl">✅</span>
            Resultado da Conversão
          </h3>
          <div className="space-y-2 text-sm">
            {Object.entries(result).map(([key, value]) => (
              <div key={key} className="flex justify-between py-1 border-b border-green-100">
                <span className="font-medium text-green-700 capitalize">
                  {key.replace(/_/g, " ")}:
                </span>
                <span className="text-green-800">{String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Componente para Número por Extenso
function NumberToText() {
  const [number, setNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!number.trim() || isNaN(Number(number))) {
      setError("Digite um número válido.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.get(`${API_URL}/api/number/`, {
        params: { number: number.trim() }
      });
      setResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao converter número.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickNumber = (quickNumber: string) => {
    setNumber(quickNumber);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
          <span className="text-3xl">🔢</span>
          Número por Extenso
        </h2>
        <p className="text-gray-600">Converta números em texto por extenso</p>
      </div>

      {/* Números rápidos */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Números Rápidos</label>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleQuickNumber("100")}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
          >
            100
          </button>
          <button
            type="button"
            onClick={() => handleQuickNumber("1000")}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
          >
            1.000
          </button>
          <button
            type="button"
            onClick={() => handleQuickNumber("1000000")}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
          >
            1.000.000
          </button>
          <button
            type="button"
            onClick={() => handleQuickNumber("3.14")}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
          >
            3,14
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-2">
            Número
          </label>
          <input
            type="text"
            id="number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="Digite um número"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-gray-900 bg-white"
          />
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-all disabled:opacity-50"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="animate-spin text-xl">🔄</span>
              Convertendo...
            </>
          ) : (
            <>
              <span className="text-xl">🔢</span>
              Converter
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-700">
            <span className="text-xl">❌</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {result && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
            <span className="text-xl">✅</span>
            Número por Extenso
          </h3>
          <div className="space-y-2 text-sm">
            {Object.entries(result).map(([key, value]) => (
              <div key={key} className="flex justify-between py-1 border-b border-green-100">
                <span className="font-medium text-green-700 capitalize">
                  {key.replace(/_/g, " ")}:
                </span>
                <span className="text-green-800">{String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Componente para Código de Barras
function BarcodeGenerator() {
  const [text, setText] = useState("");
  const [format, setFormat] = useState("code128");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const formats = [
    { code: "code128", name: "Code 128" },
    { code: "code39", name: "Code 39" },
    { code: "ean13", name: "EAN-13" },
    { code: "ean8", name: "EAN-8" },
    { code: "upca", name: "UPC-A" },
    { code: "upce", name: "UPC-E" },
    { code: "itf14", name: "ITF-14" },
    { code: "databar", name: "DataBar" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      setError("Digite um texto para gerar o código de barras.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.get(`${API_URL}/api/barcode/`, {
        params: {
          text: text.trim(),
          type: format
        }
      });
      setResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Erro ao gerar código de barras.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickText = (quickText: string) => {
    setText(quickText);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
          <span className="text-3xl">🏷️</span>
          Gerador de Código de Barras
        </h2>
        <p className="text-gray-600">Gere códigos de barras em diferentes formatos</p>
      </div>

      {/* Textos rápidos */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Textos Rápidos</label>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleQuickText("123456789")}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
          >
            123456789
          </button>
          <button
            type="button"
            onClick={() => handleQuickText("789123456")}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
          >
            789123456
          </button>
          <button
            type="button"
            onClick={() => handleQuickText("PRODUTO001")}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
          >
            PRODUTO001
          </button>
          <button
            type="button"
            onClick={() => handleQuickText("ABC123")}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
          >
            ABC123
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-2">
            Texto
          </label>
          <input
            type="text"
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Digite o texto para o código de barras"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-gray-900 bg-white"
          />
        </div>

        <div>
          <label htmlFor="format" className="block text-sm font-medium text-gray-700 mb-2">
            Formato
          </label>
          <select
            id="format"
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-gray-900 bg-white"
          >
            {formats.map((fmt) => (
              <option key={fmt.code} value={fmt.code}>
                {fmt.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-all disabled:opacity-50"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="animate-spin text-xl">🔄</span>
              Gerando...
            </>
          ) : (
            <>
              <span className="text-xl">🏷️</span>
              Gerar Código de Barras
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-700">
            <span className="text-xl">❌</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {result && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
            <span className="text-xl">✅</span>
            Código de Barras Gerado
          </h3>
          <div className="space-y-4">
            {result.image_base64 ? (
              <div className="text-center">
                <img
                  src={`data:${result.content_type || 'image/png'};base64,${result.image_base64}`}
                  alt="Código de Barras"
                  className="mx-auto max-w-full h-auto border border-gray-200 rounded"
                />
              </div>
            ) : (
              <div className="text-red-600">
                <p>Erro: Imagem não gerada</p>
                <p className="text-xs mt-1">Resposta: {JSON.stringify(result)}</p>
              </div>
            )}
            <div className="space-y-2 text-sm">
              {Object.entries(result).map(([key, value]) => (
                key !== 'image_base64' && key !== 'content_type' && (
                  <div key={key} className="flex justify-between py-1 border-b border-green-100">
                    <span className="font-medium text-green-700 capitalize">
                      {key.replace(/_/g, " ")}:
                    </span>
                    <span className="text-green-800">{String(value)}</span>
                  </div>
                )
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function UtilityPlaceholder({ label, icon }: { label: string; icon: string }) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <span className="text-5xl mb-4 animate-bounce">{icon}</span>
      <h2 className="text-xl font-semibold text-gray-700 mb-2">{label}</h2>
      <p className="text-gray-400">Funcionalidade em construção.</p>
    </div>
  );
}

export default function Utilities() {
  const [selected, setSelected] = useState(UTILITIES[0].key);
  const selectedUtility = UTILITIES.find(u => u.key === selected);

  const renderSelectedUtility = () => {
    switch (selected) {
      case "cnpj":
        return <CnpjConsult />;
      case "faker":
        return <FakerGenerator />;
      case "geoip":
        return <GeoIpConsult />;
      case "fipe":
        return <FipeBrands />;
      case "qrcode":
        return <QrCodeGenerator />;
      case "cep":
        return <CepConsult />;
      case "holidays":
        return <HolidaysConsult />;
      case "cpf":
        return <CpfValidator />;
      case "cnpjval":
        return <CnpjValidator />;
      case "currency":
        return <CurrencyConverter />;
      case "number":
        return <NumberToText />;
      case "barcode":
        return <BarcodeGenerator />;
      default:
        return selectedUtility ? (
          <UtilityPlaceholder label={selectedUtility.label} icon={selectedUtility.icon} />
        ) : (
          <span className="text-2xl text-gray-400">Selecione uma utilidade acima para começar.</span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-3">
            <span role="img" aria-label="tools" className="text-4xl animate-spin">🧰</span>
            Utilidades
          </h1>
          <p className="text-lg text-gray-600">
            Ferramentas rápidas: CNPJ, CEP, QR Code, FIPE, CPF, moedas e mais!
          </p>
        </div>

        {/* Navegação de utilidades */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {UTILITIES.map((util) => (
            <button
              key={util.key}
              onClick={() => setSelected(util.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200 focus:outline-none text-lg font-medium shadow-sm ${selected === util.key ? "bg-green-500 text-white border-green-600 scale-105" : "bg-white text-gray-700 border-gray-300 hover:bg-green-100"}`}
              aria-pressed={selected === util.key}
            >
              <span className="text-xl transition-transform duration-200" style={{ transform: selected === util.key ? "scale(1.3) rotate(-10deg)" : "none" }}>{util.icon}</span>
              {util.label}
            </button>
          ))}
        </div>

        {/* Área de utilidade selecionada */}
        <div className="bg-white rounded-lg shadow-lg p-8 min-h-[300px] flex items-center justify-center">
          {renderSelectedUtility()}
        </div>
      </div>
    </div>
  );
} 