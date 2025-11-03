import { useState } from "react";
import { FaMinus, FaPlus, FaTimes } from "react-icons/fa";

const RoomsGuestsPicker = ({ rooms, onChange, onClose, maxGuests = 20 }) => {
  const [roomsData, setRoomsData] = useState(
    rooms || [{ adults: 2, children: [] }]
  );

  // Atualizar número de quartos
  const updateRoomCount = (count) => {
    if (count < 1 || count > 5) return;

    const newRooms = [...roomsData];

    if (count > roomsData.length) {
      // Adicionar novos quartos
      for (let i = roomsData.length; i < count; i++) {
        newRooms.push({ adults: 2, children: [] });
      }
    } else {
      // Remover quartos
      newRooms.splice(count);
    }

    setRoomsData(newRooms);
  };

  // Atualizar adultos em um quarto específico
  const updateAdults = (roomIndex, delta) => {
    const newRooms = [...roomsData];
    const currentAdults = newRooms[roomIndex].adults;
    const newAdults = currentAdults + delta;

    // Calcular total de hóspedes após a mudança
    const currentTotal = getTotalGuestsFromRooms(newRooms);
    const newTotal = currentTotal - currentAdults + newAdults;

    if (newAdults >= 1 && newAdults <= 10 && newTotal <= maxGuests) {
      newRooms[roomIndex].adults = newAdults;
      setRoomsData(newRooms);
    }
  };

  // Atualizar crianças em um quarto específico
  const updateChildrenCount = (roomIndex, delta) => {
    const newRooms = [...roomsData];
    const currentChildren = newRooms[roomIndex].children.length;
    const newCount = currentChildren + delta;

    if (newCount < 0 || newCount > 6) return;

    // Verificar limite máximo de hóspedes
    const currentTotal = getTotalGuestsFromRooms(newRooms);

    if (delta > 0) {
      // Verificar se pode adicionar mais um hóspede
      if (currentTotal >= maxGuests) return;
      // Adicionar criança com idade padrão 5
      newRooms[roomIndex].children.push(5);
    } else {
      // Remover última criança
      newRooms[roomIndex].children.pop();
    }

    setRoomsData(newRooms);
  };

  // Atualizar idade de uma criança específica
  const updateChildAge = (roomIndex, childIndex, age) => {
    const newRooms = [...roomsData];
    newRooms[roomIndex].children[childIndex] = parseInt(age);
    setRoomsData(newRooms);
  };

  // Helper: Calcular total de hóspedes de um array de quartos
  const getTotalGuestsFromRooms = (rooms) => {
    return rooms.reduce((total, room) => {
      return total + room.adults + room.children.length;
    }, 0);
  };

  // Calcular total de hóspedes
  const getTotalGuests = () => {
    return getTotalGuestsFromRooms(roomsData);
  };

  // Verificar se atingiu o limite máximo
  const isAtMaxCapacity = () => {
    return getTotalGuests() >= maxGuests;
  };

  // Confirmar seleção
  const handleConfirm = () => {
    onChange(roomsData);
    onClose();
  };

  return (
    <>
      {/* Overlay para fechar ao clicar fora */}
      <div
        className="fixed inset-0 z-40 bg-black bg-opacity-20"
        onClick={onClose}
      />

      {/* Popup do Picker */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white shadow-2xl rounded-2xl border-2 border-gray-200 w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 overflow-y-auto flex-1">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Quartos e Hóspedes
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Total: {getTotalGuests()} {getTotalGuests() === 1 ? "hóspede" : "hóspedes"}
              {maxGuests && <span className="text-gray-400"> (Máx: {maxGuests})</span>}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
          >
            <FaTimes />
          </button>
        </div>

        {/* Mensagem de aviso quando atingir o limite */}
        {isAtMaxCapacity() && (
          <div className="mb-4 bg-yellow-50 border-2 border-yellow-400 rounded-xl p-4 flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div className="flex-1">
              <p className="font-semibold text-yellow-900 text-sm">
                Limite máximo atingido
              </p>
              <p className="text-xs text-yellow-800 mt-1">
                Você atingiu o número máximo de hóspedes ({maxGuests}) permitidos para esta acomodação.
              </p>
            </div>
          </div>
        )}

        {/* Seletor de Quartos */}
        <div className="mb-6 pb-6 border-b-2 border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">Quartos</p>
              <p className="text-xs text-gray-500 mt-0.5">Máximo 5 quartos</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => updateRoomCount(roomsData.length - 1)}
                disabled={roomsData.length <= 1}
                className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-600 hover:border-primary-600 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:text-gray-600 disabled:hover:bg-white"
              >
                <FaMinus className="text-sm" />
              </button>
              <span className="text-xl font-bold text-gray-900 w-8 text-center">
                {roomsData.length}
              </span>
              <button
                onClick={() => updateRoomCount(roomsData.length + 1)}
                disabled={roomsData.length >= 5}
                className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-600 hover:border-primary-600 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:text-gray-600 disabled:hover:bg-white"
              >
                <FaPlus className="text-sm" />
              </button>
            </div>
          </div>
        </div>

        {/* Detalhes de cada quarto */}
        <div className="space-y-6">
          {roomsData.map((room, roomIndex) => (
            <div
              key={roomIndex}
              className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border-2 border-gray-200"
            >
              <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-7 h-7 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm">
                  {roomIndex + 1}
                </span>
                Quarto {roomIndex + 1}
              </h4>

              {/* Adultos */}
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">
                      Adultos
                    </p>
                    <p className="text-xs text-gray-500">18+ anos</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateAdults(roomIndex, -1)}
                      disabled={room.adults <= 1}
                      className="w-9 h-9 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-600 hover:border-primary-600 hover:text-primary-600 hover:bg-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:text-gray-600 disabled:hover:bg-gray-100"
                    >
                      <FaMinus className="text-xs" />
                    </button>
                    <span className="text-lg font-bold text-gray-900 w-6 text-center">
                      {room.adults}
                    </span>
                    <button
                      onClick={() => updateAdults(roomIndex, 1)}
                      disabled={room.adults >= 10 || isAtMaxCapacity()}
                      className="w-9 h-9 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-600 hover:border-primary-600 hover:text-primary-600 hover:bg-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:text-gray-600 disabled:hover:bg-gray-100"
                    >
                      <FaPlus className="text-xs" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Crianças */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">
                      Crianças
                    </p>
                    <p className="text-xs text-gray-500">0-17 anos</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateChildrenCount(roomIndex, -1)}
                      disabled={room.children.length === 0}
                      className="w-9 h-9 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-600 hover:border-primary-600 hover:text-primary-600 hover:bg-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:text-gray-600 disabled:hover:bg-gray-100"
                    >
                      <FaMinus className="text-xs" />
                    </button>
                    <span className="text-lg font-bold text-gray-900 w-6 text-center">
                      {room.children.length}
                    </span>
                    <button
                      onClick={() => updateChildrenCount(roomIndex, 1)}
                      disabled={room.children.length >= 6 || isAtMaxCapacity()}
                      className="w-9 h-9 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-600 hover:border-primary-600 hover:text-primary-600 hover:bg-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:text-gray-600 disabled:hover:bg-gray-100"
                    >
                      <FaPlus className="text-xs" />
                    </button>
                  </div>
                </div>

                {/* Idades das crianças */}
                {room.children.length > 0 && (
                  <div className="space-y-2 mt-3 pt-3 border-t border-gray-300">
                    {room.children.map((age, childIndex) => (
                      <div key={childIndex} className="flex items-center gap-3">
                        <label className="text-sm text-gray-700 font-medium w-24">
                          Criança {childIndex + 1}:
                        </label>
                        <select
                          value={age}
                          onChange={(e) =>
                            updateChildAge(roomIndex, childIndex, e.target.value)
                          }
                          className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 text-sm bg-white"
                        >
                          <option value="">Idade</option>
                          {Array.from({ length: 18 }, (_, i) => (
                            <option key={i} value={i}>
                              {i === 0 ? "Menos de 1 ano" : `${i} ${i === 1 ? "ano" : "anos"}`}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Botões de Ação */}
        <div className="flex items-center gap-3 mt-6 pt-6 border-t-2 border-gray-200">
          <button
            onClick={() => {
              setRoomsData([{ adults: 2, children: [] }]);
            }}
            className="flex-1 px-5 py-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200 font-semibold border-2 border-gray-300 hover:border-gray-400"
          >
            Limpar
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 px-5 rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-200 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Confirmar
          </button>
        </div>
      </div>
      {/* Fecha o modal fixo */}
    </div>
    </>
  );
};

export default RoomsGuestsPicker;
