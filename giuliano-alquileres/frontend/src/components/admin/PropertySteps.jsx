// PropertySteps.jsx - Componentes dos Steps do Wizard
import {
  FaMapMarkerAlt,
  FaSearch,
  FaBed,
  FaBath,
  FaUsers,
  FaPlus,
  FaMinus,
  FaStar,
  FaWifi,
  FaParking,
  FaSwimmingPool,
  FaTv,
  FaSnowflake,
  FaShieldAlt,
  FaDumbbell,
  FaCocktail,
  FaDollarSign,
  FaImages,
  FaTrash,
  FaCheckCircle,
  FaMapPin,
  FaEye,
  FaCalendarAlt
} from "react-icons/fa";

// Step 2: Location
export const Step2Location = ({ formData, handleInputChange, cities, handleGeocodeAddress }) => (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-black text-gray-900 mb-2">Localização</h2>
      <p className="text-gray-600">Onde está localizado seu imóvel?</p>
    </div>

    {/* Cidade */}
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2">
        Cidade *
      </label>
      <select
        name="city_id"
        value={formData.city_id}
        onChange={handleInputChange}
        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
      >
        <option value="">Selecione uma cidade</option>
        {cities.map(city => (
          <option key={city.id} value={city.id}>
            {city.name} - {city.state}
          </option>
        ))}
      </select>
    </div>

    {/* Endereço */}
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2">
        Endereço Completo *
      </label>
      <div className="flex gap-3">
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          placeholder="Rua, número e complemento"
          className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
        <button
          type="button"
          onClick={handleGeocodeAddress}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2"
        >
          <FaSearch />
          <span className="hidden md:inline">Buscar no Mapa</span>
        </button>
      </div>
    </div>

    {/* Bairro */}
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2">
        Bairro
      </label>
      <input
        type="text"
        name="neighborhood"
        value={formData.neighborhood}
        onChange={handleInputChange}
        placeholder="Ex: Centro, Praia Brava"
        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
      />
    </div>

    {/* Coordenadas */}
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <FaMapPin className="text-2xl text-blue-600" />
        <div>
          <h3 className="font-bold text-gray-900">Coordenadas GPS</h3>
          <p className="text-sm text-gray-600">Para exibição no mapa (opcional)</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Latitude</label>
          <input
            type="text"
            name="latitude"
            value={formData.latitude}
            onChange={handleInputChange}
            placeholder="-26.9944"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Longitude</label>
          <input
            type="text"
            name="longitude"
            value={formData.longitude}
            onChange={handleInputChange}
            placeholder="-48.6386"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {formData.latitude && formData.longitude && (
        <div className="mt-4 p-4 bg-white rounded-lg border border-blue-200">
          <p className="text-sm text-green-600 font-medium flex items-center gap-2">
            <FaCheckCircle />
            Localização definida com sucesso!
          </p>
        </div>
      )}
    </div>
  </div>
);

