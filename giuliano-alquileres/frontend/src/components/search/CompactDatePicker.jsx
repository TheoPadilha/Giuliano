import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const CompactDatePicker = ({ selectedDate, onChange, onClose, occupiedDates = [], minDate = null }) => {
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());

  const months = [
    "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
    "Jul", "Ago", "Set", "Out", "Nov", "Dez",
  ];

  const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const isDateOccupied = (date) => {
    if (!date) return false;
    const dateStr = date.toISOString().split("T")[0];
    return occupiedDates.some((range) => {
      const start = new Date(range.start);
      const end = new Date(range.end);
      return date >= start && date <= end;
    });
  };

  const isPastDate = (date) => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isBeforeMinDate = (date) => {
    if (!date || !minDate) return false;
    return date < minDate;
  };

  const handleDateClick = (date) => {
    if (!date || isPastDate(date) || isDateOccupied(date) || isBeforeMinDate(date)) return;
    onChange(date.toISOString().split("T")[0]);
    onClose();
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-[280px]">
      {/* Header do mês */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={goToPreviousMonth}
          className="p-1.5 hover:bg-gray-100 text-gray-600 hover:text-red-600 rounded-full transition-colors"
        >
          <FaChevronLeft className="text-xs" />
        </button>
        <span className="font-semibold text-sm text-gray-800">
          {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </span>
        <button
          onClick={goToNextMonth}
          className="p-1.5 hover:bg-gray-100 text-gray-600 hover:text-red-600 rounded-full transition-colors"
        >
          <FaChevronRight className="text-xs" />
        </button>
      </div>

      {/* Dias da semana */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day, i) => (
          <div key={i} className="text-center text-[10px] font-semibold text-gray-500 py-1">
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
          const isBeforeMin = isBeforeMinDate(date);
          const isDisabled = isPast || isOccupied || isBeforeMin;
          const isSelected = selectedDate && date.toDateString() === new Date(selectedDate).toDateString();

          return (
            <button
              key={index}
              onClick={() => handleDateClick(date)}
              disabled={isDisabled}
              className={`
                aspect-square rounded-md text-xs font-medium transition-all
                ${isDisabled ? "text-gray-300 cursor-not-allowed bg-gray-50" : "hover:bg-red-50 hover:text-red-600"}
                ${isSelected ? "bg-red-600 text-white hover:bg-red-700 shadow-sm" : ""}
                ${!isDisabled && !isSelected ? "text-gray-700" : ""}
              `}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CompactDatePicker;
