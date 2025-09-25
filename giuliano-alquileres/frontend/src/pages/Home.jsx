import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import PropertyCard from "../components/property/PropertyCard";
import Loading from "../components/common/Loading";

const Home = () => {
  const [properties, setProperties] = useState([]);
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    city_id: "",
    type: "",
    max_guests: "",
    search: "",
  });

  // Carregar dados iniciais
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propertiesRes, featuredRes, citiesRes] = await Promise.all([
          api.get("/properties?limit=12"),
          api.get("/properties/featured?limit=4"),
          api.get("/utilities/cities?active_only=true"),
        ]);

        setProperties(propertiesRes.data.properties || []);
        setFeaturedProperties(featuredRes.data.properties || []);
        setCities(citiesRes.data.cities || []);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Buscar imóveis com filtros
  const handleSearch = async (e) => {
    e.preventDefault();
    setSearching(true);

    try {
      const params = new URLSearchParams();
      if (searchFilters.city_id)
        params.append("city_id", searchFilters.city_id);
      if (searchFilters.type) params.append("type", searchFilters.type);
      if (searchFilters.max_guests)
        params.append("max_guests", searchFilters.max_guests);
      if (searchFilters.search) params.append("search", searchFilters.search);

      const response = await api.get(`/properties?${params.toString()}`);
      setProperties(response.data.properties || []);
    } catch (error) {
      console.error("Erro na busca:", error);
    } finally {
      setSearching(false);
    }
  };

  // Limpar filtros
  const clearFilters = () => {
    setSearchFilters({
      city_id: "",
      type: "",
      max_guests: "",
      search: "",
    });

    // Recarregar propriedades iniciais
    const fetchInitialProperties = async () => {
      try {
        const response = await api.get("/properties?limit=12");
        setProperties(response.data.properties || []);
      } catch (error) {
        console.error("Erro ao recarregar:", error);
      }
    };

    fetchInitialProperties();
  };

  const hasActiveFilters =
    searchFilters.city_id ||
    searchFilters.type ||
    searchFilters.max_guests ||
    searchFilters.search;

  if (loading) {
    return <Loading text="Carregando imóveis..." />;
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link
                to="/"
                className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
              >
                Giuliano Alquileres
              </Link>
              <p className="text-gray-600 text-sm">
                Aluguel de temporada em Santa Catarina
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm">
                <option value="pt">🇧🇷 Português</option>
                <option value="es">🇪🇸 Español</option>
                <option value="en">🇺🇸 English</option>
              </select>

              <Link to="/login" className="btn-secondary text-sm py-2">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section com Busca */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            Encontre sua Casa de Férias Perfeita
          </h1>
          <p className="text-xl lg:text-2xl mb-10 text-blue-100">
            Imóveis selecionados em Balneário Camboriú, Itapema e região
          </p>

          {/* Formulário de Busca Melhorado */}
          <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-5xl mx-auto">
            <form onSubmit={handleSearch} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Busca por texto */}
                <div className="lg:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                    Buscar Imóvel
                  </label>
                  <input
                    type="text"
                    placeholder="Nome, localização..."
                    value={searchFilters.search}
                    onChange={(e) =>
                      setSearchFilters({
                        ...searchFilters,
                        search: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>

                {/* Cidade */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                    Cidade
                  </label>
                  <select
                    value={searchFilters.city_id}
                    onChange={(e) =>
                      setSearchFilters({
                        ...searchFilters,
                        city_id: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="">Todas as cidades</option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tipo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                    Tipo de Imóvel
                  </label>
                  <select
                    value={searchFilters.type}
                    onChange={(e) =>
                      setSearchFilters({
                        ...searchFilters,
                        type: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="">Todos os tipos</option>
                    <option value="apartment">🏢 Apartamento</option>
                    <option value="house">🏠 Casa</option>
                    <option value="studio">🏡 Studio</option>
                    <option value="penthouse">🏰 Cobertura</option>
                  </select>
                </div>

                {/* Hóspedes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                    Hóspedes
                  </label>
                  <select
                    value={searchFilters.max_guests}
                    onChange={(e) =>
                      setSearchFilters({
                        ...searchFilters,
                        max_guests: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="">Qualquer quantidade</option>
                    <option value="1">1 pessoa</option>
                    <option value="2">2 pessoas</option>
                    <option value="4">4 pessoas</option>
                    <option value="6">6+ pessoas</option>
                  </select>
                </div>
              </div>

              {/* Botões */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  type="submit"
                  disabled={searching}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-4 px-8 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
                >
                  {searching ? (
                    <span className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Buscando...
                    </span>
                  ) : (
                    <>🔍 Buscar Imóveis</>
                  )}
                </button>

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="bg-gray-600 hover:bg-gray-700 text-white py-4 px-8 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    🔄 Limpar Filtros
                  </button>
                )}
              </div>

              {/* Indicador de filtros ativos */}
              {hasActiveFilters && (
                <div className="text-sm text-gray-600 bg-blue-50 rounded-lg p-3">
                  <span className="font-medium">Filtros ativos:</span>
                  {searchFilters.search && (
                    <span className="ml-2 bg-blue-100 px-2 py-1 rounded">
                      Busca: "{searchFilters.search}"
                    </span>
                  )}
                  {searchFilters.city_id && (
                    <span className="ml-2 bg-blue-100 px-2 py-1 rounded">
                      Cidade selecionada
                    </span>
                  )}
                  {searchFilters.type && (
                    <span className="ml-2 bg-blue-100 px-2 py-1 rounded">
                      Tipo selecionado
                    </span>
                  )}
                  {searchFilters.max_guests && (
                    <span className="ml-2 bg-blue-100 px-2 py-1 rounded">
                      Hóspedes: {searchFilters.max_guests}+
                    </span>
                  )}
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Imóveis em Destaque */}
      {featuredProperties.length > 0 && !hasActiveFilters && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                ⭐ Imóveis em Destaque
              </h2>
              <p className="text-xl text-gray-600">
                Selecionados especialmente para você
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  className="transform hover:-translate-y-2"
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Todos os Imóveis */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {hasActiveFilters
                ? "🔍 Resultados da Busca"
                : "🏠 Todos os Imóveis"}
            </h2>
            <p className="text-xl text-gray-600">
              {properties.length}{" "}
              {properties.length === 1
                ? "imóvel encontrado"
                : "imóveis encontrados"}
              {hasActiveFilters && " com os filtros aplicados"}
            </p>
          </div>

          {properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-8xl mb-6">🏠</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {hasActiveFilters
                  ? "Nenhum imóvel encontrado"
                  : "Nenhum imóvel disponível"}
              </h3>
              <p className="text-gray-600 text-lg mb-8">
                {hasActiveFilters
                  ? "Tente ajustar os filtros de busca para encontrar mais opções"
                  : "Em breve teremos novos imóveis disponíveis"}
              </p>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="btn-primary text-lg py-3 px-8"
                >
                  🔄 Ver Todos os Imóveis
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold mb-4">Giuliano Alquileres</h3>
              <p className="text-gray-400 text-lg mb-6">
                Sua melhor opção para aluguel de temporada em Santa Catarina.
                Imóveis selecionados, atendimento personalizado e experiência
                inesquecível.
              </p>

              {/* Redes Sociais */}
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="bg-blue-600 hover:bg-blue-700 p-3 rounded-full transition-colors"
                >
                  📘
                </a>
                <a
                  href="#"
                  className="bg-pink-600 hover:bg-pink-700 p-3 rounded-full transition-colors"
                >
                  📷
                </a>
                <a
                  href="https://wa.me/5547989105580"
                  className="bg-green-600 hover:bg-green-700 p-3 rounded-full transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  💬
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">📞 Contato</h4>
              <div className="space-y-3 text-gray-400">
                <p className="flex items-center">
                  <span className="mr-2">💬</span>
                  <a
                    href="https://wa.me/5547989105580"
                    className="hover:text-white transition-colors"
                  >
                    (47) 98910-5580
                  </a>
                </p>
                <p className="flex items-center">
                  <span className="mr-2">📧</span>
                  <a
                    href="mailto:contato@giulianoalquileres.com"
                    className="hover:text-white transition-colors"
                  >
                    contato@giuliano.com
                  </a>
                </p>
                <p className="flex items-center">
                  <span className="mr-2">📍</span>
                  <span>Balneário Camboriú, SC</span>
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">🏙️ Cidades</h4>
              <div className="space-y-2 text-gray-400">
                {cities.slice(0, 6).map((city) => (
                  <p
                    key={city.id}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    {city.name}
                  </p>
                ))}
                {cities.length > 6 && (
                  <p className="text-blue-400">+{cities.length - 6} cidades</p>
                )}
              </div>
            </div>
          </div>

          {/* Informações Legais */}
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 text-sm">
                <p>
                  &copy; 2025 Giuliano Alquileres. Todos os direitos reservados.
                </p>
                <p className="mt-1">
                  CNPJ: XX.XXX.XXX/XXXX-XX • Registro de Turismo: XXXXXX
                </p>
              </div>

              <div className="mt-4 md:mt-0 flex space-x-6 text-sm text-gray-400">
                <a href="#" className="hover:text-white transition-colors">
                  Termos de Uso
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  Política de Privacidade
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  Cancelamento
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* WhatsApp Flutuante */}
      <a
        href="https://wa.me/5547989105580?text=Olá! Gostaria de mais informações sobre os imóveis disponíveis."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-200 transform hover:scale-110 z-50 animate-bounce"
        title="Contato via WhatsApp"
      >
        <div className="text-2xl">💬</div>
      </a>
    </div>
  );
};

export default Home;