// Step 3: Details
export const Step3Details = ({ formData, handleInputChange }) => {
  const increment = (field) => {
    const max = field === 'max_guests' ? 20 : 10;
    handleInputChange({
      target: {
        name: field,
        value: Math.min(formData[field] + 1, max),
        type: 'number'
      }
    });
  };

  const decrement = (field) => {
    const min = field === 'bathrooms' ? 1 : 0;
    handleInputChange({
      target: {
        name: field,
        value: Math.max(formData[field] - 1, min),
        type: 'number'
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Detalhes do Imóvel</h2>
        <p className="text-gray-600">Especificações e capacidade</p>
      </div>

      <div className="grid gap-6">
        {/* Hóspedes */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center">
                <FaUsers className="text-2xl text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Hóspedes</h3>
                <p className="text-sm text-gray-600">Capacidade máxima</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => decrement('max_guests')}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-gray-700 hover:bg-gray-100 transition-all shadow-md hover:shadow-lg"
              >
                <FaMinus />
              </button>
              <div className="w-16 text-center">
                <span className="text-3xl font-black text-gray-900">{formData.max_guests}</span>
              </div>
              <button
                type="button"
                onClick={() => increment('max_guests')}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-gray-700 hover:bg-gray-100 transition-all shadow-md hover:shadow-lg"
              >
                <FaPlus />
              </button>
            </div>
          </div>
        </div>

        {/* Quartos */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-purple-600 rounded-xl flex items-center justify-center">
                <FaBed className="text-2xl text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Quartos</h3>
                <p className="text-sm text-gray-600">Número de quartos</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => decrement('bedrooms')}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-gray-700 hover:bg-gray-100 transition-all shadow-md hover:shadow-lg"
              >
                <FaMinus />
              </button>
              <div className="w-16 text-center">
                <span className="text-3xl font-black text-gray-900">{formData.bedrooms}</span>
              </div>
              <button
                type="button"
                onClick={() => increment('bedrooms')}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-gray-700 hover:bg-gray-100 transition-all shadow-md hover:shadow-lg"
              >
                <FaPlus />
              </button>
            </div>
          </div>
        </div>

        {/* Banheiros */}
        <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl p-6 border border-teal-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-teal-600 rounded-xl flex items-center justify-center">
                <FaBath className="text-2xl text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Banheiros</h3>
                <p className="text-sm text-gray-600">Número de banheiros</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => decrement('bathrooms')}
                disabled={formData.bathrooms <= 1}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-gray-700 hover:bg-gray-100 transition-all shadow-md hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <FaMinus />
              </button>
              <div className="w-16 text-center">
                <span className="text-3xl font-black text-gray-900">{formData.bathrooms}</span>
              </div>
              <button
                type="button"
                onClick={() => increment('bathrooms')}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-gray-700 hover:bg-gray-100 transition-all shadow-md hover:shadow-lg"
              >
                <FaPlus />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <p className="text-sm text-gray-700">
          <strong>Dica:</strong> Informações precisas aumentam a confiança dos hóspedes e reduzem cancelamentos.
        </p>
      </div>
    </div>
  );
};

// Step 4: Amenities
export const Step4Amenities = ({ formData, amenities, handleAmenityToggle }) => {
  const groupedAmenities = {
    basic: amenities.filter(a => a.category === 'basic'),
    comfort: amenities.filter(a => a.category === 'comfort'),
    security: amenities.filter(a => a.category === 'security'),
    entertainment: amenities.filter(a => a.category === 'entertainment'),
  };

  const categoryLabels = {
    basic: { label: 'Essenciais', color: 'blue' },
    comfort: { label: 'Conforto', color: 'purple' },
    security: { label: 'Segurança', color: 'green' },
    entertainment: { label: 'Entretenimento', color: 'pink' }
  };

  const iconMap = {
    wifi: FaWifi,
    parking: FaParking,
    pool: FaSwimmingPool,
    tv: FaTv,
    ac: FaSnowflake,
    security: FaShieldAlt,
    gym: FaDumbbell,
    bar: FaCocktail
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Comodidades</h2>
        <p className="text-gray-600">Selecione tudo que seu imóvel oferece</p>
      </div>

      {Object.entries(groupedAmenities).map(([category, items]) => {
        if (items.length === 0) return null;
        const { label, color } = categoryLabels[category];

        return (
          <div key={category} className="space-y-3">
            <h3 className={`text-lg font-bold text-${color}-600 flex items-center gap-2`}>
              <FaStar className={`text-${color}-500`} />
              {label}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {items.map(amenity => {
                const Icon = iconMap[amenity.icon] || FaStar;
                const isSelected = formData.amenities.includes(amenity.id);

                return (
                  <button
                    key={amenity.id}
                    type="button"
                    onClick={() => handleAmenityToggle(amenity.id)}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                      isSelected
                        ? `border-${color}-600 bg-${color}-50 shadow-lg scale-105`
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                    }`}
                  >
                    <Icon className={`text-2xl mx-auto mb-2 ${isSelected ? `text-${color}-600` : 'text-gray-400'}`} />
                    <p className={`text-sm font-bold ${isSelected ? `text-${color}-600` : 'text-gray-600'}`}>
                      {amenity.name}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      <div className="bg-green-50 border border-green-200 rounded-xl p-4 mt-6">
        <p className="text-sm text-gray-700">
          <strong>✓ {formData.amenities.length} comodidades selecionadas</strong> - Quanto mais amenidades, mais atrativo fica seu anúncio!
        </p>
      </div>
    </div>
  );
};

// Step 5: Pricing
export const Step5Pricing = ({ formData, handleInputChange }) => (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-black text-gray-900 mb-2">Definir Preços</h2>
      <p className="text-gray-600">Configure os valores por temporada</p>
    </div>

    {/* Preço Base */}
    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border-2 border-green-300">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
          <FaDollarSign className="text-2xl text-white" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-lg">Preço por Noite *</h3>
          <p className="text-sm text-gray-600">Valor padrão durante a semana</p>
        </div>
      </div>
      <div className="relative">
        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold text-xl">
          R$
        </span>
        <input
          type="number"
          name="price_per_night"
          value={formData.price_per_night}
          onChange={handleInputChange}
          placeholder="0,00"
          step="0.01"
          min="0"
          className="w-full pl-12 pr-4 py-4 border border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-2xl font-bold"
        />
      </div>
    </div>

    {/* Preço Final de Semana */}
    <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
          <FaCalendarAlt className="text-xl text-white" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">Preço de Final de Semana</h3>
          <p className="text-sm text-gray-600">Sexta, sábado e domingo (opcional)</p>
        </div>
      </div>
      <div className="relative">
        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">
          R$
        </span>
        <input
          type="number"
          name="weekend_price"
          value={formData.weekend_price}
          onChange={handleInputChange}
          placeholder="0,00"
          step="0.01"
          min="0"
          className="w-full pl-12 pr-4 py-3 border border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-bold"
        />
      </div>
    </div>

    {/* Preço Alta Temporada */}
    <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center">
          <FaStar className="text-xl text-white" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">Preço de Alta Temporada</h3>
          <p className="text-sm text-gray-600">Dezembro, janeiro e fevereiro (opcional)</p>
        </div>
      </div>
      <div className="relative">
        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">
          R$
        </span>
        <input
          type="number"
          name="high_season_price"
          value={formData.high_season_price}
          onChange={handleInputChange}
          placeholder="0,00"
          step="0.01"
          min="0"
          className="w-full pl-12 pr-4 py-3 border border-orange-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent font-bold"
        />
      </div>
    </div>

    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
      <p className="text-sm text-gray-700">
        <strong>Dica de precificação:</strong> Pesquise imóveis similares na região. Preços competitivos geram mais reservas!
      </p>
    </div>
  </div>
);

// Step 6: Photos
export const Step6Photos = ({ uploadedPhotos, handlePhotoUpload, setMainPhoto, removePhoto, loading }) => (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-black text-gray-900 mb-2">Fotos do Imóvel</h2>
      <p className="text-gray-600">Adicione fotos de alta qualidade (mínimo 1)</p>
    </div>

    {/* Upload Area */}
    <label className="block">
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handlePhotoUpload}
        className="hidden"
        disabled={loading}
      />
      <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-red-500 hover:bg-red-50 transition-all cursor-pointer">
        <FaImages className="text-6xl text-gray-400 mx-auto mb-4" />
        <p className="font-bold text-gray-900 mb-2">Clique para adicionar fotos</p>
        <p className="text-sm text-gray-600">ou arraste e solte aqui</p>
        <p className="text-xs text-gray-500 mt-2">PNG, JPG até 10MB cada</p>
      </div>
    </label>

    {/* Photos Grid */}
    {uploadedPhotos.length > 0 && (
      <div>
        <h3 className="font-bold text-gray-900 mb-4">{uploadedPhotos.length} foto(s) adicionada(s)</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {uploadedPhotos.map((photo, index) => (
            <div key={photo.id} className="relative group">
              <img
                src={photo.url}
                alt={`Foto ${index + 1}`}
                className="w-full h-48 object-cover rounded-xl"
              />
              {photo.is_main && (
                <div className="absolute top-2 left-2 bg-yellow-400 text-gray-900 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                  <FaStar />
                  Principal
                </div>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-xl flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                {!photo.is_main && (
                  <button
                    type="button"
                    onClick={() => setMainPhoto(photo.id)}
                    className="px-3 py-2 bg-yellow-400 text-gray-900 rounded-lg font-bold text-sm hover:bg-yellow-500"
                  >
                    Tornar Principal
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removePhoto(photo.id)}
                  className="px-3 py-2 bg-red-600 text-white rounded-lg font-bold text-sm hover:bg-red-700"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

// Step 7: Review
export const Step7Review = ({ formData, cities, amenities, uploadedPhotos }) => {
  const selectedCity = cities.find(c => c.id === parseInt(formData.city_id));
  const selectedAmenities = amenities.filter(a => formData.amenities.includes(a.id));
  const propertyType = {
    apartment: "Apartamento",
    house: "Casa",
    penthouse: "Cobertura",
    studio: "Studio"
  }[formData.type];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Revisão Final</h2>
        <p className="text-gray-600">Confira todas as informações antes de publicar</p>
      </div>

      {/* Preview Card */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
        <h3 className="font-bold text-gray-900 text-lg mb-4">Preview do Anúncio</h3>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {uploadedPhotos.length > 0 && (
            <img
              src={uploadedPhotos.find(p => p.is_main)?.url || uploadedPhotos[0].url}
              alt="Preview"
              className="w-full h-64 object-cover"
            />
          )}

          <div className="p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">
                {propertyType}
              </span>
              {formData.is_featured && (
                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <FaStar /> Destaque
                </span>
              )}
            </div>

            <h4 className="text-xl font-bold text-gray-900 mb-2">{formData.title}</h4>

            <p className="text-gray-600 mb-4 line-clamp-2">{formData.description}</p>

            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
              <span className="flex items-center gap-1">
                <FaUsers /> {formData.max_guests} hóspedes
              </span>
              <span className="flex items-center gap-1">
                <FaBed /> {formData.bedrooms} quartos
              </span>
              <span className="flex items-center gap-1">
                <FaBath /> {formData.bathrooms} banheiros
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
              <FaMapMarkerAlt />
              <span>{selectedCity?.name}, {selectedCity?.state}</span>
            </div>

            <div className="border-t pt-4">
              <p className="text-3xl font-black text-gray-900">
                R$ {parseFloat(formData.price_per_night || 0).toFixed(2)}
                <span className="text-sm font-normal text-gray-600"> / noite</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h4 className="font-bold text-gray-900 mb-3">Informações Básicas</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between">
              <span className="text-gray-600">Tipo:</span>
              <span className="font-medium">{propertyType}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="font-medium capitalize">{formData.status}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-600">Destaque:</span>
              <span className="font-medium">{formData.is_featured ? 'Sim' : 'Não'}</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h4 className="font-bold text-gray-900 mb-3">Preços</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between">
              <span className="text-gray-600">Semana:</span>
              <span className="font-medium">R$ {parseFloat(formData.price_per_night || 0).toFixed(2)}</span>
            </li>
            {formData.weekend_price && (
              <li className="flex justify-between">
                <span className="text-gray-600">Fim de semana:</span>
                <span className="font-medium">R$ {parseFloat(formData.weekend_price).toFixed(2)}</span>
              </li>
            )}
            {formData.high_season_price && (
              <li className="flex justify-between">
                <span className="text-gray-600">Alta temporada:</span>
                <span className="font-medium">R$ {parseFloat(formData.high_season_price).toFixed(2)}</span>
              </li>
            )}
          </ul>
        </div>
      </div>

      {selectedAmenities.length > 0 && (
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h4 className="font-bold text-gray-900 mb-3">Comodidades ({selectedAmenities.length})</h4>
          <div className="flex flex-wrap gap-2">
            {selectedAmenities.map(amenity => (
              <span key={amenity.id} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-sm">
                {amenity.name}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
        <p className="text-sm text-green-700 font-medium flex items-center gap-2">
          <FaCheckCircle />
          Tudo pronto! Clique em "Publicar Imóvel" para finalizar.
        </p>
      </div>
    </div>
  );
};
