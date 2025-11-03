import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FaSearch, FaHome } from "react-icons/fa";
import { MdTune } from "react-icons/md";
import DateRangePicker from "./DateRangePicker";
import GuestsPickerAirbnb from "./GuestsPickerAirbnb";

const CompactSearchBar = ({ filters, onSearch, onFiltersClick }) => {
  const { t } = useTranslation();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGuestsPicker, setShowGuestsPicker] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  const datePickerRef = useRef(null);
  const guestsPickerRef = useRef(null);

  // Fechar dropdowns ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setShowDatePicker(false);
      }
      if (guestsPickerRef.current && !guestsPickerRef.current.contains(event.target)) {
        setShowGuestsPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Parse date string to local date without timezone issues
  const parseDate = (dateString) => {
    if (!dateString) return null;
    if (typeof dateString === 'object' && dateString instanceof Date) {
      return dateString;
    }
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  const formatDate = (date) => {
    if (!date) return "";
    const d = parseDate(date);
    if (!d) return "";
    return d.toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "short",
    });
  };

  const formatGuestsDisplay = () => {
    const total = (localFilters.guests?.adults || 0) + (localFilters.guests?.children || 0);
    if (total === 0) return t('header.guests');
    return t('guests.summary', { count: total });
  };

  const handleSearch = () => {
    onSearch(localFilters);
  };

  return (
    <div className="sticky top-20 z-40 bg-white dark:bg-airbnb-grey-900 border-b border-airbnb-grey-200 dark:border-airbnb-grey-700 py-4">
      <div className="max-w-[2520px] mx-auto px-5 sm:px-10 lg:px-20">
        <div className="flex items-center gap-3">
          {/* Barra de busca compacta */}
          <div className="flex-1 flex items-center bg-white dark:bg-airbnb-grey-900 border border-airbnb-grey-300 dark:border-airbnb-grey-700 rounded-full shadow-sm hover:shadow-md transition-all">
            {/* Onde */}
            <div className="flex-1 min-w-0 px-6 py-3 border-r border-airbnb-grey-200 dark:border-airbnb-grey-700">
              <div className="flex items-center gap-2">
                <FaHome className="text-airbnb-grey-600 dark:text-airbnb-grey-400 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-airbnb-black dark:text-white">
                    {t('header.where')}
                  </div>
                  <input
                    type="text"
                    value={localFilters.search || ""}
                    onChange={(e) => setLocalFilters({ ...localFilters, search: e.target.value })}
                    placeholder={t('header.wherePlaceholder')}
                    className="w-full bg-transparent text-sm text-airbnb-black dark:text-white placeholder-airbnb-grey-400 focus:outline-none truncate"
                  />
                </div>
              </div>
            </div>

            {/* Check-in */}
            <div
              ref={datePickerRef}
              className="flex-1 min-w-0 px-6 py-3 border-r border-airbnb-grey-200 dark:border-airbnb-grey-700 cursor-pointer relative"
              onClick={() => {
                setShowDatePicker(!showDatePicker);
                setShowGuestsPicker(false);
              }}
            >
              <div className="text-xs font-semibold text-airbnb-black dark:text-white">
                {t('header.checkIn')}
              </div>
              <div className="text-sm text-airbnb-grey-600 dark:text-airbnb-grey-400 truncate">
                {localFilters.checkIn ? formatDate(localFilters.checkIn) : t('header.addDates')}
              </div>

              {/* DatePicker Modal */}
              {showDatePicker && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
                  <div className="relative my-auto" onClick={(e) => e.stopPropagation()}>
                    <DateRangePicker
                      checkIn={localFilters.checkIn}
                      checkOut={localFilters.checkOut}
                      onChange={(newDates) => {
                        setLocalFilters({
                          ...localFilters,
                          checkIn: newDates.checkIn,
                          checkOut: newDates.checkOut
                        });
                      }}
                      onClose={() => setShowDatePicker(false)}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Checkout */}
            <div
              className="flex-1 min-w-0 px-6 py-3 border-r border-airbnb-grey-200 dark:border-airbnb-grey-700 cursor-pointer"
              onClick={() => {
                setShowDatePicker(!showDatePicker);
                setShowGuestsPicker(false);
              }}
            >
              <div className="text-xs font-semibold text-airbnb-black dark:text-white">
                {t('header.checkout')}
              </div>
              <div className="text-sm text-airbnb-grey-600 dark:text-airbnb-grey-400 truncate">
                {localFilters.checkOut ? formatDate(localFilters.checkOut) : t('header.addDates')}
              </div>
            </div>

            {/* Quem */}
            <div
              ref={guestsPickerRef}
              className="flex-1 min-w-0 px-6 py-3 cursor-pointer relative"
              onClick={() => {
                setShowGuestsPicker(!showGuestsPicker);
                setShowDatePicker(false);
              }}
            >
              <div className="text-xs font-semibold text-airbnb-black dark:text-white">
                {t('header.who')}
              </div>
              <div className="text-sm text-airbnb-grey-600 dark:text-airbnb-grey-400 truncate">
                {formatGuestsDisplay()}
              </div>

              {/* Guests Picker */}
              {showGuestsPicker && (
                <GuestsPickerAirbnb
                  guests={localFilters.guests || { adults: 0, children: 0, infants: 0, pets: 0 }}
                  onChange={(newGuests) => setLocalFilters({ ...localFilters, guests: newGuests })}
                  onClose={() => setShowGuestsPicker(false)}
                />
              )}
            </div>

            {/* Botão Buscar */}
            <button
              onClick={handleSearch}
              className="mr-2 bg-rausch hover:bg-rausch-dark text-white rounded-full w-12 h-12 flex items-center justify-center transition-all flex-shrink-0"
              aria-label="Buscar"
            >
              <FaSearch className="text-lg" />
            </button>
          </div>

          {/* Botão Filtros */}
          <button
            onClick={onFiltersClick}
            className="flex items-center gap-2 px-4 py-3 border border-airbnb-grey-300 dark:border-airbnb-grey-700 hover:border-airbnb-black dark:hover:border-white rounded-full transition-all bg-white dark:bg-airbnb-grey-900"
          >
            <MdTune className="text-lg" />
            <span className="hidden sm:inline text-sm font-semibold">{t('properties.filters')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompactSearchBar;
