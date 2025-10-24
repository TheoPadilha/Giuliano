// AirbnbHeader - Header com busca completa estilo Airbnb
import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { FiMenu, FiUser, FiLogOut, FiSettings, FiGlobe } from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";
import CompactDatePicker from "../search/CompactDatePicker";
import RoomsGuestsPicker from "../search/RoomsGuestsPicker";

const AirbnbHeader = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  // Estados da busca
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [rooms, setRooms] = useState([{ adults: 2, children: [] }]);

  // Estados dos dropdowns
  const [showCheckInPicker, setShowCheckInPicker] = useState(false);
  const [showCheckOutPicker, setShowCheckOutPicker] = useState(false);
  const [showRoomsPicker, setShowRoomsPicker] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Refs para fechar dropdowns ao clicar fora
  const checkInRef = useRef(null);
  const checkOutRef = useRef(null);
  const roomsRef = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (checkInRef.current && !checkInRef.current.contains(event.target)) {
        setShowCheckInPicker(false);
      }
      if (checkOutRef.current && !checkOutRef.current.contains(event.target)) {
        setShowCheckOutPicker(false);
      }
      if (roomsRef.current && !roomsRef.current.contains(event.target)) {
        setShowRoomsPicker(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (destination) params.append("city", destination);
    if (checkIn) params.append("checkIn", checkIn);
    if (checkOut) params.append("checkOut", checkOut);

    const totalGuests = rooms.reduce((total, room) => {
      return total + room.adults + room.children.length;
    }, 0);

    params.append("guests", totalGuests);
    params.append("rooms", rooms.length);
    params.append("roomsData", JSON.stringify(rooms));

    navigate(`/properties?${params.toString()}`);
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate("/");
  };

  const formatRoomsGuests = () => {
    const totalGuests = rooms.reduce((total, room) => {
      return total + room.adults + room.children.length;
    }, 0);

    const roomsText = rooms.length === 1 ? "quarto" : "quartos";
    const guestsText = totalGuests === 1 ? "hóspede" : "hóspedes";

    return `${rooms.length} ${roomsText}, ${totalGuests} ${guestsText}`;
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
    });
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-airbnb-grey-200 shadow-sm">
      <div className="max-w-[2520px] mx-auto px-5 sm:px-10 lg:px-20">
        <div className="flex items-center justify-between h-20">
          {/* Logo - Esquerda */}
          <Link to="/" className="flex items-center flex-shrink-0 gap-2">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-rausch to-rausch-dark rounded-xlarge flex items-center justify-center shadow-md">
                <span className="text-white text-xl font-bold">Z</span>
              </div>
              <span className="hidden lg:block text-xl font-bold text-rausch">Ziguealuga</span>
            </div>
          </Link>

          {/* Barra de Busca Completa - Centro */}
          <div className="hidden md:flex flex-1 max-w-[850px] mx-auto">
            <div className="flex items-center w-full bg-white border border-airbnb-grey-200 rounded-full shadow-sm hover:shadow-md transition-shadow duration-200">
              {/* Destino */}
              <div className="flex-1 min-w-0 pl-6 pr-4 py-2.5 border-r border-airbnb-grey-200">
                <label className="block text-xs font-semibold text-airbnb-black mb-0.5">
                  Localização
                </label>
                <input
                  type="text"
                  placeholder="Para onde?"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full bg-transparent text-sm text-airbnb-black placeholder-airbnb-grey-400 focus:outline-none"
                />
              </div>

              {/* Check-in */}
              <div className="flex-1 min-w-0 px-4 py-2.5 border-r border-airbnb-grey-200 relative" ref={checkInRef}>
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    setShowCheckInPicker(!showCheckInPicker);
                    setShowCheckOutPicker(false);
                    setShowRoomsPicker(false);
                  }}
                >
                  <label className="block text-xs font-semibold text-airbnb-black mb-0.5">
                    Check-in
                  </label>
                  <div className="text-sm text-airbnb-black">
                    {checkIn ? (
                      formatDate(checkIn)
                    ) : (
                      <span className="text-airbnb-grey-400">Adicionar data</span>
                    )}
                  </div>
                </div>

                {showCheckInPicker && (
                  <div className="absolute top-full left-0 mt-2 z-50">
                    <CompactDatePicker
                      selectedDate={checkIn}
                      onChange={(date) => {
                        setCheckIn(date);
                        setShowCheckInPicker(false);
                        if (checkOut && new Date(date) >= new Date(checkOut)) {
                          setCheckOut(null);
                        }
                      }}
                      onClose={() => setShowCheckInPicker(false)}
                    />
                  </div>
                )}
              </div>

              {/* Check-out */}
              <div className="flex-1 min-w-0 px-4 py-2.5 border-r border-airbnb-grey-200 relative" ref={checkOutRef}>
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    setShowCheckOutPicker(!showCheckOutPicker);
                    setShowCheckInPicker(false);
                    setShowRoomsPicker(false);
                  }}
                >
                  <label className="block text-xs font-semibold text-airbnb-black mb-0.5">
                    Check-out
                  </label>
                  <div className="text-sm text-airbnb-black">
                    {checkOut ? (
                      formatDate(checkOut)
                    ) : (
                      <span className="text-airbnb-grey-400">Adicionar data</span>
                    )}
                  </div>
                </div>

                {showCheckOutPicker && (
                  <div className="absolute top-full left-0 mt-2 z-50">
                    <CompactDatePicker
                      selectedDate={checkOut}
                      onChange={(date) => {
                        setCheckOut(date);
                        setShowCheckOutPicker(false);
                      }}
                      onClose={() => setShowCheckOutPicker(false)}
                      minDate={checkIn ? new Date(checkIn) : null}
                    />
                  </div>
                )}
              </div>

              {/* Quartos e Hóspedes */}
              <div className="flex-1 min-w-0 px-4 py-2.5 relative" ref={roomsRef}>
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
              </div>

              {/* Botão de Busca */}
              <button
                onClick={handleSearch}
                className="mr-2 w-12 h-12 bg-rausch hover:bg-rausch-dark text-white rounded-full flex items-center justify-center transition-colors duration-200 flex-shrink-0"
                aria-label="Buscar"
              >
                <FaSearch className="text-lg" />
              </button>
            </div>
          </div>

          {/* Versão Mobile - Busca Simples */}
          <button
            onClick={handleSearch}
            className="md:hidden flex items-center gap-3 flex-1 ml-4 border border-airbnb-grey-200 rounded-full py-2.5 px-4 shadow-sm"
          >
            <FaSearch className="text-airbnb-black" />
            <div className="flex flex-col items-start">
              <span className="text-sm font-semibold text-airbnb-black">Para onde?</span>
              <span className="text-xs text-airbnb-grey-400">Qualquer lugar • Qualquer semana</span>
            </div>
          </button>

          {/* Menu Direita */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Botão Idioma */}
            <button className="hidden lg:block p-3 hover:bg-airbnb-grey-50 rounded-full transition-colors">
              <FiGlobe className="text-airbnb-black text-lg" />
            </button>

            {/* Menu de Usuário */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-3 border border-airbnb-grey-300 hover:shadow-md rounded-full pl-3 pr-2 py-2 transition-all duration-200"
                >
                  <FiMenu className="text-airbnb-black text-lg" />
                  <div className="w-7 h-7 bg-airbnb-grey-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
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

                    {user?.role === 'admin' && (
                      <>
                        <div className="border-t border-airbnb-grey-200 my-2"></div>
                        <Link
                          to="/admin/properties"
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
                  to="/login"
                  className="hidden sm:block px-4 py-2 text-sm font-semibold text-airbnb-black hover:bg-airbnb-grey-50 rounded-full transition-colors"
                >
                  Entrar
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-rausch hover:bg-rausch-dark rounded-full transition-colors"
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
