import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaHome } from "react-icons/fa";
import { MdTune } from "react-icons/md";
import { FiMenu, FiUser, FiLogOut, FiSettings } from "react-icons/fi";
import DateRangePicker from "./DateRangePicker";
import GuestsPickerAirbnb from "./GuestsPickerAirbnb";
import { useAuth } from "../../contexts/AuthContext";

const ExpandableSearchBar = ({ filters, onSearch, onFiltersClick }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGuestsPicker, setShowGuestsPicker] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const [localFilters, setLocalFilters] = useState(filters);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const searchBarRef = useRef(null);
  const datePickerRef = useRef(null);
  const guestsPickerRef = useRef(null);
  const userMenuRef = useRef(null);

  // Sync with parent filters
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Click outside handler - improved
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if clicked outside search bar
      const clickedOutsideSearchBar =
        searchBarRef.current && !searchBarRef.current.contains(event.target);

      // Check if clicked outside date picker
      const clickedOutsideDatePicker =
        !datePickerRef.current || !datePickerRef.current.contains(event.target);

      // Check if clicked outside guests picker
      const clickedOutsideGuestsPicker =
        !guestsPickerRef.current || !guestsPickerRef.current.contains(event.target);

      // Check if clicked outside user menu
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }

      // If clicked outside search bar, close everything
      if (clickedOutsideSearchBar) {
        // Close date picker if open and clicked outside
        if (showDatePicker && clickedOutsideDatePicker) {
          setShowDatePicker(false);
        }

        // Close guests picker if open and clicked outside
        if (showGuestsPicker && clickedOutsideGuestsPicker) {
          setShowGuestsPicker(false);
        }

        // If no dropdowns are open, collapse the search bar
        if (
          (!showDatePicker || clickedOutsideDatePicker) &&
          (!showGuestsPicker || clickedOutsideGuestsPicker)
        ) {
          setIsExpanded(false);
          setActiveField(null);
        }
      }
    };

    // Always add listener when expanded or dropdowns are open
    if (isExpanded || showDatePicker || showGuestsPicker || isUserMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isExpanded, showDatePicker, showGuestsPicker, isUserMenuOpen]);

  // Parse date string to local date without timezone issues
  const parseDate = (dateString) => {
    if (!dateString) return null;
    // Handle both YYYY-MM-DD and Date objects
    if (typeof dateString === 'object' && dateString instanceof Date) {
      return dateString;
    }
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  // Format date for compact display
  const formatCompactDate = (date) => {
    if (!date) return null;
    const d = parseDate(date);
    if (!d) return null;
    const day = d.getDate();
    const monthNames =
      i18n.language === "pt-BR"
        ? [
            "jan.",
            "fev.",
            "mar.",
            "abr.",
            "mai.",
            "jun.",
            "jul.",
            "ago.",
            "set.",
            "out.",
            "nov.",
            "dez.",
          ]
        : [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ];
    return `${day} ${monthNames[d.getMonth()]}`;
  };

  // Format guests for compact display
  const formatGuestsCompact = (guests) => {
    if (!guests) return t("search.guests");
    const total = (guests.adults || 0) + (guests.children || 0);
    if (total === 0) return t("search.guests");
    return total === 1 ? "1 hóspede" : `${total} hóspedes`;
  };

  // Get compact date range display
  const getCompactDateDisplay = () => {
    if (localFilters.checkIn && localFilters.checkOut) {
      return `${formatCompactDate(localFilters.checkIn)} – ${formatCompactDate(
        localFilters.checkOut
      )}`;
    }
    return i18n.language === "pt-BR"
      ? "Insira as datas"
      : "Add dates";
  };

  // Handle field click
  const handleFieldClick = (field) => {
    setIsExpanded(true);
    setActiveField(field);

    if (field === "dates") {
      setShowDatePicker(true);
      setShowGuestsPicker(false);
    } else if (field === "guests") {
      setShowGuestsPicker(true);
      setShowDatePicker(false);
    } else {
      setShowDatePicker(false);
      setShowGuestsPicker(false);
    }
  };

  // Handle search
  const handleSearch = () => {
    onSearch(localFilters);
    setIsExpanded(false);
    setShowDatePicker(false);
    setShowGuestsPicker(false);
    setActiveField(null);
  };

  // Handle date change
  const handleDateChange = ({ checkIn, checkOut }) => {
    setLocalFilters({ ...localFilters, checkIn, checkOut });
  };

  // Handle guests change
  const handleGuestsChange = (guests) => {
    setLocalFilters({ ...localFilters, guests });
  };

  // Check if any filters are active
  const hasActiveFilters = () => {
    // Check basic filters
    if (localFilters.city_id || localFilters.type || localFilters.featured) {
      return true;
    }

    // Check price range
    if (localFilters.min_price || localFilters.max_price) {
      return true;
    }

    // Check bedrooms/bathrooms
    if (localFilters.bedrooms || localFilters.bathrooms) {
      return true;
    }

    // Check amenities
    if (localFilters.amenities && localFilters.amenities.length > 0) {
      return true;
    }

    // Check max_guests (separate from guests picker)
    if (localFilters.max_guests) {
      return true;
    }

    return false;
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate("/");
  };

  return (
    <div className="sticky top-0 z-50 bg-white dark:bg-airbnb-grey-900 border-b border-airbnb-grey-200 dark:border-airbnb-grey-700 py-4">
      <div className="max-w-[2520px] mx-auto px-5 sm:px-10 lg:px-20">
        <div className="flex items-center justify-between gap-4">
          {/* Logo/Site Name - Left */}
          <Link
            to="/"
            className="flex-shrink-0 text-rausch hover:text-rausch-dark transition-colors"
          >
            <div className="flex items-center gap-2">
              <svg
                className="w-8 h-8"
                viewBox="0 0 32 32"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M16 1c-1.1 0-2 .9-2 2v26c0 1.1.9 2 2 2s2-.9 2-2V3c0-1.1-.9-2-2-2zM7 8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2s2-.9 2-2V10c0-1.1-.9-2-2-2zm18 0c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2s2-.9 2-2V10c0-1.1-.9-2-2-2z" />
              </svg>
              <span className="hidden md:block text-xl font-bold">
                Ziguealuga
              </span>
            </div>
          </Link>
          {/* Expandable Search Bar - Centered */}
          <div
            ref={searchBarRef}
            className={`transition-all duration-200 ease-in-out ${
              isExpanded
                ? "flex-1 max-w-[850px] mx-auto"
                : "flex-1 max-w-[700px] mx-auto"
            }`}
          >
            {!isExpanded ? (
              // COMPACT STATE
              <div className="bg-white dark:bg-airbnb-grey-900 border border-airbnb-grey-300 dark:border-airbnb-grey-600 rounded-full shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center h-14 px-4">
                  {/* Location */}
                  <button
                    onClick={() => handleFieldClick("location")}
                    className="flex items-center gap-3 flex-1 min-w-0 pr-4 hover:bg-airbnb-grey-50 dark:hover:bg-airbnb-grey-800 rounded-full py-2 px-3 transition-colors"
                  >
                    <FaHome className="text-lg text-airbnb-grey-600 dark:text-airbnb-grey-400 flex-shrink-0" />
                    <span className="text-sm font-medium text-airbnb-black dark:text-white truncate">
                      {localFilters.search || t("search.accommodationsNearby")}
                    </span>
                  </button>

                  <div className="w-px h-6 bg-airbnb-grey-200 dark:bg-airbnb-grey-700" />

                  {/* Dates */}
                  <button
                    onClick={() => handleFieldClick("dates")}
                    className="flex-1 min-w-0 px-4 hover:bg-airbnb-grey-50 dark:hover:bg-airbnb-grey-800 rounded-full py-2 transition-colors"
                  >
                    <span className="text-sm font-medium text-airbnb-black dark:text-white truncate block">
                      {getCompactDateDisplay()}
                    </span>
                  </button>

                  <div className="w-px h-6 bg-airbnb-grey-200 dark:bg-airbnb-grey-700" />

                  {/* Guests */}
                  <button
                    onClick={() => handleFieldClick("guests")}
                    className="flex-1 min-w-0 px-4 hover:bg-airbnb-grey-50 dark:hover:bg-airbnb-grey-800 rounded-full py-2 transition-colors"
                  >
                    <span className="text-sm font-medium text-airbnb-grey-600 dark:text-airbnb-grey-400 truncate block">
                      {formatGuestsCompact(localFilters.guests)}
                    </span>
                  </button>

                  {/* Search Button */}
                  <button
                    onClick={handleSearch}
                    className="ml-2 w-8 h-8 bg-rausch hover:bg-rausch-dark text-white rounded-full flex items-center justify-center transition-colors flex-shrink-0"
                  >
                    <FaSearch className="text-xs" />
                  </button>
                </div>
              </div>
            ) : (
              // EXPANDED STATE
              <div className="bg-white dark:bg-airbnb-grey-900 border border-airbnb-grey-300 dark:border-airbnb-grey-600 rounded-3xl shadow-lg">
                <div className="flex items-stretch">
                  {/* Onde */}
                  <div
                    className={`flex-1 px-6 py-3 cursor-pointer hover:bg-airbnb-grey-50 dark:hover:bg-airbnb-grey-800 rounded-l-3xl transition-colors ${
                      activeField === "location"
                        ? "bg-airbnb-grey-100 dark:bg-airbnb-grey-800"
                        : ""
                    }`}
                    onClick={() => handleFieldClick("location")}
                  >
                    <label className="text-xs font-semibold text-airbnb-black dark:text-white block mb-1">
                      {t("search.where")}
                    </label>
                    <input
                      type="text"
                      placeholder={t("search.searchDestinations")}
                      value={localFilters.search || ""}
                      onChange={(e) =>
                        setLocalFilters({
                          ...localFilters,
                          search: e.target.value,
                        })
                      }
                      className="w-full text-sm bg-transparent border-none outline-none text-airbnb-grey-600 dark:text-airbnb-grey-400 placeholder-airbnb-grey-400 dark:placeholder-airbnb-grey-500"
                    />
                  </div>

                  <div className="w-px bg-airbnb-grey-200 dark:bg-airbnb-grey-700 my-3" />

                  {/* Check-in */}
                  <div
                    className={`flex-1 px-6 py-3 cursor-pointer hover:bg-airbnb-grey-50 dark:hover:bg-airbnb-grey-800 transition-colors ${
                      activeField === "dates"
                        ? "bg-airbnb-grey-100 dark:bg-airbnb-grey-800"
                        : ""
                    }`}
                    onClick={() => handleFieldClick("dates")}
                  >
                    <label className="text-xs font-semibold text-airbnb-black dark:text-white block mb-1">
                      {t("search.checkIn")}
                    </label>
                    <div className="text-sm text-airbnb-grey-600 dark:text-airbnb-grey-400">
                      {localFilters.checkIn
                        ? formatCompactDate(localFilters.checkIn)
                        : t("search.addDates")}
                    </div>
                  </div>

                  <div className="w-px bg-airbnb-grey-200 dark:bg-airbnb-grey-700 my-3" />

                  {/* Checkout */}
                  <div
                    className={`flex-1 px-6 py-3 cursor-pointer hover:bg-airbnb-grey-50 dark:hover:bg-airbnb-grey-800 transition-colors ${
                      activeField === "dates"
                        ? "bg-airbnb-grey-100 dark:bg-airbnb-grey-800"
                        : ""
                    }`}
                    onClick={() => handleFieldClick("dates")}
                  >
                    <label className="text-xs font-semibold text-airbnb-black dark:text-white block mb-1">
                      {t("search.checkOut")}
                    </label>
                    <div className="text-sm text-airbnb-grey-600 dark:text-airbnb-grey-400">
                      {localFilters.checkOut
                        ? formatCompactDate(localFilters.checkOut)
                        : t("search.addDates")}
                    </div>
                  </div>

                  <div className="w-px bg-airbnb-grey-200 dark:bg-airbnb-grey-700 my-3" />

                  {/* Quem */}
                  <div className="flex items-center pr-2">
                    <div
                      className={`flex-1 px-6 py-3 cursor-pointer hover:bg-airbnb-grey-50 dark:hover:bg-airbnb-grey-800 transition-colors min-w-[180px] ${
                        activeField === "guests"
                          ? "bg-airbnb-grey-100 dark:bg-airbnb-grey-800"
                          : ""
                      }`}
                      onClick={() => handleFieldClick("guests")}
                    >
                      <label className="text-xs font-semibold text-airbnb-black dark:text-white block mb-1">
                        {t("search.who")}
                      </label>
                      <div className="text-sm text-airbnb-grey-600 dark:text-airbnb-grey-400">
                        {formatGuestsCompact(localFilters.guests)}
                      </div>
                    </div>

                    {/* Search Button */}
                    <button
                      onClick={handleSearch}
                      className="ml-2 mr-2 px-6 py-3 bg-rausch hover:bg-rausch-dark text-white rounded-full flex items-center gap-2 transition-colors font-semibold text-sm"
                    >
                      <FaSearch />
                      <span className="hidden md:inline">{t("common.search")}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Filters Button */}
          <button
            onClick={onFiltersClick}
            className="relative flex items-center gap-2 px-4 py-3 border border-airbnb-grey-300 dark:border-airbnb-grey-600 rounded-xl hover:border-airbnb-black dark:hover:border-white transition-colors bg-white dark:bg-airbnb-grey-900"
          >
            <MdTune className="text-lg text-airbnb-black dark:text-white" />
            <span className="text-sm font-medium text-airbnb-black dark:text-white hidden md:inline">
              {t("common.filters")}
            </span>
            {/* Active Filters Badge */}
            {hasActiveFilters() && (
              <span
                className="absolute"
                style={{
                  top: '4px',
                  right: '8px',
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#FF385C',
                  borderRadius: '50%'
                }}
              />
            )}
          </button>

          {/* User Menu */}
          {isAuthenticated ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 border border-airbnb-grey-300 dark:border-airbnb-grey-600 hover:shadow-md rounded-full pl-3 pr-2 py-2 transition-all"
              >
                <FiMenu className="text-lg text-airbnb-black dark:text-white" />
                <div className="bg-airbnb-grey-500 rounded-full w-7 h-7 flex items-center justify-center text-white font-semibold text-sm">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
              </button>

              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-airbnb-grey-800 rounded-xl shadow-lg border border-airbnb-grey-200 dark:border-airbnb-grey-700 py-2 overflow-hidden z-[60]">
                  <div className="px-4 py-3 border-b border-airbnb-grey-200 dark:border-airbnb-grey-700">
                    <p className="text-sm font-semibold text-airbnb-black dark:text-white truncate">
                      {user?.name}
                    </p>
                    <p className="text-xs text-airbnb-grey-400 truncate mt-0.5">
                      {user?.email}
                    </p>
                  </div>

                  <Link
                    to="/my-bookings"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-airbnb-black dark:text-white hover:bg-airbnb-grey-50 dark:hover:bg-airbnb-grey-700 transition-colors text-sm"
                  >
                    <FiUser className="text-lg" />
                    <span>{t('header.myBookings')}</span>
                  </Link>

                  <Link
                    to="/favorites"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-airbnb-black dark:text-white hover:bg-airbnb-grey-50 dark:hover:bg-airbnb-grey-700 transition-colors text-sm"
                  >
                    <span className="text-lg">♥</span>
                    <span>{t('header.favorites')}</span>
                  </Link>

                  <div className="border-t border-airbnb-grey-200 dark:border-airbnb-grey-700 my-2"></div>

                  <Link
                    to="/profile"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-airbnb-black dark:text-white hover:bg-airbnb-grey-50 dark:hover:bg-airbnb-grey-700 transition-colors text-sm"
                  >
                    <FiUser className="text-lg" />
                    <span>{t('header.profile')}</span>
                  </Link>

                  {(user?.role === "admin" || user?.role === "admin_master") && (
                    <>
                      <div className="border-t border-airbnb-grey-200 dark:border-airbnb-grey-700 my-2"></div>
                      <Link
                        to="/admin"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-airbnb-black dark:text-white hover:bg-airbnb-grey-50 dark:hover:bg-airbnb-grey-700 transition-colors text-sm"
                      >
                        <FiSettings className="text-lg" />
                        <span>{t('header.adminPanel')}</span>
                      </Link>
                    </>
                  )}

                  <div className="border-t border-airbnb-grey-200 dark:border-airbnb-grey-700 my-2"></div>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 text-airbnb-black dark:text-white hover:bg-airbnb-grey-50 dark:hover:bg-airbnb-grey-700 transition-colors text-sm w-full text-left"
                  >
                    <FiLogOut className="text-lg" />
                    <span>{t('header.logout')}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 border border-airbnb-grey-300 dark:border-airbnb-grey-600 hover:shadow-md rounded-full px-4 py-2 transition-all text-sm font-medium text-airbnb-black dark:text-white"
            >
              <FiUser className="text-lg" />
              <span className="hidden md:inline">{t('header.login')}</span>
            </Link>
          )}
        </div>

        {/* Date Picker Modal */}
        {showDatePicker && (
          <div className="fixed inset-0 z-60 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div ref={datePickerRef} onClick={(e) => e.stopPropagation()}>
              <DateRangePicker
                checkIn={localFilters.checkIn}
                checkOut={localFilters.checkOut}
                onChange={handleDateChange}
                onClose={() => setShowDatePicker(false)}
                compact={true}
              />
            </div>
          </div>
        )}

        {/* Guests Picker Dropdown */}
        {showGuestsPicker && (
          <div className="relative">
            <div
              ref={guestsPickerRef}
              className="absolute top-2 right-0 z-60"
              style={{ marginRight: "80px" }}
            >
              <GuestsPickerAirbnb
                guests={localFilters.guests || { adults: 0, children: 0, infants: 0, pets: 0 }}
                onChange={handleGuestsChange}
                onClose={() => setShowGuestsPicker(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpandableSearchBar;
