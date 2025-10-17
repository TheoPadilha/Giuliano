import { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const DateRangePicker = ({ checkIn, checkOut, onChange, onClose, occupiedDates = [] }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selecting, setSelecting] = useState("checkIn"); // 'checkIn' ou 'checkOut'
  const [tempCheckIn, setTempCheckIn] = useState(checkIn);
  const [tempCheckOut, setTempCheckOut] = useState(checkOut);

  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
  ];

  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  // Obter dias do mês
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Dias vazios do mês anterior
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Dias do mês atual
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  // Verificar se uma data está ocupada
  const isDateOccupied = (date) => {
    if (!date) return false;
    const dateStr = date.toISOString().split("T")[0];
    return occupiedDates.some((range) => {
      const start = new Date(range.start);
      const end = new Date(range.end);
      return date >= start && date <= end;
    });
  };

  // Verificar se a data é passada
  const isPastDate = (date) => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  // Verificar se a data está no range selecionado
  const isInRange = (date) => {
    if (!date || !tempCheckIn || !tempCheckOut) return false;
    return date > tempCheckIn && date < tempCheckOut;
  };

  // Selecionar data
  const handleDateClick = (date) => {
    if (!date || isPastDate(date) || isDateOccupied(date)) return;

    if (selecting === "checkIn") {
      setTempCheckIn(date);
      setTempCheckOut(null);
      setSelecting("checkOut");
    } else {
      if (date > tempCheckIn) {
        setTempCheckOut(date);
        onChange({ checkIn: tempCheckIn.toISOString().split("T")[0], checkOut: date.toISOString().split("T")[0] });
      } else {
        setTempCheckIn(date);
        setTempCheckOut(null);
      }
    }
  };

  // Navegar entre meses
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const days = getDaysInMonth(currentMonth);
  const nextMonthDays = getDaysInMonth(
    new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
  );

  return (
    <div className="p-6 w-[700px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Selecione as datas</h3>
          <p className="text-sm text-gray-500">
            {selecting === "checkIn" ? "Escolha o check-in" : "Escolha o check-out"}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-2xl"
        >
          ×
        </button>
      </div>

      {/* Datas selecionadas */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="border-2 border-gray-300 rounded-xl p-3 hover:border-primary-300 transition-colors">
          <p className="text-xs text-gray-500 mb-1">Check-in</p>
          <p className="font-semibold text-gray-800">
            {tempCheckIn
              ? tempCheckIn.toLocaleDateString("pt-BR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "Selecione"}
          </p>
        </div>
        <div className="border-2 border-gray-300 rounded-xl p-3 hover:border-primary-300 transition-colors">
          <p className="text-xs text-gray-500 mb-1">Check-out</p>
          <p className="font-semibold text-gray-800">
            {tempCheckOut
              ? tempCheckOut.toLocaleDateString("pt-BR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "Selecione"}
          </p>
        </div>
      </div>

      {/* Calendários (2 meses side-by-side) */}
      <div className="grid grid-cols-2 gap-6">
        {/* Mês atual */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={goToPreviousMonth}
              className="p-2 hover:bg-primary-100 text-gray-600 hover:text-primary-600 rounded-full transition-all duration-200"
            >
              <FaChevronLeft />
            </button>
            <span className="font-semibold text-gray-800">
              {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </span>
            <div className="w-8" /> {/* Spacer */}
          </div>

          {/* Dias da semana */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((day) => (
              <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Dias do mês */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((date, index) => {
              if (!date) {
                return <div key={index} />;
              }

              const isOccupied = isDateOccupied(date);
              const isPast = isPastDate(date);
              const isDisabled = isPast || isOccupied;
              const isSelected =
                (tempCheckIn && date.toDateString() === tempCheckIn.toDateString()) ||
                (tempCheckOut && date.toDateString() === tempCheckOut.toDateString());
              const inRange = isInRange(date);

              return (
                <button
                  key={index}
                  onClick={() => handleDateClick(date)}
                  disabled={isDisabled}
                  className={`
                    aspect-square rounded-lg text-sm font-medium transition-all
                    ${isDisabled ? "text-gray-300 cursor-not-allowed" : "hover:bg-primary-100"}
                    ${isSelected ? "bg-gradient-to-br from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800 shadow-md" : ""}
                    ${inRange ? "bg-primary-50 text-primary-600" : ""}
                    ${!isDisabled && !isSelected && !inRange ? "text-gray-700" : ""}
                  `}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        </div>

        {/* Próximo mês */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="w-8" /> {/* Spacer */}
            <span className="font-semibold text-gray-800">
              {months[(currentMonth.getMonth() + 1) % 12]}{" "}
              {currentMonth.getMonth() === 11
                ? currentMonth.getFullYear() + 1
                : currentMonth.getFullYear()}
            </span>
            <button
              onClick={goToNextMonth}
              className="p-2 hover:bg-primary-100 text-gray-600 hover:text-primary-600 rounded-full transition-all duration-200"
            >
              <FaChevronRight />
            </button>
          </div>

          {/* Dias da semana */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((day) => (
              <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Dias do próximo mês */}
          <div className="grid grid-cols-7 gap-1">
            {nextMonthDays.map((date, index) => {
              if (!date) {
                return <div key={index} />;
              }

              const isOccupied = isDateOccupied(date);
              const isPast = isPastDate(date);
              const isDisabled = isPast || isOccupied;
              const isSelected =
                (tempCheckIn && date.toDateString() === tempCheckIn.toDateString()) ||
                (tempCheckOut && date.toDateString() === tempCheckOut.toDateString());
              const inRange = isInRange(date);

              return (
                <button
                  key={index}
                  onClick={() => handleDateClick(date)}
                  disabled={isDisabled}
                  className={`
                    aspect-square rounded-lg text-sm font-medium transition-all
                    ${isDisabled ? "text-gray-300 cursor-not-allowed" : "hover:bg-primary-100"}
                    ${isSelected ? "bg-gradient-to-br from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800 shadow-md" : ""}
                    ${inRange ? "bg-primary-50 text-primary-600" : ""}
                    ${!isDisabled && !isSelected && !inRange ? "text-gray-700" : ""}
                  `}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legenda */}
      <div className="flex items-center gap-6 mt-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gradient-to-br from-primary-600 to-primary-700 rounded shadow-sm" />
          <span className="text-gray-600">Selecionado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-200 rounded" />
          <span className="text-gray-600">Indisponível</span>
        </div>
      </div>

      {/* Botões */}
      <div className="flex items-center justify-end gap-3 mt-6">
        <button
          onClick={() => {
            setTempCheckIn(null);
            setTempCheckOut(null);
            setSelecting("checkIn");
          }}
          className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200 font-medium"
        >
          Limpar
        </button>
        <button
          onClick={onClose}
          className="px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
        >
          Confirmar
        </button>
      </div>
    </div>
  );
};

export default DateRangePicker;
