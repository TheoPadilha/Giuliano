// giuliano-alquileres/frontend/src/pages/Properties.jsx

import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../services/api";
import PropertyCard from "../components/property/PropertyCard";
import PropertyFilters from "../components/property/PropertyFilters";
import PropertyFiltersPro from "../components/property/PropertyFiltersPro";
import AirbnbHeader from "../components/layout/AirbnbHeader";
import Footer from "../components/layout/Footer";
import Loading from "../components/common/Loading";
import { FaArrowLeft, FaSearch, FaRedo, FaFlag, FaSortAmountDown } from "react-icons/fa";

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
    max_guests: searchParams.get("max_guests") || searchParams.get("guests") || "",
    min_price: searchParams.get("min_price") || "",
    max_price: searchParams.get("max_price") || "",
    bedrooms: searchParams.get("bedrooms") || "",
    bathrooms: searchParams.get("bathrooms") || "",
    featured: searchParams.get("featured") || "",
    amenities: searchParams.get("amenities")?.split(",").filter(Boolean) || [],
    checkIn: searchParams.get("checkIn") || "",
    checkOut: searchParams.get("checkOut") || "",
    rooms: [],
    page: parseInt(searchParams.get("page")) || 1,
    limit: parseInt(searchParams.get("limit")) || 12,
  });

  // Carregar dados auxiliares (cidades e amenidades)
  useEffect(() => {
    const fetchAuxData = async () => {
      try {
        const [citiesRes, amenitiesRes] = await Promise.all([
          api.get("/api/utilities/cities"),
          api.get("/api/utilities/amenities"),
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

      const response = await api.get(`/api/properties?${params.toString()}`);

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
      {/* Header Estilo Airbnb */}
      <AirbnbHeader />

      {/* Main Content */}
      <div className="max-w-[1760px] mx-auto px-6 lg:px-12 py-8">
        {/* Filtros Profissionais */}
        <PropertyFiltersPro
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
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl border-2 border-gray-200 p-16 text-center shadow-xl">
            <div className="max-w-2xl mx-auto">
              <div className="mb-8 relative">
                <div className="w-32 h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full mx-auto flex items-center justify-center">
                  <FaSearch className="text-6xl text-gray-400" />
                </div>
                <div className="absolute top-0 right-1/4 w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                  <FaFlag className="text-3xl text-primary-600" />
                </div>
              </div>

              <h3 className="text-4xl font-bold text-gray-900 mb-4">
                Nenhum imóvel encontrado
              </h3>
              <p className="text-gray-600 text-lg mb-8">
                Não encontramos imóveis que correspondam aos seus critérios de busca.
                <br />
                <span className="text-sm">Tente ajustar os filtros ou fazer uma nova pesquisa.</span>
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
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
                      checkIn: "",
                      checkOut: "",
                      rooms: [],
                      page: 1,
                      limit: 12,
                    });
                    setSearchParams({});
                  }}
                  className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-3"
                >
                  <FaRedo />
                  <span>Limpar Todos os Filtros</span>
                </button>

                <Link
                  to="/"
                  className="px-8 py-4 bg-white border-2 border-gray-300 hover:border-primary-600 text-gray-700 hover:text-primary-600 rounded-xl font-bold transition-all duration-300 flex items-center gap-3 shadow-md"
                >
                  <FaArrowLeft />
                  <span>Voltar ao Início</span>
                </Link>
              </div>

              <div className="mt-12 pt-8 border-t border-gray-300">
                <p className="text-sm text-gray-600 mb-4 font-semibold">Sugestões:</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="font-medium text-gray-900 mb-1">Expanda a busca</p>
                    <p>Tente buscar em outras cidades ou regiões</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="font-medium text-gray-900 mb-1">Ajuste o preço</p>
                    <p>Aumente a faixa de preço para mais opções</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="font-medium text-gray-900 mb-1">Reduza filtros</p>
                    <p>Menos comodidades selecionadas = mais resultados</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Header de Resultados */}
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-airbnb-black mb-2">
                {properties.length} {properties.length === 1 ? 'imóvel' : 'imóveis'}
              </h1>
              <p className="text-airbnb-grey-400 text-base">
                Explore opções incríveis para sua próxima estadia
              </p>
            </div>

            {/* Grid de Propriedades - Estilo Airbnb */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10 mb-12">
              {properties.map((property, index) => (
                <PropertyCard
                  key={property.uuid || property.id || `property-${index}`}
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

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Properties;
