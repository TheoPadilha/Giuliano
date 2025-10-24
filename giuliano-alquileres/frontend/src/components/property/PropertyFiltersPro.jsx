import { useState } from "react";
import { FaSliders } from "react-icons/fa6";
import { FiX, FiMapPin, FiCalendar, FiHome } from "react-icons/fi";

const PropertyFiltersPro = ({
  filters,
  onFiltersChange,
  cities,
  amenities,
  onSearch,
  loading,
  className = "",
}) => {
  const [showFiltersModal, setShowFiltersModal] = useState(false);

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

  const clearAllFilters = () => {
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
      checkIn: "",
      checkOut: "",
      rooms: [],
      page: 1,
      limit: filters.limit || 12,
    });
    setShowFiltersModal(false);
  };

  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === "page" || key === "limit") return false;
    if (Array.isArray(value)) return value.length > 0;
    return value !== "" && value !== null && value !== undefined;
  }).length;

  const applyFilters = () => {
    onSearch();
    setShowFiltersModal(false);
  };

  // Format date for display
  const formatDateDisplay = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
  };

  // Get selected city name
  const getSelectedCityName = () => {
    if (!filters.city_id) return "Localização";
    const city = cities.find(c => c.id === parseInt(filters.city_id));
    return city ? city.name : "Localização";
  };

  // Get selected type name
  const getSelectedTypeName = () => {
    if (!filters.type) return "Tipo";
    const types = {
      apartment: "Apartamento",
      house: "Casa",
      penthouse: "Cobertura",
      studio: "Studio"
    };
    return types[filters.type] || "Tipo";
  };

  return (
    <>
      {/* Elegant Horizontal Filter Bar */}
      <div className={`flex items-center gap-2 ${className}`}>
        {/* City Filter */}
        <div className="relative group">
          <select
            value={filters.city_id}
            onChange={(e) => handleChange("city_id", e.target.value)}
            className="appearance-none pl-10 pr-8 py-2.5 text-sm font-medium border border-airbnb-grey-300 rounded-full hover:shadow-md focus:outline-none focus:shadow-lg transition-all bg-white text-airbnb-black cursor-pointer min-w-[140px]"
          >
            <option value="">Localização</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
          <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-airbnb-grey-600 pointer-events-none" />
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-airbnb-grey-300"></div>

        {/* Check-in */}
        <div className="relative group">
          <input
            type="date"
            value={filters.checkIn}
            onChange={(e) => handleChange("checkIn", e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            placeholder="Check-in"
            className="pl-10 pr-4 py-2.5 text-sm font-medium border border-airbnb-grey-300 rounded-full hover:shadow-md focus:outline-none focus:shadow-lg transition-all bg-white text-airbnb-black cursor-pointer min-w-[140px] [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-2 [&::-webkit-calendar-picker-indicator]:w-5 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
          />
          <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-airbnb-grey-600 pointer-events-none" />
        </div>

        {/* Check-out */}
        <div className="relative group">
          <input
            type="date"
            value={filters.checkOut}
            onChange={(e) => handleChange("checkOut", e.target.value)}
            min={filters.checkIn || new Date().toISOString().split('T')[0]}
            disabled={!filters.checkIn}
            placeholder="Check-out"
            className="pl-10 pr-4 py-2.5 text-sm font-medium border border-airbnb-grey-300 rounded-full hover:shadow-md focus:outline-none focus:shadow-lg transition-all bg-white text-airbnb-black cursor-pointer disabled:bg-airbnb-grey-100 disabled:cursor-not-allowed disabled:hover:shadow-none min-w-[140px] [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-2 [&::-webkit-calendar-picker-indicator]:w-5 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
          />
          <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-airbnb-grey-600 pointer-events-none" />
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-airbnb-grey-300"></div>

        {/* Type Filter */}
        <div className="relative group">
          <select
            value={filters.type}
            onChange={(e) => handleChange("type", e.target.value)}
            className="appearance-none pl-10 pr-8 py-2.5 text-sm font-medium border border-airbnb-grey-300 rounded-full hover:shadow-md focus:outline-none focus:shadow-lg transition-all bg-white text-airbnb-black cursor-pointer min-w-[140px]"
          >
            <option value="">Tipo</option>
            <option value="apartment">Apartamento</option>
            <option value="house">Casa</option>
            <option value="penthouse">Cobertura</option>
            <option value="studio">Studio</option>
          </select>
          <FiHome className="absolute left-4 top-1/2 -translate-y-1/2 text-airbnb-grey-600 pointer-events-none" />
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-airbnb-grey-300"></div>

        {/* More Filters Button - Enhanced */}
        <button
          onClick={() => setShowFiltersModal(true)}
          className="flex items-center gap-2.5 pl-4 pr-5 py-2.5 text-sm font-medium border border-airbnb-grey-300 rounded-full hover:shadow-md focus:outline-none focus:shadow-lg transition-all bg-white text-airbnb-black group"
        >
          <FaSliders className="text-sm group-hover:rotate-90 transition-transform duration-300" />
          <span>Filtros</span>
          {activeFiltersCount > 0 && (
            <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-gradient-to-r from-rausch to-rausch-dark text-white text-xs font-bold rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </button>

        {/* Clear Filters - Enhanced */}
        {activeFiltersCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="ml-2 text-sm font-medium text-airbnb-grey-600 hover:text-airbnb-black underline decoration-2 underline-offset-4 hover:decoration-rausch transition-all"
          >
            Limpar tudo
          </button>
        )}
      </div>

      {/* Clean Filters Modal - Airbnb Style */}
      {showFiltersModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xlarge shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="border-b border-airbnb-grey-200 px-6 py-5 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-airbnb-black">Filtros</h2>
              <button
                onClick={() => setShowFiltersModal(false)}
                className="p-2 hover:bg-airbnb-grey-100 rounded-full transition-colors"
              >
                <FiX className="text-xl text-airbnb-grey-600" />
              </button>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="flex-1 overflow-y-auto px-6 py-8">
              <div className="space-y-8">
                {/* Price Range */}
                <div className="pb-8 border-b border-airbnb-grey-200">
                  <h3 className="text-lg font-semibold text-airbnb-black mb-6">Faixa de preço</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-airbnb-grey-600 mb-2">Preço mínimo</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-airbnb-grey-500 text-sm">R$</span>
                        <input
                          type="number"
                          placeholder="0"
                          value={filters.min_price}
                          onChange={(e) => handleChange("min_price", e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-airbnb-grey-300 rounded-lg focus:outline-none focus:border-airbnb-black hover:border-airbnb-grey-400 transition-colors"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-airbnb-grey-600 mb-2">Preço máximo</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-airbnb-grey-500 text-sm">R$</span>
                        <input
                          type="number"
                          placeholder="10.000"
                          value={filters.max_price}
                          onChange={(e) => handleChange("max_price", e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-airbnb-grey-300 rounded-lg focus:outline-none focus:border-airbnb-black hover:border-airbnb-grey-400 transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rooms & Bathrooms */}
                <div className="pb-8 border-b border-airbnb-grey-200">
                  <h3 className="text-lg font-semibold text-airbnb-black mb-6">Quartos e banheiros</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-airbnb-grey-600 mb-2">Quartos</label>
                      <select
                        value={filters.bedrooms}
                        onChange={(e) => handleChange("bedrooms", e.target.value)}
                        className="w-full px-4 py-3 border border-airbnb-grey-300 rounded-lg focus:outline-none focus:border-airbnb-black hover:border-airbnb-grey-400 transition-colors bg-white appearance-none cursor-pointer"
                      >
                        <option value="">Qualquer</option>
                        <option value="1">1 quarto</option>
                        <option value="2">2 quartos</option>
                        <option value="3">3 quartos</option>
                        <option value="4">4+ quartos</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-airbnb-grey-600 mb-2">Banheiros</label>
                      <select
                        value={filters.bathrooms}
                        onChange={(e) => handleChange("bathrooms", e.target.value)}
                        className="w-full px-4 py-3 border border-airbnb-grey-300 rounded-lg focus:outline-none focus:border-airbnb-black hover:border-airbnb-grey-400 transition-colors bg-white appearance-none cursor-pointer"
                      >
                        <option value="">Qualquer</option>
                        <option value="1">1 banheiro</option>
                        <option value="2">2 banheiros</option>
                        <option value="3">3+ banheiros</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Guests */}
                <div className="pb-8 border-b border-airbnb-grey-200">
                  <h3 className="text-lg font-semibold text-airbnb-black mb-6">Hóspedes</h3>
                  <input
                    type="number"
                    placeholder="Número de hóspedes"
                    value={filters.max_guests}
                    onChange={(e) => handleChange("max_guests", e.target.value)}
                    className="w-full px-4 py-3 border border-airbnb-grey-300 rounded-lg focus:outline-none focus:border-airbnb-black hover:border-airbnb-grey-400 transition-colors"
                    min="1"
                  />
                </div>

                {/* Amenities */}
                {amenities.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-airbnb-black mb-6">Comodidades</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {amenities.map((amenity) => {
                        const isSelected = filters.amenities?.includes(amenity.id);
                        return (
                          <button
                            key={amenity.id}
                            onClick={() => handleAmenityToggle(amenity.id)}
                            className={`px-4 py-3 text-sm font-medium rounded-lg border transition-all ${
                              isSelected
                                ? "bg-airbnb-grey-100 border-airbnb-black text-airbnb-black"
                                : "bg-white border-airbnb-grey-300 text-airbnb-grey-700 hover:border-airbnb-black"
                            }`}
                          >
                            {amenity.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-airbnb-grey-200 px-6 py-4 flex items-center justify-between bg-white">
              <button
                onClick={clearAllFilters}
                className="text-sm font-semibold text-airbnb-black underline hover:text-airbnb-grey-600 transition-colors"
              >
                Limpar tudo
              </button>
              <button
                onClick={applyFilters}
                disabled={loading}
                className="px-6 py-3 bg-airbnb-black hover:bg-airbnb-grey-1000 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Buscando..." : "Mostrar resultados"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PropertyFiltersPro;
