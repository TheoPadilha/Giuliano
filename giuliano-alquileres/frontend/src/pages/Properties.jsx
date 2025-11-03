// Properties.jsx - Versão Corrigida
import { useState, useEffect, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../services/api";
import PropertyCard from "../components/property/PropertyCard";
import PropertyFiltersPro from "../components/property/PropertyFiltersPro";
import SortDropdown from "../components/property/SortDropdown";
import MapViewLeaflet from "../components/property/MapViewLeaflet";
import ExpandableSearchBar from "../components/search/ExpandableSearchBar";
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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [viewMode, setViewMode] = useState(
    window.innerWidth < 1024 ? "map" : "grid"
  ); // Mobile padrão: map, Desktop: grid
  const [hoveredPropertyId, setHoveredPropertyId] = useState(null); // Para sincronizar hover entre card e mapa
  const propertyRefs = useRef({}); // Refs para scroll até card

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
    guests: {
      adults: parseInt(searchParams.get("adults")) || 0,
      children: parseInt(searchParams.get("children")) || 0,
      infants: parseInt(searchParams.get("infants")) || 0,
      pets: parseInt(searchParams.get("pets")) || 0,
    },
    rooms: [],
    page: parseInt(searchParams.get("page")) || 1,
    limit: parseInt(searchParams.get("limit")) || 20,
  });

  // Estado de ordenação
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "");

  // Detectar mudanças de tamanho de tela
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);

      // Se estava em modo grid/list no desktop e mudou para mobile, muda para map
      if (mobile && (viewMode === "grid" || viewMode === "list")) {
        setViewMode("map");
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [viewMode]);

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

  // Função para scroll até card quando clicar no mapa
  const scrollToProperty = (propertyId) => {
    const cardElement = propertyRefs.current[propertyId];
    if (cardElement) {
      // Destaca o card temporariamente
      setHoveredPropertyId(propertyId);

      // Scroll suave até o card
      cardElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      // Remove o destaque após 2 segundos
      setTimeout(() => {
        setHoveredPropertyId(null);
      }, 2000);
    }
  };

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
        if (key === 'guests' && typeof value === 'object') {
          // Calculate total guests from adults and children
          const totalGuests = (value.adults || 0) + (value.children || 0);
          if (totalGuests > 0) {
            params.append('max_guests', totalGuests.toString());
          }
        } else if (value && value !== "") {
          if (Array.isArray(value) && value.length > 0) {
            params.append(key, value.join(","));
          } else if (!Array.isArray(value) && typeof value !== 'object') {
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
      if (key === 'guests' && typeof value === 'object') {
        // Handle guests object separately
        Object.entries(value).forEach(([guestType, count]) => {
          if (count > 0) {
            params.set(guestType, count.toString());
          }
        });
      } else if (
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
      guests: {
        adults: 0,
        children: 0,
        infants: 0,
        pets: 0,
      },
      rooms: [],
      page: 1,
      limit: 20,
    });
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-white dark:bg-airbnb-grey-900">
      {/* Barra de Busca Expansível */}
      <ExpandableSearchBar
        filters={filters}
        onSearch={(newFilters) => {
          setFilters(newFilters);
          handleSearch();
        }}
        onFiltersClick={() => setShowFiltersModal(true)}
      />

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
                <div className="space-y-6">
                  {properties.map((property, index) => (
                    <PropertyCard
                      key={property.uuid || property.id || `property-${index}`}
                      property={property}
                      layout="horizontal"
                    />
                  ))}
                </div>
              )}

              {/* Visualização em Mapa - Layout Estilo Airbnb */}
              {viewMode === "map" && (
                <div className="relative flex flex-col lg:flex-row h-auto lg:h-[calc(100vh-240px)] min-h-[600px] transition-all ease-in-out duration-300">
                  {/* MOBILE: Mapa no topo */}
                  <div className="lg:hidden w-full h-[50vh] sticky top-[72px] z-10 transition-all ease-in-out duration-300">
                    <MapViewLeaflet
                      properties={properties}
                      hoveredPropertyId={hoveredPropertyId}
                      onPropertyHover={setHoveredPropertyId}
                      onPropertyClick={scrollToProperty}
                    />

                    {/* Badge de Contagem no Mapa Mobile */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-[1000] pointer-events-none">
                      <div className="bg-white px-4 py-2 rounded-full shadow-lg border border-airbnb-grey-200 flex items-center gap-2">
                        <div className="w-2 h-2 bg-rausch rounded-full animate-pulse"></div>
                        <p className="text-sm font-semibold text-airbnb-black">
                          {properties.filter(p => p.latitude && p.longitude).length} no mapa
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* DESKTOP/MOBILE: Coluna Esquerda - Cards Scrollable */}
                  <div className="w-full lg:w-[45%] overflow-y-auto px-4 py-6 lg:px-6 bg-white custom-scrollbar relative">
                    {/* Barrinha cinza no topo (Mobile apenas) - Estilo Airbnb */}
                    <div className="lg:hidden sticky top-0 left-0 right-0 flex justify-center pt-2 pb-4 bg-white z-10">
                      <div className="w-10 h-1 bg-airbnb-grey-300 rounded-full"></div>
                    </div>

                    <div className="max-w-2xl mx-auto space-y-4">
                      {/* Total de Resultados */}
                      <div className="mb-4">
                        <h2 className="text-xl font-semibold text-airbnb-black">
                          {properties.length} {properties.length === 1 ? 'propriedade' : 'propriedades'}
                        </h2>
                        <p className="hidden lg:block text-sm text-airbnb-grey-600 mt-1">
                          Passe o mouse sobre os cards para destacar no mapa
                        </p>
                        <p className="lg:hidden text-sm text-airbnb-grey-600 mt-1">
                          Toque nos preços do mapa para ver detalhes
                        </p>
                      </div>

                      {/* Cards com Animações */}
                      {properties.map((property, index) => {
                        const propertyId = property.uuid || property.id;
                        const isHovered = hoveredPropertyId === propertyId;

                        return (
                          <div
                            key={propertyId || `property-${index}`}
                            ref={(el) => (propertyRefs.current[propertyId] = el)}
                            onMouseEnter={() => setHoveredPropertyId(propertyId)}
                            onMouseLeave={() => setHoveredPropertyId(null)}
                            className={`
                              transition-all duration-300 ease-in-out
                              ${isHovered ? 'transform scale-[1.02]' : 'transform scale-100'}
                            `}
                          >
                            <div className={`
                              rounded-xl overflow-hidden bg-white
                              ${isHovered ? 'shadow-xl ring-2 ring-rausch/50' : 'shadow-sm hover:shadow-md'}
                              transition-all duration-300 ease-in-out
                            `}>
                              <PropertyCard
                                property={property}
                                layout="horizontal"
                              />
                            </div>
                          </div>
                        );
                      })}

                      {/* Espaço final para não ficar colado no fim */}
                      <div className="h-20"></div>
                    </div>
                  </div>

                  {/* DESKTOP: Coluna Direita - Mapa Fixo (60%) */}
                  <div className="hidden lg:block w-[55%] h-full sticky top-0">
                    <MapViewLeaflet
                      properties={properties}
                      hoveredPropertyId={hoveredPropertyId}
                      onPropertyHover={setHoveredPropertyId}
                      onPropertyClick={scrollToProperty}
                    />

                    {/* Badge de Contagem no Mapa Desktop */}
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] pointer-events-none">
                      <div className="bg-white px-3 py-1.5 rounded-full shadow-md border border-airbnb-grey-200">
                        <p className="text-xs font-semibold text-airbnb-black">
                          {properties.filter(p => p.latitude && p.longitude).length} no mapa
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* CSS Custom Scrollbar */}
                  <style>{`
                    /* Custom Scrollbar */}
                    .custom-scrollbar::-webkit-scrollbar {
                      width: 6px;
                    }

                    .custom-scrollbar::-webkit-scrollbar-track {
                      background: transparent;
                    }

                    .custom-scrollbar::-webkit-scrollbar-thumb {
                      background: #ddd;
                      border-radius: 10px;
                    }

                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                      background: #bbb;
                    }

                    /* Ocultar WhatsApp button no modo mapa */
                    #whatsapp-button {
                      display: none !important;
                    }
                  `}</style>
                </div>
              )}

              {/* Paginação - Ocultar no modo mapa */}
              {pagination.totalPages > 1 && viewMode !== "map" && (
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
