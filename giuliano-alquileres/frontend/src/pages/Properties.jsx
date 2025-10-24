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
      <div className="max-w-[2520px] mx-auto px-6 sm:px-10 lg:px-20 xl:px-20">
        {/* Filtros Minimalistas - Sticky e Compacto */}
        <div className="sticky top-20 z-40 bg-white border-b border-airbnb-grey-200 -mx-6 sm:-mx-10 lg:-mx-20 xl:-mx-20 px-6 sm:px-10 lg:px-20 xl:px-20 py-3">
          <PropertyFiltersPro
            filters={filters}
            onFiltersChange={handleFiltersChange}
            cities={cities}
            amenities={amenities}
            onSearch={handleSearch}
            loading={loading}
          />
        </div>

        {/* Results Container */}
        <div className="pt-8 pb-12">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loading text="Buscando imóveis..." />
            </div>
          ) : properties.length === 0 ? (
            // Empty State - Clean e Minimalista
            <div className="bg-white rounded-xlarge p-12 text-center max-w-2xl mx-auto my-12">
              <div className="w-20 h-20 bg-airbnb-grey-100 rounded-full mx-auto flex items-center justify-center mb-6">
                <FaSearch className="text-3xl text-airbnb-grey-400" />
              </div>

              <h3 className="text-2xl font-semibold text-airbnb-black mb-3">
                Nenhuma estadia encontrada
              </h3>
              <p className="text-airbnb-grey-400 text-base mb-8 max-w-md mx-auto">
                Tente ajustar seus filtros ou datas para ver mais opções disponíveis
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
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
                  className="px-6 py-3 bg-airbnb-black text-white rounded-medium font-semibold hover:bg-airbnb-grey-1000 transition-colors flex items-center gap-2"
                >
                  <FaRedo className="text-sm" />
                  <span>Limpar filtros</span>
                </button>

                <Link
                  to="/"
                  className="px-6 py-3 bg-white border border-airbnb-grey-300 text-airbnb-black rounded-medium font-semibold hover:border-airbnb-black transition-colors"
                >
                  Explorar todos os imóveis
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Grid de Propriedades - Minimalista */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-x-6 gap-y-10 mb-16">
                {properties.map((property, index) => (
                  <PropertyCard
                    key={property.uuid || property.id || `property-${index}`}
                    property={property}
                  />
                ))}
              </div>

              {/* Paginação Minimalista */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-3 pt-6 pb-4">
                  <button
                    onClick={() => handlePageChange(filters.page - 1)}
                    disabled={!pagination.hasPrevPage}
                    className="px-5 py-2.5 text-sm font-medium text-airbnb-black underline hover:bg-airbnb-grey-50 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:no-underline transition-all"
                  >
                    Anterior
                  </button>

                  <span className="text-sm text-airbnb-grey-400 px-4">
                    {filters.page} de {pagination.totalPages}
                  </span>

                  <button
                    onClick={() => handlePageChange(filters.page + 1)}
                    disabled={!pagination.hasNextPage}
                    className="px-5 py-2.5 text-sm font-medium text-airbnb-black underline hover:bg-airbnb-grey-50 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:no-underline transition-all"
                  >
                    Próxima
                  </button>
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
