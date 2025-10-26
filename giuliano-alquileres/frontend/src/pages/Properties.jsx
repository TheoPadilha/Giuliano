// Properties.jsx - Versão Corrigida e Melhorada
import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../services/api";
import PropertyCard from "../components/property/PropertyCard";
import PropertyFiltersPro from "../components/property/PropertyFiltersPro";
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
      {/* Header com animação */}
      <AirbnbHeader />

      {/* Filtros Sticky - MELHORADO */}
      <div className="sticky top-[80px] z-40 bg-white shadow-sm transition-all duration-300">
        <div className="border-b border-airbnb-grey-200">
          <div className="max-w-[2520px] mx-auto px-5 sm:px-10 lg:px-20 py-4">
            <PropertyFiltersPro
              filters={filters}
              onFiltersChange={handleFiltersChange}
              cities={cities}
              amenities={amenities}
              onSearch={handleSearch}
              loading={loading}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[2520px] mx-auto px-5 sm:px-10 lg:px-20">
        {/* Barra de Resultados e Controles - CORRIGIDA */}
        {!loading && properties.length > 0 && (
          <div className="flex items-center justify-between py-6 border-b border-airbnb-grey-200">
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

            {/* Controles de Visualização */}
            <div className="hidden md:flex items-center gap-2">
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

              {/* Botão Mapa - Para futuro */}
              <button
                onClick={() => setViewMode("map")}
                disabled
                className="p-2.5 rounded-lg bg-white text-airbnb-grey-300 border border-airbnb-grey-200 cursor-not-allowed opacity-50"
                title="Visualização em mapa (em breve)"
              >
                <FaMapMarkedAlt className="text-sm" />
              </button>
            </div>
          </div>
        )}

        {/* Área de Conteúdo - LÓGICA CORRIGIDA */}
        <div className="py-8">
          {loading ? (
            // Loading State
            <div className="flex flex-col justify-center items-center py-32">
              <Loading text="Buscando imóveis..." />
            </div>
          ) : properties.length === 0 ? (
            // Empty State - SÓ MOSTRA QUANDO REALMENTE NÃO TEM IMÓVEIS
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
            // TEM IMÓVEIS - MOSTRAR GRID/LISTA
            <>
              {/* Grid de Propriedades */}
              {viewMode === "grid" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-6 gap-y-10">
                  {properties.map((property, index) => (
                    <PropertyCard
                      key={property.uuid || property.id || `property-${index}`}
                      property={property}
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

              {/* Mapa de Propriedades - Placeholder */}
              {viewMode === "map" && (
                <div className="flex items-center justify-center py-32 bg-airbnb-grey-50 rounded-xlarge">
                  <div className="text-center">
                    <FaMapMarkedAlt className="text-6xl text-airbnb-grey-300 mx-auto mb-4" />
                    <p className="text-airbnb-grey-600 text-lg font-medium">
                      Visualização em mapa em desenvolvimento
                    </p>
                  </div>
                </div>
              )}

              {/* Paginação Minimalista */}
              {pagination.totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-16 pt-8 border-t border-airbnb-grey-200">
                  {/* Info de Página */}
                  <div className="text-sm text-airbnb-grey-600">
                    Mostrando{" "}
                    <span className="font-semibold text-airbnb-black">
                      {(filters.page - 1) * filters.limit + 1}
                    </span>
                    {" - "}
                    <span className="font-semibold text-airbnb-black">
                      {Math.min(filters.page * filters.limit, pagination.total)}
                    </span>
                    {" de "}
                    <span className="font-semibold text-airbnb-black">
                      {pagination.total}
                    </span>
                    {" imóveis"}
                  </div>

                  {/* Controles de Página */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(filters.page - 1)}
                      disabled={!pagination.hasPrevPage}
                      className="px-6 py-2.5 text-sm font-semibold text-airbnb-black bg-white border border-airbnb-grey-300 rounded-lg hover:border-airbnb-black hover:bg-airbnb-grey-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-airbnb-grey-300 disabled:hover:bg-white transition-all"
                    >
                      Anterior
                    </button>

                    {/* Números de Página */}
                    <div className="hidden sm:flex items-center gap-1 px-4">
                      {[...Array(Math.min(5, pagination.totalPages))].map(
                        (_, i) => {
                          let pageNum;
                          if (pagination.totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (filters.page <= 3) {
                            pageNum = i + 1;
                          } else if (
                            filters.page >=
                            pagination.totalPages - 2
                          ) {
                            pageNum = pagination.totalPages - 4 + i;
                          } else {
                            pageNum = filters.page - 2 + i;
                          }

                          return (
                            <button
                              key={i}
                              onClick={() => handlePageChange(pageNum)}
                              className={`w-10 h-10 rounded-lg font-semibold text-sm transition-all ${
                                pageNum === filters.page
                                  ? "bg-airbnb-black text-white"
                                  : "text-airbnb-grey-600 hover:bg-airbnb-grey-50"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        }
                      )}
                    </div>

                    {/* Info mobile */}
                    <div className="sm:hidden px-4 text-sm font-medium text-airbnb-grey-600">
                      {filters.page} / {pagination.totalPages}
                    </div>

                    <button
                      onClick={() => handlePageChange(filters.page + 1)}
                      disabled={!pagination.hasNextPage}
                      className="px-6 py-2.5 text-sm font-semibold text-white bg-airbnb-black rounded-lg hover:bg-rausch disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-airbnb-black transition-all"
                    >
                      Próxima
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Properties;
