import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import AirbnbHeader from "../components/layout/AirbnbHeader";
import Footer from "../components/layout/Footer";
import { FaHome, FaSearch, FaCompass, FaArrowLeft } from "react-icons/fa";

const NotFoundPage = () => {
  const navigate = useNavigate();

  // Track 404 page views for analytics
  useEffect(() => {
    document.title = "404 - Página não encontrada | Ziguealuga";
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <AirbnbHeader />

      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="text-center max-w-2xl">
          {/* Ilustração animada */}
          <div className="mb-8 relative">
            <div className="text-9xl animate-bounce-slow">🏠</div>
            <div className="absolute top-0 right-1/4 text-4xl opacity-20 animate-float">🔍</div>
            <div className="absolute bottom-0 left-1/4 text-3xl opacity-30 animate-float-delayed">❓</div>
          </div>

          {/* Número 404 com gradiente */}
          <h1 className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-rausch to-rausch-dark bg-clip-text text-transparent mb-6">
            404
          </h1>

          {/* Título */}
          <h2 className="text-3xl md:text-4xl font-bold text-airbnb-black mb-4">
            Ops! Parece que você se perdeu
          </h2>

          {/* Descrição */}
          <p className="text-lg text-airbnb-grey-600 mb-10 max-w-md mx-auto">
            A página que você está procurando não existe ou foi movida para outro endereço.
          </p>

          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-rausch to-rausch-dark hover:from-rausch-dark hover:to-rausch text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <FaHome className="text-lg" />
              <span>Voltar para Home</span>
            </Link>
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center justify-center gap-2 bg-white border-2 border-airbnb-grey-300 text-airbnb-black font-semibold px-8 py-4 rounded-xl hover:border-airbnb-black transition-all duration-200"
            >
              <FaArrowLeft className="text-lg" />
              <span>Voltar</span>
            </button>
          </div>

          {/* Sugestões rápidas */}
          <div className="bg-airbnb-grey-50 rounded-2xl p-8 max-w-lg mx-auto">
            <h3 className="text-xl font-semibold text-airbnb-black mb-6">
              Que tal explorar?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                to="/properties"
                className="flex items-center gap-3 p-4 bg-white rounded-xl hover:shadow-md transition-all duration-200 group"
              >
                <div className="w-12 h-12 bg-rausch/10 rounded-lg flex items-center justify-center group-hover:bg-rausch/20 transition-colors">
                  <FaSearch className="text-rausch text-xl" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-airbnb-black">Buscar Imóveis</p>
                  <p className="text-sm text-airbnb-grey-600">500+ propriedades</p>
                </div>
              </Link>

              <Link
                to="/properties?featured=true"
                className="flex items-center gap-3 p-4 bg-white rounded-xl hover:shadow-md transition-all duration-200 group"
              >
                <div className="w-12 h-12 bg-rausch/10 rounded-lg flex items-center justify-center group-hover:bg-rausch/20 transition-colors">
                  <FaCompass className="text-rausch text-xl" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-airbnb-black">Destaques</p>
                  <p className="text-sm text-airbnb-grey-600">Imóveis premium</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Animações CSS */}
      <style>{`
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(5deg);
          }
        }

        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(-5deg);
          }
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default NotFoundPage;
