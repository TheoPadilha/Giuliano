import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaCalendarAlt, FaUsers, FaSearch } from "react-icons/fa";
import { FiUser, FiLogOut, FiSettings } from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";
import CompactDatePicker from "../search/CompactDatePicker";
import RoomsGuestsPicker from "../search/RoomsGuestsPicker";

const SearchHeader = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [rooms, setRooms] = useState([{ adults: 2, children: [] }]);
  const [showCheckInPicker, setShowCheckInPicker] = useState(false);
  const [showCheckOutPicker, setShowCheckOutPicker] = useState(false);
  const [showRoomsPicker, setShowRoomsPicker] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const checkInRef = useRef(null);
  const checkOutRef = useRef(null);
  const roomsRef = useRef(null);
  const userMenuRef = useRef(null);

  // Fechar dropdowns ao clicar fora
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
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex items-center justify-between h-20 gap-8">
          {/* Logo - Esquerda */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-2xl">🏠</span>
            </div>
            <h1 className="text-2xl font-bold text-red-600 hidden sm:block">Giuliano</h1>
          </Link>

          {/* Barra de Busca Centralizada - Centro */}
          <div className="flex-1 max-w-[850px] mx-auto">
            <div className="flex items-center bg-gradient-to-b from-white to-gray-50 border-2 border-gray-200 rounded-full shadow-md hover:shadow-xl transition-shadow duration-300">
              {/* Destino */}
              <div className="flex-1 min-w-0 pl-6 pr-4 py-3 border-r border-gray-200">
                <label className="block text-xs font-semibold text-gray-700 mb-1">Destino</label>
                <input
                  type="text"
                  placeholder="Para onde?"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
                />
              </div>

              {/* Check-in */}
              <div className="flex-1 min-w-0 px-4 py-3 border-r border-gray-200 relative" ref={checkInRef}>
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    setShowCheckInPicker(!showCheckInPicker);
                    setShowCheckOutPicker(false);
                    setShowRoomsPicker(false);
                  }}
                >
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Check-in</label>
                  <div className="text-sm text-gray-900">
                    {checkIn ? formatDate(checkIn) : <span className="text-gray-400">Adicionar data</span>}
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
              <div className="flex-1 min-w-0 px-4 py-3 border-r border-gray-200 relative" ref={checkOutRef}>
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    setShowCheckOutPicker(!showCheckOutPicker);
                    setShowCheckInPicker(false);
                    setShowRoomsPicker(false);
                  }}
                >
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Check-out</label>
                  <div className="text-sm text-gray-900">
                    {checkOut ? formatDate(checkOut) : <span className="text-gray-400">Adicionar data</span>}
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
              <div className="flex-1 min-w-0 px-4 py-3 relative" ref={roomsRef}>
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    setShowRoomsPicker(!showRoomsPicker);
                    setShowCheckInPicker(false);
                    setShowCheckOutPicker(false);
                  }}
                >
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Hóspedes</label>
                  <div className="text-sm text-gray-900 truncate">
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

              {/* Botão de busca */}
              <button
                onClick={handleSearch}
                className="mr-2 w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 flex-shrink-0"
                aria-label="Buscar"
              >
                <FaSearch className="text-lg" />
              </button>
            </div>
          </div>

          {/* Menu de Usuário - Direita */}
          <div className="flex items-center gap-4 flex-shrink-0">
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-3 bg-white border-2 border-gray-300 hover:border-gray-400 rounded-full pl-4 pr-2 py-2 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <span className="text-sm font-medium text-gray-700 hidden md:block">
                    {user?.name?.split(" ")[0]}
                  </span>
                  <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center text-white font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                </button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-200 py-2 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {user?.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate mt-1">
                        {user?.email}
                      </p>
                    </div>

                    <Link
                      to="/my-bookings"
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <span className="text-lg">📅</span>
                      <span className="text-sm font-medium">Minhas Reservas</span>
                    </Link>

                    <Link
                      to="/favorites"
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <span className="text-lg">❤️</span>
                      <span className="text-sm font-medium">Favoritos</span>
                    </Link>

                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <FiSettings className="text-lg text-gray-600" />
                      <span className="text-sm font-medium">Meu Perfil</span>
                    </Link>

                    {(user?.role === "admin" || user?.role === "admin_master") && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <span className="text-lg">⚙️</span>
                        <span className="text-sm font-medium">Painel Admin</span>
                      </Link>
                    )}

                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <FiLogOut className="text-lg" />
                        <span className="text-sm font-medium">Sair</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-red-600 font-medium text-sm transition-colors hidden md:block"
                >
                  Entrar
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-2.5 rounded-full font-medium text-sm shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
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

export default SearchHeader;
