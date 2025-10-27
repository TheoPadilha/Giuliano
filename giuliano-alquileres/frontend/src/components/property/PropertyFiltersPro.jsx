// PropertyFiltersPro.jsx - Popup Único com Todos os Filtros
import { useState } from "react";
import { FaSearch, FaSlidersH, FaTimes } from "react-icons/fa";

const PropertyFiltersPro = ({
  filters,
  onFiltersChange,
  cities,
  amenities,
  onSearch,
  loading,
  isModal = false,
  onClose,
}) => {
  const [showFilters, setShowFilters] = useState(false);

  // Contar filtros ativos
  const activeFiltersCount = [
    filters.search,
    filters.city_id,
    filters.checkIn,
    filters.checkOut,
    filters.max_guests,
    filters.min_price,
    filters.max_price,
    filters.bedrooms,
    filters.bathrooms,
    filters.type,
    ...(filters.amenities || []),
  ].filter(Boolean).length;

  return (
    <div className="relative">
      {/* Barra de Filtros Compacta - Oculta se for modal */}
      {!isModal && (
        <div className="flex items-center gap-3">
          {/* Localização - Input rápido */}
          <div className="relative flex-1 max-w-xs">
            <input
              type="text"
              placeholder="Para onde?"
              value={filters.search || ""}
              onChange={(e) =>
                onFiltersChange({ ...filters, search: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-airbnb-grey-300 rounded-lg text-sm focus:border-airbnb-black focus:ring-2 focus:ring-airbnb-black/5 outline-none transition-all"
            />
          </div>

          {/* Check-in rápido */}
          <input
            type="date"
            value={filters.checkIn || ""}
            onChange={(e) =>
              onFiltersChange({ ...filters, checkIn: e.target.value })
            }
            className="px-4 py-2.5 border border-airbnb-grey-300 rounded-lg text-sm focus:border-airbnb-black focus:ring-2 focus:ring-airbnb-black/5 outline-none transition-all"
          />

          {/* Check-out rápido */}
          <input
            type="date"
            value={filters.checkOut || ""}
            onChange={(e) =>
              onFiltersChange({ ...filters, checkOut: e.target.value })
            }
            className="px-4 py-2.5 border border-airbnb-grey-300 rounded-lg text-sm focus:border-airbnb-black focus:ring-2 focus:ring-airbnb-black/5 outline-none transition-all"
          />

          {/* Hóspedes rápido */}
          <input
            type="number"
            placeholder="Hóspedes"
            value={filters.max_guests || ""}
            onChange={(e) =>
              onFiltersChange({ ...filters, max_guests: e.target.value })
            }
            className="w-32 px-4 py-2.5 border border-airbnb-grey-300 rounded-lg text-sm focus:border-airbnb-black focus:ring-2 focus:ring-airbnb-black/5 outline-none transition-all"
          />

          {/* Botão Filtros - Abre o popup */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`relative px-4 py-2.5 border rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              showFilters || activeFiltersCount > 0
                ? "border-airbnb-black bg-airbnb-grey-50"
                : "border-airbnb-grey-300 hover:border-airbnb-black"
            }`}
          >
            <FaSlidersH className="text-sm" />
            <span>Filtros</span>
            {activeFiltersCount > 0 && (
              <span className="absolute -top-2 -right-2 w-6 h-6 bg-rausch text-white text-xs font-bold rounded-full flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Botão de Busca */}
          <button
            onClick={onSearch}
            disabled={loading}
            className="px-6 py-2.5 bg-rausch hover:bg-rausch-dark text-white rounded-lg font-semibold transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaSearch className="text-sm" />
            <span>Buscar</span>
          </button>
        </div>
      )}

      {/* POPUP ÚNICO COM TODOS OS FILTROS */}
      {(showFilters || isModal) && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[59]"
            onClick={() => (isModal ? onClose() : setShowFilters(false))}
          />

          {/* Container do Popup */}
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl max-h-[90vh] bg-white rounded-xlarge shadow-2xl border border-airbnb-grey-200 z-[60] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-airbnb-grey-200 bg-white flex items-center justify-between flex-shrink-0">
              <h2 className="text-xl font-semibold text-airbnb-black">
                Filtros
              </h2>
              <button
                onClick={() => (isModal ? onClose() : setShowFilters(false))}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-airbnb-grey-100 transition-colors"
                aria-label="Fechar filtros"
              >
                <FaTimes className="text-lg text-airbnb-grey-600" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-8">
                {/* Seção: Localização e datas */}
                <div>
                  <h3 className="text-lg font-semibold text-airbnb-black mb-4">
                    Localização e datas
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Cidade */}
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-airbnb-grey-600 mb-2">
                        Cidade
                      </label>
                      <select
                        value={filters.city_id || ""}
                        onChange={(e) =>
                          onFiltersChange({
                            ...filters,
                            city_id: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-airbnb-grey-300 rounded-lg text-sm focus:border-airbnb-black focus:ring-2 focus:ring-airbnb-black/5 outline-none transition-all"
                      >
                        <option value="">Todas as cidades</option>
                        {(cities || []).map((city) => (
                          <option key={city.id} value={city.id}>
                            {city.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Check-in */}
                    <div>
                      <label className="block text-sm font-medium text-airbnb-grey-600 mb-2">
                        Check-in
                      </label>
                      <input
                        type="date"
                        value={filters.checkIn || ""}
                        onChange={(e) =>
                          onFiltersChange({
                            ...filters,
                            checkIn: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-airbnb-grey-300 rounded-lg text-sm focus:border-airbnb-black focus:ring-2 focus:ring-airbnb-black/5 outline-none transition-all"
                      />
                    </div>

                    {/* Check-out */}
                    <div>
                      <label className="block text-sm font-medium text-airbnb-grey-600 mb-2">
                        Check-out
                      </label>
                      <input
                        type="date"
                        value={filters.checkOut || ""}
                        onChange={(e) =>
                          onFiltersChange({
                            ...filters,
                            checkOut: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-airbnb-grey-300 rounded-lg text-sm focus:border-airbnb-black focus:ring-2 focus:ring-airbnb-black/5 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Divisor */}
                <div className="border-t border-airbnb-grey-200"></div>

                {/* Seção: Faixa de Preço */}
                <div>
                  <h3 className="text-lg font-semibold text-airbnb-black mb-4">
                    Faixa de preço
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Preço Mínimo */}
                    <div>
                      <label className="block text-sm font-medium text-airbnb-grey-600 mb-2">
                        Preço mínimo
                      </label>
                      <input
                        type="number"
                        placeholder="R$ 0"
                        value={filters.min_price || ""}
                        onChange={(e) =>
                          onFiltersChange({
                            ...filters,
                            min_price: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-airbnb-grey-300 rounded-lg text-sm focus:border-airbnb-black focus:ring-2 focus:ring-airbnb-black/5 outline-none transition-all placeholder:text-airbnb-grey-400"
                      />
                    </div>

                    {/* Preço Máximo */}
                    <div>
                      <label className="block text-sm font-medium text-airbnb-grey-600 mb-2">
                        Preço máximo
                      </label>
                      <input
                        type="number"
                        placeholder="R$ 10.000"
                        value={filters.max_price || ""}
                        onChange={(e) =>
                          onFiltersChange({
                            ...filters,
                            max_price: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-airbnb-grey-300 rounded-lg text-sm focus:border-airbnb-black focus:ring-2 focus:ring-airbnb-black/5 outline-none transition-all placeholder:text-airbnb-grey-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Divisor */}
                <div className="border-t border-airbnb-grey-200"></div>

                {/* Seção: Quartos e Banheiros */}
                <div>
                  <h3 className="text-lg font-semibold text-airbnb-black mb-4">
                    Quartos e banheiros
                  </h3>

                  <div className="space-y-6">
                    {/* Quartos */}
                    <div>
                      <label className="block text-sm font-medium text-airbnb-black mb-3">
                        Quartos
                      </label>
                      <div className="grid grid-cols-5 gap-2">
                        {["Qualquer", "1", "2", "3", "4+"].map((num) => (
                          <button
                            key={`bedroom-${num}`}
                            onClick={() =>
                              onFiltersChange({
                                ...filters,
                                bedrooms:
                                  num === "Qualquer"
                                    ? ""
                                    : num.replace("+", ""),
                              })
                            }
                            className={`py-3 px-4 text-sm font-medium rounded-lg transition-all ${
                              (num === "Qualquer" && !filters.bedrooms) ||
                              filters.bedrooms === num.replace("+", "")
                                ? "bg-airbnb-black text-white"
                                : "bg-white border border-airbnb-grey-300 text-airbnb-grey-600 hover:border-airbnb-black"
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Banheiros */}
                    <div>
                      <label className="block text-sm font-medium text-airbnb-black mb-3">
                        Banheiros
                      </label>
                      <div className="grid grid-cols-5 gap-2">
                        {["Qualquer", "1", "2", "3", "4+"].map((num) => (
                          <button
                            key={`bathroom-${num}`}
                            onClick={() =>
                              onFiltersChange({
                                ...filters,
                                bathrooms:
                                  num === "Qualquer"
                                    ? ""
                                    : num.replace("+", ""),
                              })
                            }
                            className={`py-3 px-4 text-sm font-medium rounded-lg transition-all ${
                              (num === "Qualquer" && !filters.bathrooms) ||
                              filters.bathrooms === num.replace("+", "")
                                ? "bg-airbnb-black text-white"
                                : "bg-white border border-airbnb-grey-300 text-airbnb-grey-600 hover:border-airbnb-black"
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Divisor */}
                <div className="border-t border-airbnb-grey-200"></div>

                {/* Seção: Hóspedes */}
                <div>
                  <h3 className="text-lg font-semibold text-airbnb-black mb-4">
                    Número de hóspedes
                  </h3>

                  <div className="grid grid-cols-4 gap-2">
                    {["1", "2", "4", "6+"].map((num) => (
                      <button
                        key={`guest-${num}`}
                        onClick={() =>
                          onFiltersChange({
                            ...filters,
                            max_guests: num.replace("+", ""),
                          })
                        }
                        className={`py-3 px-4 text-sm font-medium rounded-lg transition-all ${
                          filters.max_guests === num.replace("+", "")
                            ? "bg-airbnb-black text-white"
                            : "bg-white border border-airbnb-grey-300 text-airbnb-grey-600 hover:border-airbnb-black"
                        }`}
                      >
                        {num} {num === "1" ? "hóspede" : "hóspedes"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Divisor */}
                <div className="border-t border-airbnb-grey-200"></div>

                {/* Seção: Tipo de Propriedade */}
                <div>
                  <h3 className="text-lg font-semibold text-airbnb-black mb-4">
                    Tipo de propriedade
                  </h3>

                  <div className="grid grid-cols-3 gap-3">
                    {["Casa", "Apartamento", "Chalé"].map((tipo) => (
                      <button
                        key={`type-${tipo}`}
                        onClick={() =>
                          onFiltersChange({
                            ...filters,
                            type: filters.type === tipo ? "" : tipo,
                          })
                        }
                        className={`py-4 px-4 text-sm font-medium rounded-lg transition-all ${
                          filters.type === tipo
                            ? "bg-airbnb-black text-white"
                            : "bg-white border border-airbnb-grey-300 text-airbnb-grey-600 hover:border-airbnb-black"
                        }`}
                      >
                        {tipo}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Divisor */}
                <div className="border-t border-airbnb-grey-200"></div>

                {/* Seção: Comodidades */}
                {amenities && amenities.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-airbnb-black mb-4">
                      Comodidades
                    </h3>

                    <div className="grid grid-cols-2 gap-3">
                      {amenities.slice(0, 8).map((amenity) => (
                        <label
                          key={amenity.id}
                          className="flex items-center gap-3 p-3 border border-airbnb-grey-300 rounded-lg hover:border-airbnb-black transition-colors cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={(filters.amenities || []).includes(
                              amenity.id.toString()
                            )}
                            onChange={(e) => {
                              const currentAmenities = filters.amenities || [];
                              if (e.target.checked) {
                                onFiltersChange({
                                  ...filters,
                                  amenities: [
                                    ...currentAmenities,
                                    amenity.id.toString(),
                                  ],
                                });
                              } else {
                                onFiltersChange({
                                  ...filters,
                                  amenities: currentAmenities.filter(
                                    (a) => a !== amenity.id.toString()
                                  ),
                                });
                              }
                            }}
                            className="w-5 h-5 rounded border-airbnb-grey-300 text-airbnb-black focus:ring-2 focus:ring-airbnb-black/20"
                          />
                          <span className="text-sm text-airbnb-grey-600">
                            {amenity.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-airbnb-grey-200 bg-white flex items-center justify-between flex-shrink-0">
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
                    checkIn: "",
                    checkOut: "",
                    page: 1,
                    limit: 20,
                  });
                  if (!isModal) setShowFilters(false);
                  else onClose();
                }}
                className="text-sm font-semibold text-airbnb-black underline hover:no-underline transition-all"
              >
                Limpar tudo
              </button>
              <button
                onClick={() => {
                  onSearch();
                  if (!isModal) setShowFilters(false);
                  else onClose();
                }}
                className="px-6 py-2.5 bg-rausch hover:bg-rausch-dark text-white rounded-lg font-semibold transition-colors flex items-center gap-2 shadow-sm"
              >
                <FaSearch className="text-sm" />
                <span>Mostrar imóveis</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PropertyFiltersPro;
