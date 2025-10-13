import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Ícone */}
        <div className="text-8xl mb-6">🏠</div>

        {/* Número 404 */}
        <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>

        {/* Título */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Página não encontrada
        </h2>

        {/* Descrição */}
        <p className="text-gray-600 mb-8">
          A página que você procura não existe ou foi removida.
        </p>

        {/* Botões de Ação */}
        <div className="space-y-3">
          <Link
            to="/"
            className="inline-block w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            🏠 Voltar para Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="w-full bg-white text-gray-700 border-2 border-gray-300 hover:border-red-600 hover:text-red-600 font-bold py-3 px-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
          >
            ← Página Anterior
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
