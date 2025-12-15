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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    <>
      <div className="sticky top-0 z-50 bg-white dark:bg-airbnb-grey-900 border-b border-airbnb-grey-200 dark:border-airbnb-grey-700 py-3 lg:py-4">
        <div className="max-w-[2520px] mx-auto px-3 sm:px-5 lg:px-10 xl:px-20">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {/* MOBILE: Menu Hamburguer + Logo + Filtros */}
            <div className="flex items-center justify-between w-full lg:hidden">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 hover:bg-airbnb-grey-50 rounded-lg transition-colors"
                  aria-label="Menu"
                >
                  <FiMenu className="w-6 h-6 text-airbnb-black" />
                </button>
                <Link to="/" className="text-rausch hover:text-rausch-dark transition-colors">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-7 h-7"
                      viewBox="0 0 32 32"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M16 1c-1.1 0-2 .9-2 2v26c0 1.1.9 2 2 2s2-.9 2-2V3c0-1.1-.9-2-2-2zM7 8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2s2-.9 2-2V10c0-1.1-.9-2-2-2zm18 0c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2s2-.9 2-2V10c0-1.1-.9-2-2-2z" />
                    </svg>
                    <span className="text-base font-bold">Ziguealuga</span>
                  </div>
                </Link>
              </div>

              {/* Botão de Filtros Mobile */}
              <button
                onClick={onFiltersClick}
                className="flex items-center gap-2 px-3 py-2 border border-airbnb-grey-300 rounded-lg hover:bg-airbnb-grey-50 transition-colors"
              >
                <MdTune className="w-5 h-5 text-airbnb-black" />
                <span className="text-sm font-medium text-airbnb-black">Filtros</span>
                {hasActiveFilters() && (
                  <span className="w-2 h-2 bg-rausch rounded-full"></span>
                )}
              </button>
            </div>

            {/* DESKTOP: Logo Normal */}
            <Link
              to="/"
              className="hidden lg:flex flex-shrink-0 text-rausch hover:text-rausch-dark transition-colors"
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
                <span className="text-xl font-bold">Ziguealuga</span>
              </div>
            </Link>
          {/* Expandable Search Bar - Centered - APENAS DESKTOP */}
          <div
            ref={searchBarRef}
            className={`hidden lg:block transition-all duration-200 ease-in-out ${
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

          {/* Filters Button - APENAS DESKTOP */}
          <button
            onClick={onFiltersClick}
            className="hidden lg:flex relative items-center gap-2 px-4 py-3 border border-airbnb-grey-300 dark:border-airbnb-grey-600 rounded-xl hover:border-airbnb-black dark:hover:border-white transition-colors bg-white dark:bg-airbnb-grey-900"
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

          {/* User Menu - APENAS DESKTOP */}
          {isAuthenticated ? (
            <div className="hidden lg:block relative" ref={userMenuRef}>
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
              className="hidden lg:flex items-center gap-2 border border-airbnb-grey-300 dark:border-airbnb-grey-600 hover:shadow-md rounded-full px-4 py-2 transition-all text-sm font-medium text-airbnb-black dark:text-white"
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

    {/* MOBILE: Menu Lateral */}
    {isMobileMenuOpen && (
      <>
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-black/50 z-[60] lg:hidden animate-fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Menu Drawer */}
        <div className="fixed top-0 left-0 bottom-0 w-[280px] bg-white shadow-2xl z-[70] lg:hidden overflow-y-auto animate-slide-in-left">
          {/* Header do Menu */}
          <div className="p-4 border-b border-airbnb-grey-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-airbnb-black">Menu</h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 hover:bg-airbnb-grey-50 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="p-4 space-y-2">
            {isAuthenticated ? (
              <>
                {/* User Info */}
                <div className="pb-4 mb-4 border-b border-airbnb-grey-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-rausch text-white rounded-full flex items-center justify-center font-bold text-lg">
                      {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <div>
                      <p className="font-semibold text-airbnb-black">{user?.name || "Usuário"}</p>
                      <p className="text-sm text-airbnb-grey-600">{user?.email}</p>
                    </div>
                  </div>
                </div>

                <Link
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-3 hover:bg-airbnb-grey-50 rounded-lg transition-colors"
                >
                  <FaHome className="text-lg text-airbnb-grey-600" />
                  <span className="font-medium">Início</span>
                </Link>

                <Link
                  to="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-3 hover:bg-airbnb-grey-50 rounded-lg transition-colors"
                >
                  <FiUser className="text-lg text-airbnb-grey-600" />
                  <span className="font-medium">Meu Perfil</span>
                </Link>

                <Link
                  to="/my-bookings"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-3 hover:bg-airbnb-grey-50 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-airbnb-grey-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span className="font-medium">Minhas Reservas</span>
                </Link>

                <Link
                  to="/favorites"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-3 hover:bg-airbnb-grey-50 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-airbnb-grey-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span className="font-medium">Favoritos</span>
                </Link>

                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 p-3 hover:bg-red-50 text-red-600 rounded-lg transition-colors mt-4"
                >
                  <FiLogOut className="text-lg" />
                  <span className="font-medium">Sair</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-3 hover:bg-airbnb-grey-50 rounded-lg transition-colors"
                >
                  <FaHome className="text-lg text-airbnb-grey-600" />
                  <span className="font-medium">Início</span>
                </Link>

                <Link
                  to="/guest-login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-3 hover:bg-airbnb-grey-50 rounded-lg transition-colors"
                >
                  <FiUser className="text-lg text-airbnb-grey-600" />
                  <span className="font-medium">Entrar</span>
                </Link>

                <Link
                  to="/guest-register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-3 bg-rausch text-white hover:bg-rausch-dark rounded-lg transition-colors mt-4"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  <span className="font-medium">Criar Conta</span>
                </Link>
              </>
            )}
          </nav>
        </div>
      </>
    )}

    {/* Animações CSS */}
    <style>{`
      @keyframes fade-in {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      @keyframes slide-in-left {
        from {
          transform: translateX(-100%);
        }
        to {
          transform: translateX(0);
        }
      }

      .animate-fade-in {
        animation: fade-in 0.2s ease-out;
      }

      .animate-slide-in-left {
        animation: slide-in-left 0.3s ease-out;
      }
    `}</style>
  </>
  );
};

export default ExpandableSearchBar;
