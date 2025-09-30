// giuliano-alquileres/frontend/src/pages/Home.jsx

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import PropertyCard from "../components/property/PropertyCard";
import Loading from "../components/common/Loading";

const Home = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await api.get("/properties");
        const allProperties = response.data.properties || [];

        setFeaturedProperties(
          allProperties.filter((p) => p.is_featured).slice(0, 6)
        );
        setProperties(allProperties.slice(0, 12));
      } catch (error) {
        console.error("Erro ao carregar propriedades:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/properties?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  if (loading) {
    return <Loading text="Carregando imóveis incríveis..." />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[90vh] overflow-hidden">
        {/* Background com Overlay mais escuro */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40 z-10"></div>
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075')",
          }}
        ></div>

        {/* Conteúdo Hero */}
        <div className="relative z-20 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-3xl">
              {/* Badge Amarelo */}
              <div className="inline-flex items-center bg-yellow-400 text-gray-900 px-5 py-2 rounded-full font-bold text-sm mb-8">
                <span className="mr-2">✨</span>
                Imóveis Premium em Balneário Camboriú
              </div>

              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Encontre seu
                <span className="block text-red-500 mt-2">Lar dos Sonhos</span>
              </h1>

              <p className="text-xl text-gray-200 mb-10 leading-relaxed">
                Descubra os melhores imóveis para compra e aluguel na cidade
                mais desejada de Santa Catarina. Qualidade, conforto e
                localização privilegiada.
              </p>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="relative mb-16">
                <div className="flex bg-white rounded-xl shadow-2xl overflow-hidden">
                  <input
                    type="text"
                    placeholder="Buscar por localização, tipo de imóvel..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 px-6 py-4 text-gray-900 placeholder-gray-500 focus:outline-none text-base"
                  />
                  <button
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 text-white px-10 font-bold transition-all duration-300 flex items-center gap-2"
                  >
                    <span className="text-xl">🔍</span>
                    <span className="hidden sm:inline">Buscar</span>
                  </button>
                </div>
              </form>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-5xl font-bold text-white mb-2">500+</div>
                  <div className="text-gray-300 text-sm uppercase tracking-wide">
                    Imóveis
                  </div>
                  <div className="w-16 h-1 bg-yellow-400 mx-auto mt-3 rounded-full"></div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-white mb-2">98%</div>
                  <div className="text-gray-300 text-sm uppercase tracking-wide">
                    Satisfação
                  </div>
                  <div className="w-16 h-1 bg-yellow-400 mx-auto mt-3 rounded-full"></div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-white mb-2">24/7</div>
                  <div className="text-gray-300 text-sm uppercase tracking-wide">
                    Suporte
                  </div>
                  <div className="w-16 h-1 bg-yellow-400 mx-auto mt-3 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Categorias Rápidas */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Link
              to="/properties?type=apartment"
              className="group relative overflow-hidden rounded-xl h-56 shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div
                className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1035')",
                }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 z-10">
                <div className="text-4xl mb-3">🏢</div>
                <h3 className="text-white font-bold text-xl mb-2">
                  Apartamentos
                </h3>
                <div className="w-12 h-1 bg-yellow-400 rounded-full group-hover:w-full transition-all duration-300"></div>
              </div>
            </Link>

            <Link
              to="/properties?type=house"
              className="group relative overflow-hidden rounded-xl h-56 shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div
                className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1170')",
                }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 z-10">
                <div className="text-4xl mb-3">🏠</div>
                <h3 className="text-white font-bold text-xl mb-2">Casas</h3>
                <div className="w-12 h-1 bg-yellow-400 rounded-full group-hover:w-full transition-all duration-300"></div>
              </div>
            </Link>

            <Link
              to="/properties?type=penthouse"
              className="group relative overflow-hidden rounded-xl h-56 shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div
                className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1170')",
                }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 z-10">
                <div className="text-4xl mb-3">👑</div>
                <h3 className="text-white font-bold text-xl mb-2">
                  Coberturas
                </h3>
                <div className="w-12 h-1 bg-yellow-400 rounded-full group-hover:w-full transition-all duration-300"></div>
              </div>
            </Link>

            <Link
              to="/properties?type=studio"
              className="group relative overflow-hidden rounded-xl h-56 shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div
                className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1080')",
                }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 z-10">
                <div className="text-4xl mb-3">✨</div>
                <h3 className="text-white font-bold text-xl mb-2">Studios</h3>
                <div className="w-12 h-1 bg-yellow-400 rounded-full group-hover:w-full transition-all duration-300"></div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Imóveis em Destaque */}
      {featuredProperties.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center bg-yellow-400 text-gray-900 px-5 py-2 rounded-full font-bold text-sm mb-6">
                <span className="mr-2">⭐</span>
                Seleção Premium
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Imóveis em <span className="text-red-600">Destaque</span>
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Propriedades cuidadosamente selecionadas com as melhores
                localizações e comodidades
              </p>
              <div className="w-20 h-1 bg-red-600 mx-auto mt-6 rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.map((property) => (
                <PropertyCard
                  key={property.uuid || property.id}
                  property={property}
                />
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                to="/properties"
                className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-10 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <span>Ver Todos os Imóveis</span>
                <span className="ml-2 text-xl">→</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Seção de Benefícios */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Por que escolher{" "}
              <span className="text-red-600">nossos imóveis?</span>
            </h2>
            <div className="w-20 h-1 bg-red-600 mx-auto mt-6 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-red-600 rounded-xl mb-6 shadow-md">
                <span className="text-4xl">🏆</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Qualidade Garantida
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Todos os imóveis passam por rigorosa seleção e verificação de
                qualidade
              </p>
            </div>

            <div className="text-center p-8 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-red-600 rounded-xl mb-6 shadow-md">
                <span className="text-4xl">📍</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Localização Premium
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Imóveis nas melhores regiões de Balneário Camboriú e arredores
              </p>
            </div>

            <div className="text-center p-8 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-red-600 rounded-xl mb-6 shadow-md">
                <span className="text-4xl">💬</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Atendimento Exclusivo
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Suporte personalizado 24/7 para auxiliar em todas as suas
                necessidades
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Final */}
      <section className="py-20 bg-gradient-to-r from-red-600 via-red-700 to-red-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-400 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Pronto para encontrar seu próximo lar?
          </h2>
          <p className="text-xl text-gray-100 mb-10 max-w-2xl mx-auto">
            Entre em contato conosco e descubra as melhores oportunidades em
            imóveis
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/properties"
              className="inline-flex items-center justify-center bg-white text-red-600 font-bold py-4 px-10 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <span>Explorar Imóveis</span>
              <span className="ml-2">🏠</span>
            </Link>

            <a
              href="https://wa.me/5547989105580"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-4 px-10 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <span>Falar no WhatsApp</span>
              <span className="ml-2">💬</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
