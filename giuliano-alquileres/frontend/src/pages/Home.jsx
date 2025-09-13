import { useState, useEffect } from "react";
import api from "../services/api";
import Loading from "../components/common/Loading";

const Home = () => {
  const [properties, setProperties] = useState([]);
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchFilters, setSearchFilters] = useState({
    city_id: "",
    type: "",
    max_guests: "",
  });

  // Carregar dados iniciais
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propertiesRes, featuredRes, citiesRes] = await Promise.all([
          api.get("/properties?limit=6"),
          api.get("/properties/featured?limit=3"),
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

  // Componente de Card de Imóvel
  const PropertyCard = ({ property }) => (
    <div className="card hover:shadow-lg transition-shadow duration-300">
      <div className="aspect-w-16 aspect-h-9 mb-4">
        {property.photos && property.photos.length > 0 ? (
          <img
            src={`http://localhost:3001/uploads/properties/${property.photos[0].filename}`}
            alt={property.photos[0].alt_text || property.title}
            className="w-full h-48 object-cover rounded-lg"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-gray-400">Sem foto</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
          {property.title}
        </h3>

        <div className="flex items-center text-sm text-gray-600">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
          </svg>
          {property.city?.name}, {property.city?.state}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>{property.max_guests} pessoas</span>
            <span>{property.bedrooms} quartos</span>
            <span>{property.bathrooms} banheiros</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div>
            <span className="text-2xl font-bold text-blue-600">
              R$ {property.price_per_night}
            </span>
            <span className="text-gray-600">/noite</span>
          </div>

          <button
            onClick={() =>
              window.open(
                `https://wa.me/5547999999999?text=Olá! Tenho interesse no imóvel: ${property.title}`,
                "_blank"
              )
            }
            className="btn-primary"
          >
            WhatsApp
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <Loading text="Carregando imóveis..." />;
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Giuliano Alquileres
              </h1>
              <p className="text-gray-600">
                Aluguel de temporada em Santa Catarina
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="pt">🇧🇷 Português</option>
                <option value="es">🇪🇸 Español</option>
                <option value="en">🇺🇸 English</option>
              </select>

              <a href="/login" className="btn-secondary">
                Admin
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-6">
            Encontre sua Casa de Férias Perfeita
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Imóveis selecionados em Balneário Camboriú, Itapema e região
          </p>

          {/* Filtros de Busca */}
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <select
                value={searchFilters.city_id}
                onChange={(e) =>
                  setSearchFilters({
                    ...searchFilters,
                    city_id: e.target.value,
                  })
                }
                className="px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todas as cidades</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>

              <select
                value={searchFilters.type}
                onChange={(e) =>
                  setSearchFilters({ ...searchFilters, type: e.target.value })
                }
                className="px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tipo de imóvel</option>
                <option value="apartment">Apartamento</option>
                <option value="house">Casa</option>
                <option value="studio">Studio</option>
                <option value="penthouse">Cobertura</option>
              </select>

              <select
                value={searchFilters.max_guests}
                onChange={(e) =>
                  setSearchFilters({
                    ...searchFilters,
                    max_guests: e.target.value,
                  })
                }
                className="px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Pessoas</option>
                <option value="1">1 pessoa</option>
                <option value="2">2 pessoas</option>
                <option value="4">4 pessoas</option>
                <option value="6">6+ pessoas</option>
              </select>

              <button className="btn-primary py-3 px-6">Buscar Imóveis</button>
            </div>
          </div>
        </div>
      </section>

      {/* Imóveis em Destaque */}
      {featuredProperties.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Imóveis em Destaque
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Todos os Imóveis */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Todos os Imóveis
          </h2>

          {properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">Nenhum imóvel encontrado.</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Giuliano Alquileres</h3>
              <p className="text-gray-400">
                Sua melhor opção para aluguel de temporada em Santa Catarina.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Contato</h4>
              <div className="space-y-2 text-gray-400">
                <p>📱 WhatsApp: (47) 99999-9999</p>
                <p>📧 Email: contato@giuliano.com</p>
                <p>📍 Balneário Camboriú, SC</p>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Cidades</h4>
              <div className="space-y-1 text-gray-400">
                {cities.map((city) => (
                  <p key={city.id}>{city.name}</p>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>
              &copy; 2025 Giuliano Alquileres. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
