import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const CompactDatePicker = ({
  selectedDate,
  onChange,
  onClose,
  occupiedDates = [],
  minDate = null,
}) => {
  const [currentMonth, setCurrentMonth] = useState(
    selectedDate ? new Date(selectedDate) : new Date()
  );

  const months = [
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro",
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
    if (
      !date ||
      isPastDate(date) ||
      isDateOccupied(date) ||
      isBeforeMinDate(date)
    )
      return;
    onChange(date.toISOString().split("T")[0]);
    onClose();
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <div className="bg-white rounded-3xl shadow-2xl border border-airbnb-grey-200 p-8 w-[340px]">
      {/* Header do mês */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={goToPreviousMonth}
          className="p-2 hover:bg-airbnb-grey-50 rounded-full transition-colors"
        >
          <FaChevronLeft className="text-sm text-airbnb-black" />
        </button>
        <span className="font-semibold text-base text-airbnb-black">
          {months[currentMonth.getMonth()]} de {currentMonth.getFullYear()}
        </span>
        <button
          onClick={goToNextMonth}
          className="p-2 hover:bg-airbnb-grey-50 rounded-full transition-colors"
        >
          <FaChevronRight className="text-sm text-airbnb-black" />
        </button>
      </div>

      {/* Dias da semana */}
      <div className="grid grid-cols-7 gap-2 mb-3">
        {weekDays.map((day, i) => (
          <div
            key={i}
            className="text-center text-xs font-medium text-airbnb-grey-600 h-10 flex items-center justify-center"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Dias do mês */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((date, index) => {
          if (!date) {
            return <div key={index} className="h-10" />;
          }

          const isOccupied = isDateOccupied(date);
          const isPast = isPastDate(date);
          const isBeforeMin = isBeforeMinDate(date);
          const isDisabled = isPast || isOccupied || isBeforeMin;
          const isSelected =
            selectedDate &&
            date.toDateString() === new Date(selectedDate).toDateString();

          return (
            <button
              key={index}
              onClick={() => handleDateClick(date)}
              disabled={isDisabled}
              className={`
                h-10 flex items-center justify-center rounded-full text-sm font-normal transition-all
                ${
                  isDisabled
                    ? "text-airbnb-grey-300 cursor-not-allowed"
                    : "text-airbnb-black hover:bg-airbnb-grey-50 hover:border hover:border-airbnb-black"
                }
                ${
                  isSelected
                    ? "bg-airbnb-black text-white hover:bg-airbnb-black hover:border-0"
                    : ""
                }
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
