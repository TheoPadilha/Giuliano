// Properties.jsx - Versão Corrigida
import { useState, useEffect, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api, { UPLOADS_URL } from "../services/api";
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
  FaStar,
  FaCrown,
} from "react-icons/fa";
import { IoLocationOutline, IoBedOutline } from "react-icons/io5";
import { BsPeople } from "react-icons/bs";
import { MdBathtub } from "react-icons/md";
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
    <div className="min-h-screen bg-white dark:bg-airbnb-grey-900 overflow-x-hidden">
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
      <div className="max-w-[2520px] mx-auto px-3 sm:px-5 lg:px-10 xl:px-20">
        {/* Barra de Resultados e Controles */}
        {!loading && properties.length > 0 && (
          <div className="flex items-center justify-between py-3 sm:py-6 border-b border-airbnb-grey-200 flex-wrap gap-3 sm:gap-4">
            {/* Info de Resultados */}
            <div className="flex items-center gap-4">
              <h2 className="text-xs sm:text-sm text-airbnb-grey-600">
                {pagination.total > 0 ? (
                  <>
                    <span className="font-bold text-airbnb-black text-sm sm:text-base">
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
            <div className="flex items-center gap-2 sm:gap-3">
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
        <div className="py-4 sm:py-6 lg:py-8">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-x-6 sm:gap-y-10">
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
                <div className="space-y-3 sm:space-y-6">
                  {properties.map((property, index) => (
                    <PropertyCard
                      key={property.uuid || property.id || `property-${index}`}
                      property={property}
                      layout="horizontal"
                    />
                  ))}
                </div>
              )}

              {/* Visualização em Mapa - Layout Estilo Airbnb MELHORADO */}
              {viewMode === "map" && (
                <div className="relative">
                  {/* MOBILE: Layout Profissional Redesenhado */}
                  <div className="lg:hidden">
                    {/* Mapa Fixo no Topo - Sempre Visível */}
                    <div className="fixed top-0 left-0 right-0 h-[65vh] z-10">
                      <MapViewLeaflet
                        properties={properties}
                        hoveredPropertyId={hoveredPropertyId}
                        onPropertyHover={setHoveredPropertyId}
                        onPropertyClick={scrollToProperty}
                      />

                      {/* Badge de Contagem - Redesenhado */}
                      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 z-[1000] pointer-events-none">
                        <div className="bg-airbnb-black text-white px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2.5 backdrop-blur-sm">
                          <FaMapMarkedAlt className="text-sm" />
                          <p className="text-sm font-semibold">
                            {properties.filter(p => p.latitude && p.longitude).length} {properties.filter(p => p.latitude && p.longitude).length === 1 ? 'imóvel' : 'imóveis'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Spacer para empurrar o conteúdo para baixo */}
                    <div className="h-[65vh]"></div>

                    {/* Container de Cards - Redesenhado - FULL WIDTH */}
                    <div className="bg-gradient-to-b from-white to-airbnb-grey-50 rounded-t-[28px] shadow-2xl relative z-40 -mt-7 min-h-screen -mx-3">
                      {/* Handle de arraste visual - Mais sutil */}
                      <div className="sticky top-0 left-0 right-0 flex justify-center pt-4 pb-3 bg-white/95 backdrop-blur-md z-50 rounded-t-[28px] border-b border-airbnb-grey-100">
                        <div className="w-10 h-1 bg-airbnb-grey-300 rounded-full"></div>
                      </div>

                      <div className="px-4 pb-24">
                        {/* Header de Resultados - Melhorado */}
                        <div className="mb-5 pt-4">
                          <h2 className="text-2xl font-bold text-airbnb-black mb-1">
                            {properties.length} {properties.length === 1 ? 'imóvel disponível' : 'imóveis disponíveis'}
                          </h2>
                          <p className="text-sm text-airbnb-grey-600">
                            Toque nos pins do mapa para ver a localização
                          </p>
                        </div>

                        {/* Cards Grid - Novo Layout Mobile */}
                        <div className="space-y-4">
                          {properties.map((property, index) => {
                            const propertyId = property.uuid || property.id;
                            const isHovered = hoveredPropertyId === propertyId;
                            const imageUrl = (() => {
                              const images = property.photos || property.images || property.property_images || [];
                              if (images.length > 0) {
                                let image = images.find(img => img.is_main === true);
                                if (!image) {
                                  image = images.reduce((prev, curr) =>
                                    (curr.display_order < prev.display_order) ? curr : prev
                                  );
                                }
                                if (!image) image = images[0];
                                if (image) {
                                  if (image.url && image.url.startsWith("http")) return image.url;
                                  if (image.cloudinary_url) return image.cloudinary_url;
                                  if (image.filename && !image.filename.includes('/')) {
                                    return `${UPLOADS_URL}/properties/${image.filename}`;
                                  }
                                  if (image.image_url) return image.image_url;
                                }
                              }
                              return "https://placehold.co/800x600/e0e0e0/666666?text=Sem+Imagem";
                            })();

                            return (
                              <Link
                                key={propertyId || `property-${index}`}
                                to={`/property/${property.uuid || property.id}`}
                                ref={(el) => (propertyRefs.current[propertyId] = el)}
                                className={`
                                  block bg-white rounded-2xl overflow-hidden
                                  transition-all duration-300 ease-out
                                  ${isHovered
                                    ? 'shadow-2xl ring-2 ring-rausch/40 scale-[1.01]'
                                    : 'shadow-md hover:shadow-xl active:scale-[0.98]'
                                  }
                                `}
                              >
                                {/* Imagem do Card - Proporção Otimizada */}
                                <div className="relative aspect-[16/10] bg-airbnb-grey-100">
                                  <img
                                    src={imageUrl}
                                    alt={property.title || property.name}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                  />

                                  {/* Badge Premium */}
                                  {property.is_featured && (
                                    <div className="absolute top-3 left-3 px-3 py-1.5 bg-white/95 backdrop-blur-sm text-airbnb-black text-xs font-semibold rounded-full shadow-lg flex items-center gap-1.5">
                                      <FaCrown className="text-xs text-yellow-600" />
                                      <span>Destaque</span>
                                    </div>
                                  )}

                                  {/* Rating Badge */}
                                  {property.average_rating > 0 && (
                                    <div className="absolute top-3 right-3 px-2.5 py-1.5 bg-white/95 backdrop-blur-sm rounded-full shadow-lg flex items-center gap-1">
                                      <FaStar className="text-xs text-yellow-500" />
                                      <span className="text-xs font-bold text-airbnb-black">
                                        {property.average_rating.toFixed(1)}
                                      </span>
                                    </div>
                                  )}

                                  {/* Gradient Overlay Bottom */}
                                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                                </div>

                                {/* Conteúdo do Card - Otimizado */}
                                <div className="p-4">
                                  {/* Título e Localização */}
                                  <div className="mb-3">
                                    <h3 className="text-base font-bold text-airbnb-black mb-1 line-clamp-1">
                                      {property.title || property.name || "Propriedade"}
                                    </h3>
                                    <div className="flex items-center gap-1.5 text-airbnb-grey-600">
                                      <IoLocationOutline className="text-base flex-shrink-0" />
                                      <p className="text-sm truncate">
                                        {property.city?.name || property.location || "Localização"}
                                      </p>
                                    </div>
                                  </div>

                                  {/* Características - Grid Compacto */}
                                  <div className="flex items-center gap-4 mb-4 text-airbnb-grey-600">
                                    {property.max_guests && (
                                      <div className="flex items-center gap-1.5">
                                        <BsPeople className="text-base" />
                                        <span className="text-sm font-medium">{property.max_guests}</span>
                                      </div>
                                    )}

                                    {property.bedrooms > 0 && (
                                      <div className="flex items-center gap-1.5">
                                        <IoBedOutline className="text-base" />
                                        <span className="text-sm font-medium">{property.bedrooms}</span>
                                      </div>
                                    )}

                                    {property.bathrooms > 0 && (
                                      <div className="flex items-center gap-1.5">
                                        <MdBathtub className="text-base" />
                                        <span className="text-sm font-medium">{property.bathrooms}</span>
                                      </div>
                                    )}
                                  </div>

                                  {/* Preço e CTA */}
                                  <div className="flex items-end justify-between pt-3 border-t border-airbnb-grey-100">
                                    <div>
                                      <p className="text-xs text-airbnb-grey-500 mb-0.5">A partir de</p>
                                      <p className="text-xl font-bold text-airbnb-black">
                                        {new Intl.NumberFormat("pt-BR", {
                                          style: "currency",
                                          currency: "BRL",
                                          minimumFractionDigits: 0,
                                          maximumFractionDigits: 0,
                                        }).format(property.price_per_night || property.price || 0)}
                                        <span className="text-sm font-normal text-airbnb-grey-600"> /noite</span>
                                      </p>
                                    </div>

                                    {/* Botão CTA */}
                                    <div className="flex items-center gap-2 text-rausch font-semibold text-sm">
                                      <span>Ver</span>
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                      </svg>
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            );
                          })}
                        </div>

                        {/* Espaço final para scroll confortável */}
                        <div className="h-8"></div>
                      </div>

                      {/* Footer integrado - Mobile */}
                      <div className="lg:hidden">
                        <Footer />
                      </div>
                    </div>
                  </div>

                  {/* DESKTOP: Layout Original */}
                  <div className="hidden lg:flex flex-row h-[calc(100vh-240px)] min-h-[600px]">
                    {/* Coluna Esquerda - Cards Scrollable */}
                    <div className="w-[45%] overflow-y-auto px-6 py-6 bg-white custom-scrollbar relative">
                      <div className="max-w-2xl mx-auto space-y-4">
                        {/* Total de Resultados */}
                        <div className="mb-4">
                          <h2 className="text-xl font-semibold text-airbnb-black">
                            {properties.length} {properties.length === 1 ? 'propriedade' : 'propriedades'}
                          </h2>
                          <p className="text-sm text-airbnb-grey-600 mt-1">
                            Passe o mouse sobre os cards para destacar no mapa
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

                        {/* Espaço final */}
                        <div className="h-20"></div>
                      </div>
                    </div>

                    {/* Coluna Direita - Mapa Fixo */}
                    <div className="w-[55%] h-full sticky top-0">
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

      {/* Footer - Apenas Desktop */}
      <div className="hidden lg:block relative z-[100]">
        <Footer />
      </div>
    </div>
  );
};

export default Properties;
