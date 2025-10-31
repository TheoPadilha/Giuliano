// Properties.jsx - Versão Corrigida
import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../services/api";
import PropertyCard from "../components/property/PropertyCard";
import PropertyFiltersPro from "../components/property/PropertyFiltersPro";
import SortDropdown from "../components/property/SortDropdown";
import MapView from "../components/property/MapView";
import AirbnbHeader from "../components/layout/AirbnbHeader";
import Footer from "../components/layout/Footer";
import Loading from "../components/common/Loading";
import {
  FaSearch,
  FaRedo,
  FaThLarge,
  FaList,
  FaMapMarkedAlt,
} from "react-icons/fa";
import { trackPageView, trackPropertySearch } from "../utils/googleAnalytics";

const Properties = () => {
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [cities, setCities] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [viewMode, setViewMode] = useState("grid"); // grid, list, map

  // Estado dos filtros
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    city_id: searchParams.get("city_id") || "",
    type: searchParams.get("type") || "",
    max_guests:
      searchParams.get("max_guests") || searchParams.get("guests") || "",
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
    limit: parseInt(searchParams.get("limit")) || 20,
  });

  // Estado de ordenação
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "");

  // Carregar dados auxiliares (cidades e amenidades)
  useEffect(() => {
    // Rastrear visualização da página
    trackPageView("/properties", "Buscar Propriedades");

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

  // Função para ordenar propriedades no frontend
  const sortProperties = (props, sortType) => {
    const sorted = [...props];

    switch (sortType) {
      case "price_asc":
        return sorted.sort(
          (a, b) => (a.price_per_night || 0) - (b.price_per_night || 0)
        );
      case "price_desc":
        return sorted.sort(
          (a, b) => (b.price_per_night || 0) - (a.price_per_night || 0)
        );
      case "rating":
        return sorted.sort(
          (a, b) => (b.average_rating || 0) - (a.average_rating || 0)
        );
      case "newest":
        return sorted.sort(
          (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)
        );
      default:
        return sorted;
    }
  };

  // Buscar propriedades quando filtros ou ordenação mudarem
  useEffect(() => {
    fetchProperties();
  }, [filters, sortBy]);

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

      // Adicionar ordenação
      if (sortBy) {
        params.append("sort", sortBy);
      }

      console.log("🔍 Buscando com params:", params.toString());

      const response = await api.get(`/api/properties?${params.toString()}`);

      console.log("📦 Propriedades encontradas:", response.data);

      let fetchedProperties = response.data.properties || [];

      // Ordenação no frontend (caso o backend não suporte)
      if (sortBy) {
        fetchedProperties = sortProperties(fetchedProperties, sortBy);
      }

      setProperties(fetchedProperties);
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
    // Rastrear busca de propriedade
    trackPropertySearch(filters);
    fetchProperties();
  };

  // Mudar página
  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Limpar todos os filtros
  const clearAllFilters = () => {
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
      limit: 20,
    });
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Original - MANTIDO */}
      <AirbnbHeader onFilterButtonClick={() => setShowFiltersModal(true)} />

      {/* Modal de Filtros - Só aparece quando clicado */}
      {showFiltersModal && (
        <PropertyFiltersPro
          filters={filters}
          onFiltersChange={handleFiltersChange}
          cities={cities}
          amenities={amenities}
          onSearch={() => {
            handleSearch();
            setShowFiltersModal(false);
          }}
          loading={loading}
          isModal={true}
          onClose={() => setShowFiltersModal(false)}
        />
      )}

      {/* Main Content - SEM A BARRA DE FILTROS STICKY */}
      <div className="max-w-[2520px] mx-auto px-5 sm:px-10 lg:px-20">
        {/* Barra de Resultados e Controles */}
        {!loading && properties.length > 0 && (
          <div className="flex items-center justify-between py-6 border-b border-airbnb-grey-200 flex-wrap gap-4">
            {/* Info de Resultados */}
            <div className="flex items-center gap-4">
              <h2 className="text-sm text-airbnb-grey-600">
                {pagination.total > 0 ? (
                  <>
                    <span className="font-semibold text-airbnb-black">
                      {pagination.total}
                    </span>{" "}
                    {pagination.total === 1
                      ? "imóvel encontrado"
                      : "imóveis encontrados"}
                  </>
                ) : null}
              </h2>
            </div>

            {/* Controles de Ordenação e Visualização */}
            <div className="flex items-center gap-3">
              {/* Dropdown de Ordenação */}
              <SortDropdown value={sortBy} onChange={setSortBy} />

              {/* Controles de Visualização */}
              <div className="hidden md:flex items-center gap-2 ml-2 pl-2 border-l border-airbnb-grey-200">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2.5 rounded-lg transition-all ${
                    viewMode === "grid"
                      ? "bg-airbnb-black text-white"
                      : "bg-white text-airbnb-grey-600 hover:bg-airbnb-grey-50 border border-airbnb-grey-200"
                  }`}
                  title="Visualização em grade"
                >
                  <FaThLarge className="text-sm" />
                </button>

                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2.5 rounded-lg transition-all ${
                    viewMode === "list"
                      ? "bg-airbnb-black text-white"
                      : "bg-white text-airbnb-grey-600 hover:bg-airbnb-grey-50 border border-airbnb-grey-200"
                  }`}
                  title="Visualização em lista"
                >
                  <FaList className="text-sm" />
                </button>

                <button
                  onClick={() => setViewMode("map")}
                  className={`p-2.5 rounded-lg transition-all ${
                    viewMode === "map"
                      ? "bg-airbnb-black text-white"
                      : "bg-white text-airbnb-grey-600 hover:bg-airbnb-grey-50 border border-airbnb-grey-200"
                  }`}
                  title="Visualização em mapa"
                >
                  <FaMapMarkedAlt className="text-sm" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Área de Conteúdo */}
        <div className="py-8">
          {loading ? (
            // Loading State
            <div className="flex flex-col justify-center items-center py-32">
              <Loading text="Buscando imóveis..." />
            </div>
          ) : properties.length === 0 ? (
            // Empty State
            <div className="flex flex-col items-center justify-center py-24 px-4">
              <div className="max-w-md text-center">
                {/* Ícone */}
                <div className="w-24 h-24 mx-auto mb-8 bg-airbnb-grey-50 rounded-full flex items-center justify-center">
                  <FaSearch className="text-4xl text-airbnb-grey-300" />
                </div>

                {/* Título */}
                <h2 className="text-3xl font-semibold text-airbnb-black mb-4">
                  Nenhum imóvel encontrado
                </h2>

                {/* Descrição */}
                <p className="text-base text-airbnb-grey-600 mb-10 leading-relaxed">
                  Não encontramos imóveis que correspondam aos seus critérios de
                  busca. Tente ajustar os filtros ou explorar outras opções.
                </p>

                {/* Ações */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={clearAllFilters}
                    className="w-full sm:w-auto px-6 py-3 bg-rausch hover:bg-rausch-dark text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <FaRedo className="text-sm" />
                    <span>Limpar filtros</span>
                  </button>

                  <Link
                    to="/"
                    className="w-full sm:w-auto px-6 py-3 bg-white border-2 border-airbnb-grey-300 text-airbnb-black rounded-lg font-semibold hover:border-airbnb-black transition-colors"
                  >
                    Voltar ao início
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            // TEM IMÓVEIS - MOSTRAR GRID/LISTA/MAPA
            <>
              {/* Grid de Propriedades */}
              {viewMode === "grid" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-6 gap-y-10">
                  {properties.map((property, index) => (
                    <PropertyCard
                      key={property.uuid || property.id || `property-${index}`}
                      property={property}
                      viewMode={viewMode}
                    />
                  ))}
                </div>
              )}

              {/* Lista de Propriedades */}
              {viewMode === "list" && (
                <div className="space-y-8">
                  {properties.map((property, index) => (
                    <PropertyCard
                      key={property.uuid || property.id || `property-${index}`}
                      property={property}
                      viewMode={viewMode}
                    />
                  ))}
                </div>
              )}

              {/* Visualização em Mapa */}
              {viewMode === "map" && <MapView properties={properties} />}

              {/* Paginação */}
              {pagination.totalPages > 1 && (
                <div className="mt-12 flex justify-center">
                  <nav className="flex items-center space-x-1">
                    {/* Botão Anterior */}
                    <button
                      onClick={() => handlePageChange(filters.page - 1)}
                      disabled={filters.page === 1}
                      className="px-4 py-2 text-sm font-medium text-airbnb-black bg-white border border-airbnb-grey-200 rounded-lg hover:bg-airbnb-grey-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Anterior
                    </button>

                    {/* Números de Página */}
                    {Array.from(
                      { length: Math.min(5, pagination.totalPages) },
                      (_, i) => {
                        const page = i + 1;
                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                              page === filters.page
                                ? "bg-airbnb-black text-white"
                                : "text-airbnb-black bg-white hover:bg-airbnb-grey-50"
                            }`}
                          >
                            {page}
                          </button>
                        );
                      }
                    )}

                    {/* Botão Próximo */}
                    <button
                      onClick={() => handlePageChange(filters.page + 1)}
                      disabled={filters.page === pagination.totalPages}
                      className="px-4 py-2 text-sm font-medium text-airbnb-black bg-white border border-airbnb-grey-200 rounded-lg hover:bg-airbnb-grey-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Próximo
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Properties;
