// giuliano-alquileres/frontend/src/pages/Properties.jsx

import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../services/api";
import PropertyCard from "../components/property/PropertyCard";
import PropertyFilters from "../components/property/PropertyFilters";
import Loading from "../components/common/Loading";

const Properties = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [cities, setCities] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});

  // Estado dos filtros
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    city_id: searchParams.get("city_id") || "",
    type: searchParams.get("type") || "",
    max_guests: searchParams.get("max_guests") || "",
    min_price: searchParams.get("min_price") || "",
    max_price: searchParams.get("max_price") || "",
    bedrooms: searchParams.get("bedrooms") || "",
    bathrooms: searchParams.get("bathrooms") || "",
    featured: searchParams.get("featured") || "",
    amenities: searchParams.get("amenities")?.split(",").filter(Boolean) || [],
    page: parseInt(searchParams.get("page")) || 1,
    limit: parseInt(searchParams.get("limit")) || 12,
  });

  // Carregar dados auxiliares (cidades e amenidades)
  useEffect(() => {
    const fetchAuxData = async () => {
      try {
        const [citiesRes, amenitiesRes] = await Promise.all([
          api.get("/utilities/cities"),
          api.get("/utilities/amenities"),
        ]);

        setCities(citiesRes.data.cities || []);
        setAmenities(amenitiesRes.data.amenities || []);
      } catch (error) {
        console.error("Erro ao carregar dados auxiliares:", error);
      }
    };

    fetchAuxData();
  }, []);

  // Buscar propriedades quando filtros mudarem
  useEffect(() => {
    fetchProperties();
  }, [filters]);

  const fetchProperties = async () => {
    try {
      setLoading(true);

      // Construir query string
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== "") {
          if (Array.isArray(value) && value.length > 0) {
            params.append(key, value.join(","));
          } else if (!Array.isArray(value)) {
            params.append(key, value);
          }
        }
      });

      console.log("🔍 Buscando com params:", params.toString());

      const response = await api.get(`/properties?${params.toString()}`);

      console.log("📦 Propriedades encontradas:", response.data);

      setProperties(response.data.properties || []);
      setPagination(response.data.pagination || {});
    } catch (error) {
      console.error("Erro ao buscar propriedades:", error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  // Atualizar filtros e URL
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);

    // Atualizar URL
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (
        value &&
        value !== "" &&
        !(Array.isArray(value) && value.length === 0)
      ) {
        if (Array.isArray(value)) {
          params.set(key, value.join(","));
        } else {
          params.set(key, value);
        }
      }
    });

    setSearchParams(params);
  };

  // Aplicar filtros
  const handleSearch = () => {
    fetchProperties();
  };

  // Mudar página
  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Moderno */}
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Link
                to="/"
                className="text-red-600 hover:text-red-700 font-semibold text-sm flex items-center gap-2 transition-colors"
              >
                <span>←</span>
                <span>Voltar</span>
              </Link>
              <div className="border-l border-gray-300 pl-6">
                <h1 className="text-3xl font-bold text-gray-900">
                  Nossos Imóveis
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {loading
                    ? "Buscando..."
                    : `${properties.length} ${
                        properties.length === 1
                          ? "imóvel encontrado"
                          : "imóveis encontrados"
                      }`}
                </p>
              </div>
            </div>

            {/* Language Selector */}
            <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white">
              <option value="pt">🇧🇷 Português</option>
              <option value="es">🇪🇸 Español</option>
              <option value="en">🇺🇸 English</option>
            </select>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros */}
        <PropertyFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          cities={cities}
          amenities={amenities}
          onSearch={handleSearch}
          loading={loading}
          className="mb-8"
        />

        {/* Results */}
        {loading ? (
          <Loading text="Buscando imóveis..." />
        ) : properties.length === 0 ? (
          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-16 text-center">
            <div className="text-7xl mb-6">🔍</div>
            <h3 className="text-3xl font-bold text-gray-900 mb-3">
              Nenhum imóvel encontrado
            </h3>
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
              Tente ajustar os filtros ou fazer uma nova busca.
            </p>
            <button
              onClick={() => {
                setFilters({
                  search: "",
                  city_id: "",
                  type: "",
                  max_guests: "",
                  min_price: "",
                  max_price: "",
                  bedrooms: "",
                  bathrooms: "",
                  featured: "",
                  amenities: [],
                  page: 1,
                  limit: 12,
                });
                setSearchParams({});
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
            >
              🔄 Limpar Filtros
            </button>
          </div>
        ) : (
          <>
            {/* Grid de Propriedades */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {properties.map((property) => (
                <PropertyCard
                  key={property.uuid || property.id}
                  property={property}
                />
              ))}
            </div>

            {/* Paginação Moderna */}
            {pagination.totalPages > 1 && (
              <div className="flex flex-col items-center space-y-4">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handlePageChange(filters.page - 1)}
                    disabled={!pagination.hasPrevPage}
                    className="px-5 py-3 bg-white border border-gray-200 rounded-xl hover:border-red-600 hover:text-red-600 transition-all duration-200 font-semibold disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:text-gray-900 shadow-sm"
                  >
                    ← Anterior
                  </button>

                  <div className="flex space-x-2">
                    {Array.from(
                      { length: Math.min(pagination.totalPages, 5) },
                      (_, i) => {
                        let page;
                        if (pagination.totalPages <= 5) {
                          page = i + 1;
                        } else if (filters.page <= 3) {
                          page = i + 1;
                        } else if (filters.page >= pagination.totalPages - 2) {
                          page = pagination.totalPages - 4 + i;
                        } else {
                          page = filters.page - 2 + i;
                        }
                        return page;
                      }
                    ).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-12 h-12 rounded-xl font-semibold transition-all duration-200 ${
                          page === filters.page
                            ? "bg-red-600 text-white shadow-md"
                            : "bg-white border border-gray-200 hover:border-red-600 hover:text-red-600"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handlePageChange(filters.page + 1)}
                    disabled={!pagination.hasNextPage}
                    className="px-5 py-3 bg-white border border-gray-200 rounded-xl hover:border-red-600 hover:text-red-600 transition-all duration-200 font-semibold disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:text-gray-900 shadow-sm"
                  >
                    Próxima →
                  </button>
                </div>

                {/* Info de Paginação */}
                {pagination.totalItems > 0 && (
                  <div className="text-sm text-gray-600">
                    Mostrando{" "}
                    <span className="font-semibold text-gray-900">
                      {(filters.page - 1) * filters.limit + 1}
                    </span>{" "}
                    a{" "}
                    <span className="font-semibold text-gray-900">
                      {Math.min(
                        filters.page * filters.limit,
                        pagination.totalItems
                      )}
                    </span>{" "}
                    de{" "}
                    <span className="font-semibold text-gray-900">
                      {pagination.totalItems}
                    </span>{" "}
                    imóveis
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Properties;
