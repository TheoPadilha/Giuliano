// src/components/property/PropertyFilters.jsx

import { useState, useEffect } from "react";

const PropertyFilters = ({
  filters,
  onFiltersChange,
  cities = [],
  amenities = [],
  onSearch,
  loading = false,
  className = "",
}) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [priceRange, setPriceRange] = useState({
    min: filters.min_price || "",
    max: filters.max_price || "",
  });

  // Sincronizar com props
  useEffect(() => {
    setLocalFilters(filters);
    setPriceRange({
      min: filters.min_price || "",
      max: filters.max_price || "",
    });
  }, [filters]);

  // Atualizar filtro local
  const handleFilterChange = (key, value) => {
    const updatedFilters = { ...localFilters, [key]: value };
    setLocalFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  // Atualizar range de preços
  const handlePriceChange = (type, value) => {
    const newRange = { ...priceRange, [type]: value };
    setPriceRange(newRange);

    const updatedFilters = {
      ...localFilters,
      min_price: newRange.min,
      max_price: newRange.max,
    };
    setLocalFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  // Toggle amenidade
  const handleAmenityToggle = (amenityId) => {
    const currentAmenities = localFilters.amenities || [];
    const updatedAmenities = currentAmenities.includes(amenityId)
      ? currentAmenities.filter((id) => id !== amenityId)
      : [...currentAmenities, amenityId];

    handleFilterChange("amenities", updatedAmenities);
  };

  // Limpar filtros
  const clearFilters = () => {
    const emptyFilters = {
      search: "",
      city_id: "",
      type: "",
      max_guests: "",
      min_price: "",
      max_price: "",
      bedrooms: "",
      amenities: [],
    };

    setLocalFilters(emptyFilters);
    setPriceRange({ min: "", max: "" });
    onFiltersChange(emptyFilters);
  };

  // Verificar se tem filtros ativos
  const hasActiveFilters = Object.values(localFilters).some((value) => {
    if (Array.isArray(value)) return value.length > 0;
    return value !== "" && value !== null && value !== undefined;
  });

  // Agrupar amenidades por categoria
  const groupedAmenities = amenities.reduce((acc, amenity) => {
    const category = amenity.category || "other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(amenity);
    return acc;
  }, {});

  const getCategoryLabel = (category) => {
    const labels = {
      basic: "Básicas",
      comfort: "Conforto",
      entertainment: "Entretenimento",
      safety: "Segurança",
      other: "Outras",
    };
    return labels[category] || "Outras";
  };

  const getCategoryIcon = (category) => {
    const icons = {
      basic: "🏠",
      comfort: "😌",
      entertainment: "🎉",
      safety: "🛡️",
      other: "⭐",
    };
    return icons[category] || "⭐";
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-lg border border-gray-100 ${className}`}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            🔍 <span className="ml-2">Filtrar Imóveis</span>
          </h2>

          <div className="flex items-center space-x-3">
            {hasActiveFilters && (
              <span className="text-sm text-blue-600 font-medium">
                {
                  Object.values(localFilters).filter((v) =>
                    Array.isArray(v) ? v.length > 0 : v !== "" && v !== null
                  ).length
                }{" "}
                filtros ativos
              </span>
            )}

            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-sm text-gray-600 hover:text-blue-600 transition-colors font-medium"
            >
              {showAdvanced ? "▲ Menos filtros" : "▼ Mais filtros"}
            </button>
          </div>
        </div>

        {/* Filtros Básicos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Busca por texto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🔎 Buscar
            </label>
            <input
              type="text"
              placeholder="Nome, localização..."
              value={localFilters.search || ""}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Cidade */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🏙️ Cidade
            </label>
            <select
              value={localFilters.city_id || ""}
              onChange={(e) => handleFilterChange("city_id", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🏠 Tipo
            </label>
            <select
              value={localFilters.type || ""}
              onChange={(e) => handleFilterChange("type", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              👥 Hóspedes
            </label>
            <select
              value={localFilters.max_guests || ""}
              onChange={(e) => handleFilterChange("max_guests", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">Qualquer quantidade</option>
              <option value="1">1 pessoa</option>
              <option value="2">2 pessoas</option>
              <option value="4">4 pessoas</option>
              <option value="6">6+ pessoas</option>
              <option value="8">8+ pessoas</option>
            </select>
          </div>
        </div>

        {/* Filtros Avançados */}
        {showAdvanced && (
          <div className="border-t border-gray-200 pt-6 space-y-6">
            {/* Range de Preços */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                💰 Faixa de Preço (por noite)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input
                    type="number"
                    placeholder="Preço mínimo"
                    value={priceRange.min}
                    onChange={(e) => handlePriceChange("min", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="Preço máximo"
                    value={priceRange.max}
                    onChange={(e) => handlePriceChange("max", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Quartos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                🛏️ Número de Quartos
              </label>
              <select
                value={localFilters.bedrooms || ""}
                onChange={(e) => handleFilterChange("bedrooms", e.target.value)}
                className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">Qualquer quantidade</option>
                <option value="0">Studio (0 quartos)</option>
                <option value="1">1 quarto</option>
                <option value="2">2 quartos</option>
                <option value="3">3 quartos</option>
                <option value="4">4+ quartos</option>
              </select>
            </div>

            {/* Comodidades */}
            {Object.keys(groupedAmenities).length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  ⭐ Comodidades Desejadas
                </label>

                {Object.entries(groupedAmenities).map(
                  ([category, categoryAmenities]) => (
                    <div key={category} className="mb-4">
                      <h4 className="text-sm font-medium text-gray-600 mb-2 flex items-center">
                        <span className="mr-2">
                          {getCategoryIcon(category)}
                        </span>
                        {getCategoryLabel(category)}
                      </h4>

                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                        {categoryAmenities.map((amenity) => (
                          <label
                            key={amenity.id}
                            className="flex items-center p-2 border border-gray-200 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={(localFilters.amenities || []).includes(
                                amenity.id
                              )}
                              onChange={() => handleAmenityToggle(amenity.id)}
                              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="text-sm text-gray-700">
                              {amenity.name}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        )}

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
          <button
            onClick={onSearch}
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Buscando...
              </span>
            ) : (
              <>🔍 Aplicar Filtros</>
            )}
          </button>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
            >
              🔄 Limpar Tudo
            </button>
          )}
        </div>

        {/* Indicador de Resultados */}
        {hasActiveFilters && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex flex-wrap gap-2">
              {localFilters.search && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                  Busca: "{localFilters.search}"
                </span>
              )}
              {localFilters.city_id && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                  {cities.find((c) => c.id == localFilters.city_id)?.name ||
                    "Cidade"}
                </span>
              )}
              {localFilters.type && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                  {localFilters.type === "apartment" && "🏢 Apartamento"}
                  {localFilters.type === "house" && "🏠 Casa"}
                  {localFilters.type === "studio" && "🏡 Studio"}
                  {localFilters.type === "penthouse" && "🏰 Cobertura"}
                </span>
              )}
              {localFilters.max_guests && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                  👥 {localFilters.max_guests}+ pessoas
                </span>
              )}
              {(localFilters.min_price || localFilters.max_price) && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                  💰 R$ {localFilters.min_price || "0"} - R${" "}
                  {localFilters.max_price || "∞"}
                </span>
              )}
              {localFilters.amenities && localFilters.amenities.length > 0 && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                  ⭐ {localFilters.amenities.length} comodidades
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyFilters;
