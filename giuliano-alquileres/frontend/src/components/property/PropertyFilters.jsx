// giuliano-alquileres/frontend/src/components/property/PropertyFilters.jsx

import { useState } from "react";

const PropertyFilters = ({
  filters,
  onFiltersChange,
  cities,
  amenities,
  onSearch,
  loading,
  className = "",
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleChange = (field, value) => {
    onFiltersChange({ ...filters, [field]: value, page: 1 });
  };

  const handleAmenityToggle = (amenityId) => {
    const currentAmenities = filters.amenities || [];
    const newAmenities = currentAmenities.includes(amenityId)
      ? currentAmenities.filter((id) => id !== amenityId)
      : [...currentAmenities, amenityId];

    handleChange("amenities", newAmenities);
  };

  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === "page" || key === "limit") return false;
    if (Array.isArray(value)) return value.length > 0;
    return value !== "" && value !== null && value !== undefined;
  }).length;

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border border-gray-100 ${className}`}
    >
      {/* Header */}
      <div className="px-8 py-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <span className="text-xl">🔍</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Filtrar Imóveis
              </h2>
              {activeFiltersCount > 0 && (
                <p className="text-sm text-gray-600">
                  {activeFiltersCount}{" "}
                  {activeFiltersCount === 1 ? "filtro ativo" : "filtros ativos"}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-red-600 hover:text-red-700 font-semibold text-sm flex items-center gap-2 transition-colors"
          >
            <span>{showAdvanced ? "▼" : "▶"}</span>
            <span>Mais filtros</span>
          </button>
        </div>
      </div>

      {/* Filtros Principais */}
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Buscar */}
          <div className="lg:col-span-1">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              🔎 Buscar
            </label>
            <input
              type="text"
              placeholder="Nome, localização..."
              value={filters.search}
              onChange={(e) => handleChange("search", e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Cidade */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              🏙️ Cidade
            </label>
            <select
              value={filters.city_id}
              onChange={(e) => handleChange("city_id", e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all appearance-none bg-white"
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
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              🏠 Tipo
            </label>
            <select
              value={filters.type}
              onChange={(e) => handleChange("type", e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all appearance-none bg-white"
            >
              <option value="">Todos os tipos</option>
              <option value="apartment">Apartamento</option>
              <option value="house">Casa</option>
              <option value="penthouse">Cobertura</option>
              <option value="studio">Studio</option>
            </select>
          </div>

          {/* Hóspedes */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              👥 Hóspedes
            </label>
            <select
              value={filters.max_guests}
              onChange={(e) => handleChange("max_guests", e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all appearance-none bg-white"
            >
              <option value="">Qualquer quantidade</option>
              <option value="1">1 pessoa</option>
              <option value="2">2 pessoas</option>
              <option value="4">4 pessoas</option>
              <option value="6">6 pessoas</option>
              <option value="8">8+ pessoas</option>
            </select>
          </div>
        </div>

        {/* Filtros Avançados */}
        {showAdvanced && (
          <div className="mt-8 pt-8 border-t border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {/* Preço Mínimo */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  💰 Preço Mínimo
                </label>
                <input
                  type="number"
                  placeholder="R$ 0"
                  value={filters.min_price}
                  onChange={(e) => handleChange("min_price", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Preço Máximo */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  💵 Preço Máximo
                </label>
                <input
                  type="number"
                  placeholder="R$ 10.000"
                  value={filters.max_price}
                  onChange={(e) => handleChange("max_price", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Quartos */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  🛏️ Quartos
                </label>
                <select
                  value={filters.bedrooms}
                  onChange={(e) => handleChange("bedrooms", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all appearance-none bg-white"
                >
                  <option value="">Qualquer</option>
                  <option value="1">1 quarto</option>
                  <option value="2">2 quartos</option>
                  <option value="3">3 quartos</option>
                  <option value="4">4+ quartos</option>
                </select>
              </div>

              {/* Banheiros */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  🚿 Banheiros
                </label>
                <select
                  value={filters.bathrooms}
                  onChange={(e) => handleChange("bathrooms", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all appearance-none bg-white"
                >
                  <option value="">Qualquer</option>
                  <option value="1">1 banheiro</option>
                  <option value="2">2 banheiros</option>
                  <option value="3">3+ banheiros</option>
                </select>
              </div>
            </div>

            {/* Comodidades */}
            {amenities.length > 0 && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                  ✨ Comodidades
                </label>
                <div className="flex flex-wrap gap-3">
                  {amenities.map((amenity) => (
                    <button
                      key={amenity.id}
                      onClick={() => handleAmenityToggle(amenity.id)}
                      className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                        filters.amenities?.includes(amenity.id)
                          ? "bg-red-600 text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {amenity.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Botões de Ação */}
        <div className="flex items-center gap-4 mt-8 pt-8 border-t border-gray-100">
          <button
            onClick={onSearch}
            disabled={loading}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Buscando...</span>
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <span>🔍</span>
                <span>Aplicar Filtros</span>
              </span>
            )}
          </button>

          {activeFiltersCount > 0 && (
            <button
              onClick={() => {
                onFiltersChange({
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
                  limit: filters.limit || 12,
                });
              }}
              className="px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-200"
            >
              Limpar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyFilters;
