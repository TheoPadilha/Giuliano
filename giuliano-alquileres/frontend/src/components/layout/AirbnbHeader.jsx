// AirbnbHeader - Header com busca completa estilo Airbnb + Animação de Scroll
import { useState, useEffect, useRef } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";

import { FaSearch } from "react-icons/fa";
import { FiMenu, FiUser, FiLogOut, FiSettings } from "react-icons/fi"; // FiGlobe removido
import LanguageSwitch from "../common/LanguageSwitch"; // <-- Adicionado from "react-icons/fi";
import ThemeToggle from "../common/ThemeToggle";
import { useAuth } from "../../contexts/AuthContext";
import CompactDatePicker from "../search/CompactDatePicker";
// import RoomsGuestsPicker from "../search/RoomsGuestsPicker";
import GuestsPicker from "../search/GuestsPicker";

const AirbnbHeader = ({ onFilterButtonClick }) => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const isPropertiesPage = location.pathname === "/properties";

  // Estado para controlar o scroll
  const [isScrolled, setIsScrolled] = useState(false);

  // Estados da busca
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  // const [rooms, setRooms] = useState([{ adults: 2, children: [] }]);

  const [guests, setGuests] = useState({
    adults: 2,
    children: 0,
    infants: 0,
    pets: 0,
  });

  // Estados dos dropdowns
  const [showCheckInPicker, setShowCheckInPicker] = useState(false);
  const [showCheckOutPicker, setShowCheckOutPicker] = useState(false);
  // const [showRoomsPicker, setShowRoomsPicker] = useState(false);
  const [showGuestsPicker, setShowGuestsPicker] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Refs para fechar dropdowns ao clicar fora
  const checkInRef = useRef(null);
  const checkOutRef = useRef(null);
  // const roomsRef = useRef(null);
  const guestsRef = useRef(null);
  const userMenuRef = useRef(null);

  // useEffect para detectar o scroll da página
  useEffect(() => {
    const handleScroll = () => {
      // Muda o estado quando o scroll passar de 50px
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    // Adiciona o event listener
    window.addEventListener("scroll", handleScroll);

    // Cleanup - remove o event listener quando o componente for desmontado
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (checkInRef.current && !checkInRef.current.contains(event.target)) {
        setShowCheckInPicker(false);
      }
      if (checkOutRef.current && !checkOutRef.current.contains(event.target)) {
        setShowCheckOutPicker(false);
      }
      // if (roomsRef.current && !roomsRef.current.contains(event.target)) {
      //   setShowRoomsPicker(false);
      // }
      if (guestsRef.current && !guestsRef.current.contains(event.target)) {
        setShowGuestsPicker(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // const handleSearch = () => {
  //   const params = new URLSearchParams();

  //   if (destination) params.append("city", destination);
  //   if (checkIn) params.append("checkIn", checkIn);
  //   if (checkOut) params.append("checkOut", checkOut);

  //   const totalGuests = rooms.reduce((total, room) => {
  //     return total + room.adults + room.children.length;
  //   }, 0);

  //   params.append("guests", totalGuests);
  //   params.append("rooms", rooms.length);
  //   params.append("roomsData", JSON.stringify(rooms));

  //   navigate(`/properties?${params.toString()}`);
  // };

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (destination) params.append("city", destination);
    if (checkIn) params.append("checkIn", checkIn);
    if (checkOut) params.append("checkOut", checkOut);

    const totalGuests = guests.adults + guests.children;
    params.append("guests", totalGuests);

    // Passar dados completos dos hóspedes
    params.append("guestsData", JSON.stringify(guests));

    navigate(`/properties?${params.toString()}`);
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate("/");
  };

  // const formatRoomsGuests = () => {
  //   const totalGuests = rooms.reduce((total, room) => {
  //     return total + room.adults + room.children.length;
  //   }, 0);

  //   const roomsText = rooms.length === 1 ? "quarto" : "quartos";
  //   const guestsText = totalGuests === 1 ? "hóspede" : "hóspedes";

  //   return `${rooms.length} ${roomsText}, ${totalGuests} ${guestsText}`;
  // };

  const formatGuestsDisplay = () => {
    const totalGuests = guests.adults + guests.children;
    const parts = [];

    if (totalGuests > 0) {
      parts.push(
        `${totalGuests} ${totalGuests === 1 ? "hóspede" : "hóspedes"}`
      );
    }

    if (guests.infants > 0) {
      parts.push(
        `${guests.infants} ${guests.infants === 1 ? "bebê" : "bebês"}`
      );
    }

    if (guests.pets > 0) {
      parts.push(`${guests.pets} ${guests.pets === 1 ? "animal" : "animais"}`);
    }

    return parts.length > 0 ? parts.join(", ") : "Adicionar hóspedes";
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
    });
  };

  return (
    <header
      className={`sticky top-0 z-50 bg-white border-b border-airbnb-grey-200 shadow-sm transition-all duration-300 ease-in-out ${
        isScrolled ? "py-2" : "py-3"
      }`}
    >
      <div className="max-w-[2520px] mx-auto px-5 sm:px-10 lg:px-20">
        <div
          className={`flex items-center justify-between transition-all duration-300 ease-in-out ${
            isScrolled ? "h-16" : "h-20"
          }`}
        >
          {/* Logo - Esquerda */}
          <Link to="/" className="flex items-center flex-shrink-0 gap-2">
            <div className="flex items-center gap-2">
              <div
                className={`bg-gradient-to-br from-rausch to-rausch-dark rounded-xlarge flex items-center justify-center shadow-md transition-all duration-300 ease-in-out ${
                  isScrolled ? "w-9 h-9" : "w-10 h-10"
                }`}
              >
                <span
                  className={`text-white font-bold transition-all duration-300 ease-in-out ${
                    isScrolled ? "text-lg" : "text-xl"
                  }`}
                >
                  Z
                </span>
              </div>
              <span
                className={`hidden lg:block font-bold text-rausch transition-all duration-300 ease-in-out ${
                  isScrolled ? "text-lg" : "text-xl"
                }`}
              >
                Ziguealuga
              </span>
            </div>
          </Link>

          {/* Barra de Busca Completa - Centro */}
          <div className="hidden md:flex flex-1 max-w-[850px] mx-auto">
            <div
              className={`flex items-center w-full bg-white border border-airbnb-grey-200 rounded-full shadow-sm hover:shadow-md transition-all duration-300 ease-in-out ${
                isScrolled ? "scale-95" : "scale-100"
              }`}
            >
              {/* Destino */}
              <div
                className={`flex-1 min-w-0 pr-4 border-r border-airbnb-grey-200 transition-all duration-300 ease-in-out ${
                  isScrolled ? "pl-5 py-2" : "pl-6 py-2.5"
                }`}
              >
                <label
                  className={`block font-semibold text-airbnb-black mb-0.5 transition-all duration-300 ease-in-out ${
                    isScrolled ? "text-[10px]" : "text-xs"
                  }`}
                >
                  Localização
                </label>
                <input
                  type="text"
                  placeholder="Para onde?"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className={`w-full bg-transparent text-airbnb-black placeholder-airbnb-grey-400 focus:outline-none transition-all duration-300 ease-in-out ${
                    isScrolled ? "text-xs" : "text-sm"
                  }`}
                />
              </div>

              {/* Check-in */}
              <div
                className={`flex-1 min-w-0 px-4 border-r border-airbnb-grey-200 relative transition-all duration-300 ease-in-out ${
                  isScrolled ? "py-2" : "py-2.5"
                }`}
                ref={checkInRef}
              >
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    setShowCheckInPicker(!showCheckInPicker);
                    setShowCheckOutPicker(false);
                    setShowGuestsPicker(false);
                  }}
                >
                  <label
                    className={`block font-semibold text-airbnb-black mb-0.5 transition-all duration-300 ease-in-out ${
                      isScrolled ? "text-[10px]" : "text-xs"
                    }`}
                  >
                    Check-in
                  </label>
                  <div
                    className={`text-airbnb-black transition-all duration-300 ease-in-out ${
                      isScrolled ? "text-xs" : "text-sm"
                    }`}
                  >
                    {checkIn ? (
                      formatDate(checkIn)
                    ) : (
                      <span className="text-airbnb-grey-400">
                        Insira as datas
                      </span>
                    )}
                  </div>
                </div>

                {showCheckInPicker && (
                  <CompactDatePicker
                    selectedDate={checkIn}
                    onDateChange={(date) => {
                      setCheckIn(date);
                      if (date && !checkOut) {
                        setShowCheckInPicker(false);
                        setShowCheckOutPicker(true);
                      }
                    }}
                    minDate={new Date()}
                    onClose={() => setShowCheckInPicker(false)}
                  />
                )}
              </div>

              {/* Check-out */}
              <div
                className={`flex-1 min-w-0 px-4 border-r border-airbnb-grey-200 relative transition-all duration-300 ease-in-out ${
                  isScrolled ? "py-2" : "py-2.5"
                }`}
                ref={checkOutRef}
              >
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    setShowCheckOutPicker(!showCheckOutPicker);
                    setShowCheckInPicker(false);
                    setShowGuestsPicker(false);
                  }}
                >
                  <label
                    className={`block font-semibold text-airbnb-black mb-0.5 transition-all duration-300 ease-in-out ${
                      isScrolled ? "text-[10px]" : "text-xs"
                    }`}
                  >
                    Check-out
                  </label>
                  <div
                    className={`text-airbnb-black transition-all duration-300 ease-in-out ${
                      isScrolled ? "text-xs" : "text-sm"
                    }`}
                  >
                    {checkOut ? (
                      formatDate(checkOut)
                    ) : (
                      <span className="text-airbnb-grey-400">
                        Insira as datas
                      </span>
                    )}
                  </div>
                </div>

                {showCheckOutPicker && (
                  <CompactDatePicker
                    selectedDate={checkOut}
                    onDateChange={(date) => {
                      setCheckOut(date);
                      setShowCheckOutPicker(false);
                    }}
                    minDate={checkIn ? new Date(checkIn) : new Date()}
                    onClose={() => setShowCheckOutPicker(false)}
                  />
                )}
              </div>

              {/* Quartos e Hóspedes */}
              {/* <div
                className="flex-1 min-w-0 px-4 py-2.5 relative"
                ref={roomsRef}
              >
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    setShowRoomsPicker(!showRoomsPicker);
                    setShowCheckInPicker(false);
                    setShowCheckOutPicker(false);
                  }}
                >
                  <label className="block text-xs font-semibold text-airbnb-black mb-0.5">
                    Hóspedes
                  </label>
                  <div className="text-sm text-airbnb-black truncate">
                    {formatRoomsGuests()}
                  </div>
                </div>

                {showRoomsPicker && (
                  <RoomsGuestsPicker
                    rooms={rooms}
                    onChange={(newRooms) => {
                      setRooms(newRooms);
                    }}
                    onClose={() => setShowRoomsPicker(false)}
                  />
                )}
              </div> */}

              <div
                className={`flex-1 min-w-0 px-4 relative transition-all duration-300 ease-in-out ${
                  isScrolled ? "py-2" : "py-2.5"
                }`}
                ref={guestsRef}
              >
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    setShowGuestsPicker(!showGuestsPicker);
                    setShowCheckInPicker(false);
                    setShowCheckOutPicker(false);
                  }}
                >
                  <label
                    className={`block font-semibold text-airbnb-black mb-0.5 transition-all duration-300 ease-in-out ${
                      isScrolled ? "text-[10px]" : "text-xs"
                    }`}
                  >
                    Hóspedes
                  </label>
                  <div
                    className={`text-airbnb-black truncate transition-all duration-300 ease-in-out ${
                      isScrolled ? "text-xs" : "text-sm"
                    }`}
                  >
                    {formatGuestsDisplay()}
                  </div>
                </div>

                {showGuestsPicker && (
                  <GuestsPicker
                    guests={guests}
                    onChange={(newGuests) => {
                      setGuests(newGuests);
                    }}
                    onClose={() => setShowGuestsPicker(false)}
                  />
                )}
              </div>

              {/* Botão de Busca */}
              {/* Botão de Filtros (condicional) */}
              {isPropertiesPage && (
                <button
                  onClick={onFilterButtonClick}
                  className={`flex items-center gap-2 border border-airbnb-grey-300 hover:border-airbnb-black rounded-full transition-all duration-300 ease-in-out flex-shrink-0 ${
                    isScrolled ? "px-3 py-2 text-xs" : "px-4 py-2.5 text-sm"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    className={`fill-current text-airbnb-black transition-all duration-300 ease-in-out ${
                      isScrolled ? "w-3 h-3" : "w-4 h-4"
                    }`}
                  >
                    <path d="M3.9 54.9C10.5 45.7 22.3 41.5 32.2 44.6l406.8 127.3c15.8 4.9 20.3 23.9 9.1 34.2L304.5 365.9c-2.4 2.2-3.7 5.2-3.5 8.3v130.1c-1.3 12.5 7.3 24.3 19.9 26.6l102.4 19.2c12.5 2.3 24.3-6.9 26.6-19.5l25.6-137.9c.7-3.9 2.5-7.6 5.4-10.4L490.1 190.5c9.2-8.6 8.5-23.7-1.7-31.5L412.3 93.7c-9.2-7.1-22.3-5.2-29.4 4l-40 56c-1.2 1.7-2.6 3.1-4.2 4.2L288 224l-112 112L128 384l-48-48 104-104c1.2-1.2 2.3-2.6 3.1-4.2l56-40c8.9-6.9 10.8-20.1 3.7-29.4L188.7 48.7C179.5 39.5 164.4 39.7 155.2 48.3L3.9 54.9z" />
                  </svg>
                  <span className="font-semibold">Filtros</span>
                </button>
              )}

              {/* Botão de Busca */}
              <button
                onClick={handleSearch}
                className={`mr-2 bg-rausch hover:bg-rausch-dark text-white rounded-full flex items-center justify-center transition-all duration-300 ease-in-out flex-shrink-0 ${
                  isPropertiesPage
                    ? "w-10 h-10"
                    : isScrolled
                    ? "w-10 h-10"
                    : "w-12 h-12"
                }`}
                aria-label="Buscar"
              >
                <FaSearch
                  className={`transition-all duration-300 ease-in-out ${
                    isPropertiesPage
                      ? "text-base"
                      : isScrolled
                      ? "text-base"
                      : "text-lg"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Versão Mobile - Busca Simples */}
          <button
            onClick={handleSearch}
            className={`md:hidden flex items-center gap-3 flex-1 ml-4 border border-airbnb-grey-200 rounded-full px-4 shadow-sm transition-all duration-300 ease-in-out ${
              isScrolled ? "py-2" : "py-2.5"
            }`}
          >
            <FaSearch className="text-airbnb-black" />
            <div className="flex flex-col items-start">
              <span
                className={`font-semibold text-airbnb-black transition-all duration-300 ease-in-out ${
                  isScrolled ? "text-xs" : "text-sm"
                }`}
              >
                Para onde?
              </span>
              <span
                className={`text-airbnb-grey-400 transition-all duration-300 ease-in-out ${
                  isScrolled ? "text-[10px]" : "text-xs"
                }`}
              >
                Qualquer lugar • Qualquer semana
              </span>
            </div>
          </button>

          {/* Menu Direita */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Botão "Anunciar seu espaço" - Apenas para admins ou usuários não logados */}
            {(!isAuthenticated ||
              user?.role === "admin" ||
              user?.role === "admin_master") && (
              <Link
                to={isAuthenticated ? "/admin" : "/login?redirect=/admin"}
                className={`hidden lg:block px-4 font-semibold text-airbnb-black hover:bg-airbnb-grey-50 rounded-full transition-all duration-300 ease-in-out whitespace-nowrap ${
                  isScrolled ? "py-2 text-xs" : "py-3 text-sm"
                }`}
              >
                Anunciar seu espaço
              </Link>
            )}

            {/* Seletor de Idioma */}
            <div className="hidden lg:block">
              <LanguageSwitch />
            </div>

            {/* Theme Toggle */}
            <div className="hidden lg:block">
              <ThemeToggle />
            </div>

            {/* Menu de Usuário */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className={`flex items-center gap-3 border border-airbnb-grey-300 hover:shadow-md rounded-full pr-2 transition-all duration-300 ease-in-out ${
                    isScrolled ? "pl-2 py-1.5" : "pl-3 py-2"
                  }`}
                >
                  <FiMenu
                    className={`text-airbnb-black transition-all duration-300 ease-in-out ${
                      isScrolled ? "text-base" : "text-lg"
                    }`}
                  />
                  <div
                    className={`bg-airbnb-grey-500 rounded-full flex items-center justify-center text-white font-semibold transition-all duration-300 ease-in-out ${
                      isScrolled ? "w-6 h-6 text-xs" : "w-7 h-7 text-sm"
                    }`}
                  >
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white rounded-xlarge shadow-elevation-high border border-airbnb-grey-200 py-2 overflow-hidden">
                    <div className="px-4 py-3 border-b border-airbnb-grey-200">
                      <p className="text-sm font-semibold text-airbnb-black truncate">
                        {user?.name}
                      </p>
                      <p className="text-xs text-airbnb-grey-400 truncate mt-0.5">
                        {user?.email}
                      </p>
                    </div>

                    <Link
                      to="/my-bookings"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-airbnb-black hover:bg-airbnb-grey-50 transition-colors text-sm"
                    >
                      <FiUser className="text-lg" />
                      <span>Minhas Reservas</span>
                    </Link>

                    <Link
                      to="/favorites"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-airbnb-black hover:bg-airbnb-grey-50 transition-colors text-sm"
                    >
                      <span className="text-lg">♥</span>
                      <span>Favoritos</span>
                    </Link>

                    <div className="border-t border-airbnb-grey-200 my-2"></div>

                    <Link
                      to="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-airbnb-black hover:bg-airbnb-grey-50 transition-colors text-sm"
                    >
                      <FiUser className="text-lg" />
                      <span>Perfil</span>
                    </Link>

                    {(user?.role === "admin" ||
                      user?.role === "admin_master") && (
                      <>
                        <div className="border-t border-airbnb-grey-200 my-2"></div>
                        <Link
                          to="/admin"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-airbnb-black hover:bg-airbnb-grey-50 transition-colors text-sm"
                        >
                          <FiSettings className="text-lg" />
                          <span>Painel Admin</span>
                        </Link>
                      </>
                    )}

                    <div className="border-t border-airbnb-grey-200 my-2"></div>

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-3 text-airbnb-black hover:bg-airbnb-grey-50 transition-colors w-full text-left text-sm"
                    >
                      <FiLogOut className="text-lg" />
                      <span>Sair</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/guest-login"
                  className={`hidden sm:block px-4 font-semibold text-airbnb-black hover:bg-airbnb-grey-50 rounded-full transition-all duration-300 ease-in-out ${
                    isScrolled ? "py-1.5 text-xs" : "py-2 text-sm"
                  }`}
                >
                  Entrar
                </Link>
                <Link
                  to="/guest-register"
                  className={`px-4 font-semibold text-white bg-rausch hover:bg-rausch-dark rounded-full transition-all duration-300 ease-in-out ${
                    isScrolled ? "py-1.5 text-xs" : "py-2 text-sm"
                  }`}
                >
                  Cadastrar
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AirbnbHeader;
