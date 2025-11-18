// PropertySteps.jsx - Componentes dos Steps do Wizard
import {
  MapPin,
  Search,
  Bed,
  Bath,
  Users,
  Plus,
  Minus,
  Star,
  Wifi,
  Car,
  Waves,
  Tv,
  Snowflake,
  ShieldCheck,
  Dumbbell,
  Martini,
  DollarSign,
  Images,
  Trash2,
  CheckCircle2,
  Calendar,
  Eye,
  Flame,
  UtensilsCrossed,
  WashingMachine,
  Home,
  Accessibility,
  Sun
} from "lucide-react";

// Step 2: Location
export const Step2Location = ({ formData, handleInputChange, cities, handleGeocodeAddress, loading }) => (
  <div className="space-y-8">
    {/* Header Elegante */}
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg mb-4">
        <MapPin className="w-8 h-8 text-white" />
      </div>
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Localização do Imóvel</h2>
      <p className="text-gray-600 text-lg">Adicione o endereço e encontramos as coordenadas automaticamente</p>
    </div>

    {/* Card Principal - Endereço */}
    <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
          <MapPin className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Endereço Completo</h3>
          <p className="text-sm text-gray-500">Preencha os dados de localização do imóvel</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cidade */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Cidade <span className="text-red-500">*</span>
          </label>
          <select
            name="city_id"
            value={formData.city_id}
            onChange={handleInputChange}
            className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 transition-all hover:border-gray-400"
          >
            <option value="">Selecione a cidade</option>
            {cities.map((city, idx) => (
              <option key={city.id || `city-${idx}`} value={city.id}>
                {city.name} - {city.state}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1.5">{cities.length} cidades disponíveis</p>
        </div>

        {/* Bairro */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Bairro <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="neighborhood"
            value={formData.neighborhood}
            onChange={handleInputChange}
            placeholder="Ex: Centro, Praia Brava"
            className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-gray-400"
          />
        </div>
      </div>

      {/* Endereço Completo */}
      <div className="mt-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Endereço Completo <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          placeholder="Ex: Rua das Flores, 123, Apartamento 4B"
          className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-gray-400"
        />
        <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-xs text-blue-700 flex items-start gap-2">
            <span className="font-semibold">💡 Dica:</span>
            <span>Quanto mais completo o endereço, mais precisa será a localização no mapa</span>
          </p>
        </div>
      </div>

      {/* Botão de Busca Automática */}
      <div className="mt-6">
        <button
          type="button"
          onClick={handleGeocodeAddress}
          disabled={loading || !formData.city_id || !formData.address}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-base hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:scale-[1.01] active:scale-[0.99]"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Buscando coordenadas...</span>
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              <span>Buscar Coordenadas Automaticamente</span>
            </>
          )}
        </button>

        {(!formData.city_id || !formData.address) && (
          <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-xs text-amber-800 text-center font-medium">
              Preencha a cidade e o endereço para buscar as coordenadas
            </p>
          </div>
        )}
      </div>
    </div>

    {/* Card de Coordenadas GPS */}
    <div className={`bg-white border rounded-2xl p-8 shadow-sm transition-all ${
      formData.latitude && formData.longitude
        ? 'border-green-300 ring-2 ring-green-100'
        : 'border-gray-200 hover:shadow-md'
    }`}>
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
          formData.latitude && formData.longitude
            ? 'bg-green-100'
            : 'bg-gray-100'
        }`}>
          {formData.latitude && formData.longitude ? (
            <CheckCircle2 className="w-5 h-5 text-green-600" />
          ) : (
            <MapPin className="w-5 h-5 text-gray-500" />
          )}
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            {formData.latitude && formData.longitude ? 'Coordenadas Encontradas' : 'Coordenadas GPS'}
          </h3>
          <p className="text-sm text-gray-500">
            {formData.latitude && formData.longitude
              ? 'Localização do imóvel definida no mapa'
              : 'Preenchimento automático ou manual'
            }
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Latitude
          </label>
          <input
            type="text"
            name="latitude"
            value={formData.latitude}
            onChange={handleInputChange}
            placeholder="-26.9944"
            className={`w-full px-4 py-3.5 border rounded-xl focus:ring-2 focus:ring-blue-500 transition-all ${
              formData.latitude
                ? 'border-green-300 bg-green-50 text-green-900 font-medium'
                : 'border-gray-300 bg-gray-50 hover:border-gray-400'
            }`}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Longitude
          </label>
          <input
            type="text"
            name="longitude"
            value={formData.longitude}
            onChange={handleInputChange}
            placeholder="-48.6386"
            className={`w-full px-4 py-3.5 border rounded-xl focus:ring-2 focus:ring-blue-500 transition-all ${
              formData.longitude
                ? 'border-green-300 bg-green-50 text-green-900 font-medium'
                : 'border-gray-300 bg-gray-50 hover:border-gray-400'
            }`}
          />
        </div>
      </div>

      {formData.latitude && formData.longitude && (
        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
              <span className="text-sm font-semibold text-green-800">
                Localização confirmada no mapa
              </span>
            </div>
            <a
              href={`https://www.google.com/maps?q=${formData.latitude},${formData.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-blue-600 hover:text-blue-700 font-semibold text-sm rounded-lg border border-blue-200 transition-colors"
            >
              <MapPin className="w-4 h-4" />
              Visualizar no Google Maps
            </a>
          </div>
        </div>
      )}

      {!formData.latitude && !formData.longitude && (
        <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-xs text-gray-600 text-center">
            <span className="font-semibold">Opcional:</span> As coordenadas serão preenchidas automaticamente ao buscar o endereço, mas você também pode digitá-las manualmente se preferir.
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
                <Users className="w-7 h-7 text-white" />
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
                <Minus className="w-5 h-5" />
              </button>
              <div className="w-16 text-center">
                <span className="text-3xl font-black text-gray-900">{formData.max_guests}</span>
              </div>
              <button
                type="button"
                onClick={() => increment('max_guests')}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-gray-700 hover:bg-gray-100 transition-all shadow-md hover:shadow-lg"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Quartos */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-purple-600 rounded-xl flex items-center justify-center">
                <Bed className="w-7 h-7 text-white" />
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
                <Minus className="w-5 h-5" />
              </button>
              <div className="w-16 text-center">
                <span className="text-3xl font-black text-gray-900">{formData.bedrooms}</span>
              </div>
              <button
                type="button"
                onClick={() => increment('bedrooms')}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-gray-700 hover:bg-gray-100 transition-all shadow-md hover:shadow-lg"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Banheiros */}
        <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl p-6 border border-teal-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-teal-600 rounded-xl flex items-center justify-center">
                <Bath className="w-7 h-7 text-white" />
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
                <Minus className="w-5 h-5" />
              </button>
              <div className="w-16 text-center">
                <span className="text-3xl font-black text-gray-900">{formData.bathrooms}</span>
              </div>
              <button
                type="button"
                onClick={() => increment('bathrooms')}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-gray-700 hover:bg-gray-100 transition-all shadow-md hover:shadow-lg"
              >
                <Plus className="w-5 h-5" />
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
  // Icon mapping baseado nos nomes do backend
  const ICON_MAP = {
    wifi: Wifi,
    snowflake: Snowflake,
    waves: Waves,
    sun: Sun,
    eye: Sun,
    car: Car,
    flame: Flame,
    "chef-hat": UtensilsCrossed,
    tv: Tv,
    "washing-machine": WashingMachine,
    home: Home,
    shield: ShieldCheck,
    "move-vertical": Accessibility,
  };

  const getIconComponent = (iconName) => {
    return ICON_MAP[iconName] || Star;
  };

  const getCategoryLabel = (category) => {
    const labels = {
      basic: 'Essenciais',
      comfort: 'Conforto',
      security: 'Segurança',
      entertainment: 'Entretenimento'
    };
    return labels[category] || category;
  };

  // Agrupar comodidades por categoria
  const amenitiesByCategory = amenities.reduce((acc, amenity) => {
    const category = amenity.category || 'other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(amenity);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-airbnb-black mb-2">Comodidades</h2>
        <p className="text-airbnb-grey-600">Selecione tudo que seu imóvel oferece</p>
      </div>

      {/* Counter Badge */}
      {formData.amenities.length > 0 && (
        <div className="flex items-center gap-2 px-4 py-2 bg-rausch/10 rounded-full border border-rausch/20 w-fit">
          <CheckCircle2 className="w-5 h-5 text-rausch" />
          <span className="text-sm font-semibold text-rausch">
            {formData.amenities.length} selecionada{formData.amenities.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      {/* Amenities by Category */}
      <div className="space-y-8">
        {Object.keys(amenitiesByCategory).sort().map((category) => (
          <div key={category} className="space-y-4">
            {/* Category Header with Dividers */}
            <div className="flex items-center gap-2">
              <div className="h-px flex-grow bg-airbnb-grey-200"></div>
              <h4 className="text-sm font-semibold text-airbnb-grey-700 uppercase tracking-wide px-3">
                {getCategoryLabel(category)}
              </h4>
              <div className="h-px flex-grow bg-airbnb-grey-200"></div>
            </div>

            {/* Amenities Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {amenitiesByCategory[category].map((amenity, idx) => {
                const isSelected = formData.amenities.includes(amenity.id);
                const IconComponent = getIconComponent(amenity.icon);

                return (
                  <label
                    key={amenity.id || `amenity-${category}-${idx}`}
                    className={`
                      group relative flex items-center gap-3 p-4
                      border-2 rounded-xl cursor-pointer
                      transition-all duration-200 ease-in-out
                      ${isSelected
                        ? "border-rausch bg-rausch/5 shadow-sm ring-2 ring-rausch/20"
                        : "border-airbnb-grey-200 hover:border-airbnb-grey-400 hover:shadow-sm"
                      }
                    `}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleAmenityToggle(amenity.id)}
                      className="h-5 w-5 rounded border-2 text-rausch focus:ring-2 focus:ring-rausch focus:ring-offset-2 cursor-pointer transition-all checked:bg-rausch checked:border-rausch"
                    />
                    <IconComponent
                      className={`w-5 h-5 flex-shrink-0 ${
                        isSelected ? "text-rausch" : "text-airbnb-grey-400"
                      }`}
                    />
                    <span className={`text-sm font-medium flex-1 ${
                      isSelected ? "text-rausch" : "text-airbnb-grey-700 group-hover:text-airbnb-black"
                    }`}>
                      {amenity.name}
                    </span>
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-rausch rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-3 h-3 text-white" strokeWidth={3} />
                      </div>
                    )}
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Info Banner */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 mt-6">
        <p className="text-sm text-gray-700 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-600" />
          <span>
            <strong>{formData.amenities.length} comodidades selecionadas</strong> - Quanto mais amenidades, mais atrativo fica seu anúncio!
          </span>
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
      <p className="text-gray-600">Configure os valores por temporada e dia da semana</p>
    </div>

    {/* Info explicativa */}
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
      <p className="text-sm text-gray-700">
        <strong>Como funciona:</strong> O sistema aplicará automaticamente o preço correto baseado na data da reserva.
        Se não definir preços especiais, o valor padrão (preço base) será usado.
      </p>
    </div>

    {/* Preço Base */}
    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border-2 border-green-300">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
          <DollarSign className="w-7 h-7 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-lg">Preço Base (por noite) *</h3>
          <p className="text-sm text-gray-600">Segunda a quinta-feira (dias normais)</p>
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
      <p className="text-xs text-gray-600 mt-2">Este é o preço obrigatório, usado como padrão quando não há preço especial</p>
    </div>

    {/* Preço Final de Semana */}
    <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
          <Calendar className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">Preço de Final de Semana</h3>
          <p className="text-sm text-gray-600">Sexta-feira, sábado e domingo (obrigatório)</p>
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
      <p className="text-xs text-gray-600 mt-2">Digite o preço para sexta, sábado e domingo</p>
    </div>

    {/* Preço Alta Temporada */}
    <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center">
          <Star className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">Preço de Alta Temporada</h3>
          <p className="text-sm text-gray-600">Dezembro, janeiro e fevereiro - verão (obrigatório)</p>
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
      <p className="text-xs text-gray-600 mt-2">Digite o preço para dezembro, janeiro e fevereiro</p>
    </div>

    {/* Hierarquia de preços */}
    <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
      <h4 className="font-bold text-gray-900 mb-2 text-sm">Ordem de aplicação dos preços:</h4>
      <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
        <li><strong>Alta Temporada</strong> (se a data for dez/jan/fev e estiver definido)</li>
        <li><strong>Final de Semana</strong> (se for sex/sáb/dom e estiver definido)</li>
        <li><strong>Preço Base</strong> (usado quando não há preço especial)</li>
      </ol>
    </div>

    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
      <p className="text-sm text-gray-700">
        <strong>Dica de precificação:</strong> Pesquise imóveis similares na região. Preços competitivos geram mais reservas!
        Geralmente, finais de semana são 20-30% mais caros e alta temporada 50-100% mais cara.
      </p>
    </div>
  </div>
);

// Step 6: Photos
export const Step6Photos = ({ uploadedPhotos, handlePhotoUpload, setMainPhoto, removePhoto, loading }) => (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-black text-gray-900 mb-2">Fotos do Imóvel</h2>
      <p className="text-gray-600">Adicione fotos de alta qualidade (mínimo 1, máximo 20)</p>
    </div>

    {/* Info sobre upload */}
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
      <p className="text-sm text-gray-700">
        <strong>Dica:</strong> As fotos são fundamentais! Imóveis com fotos de qualidade recebem até 3x mais reservas.
        Use fotos bem iluminadas, de diferentes ângulos e detalhes.
      </p>
    </div>

    {/* Upload Area */}
    <label className="block">
      <input
        type="file"
        multiple
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handlePhotoUpload}
        className="hidden"
        disabled={loading || uploadedPhotos.length >= 20}
      />
      <div className={`border-2 border-dashed rounded-2xl p-8 md:p-12 text-center transition-all ${
        loading || uploadedPhotos.length >= 20
          ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-50'
          : 'border-gray-300 hover:border-rausch hover:bg-red-50 cursor-pointer'
      }`}>
        {loading ? (
          <>
            <div className="w-16 h-16 border-4 border-rausch border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="font-bold text-gray-900 mb-2">Processando fotos...</p>
          </>
        ) : uploadedPhotos.length >= 20 ? (
          <>
            <Images className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="font-bold text-gray-900 mb-2">Limite máximo atingido</p>
            <p className="text-sm text-gray-600">Você já adicionou 20 fotos (máximo permitido)</p>
          </>
        ) : (
          <>
            <Images className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="font-bold text-gray-900 mb-2">Clique para adicionar fotos</p>
            <p className="text-sm text-gray-600">ou arraste e solte aqui</p>
            <p className="text-xs text-gray-500 mt-2">JPG, PNG ou WEBP - máximo 5MB cada</p>
            {uploadedPhotos.length > 0 && (
              <p className="text-xs text-rausch font-bold mt-2">
                {uploadedPhotos.length}/20 fotos adicionadas
              </p>
            )}
          </>
        )}
      </div>
    </label>

    {/* Photos Grid */}
    {uploadedPhotos.length > 0 && (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">
            {uploadedPhotos.length} foto(s) adicionada(s)
          </h3>
          <span className="text-sm text-gray-600">
            {uploadedPhotos.filter(p => p.is_main).length > 0 ? '✓ Foto principal definida' : '⚠️ Defina uma foto principal'}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {uploadedPhotos.map((photo, index) => (
            <div key={photo.id || `photo-${index}`} className="relative group bg-gray-100 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all">
              <img
                src={photo.url}
                alt={`Foto ${index + 1}`}
                className="w-full h-48 object-cover"
                loading="lazy"
              />
              {/* Badge Principal */}
              {photo.is_main && (
                <div className="absolute top-2 left-2 bg-yellow-400 text-gray-900 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-lg">
                  <Star className="w-3 h-3 fill-yellow-600" />
                  Principal
                </div>
              )}
              {/* Info tamanho */}
              <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
                {photo.size} MB
              </div>
              {/* Hover overlay com botões */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-end p-4 gap-2">
                <p className="text-white text-xs font-medium text-center line-clamp-1 mb-2">
                  {photo.original_name}
                </p>
                <div className="flex gap-2 w-full">
                  {!photo.is_main && (
                    <button
                      type="button"
                      onClick={() => setMainPhoto(photo.id)}
                      className="flex-1 px-3 py-2 bg-yellow-400 text-gray-900 rounded-lg font-bold text-sm hover:bg-yellow-500 transition-all flex items-center justify-center gap-1"
                    >
                      <Star className="w-3 h-3" />
                      Principal
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removePhoto(photo.id)}
                    className="px-3 py-2 bg-red-600 text-white rounded-lg font-bold text-sm hover:bg-red-700 transition-all flex items-center justify-center"
                    title="Remover foto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Aviso se não tiver fotos */}
    {uploadedPhotos.length === 0 && (
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <p className="text-sm text-yellow-800 font-medium">
          ⚠️ Você ainda não adicionou nenhuma foto. Adicione pelo menos 1 foto para continuar.
        </p>
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
                  <Star className="w-3 h-3" /> Destaque
                </span>
              )}
            </div>

            <h4 className="text-xl font-bold text-gray-900 mb-2">{formData.title}</h4>

            <p className="text-gray-600 mb-4 line-clamp-2">{formData.description}</p>

            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" /> {formData.max_guests} hóspedes
              </span>
              <span className="flex items-center gap-1">
                <Bed className="w-4 h-4" /> {formData.bedrooms} quartos
              </span>
              <span className="flex items-center gap-1">
                <Bath className="w-4 h-4" /> {formData.bathrooms} banheiros
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
              <MapPin className="w-4 h-4" />
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
            {selectedAmenities.map((amenity, idx) => (
              <span key={amenity.id || `review-amenity-${idx}`} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-sm">
                {amenity.name}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
        <p className="text-sm text-green-700 font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          Tudo pronto! Clique em "Publicar Imóvel" para finalizar.
        </p>
      </div>
    </div>
  );
};
