import { Link } from "react-router-dom";

export default function Home() {
  const tools = [
    {
      title: "Conversor de Documentos",
      description: "Converta PDF, DOCX, TXT e imagens",
      icon: "📄",
      path: "/converter",
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      title: "Conversor de Vídeo",
      description: "Extraia áudio de vídeos",
      icon: "🎬",
      path: "/video-converter",
      color: "bg-purple-500 hover:bg-purple-600",
    },
    {
      title: "Download de Vídeos",
      description: "Baixe vídeos do YouTube",
      icon: "📥",
      path: "/video-download",
      color: "bg-red-500 hover:bg-red-600",
    },
    {
      title: "Utilidades",
      description: "CNPJ, CEP, QR Code, FIPE e mais",
      icon: "🔧",
      path: "/utilities",
      color: "bg-green-500 hover:bg-green-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-3">
            <span role="img" aria-label="tools" className="text-5xl">🛠️</span>
            DailyToolsHub
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Sua central de utilidades diárias. Converta documentos, baixe vídeos e acesse ferramentas úteis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {tools.map((tool, index) => (
            <Link
              key={tool.path}
              to={tool.path}
              className={`${tool.color} text-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group`}
            >
              <div className="text-center">
                <div className="text-4xl mb-4 group-hover:animate-bounce">
                  {tool.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{tool.title}</h3>
                <p className="text-sm opacity-90">{tool.description}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            ✨ Ferramentas gratuitas e de código aberto
          </p>
        </div>
      </div>
    </div>
  );
}
