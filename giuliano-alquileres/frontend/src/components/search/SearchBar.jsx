import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaSearch, FaDoorOpen } from "react-icons/fa";
import DateRangePicker from "./DateRangePicker";
import RoomsGuestsPicker from "./RoomsGuestsPicker";

const SearchBar = () => {
  const navigate = useNavigate();
  const [destination, setDestination] = useState("");
  const [dates, setDates] = useState({ checkIn: null, checkOut: null });
  const [rooms, setRooms] = useState([{ adults: 2, children: [] }]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showRoomsPicker, setShowRoomsPicker] = useState(false);

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (destination) params.append("city", destination);
    if (dates.checkIn) params.append("checkIn", dates.checkIn);
    if (dates.checkOut) params.append("checkOut", dates.checkOut);

    // Calcular total de hóspedes e quartos
    const totalGuests = rooms.reduce((total, room) => {
      return total + room.adults + room.children.length;
    }, 0);

    params.append("guests", totalGuests);
    params.append("rooms", rooms.length);

    // Passar dados completos dos quartos como JSON
    params.append("roomsData", JSON.stringify(rooms));

    navigate(`/properties?${params.toString()}`);
  };

  // Função para formatar exibição de quartos e hóspedes
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
    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-5xl mx-auto">
      {/* Título */}
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Encontre seu <span className="text-primary-600">Imóvel Ideal</span>
        </h2>
        <p className="text-gray-600">
          Milhares de propriedades incríveis esperando por você
        </p>
      </div>

      {/* Campos de busca */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Destino */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Destino
          </label>
          <div className="relative">
            <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-600" />
            <input
              type="text"
              placeholder="Para onde?"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-200"
            />
          </div>
        </div>

        {/* Check-in e Check-out */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Check-in / Check-out
          </label>
          <div
            className="relative cursor-pointer"
            onClick={() => setShowDatePicker(!showDatePicker)}
          >
            <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-600" />
            <input
              type="text"
              placeholder="Selecione as datas"
              value={
                dates.checkIn && dates.checkOut
                  ? `${formatDate(dates.checkIn)} - ${formatDate(dates.checkOut)}`
                  : ""
              }
              readOnly
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-200 cursor-pointer"
            />
          </div>

          {/* DatePicker Dropdown */}
          {showDatePicker && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto"
              onClick={() => setShowDatePicker(false)}
            >
              <div className="relative my-auto" onClick={(e) => e.stopPropagation()}>
                <DateRangePicker
                  checkIn={dates.checkIn}
                  checkOut={dates.checkOut}
                  onChange={(newDates) => {
                    setDates(newDates);
                    if (newDates.checkIn && newDates.checkOut) {
                      setShowDatePicker(false);
                    }
                  }}
                  onClose={() => setShowDatePicker(false)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Quartos e Hóspedes */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quartos e Hóspedes
          </label>
          <div
            className="relative cursor-pointer"
            onClick={() => setShowRoomsPicker(!showRoomsPicker)}
          >
            <FaDoorOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-600" />
            <input
              type="text"
              placeholder="Selecione"
              value={formatRoomsGuests()}
              readOnly
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-200 cursor-pointer"
            />
          </div>

          {/* Rooms & Guests Picker Dropdown */}
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
        <div className="flex items-end">
          <button
            onClick={handleSearch}
            className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:shadow-red-strong transform hover:scale-105"
          >
            <FaSearch />
            <span>Buscar</span>
          </button>
        </div>
      </div>

      {/* Info adicional */}
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>
          🏡 <span className="font-semibold">120+ propriedades</span> em{" "}
          <span className="font-semibold">15+ cidades</span>
        </p>
      </div>
    </div>
  );
};

export default SearchBar;
