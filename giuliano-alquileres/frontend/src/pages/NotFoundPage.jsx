import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Ícone */}
        <div className="text-8xl mb-6">🏠</div>

        {/* Número 404 */}
        <h1 className="text-6xl font-bold text-rausch mb-4">404</h1>

        {/* Título */}
        <h2 className="heading-2 mb-4">
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
            className="btn-primary inline-block w-full"
          >
            🏠 Voltar para Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn-secondary w-full"
          >
            Página Anterior
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
