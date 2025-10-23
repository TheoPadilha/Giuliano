import { useState } from "react";
import {
  FaSearch, FaMapMarkerAlt, FaHome, FaUsers, FaDollarSign,
  FaBed, FaBath, FaStar, FaFilter, FaTimes, FaChevronDown,
  FaChevronUp, FaCheck, FaCalendarAlt
} from "react-icons/fa";
import RoomsGuestsPicker from "../search/RoomsGuestsPicker";

const PropertyFiltersPro = ({
  filters,
  onFiltersChange,
  cities,
  amenities,
  onSearch,
  loading,
  className = "",
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    price: false,
    rooms: false,
    amenities: false,
  });
  const [showRoomsPicker, setShowRoomsPicker] = useState(false);

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
  };

  // Calcular total de hóspedes e quartos
  const roomsData = filters.rooms || [];
  const totalGuests = roomsData.reduce((sum, room) => {
    return sum + room.adults + (room.children?.length || 0);
  }, 0);
  const totalRooms = roomsData.length;

  // Formatar texto de quartos e hóspedes
  const getRoomsGuestsText = () => {
    if (totalRooms === 0) return "Selecionar";
    return `${totalRooms} ${totalRooms === 1 ? 'quarto' : 'quartos'}, ${totalGuests} ${totalGuests === 1 ? 'hóspede' : 'hóspedes'}`;
  };

  // Formatar datas
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === "page" || key === "limit") return false;
    if (Array.isArray(value)) return value.length > 0;
    return value !== "" && value !== null && value !== undefined;
  }).length;

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className={`bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-white">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <FaFilter className="text-white text-lg" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Filtros de Busca</h2>
              {activeFiltersCount > 0 && (
                <p className="text-xs text-white/80">
                  {activeFiltersCount} {activeFiltersCount === 1 ? "filtro ativo" : "filtros ativos"}
                </p>
              )}
            </div>
          </div>

          {activeFiltersCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-sm font-semibold rounded-lg transition-all"
            >
              <FaTimes />
              <span>Limpar Tudo</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Filters */}
      <div className="p-6">
        {/* Quick Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="text"
              placeholder="Buscar por nome, cidade, bairro..."
              value={filters.search}
              onChange={(e) => handleChange("search", e.target.value)}
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all text-gray-900 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Primary Filters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {/* Check-in */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <FaCalendarAlt className="text-primary-600" />
              <span>Check-in</span>
            </label>
            <input
              type="date"
              value={filters.checkIn}
              onChange={(e) => handleChange("checkIn", e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all bg-white text-gray-900 font-medium cursor-pointer"
            />
          </div>

          {/* Check-out */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <FaCalendarAlt className="text-primary-600" />
              <span>Check-out</span>
            </label>
            <input
              type="date"
              value={filters.checkOut}
              onChange={(e) => handleChange("checkOut", e.target.value)}
              min={filters.checkIn || new Date().toISOString().split('T')[0]}
              disabled={!filters.checkIn}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all bg-white text-gray-900 font-medium cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          {/* Quartos e Hóspedes */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <FaUsers className="text-primary-600" />
              <span>Quartos e Hóspedes</span>
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowRoomsPicker(!showRoomsPicker)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all bg-white text-gray-900 font-medium cursor-pointer text-left flex items-center justify-between hover:border-primary-500"
              >
                <span className={totalRooms === 0 ? "text-gray-500" : ""}>
                  {getRoomsGuestsText()}
                </span>
                <FaChevronDown className={`transition-transform ${showRoomsPicker ? 'rotate-180' : ''}`} />
              </button>

              {/* Rooms Guests Picker */}
              {showRoomsPicker && (
                <RoomsGuestsPicker
                  rooms={roomsData}
                  onChange={(newRooms) => {
                    handleChange("rooms", newRooms);
                    // Atualizar max_guests baseado no total de hóspedes
                    const newTotalGuests = newRooms.reduce((sum, room) => {
                      return sum + room.adults + (room.children?.length || 0);
                    }, 0);
                    handleChange("max_guests", newTotalGuests > 0 ? String(newTotalGuests) : "");
                  }}
                  onClose={() => setShowRoomsPicker(false)}
                />
              )}
            </div>
          </div>
        </div>

        {/* Secondary Filters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {/* City */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <FaMapMarkerAlt className="text-primary-600" />
              <span>Cidade</span>
            </label>
            <select
              value={filters.city_id}
              onChange={(e) => handleChange("city_id", e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all appearance-none bg-white text-gray-900 font-medium cursor-pointer"
            >
              <option value="">Todas as cidades</option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}, {city.state}
                </option>
              ))}
            </select>
          </div>

          {/* Property Type */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <FaHome className="text-primary-600" />
              <span>Tipo de Imóvel</span>
            </label>
            <select
              value={filters.type}
              onChange={(e) => handleChange("type", e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all appearance-none bg-white text-gray-900 font-medium cursor-pointer"
            >
              <option value="">Todos os tipos</option>
              <option value="apartment">Apartamento</option>
              <option value="house">Casa</option>
              <option value="penthouse">Cobertura</option>
              <option value="studio">Studio</option>
            </select>
          </div>

          {/* Featured */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <FaStar className="text-primary-600" />
              <span>Destaque</span>
            </label>
            <select
              value={filters.featured}
              onChange={(e) => handleChange("featured", e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all appearance-none bg-white text-gray-900 font-medium cursor-pointer"
            >
              <option value="">Todos</option>
              <option value="true">Apenas em destaque</option>
            </select>
          </div>
        </div>

        {/* Advanced Filters Toggle */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold rounded-xl transition-all border-2 border-gray-200 mb-6"
        >
          <FaFilter />
          <span>{showAdvanced ? "Ocultar" : "Mostrar"} Filtros Avançados</span>
          {showAdvanced ? <FaChevronUp /> : <FaChevronDown />}
        </button>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="space-y-6 mb-6 p-6 bg-gray-50 rounded-xl border-2 border-gray-200">
            {/* Price Range */}
            <div>
              <button
                onClick={() => toggleSection('price')}
                className="w-full flex items-center justify-between mb-3"
              >
                <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                  <FaDollarSign className="text-green-600" />
                  <span>Faixa de Preço (por noite)</span>
                </div>
                {expandedSections.price ? <FaChevronUp /> : <FaChevronDown />}
              </button>

              {expandedSections.price && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-2">
                      Mínimo
                    </label>
                    <input
                      type="number"
                      placeholder="R$ 0"
                      value={filters.min_price}
                      onChange={(e) => handleChange("min_price", e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-2">
                      Máximo
                    </label>
                    <input
                      type="number"
                      placeholder="R$ 10.000"
                      value={filters.max_price}
                      onChange={(e) => handleChange("max_price", e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Rooms & Bathrooms */}
            <div>
              <button
                onClick={() => toggleSection('rooms')}
                className="w-full flex items-center justify-between mb-3"
              >
                <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                  <FaBed className="text-blue-600" />
                  <span>Quartos e Banheiros</span>
                </div>
                {expandedSections.rooms ? <FaChevronUp /> : <FaChevronDown />}
              </button>

              {expandedSections.rooms && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-2">
                      Quartos
                    </label>
                    <select
                      value={filters.bedrooms}
                      onChange={(e) => handleChange("bedrooms", e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all appearance-none bg-white"
                    >
                      <option value="">Qualquer</option>
                      <option value="1">1 quarto</option>
                      <option value="2">2 quartos</option>
                      <option value="3">3 quartos</option>
                      <option value="4">4 ou mais</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-2">
                      Banheiros
                    </label>
                    <select
                      value={filters.bathrooms}
                      onChange={(e) => handleChange("bathrooms", e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all appearance-none bg-white"
                    >
                      <option value="">Qualquer</option>
                      <option value="1">1 banheiro</option>
                      <option value="2">2 banheiros</option>
                      <option value="3">3 ou mais</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Amenities */}
            {amenities.length > 0 && (
              <div>
                <button
                  onClick={() => toggleSection('amenities')}
                  className="w-full flex items-center justify-between mb-3"
                >
                  <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                    <FaCheck className="text-purple-600" />
                    <span>Comodidades</span>
                    {filters.amenities?.length > 0 && (
                      <span className="ml-2 px-2 py-1 bg-primary-600 text-white text-xs font-bold rounded-full">
                        {filters.amenities.length}
                      </span>
                    )}
                  </div>
                  {expandedSections.amenities ? <FaChevronUp /> : <FaChevronDown />}
                </button>

                {expandedSections.amenities && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {amenities.map((amenity) => {
                      const isSelected = filters.amenities?.includes(amenity.id);
                      return (
                        <button
                          key={amenity.id}
                          onClick={() => handleAmenityToggle(amenity.id)}
                          className={`px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 border-2 ${
                            isSelected
                              ? "bg-primary-600 text-white border-primary-600 shadow-md"
                              : "bg-white text-gray-700 border-gray-300 hover:border-primary-500"
                          }`}
                        >
                          <div className="flex items-center justify-center gap-2">
                            {isSelected && <FaCheck className="text-xs" />}
                            <span>{amenity.name}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <button
            onClick={onSearch}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
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
                <span>Buscando Imóveis...</span>
              </>
            ) : (
              <>
                <FaSearch />
                <span>Buscar Imóveis</span>
              </>
            )}
          </button>

          {activeFiltersCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all duration-200 flex items-center gap-2 border-2 border-gray-300"
            >
              <FaTimes />
              <span>Limpar</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyFiltersPro;
