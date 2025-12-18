// DateRangePicker - Estilo Airbnb exato da imagem
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const DateRangePicker = ({ checkIn, checkOut, onChange, onClose, occupiedDates = [], compact = false }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("datas"); // datas, meses, flexivel
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selecting, setSelecting] = useState("checkIn");

  // Parse date string to local date without timezone issues
  const parseDate = (dateString) => {
    if (!dateString) return null;
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  const [tempCheckIn, setTempCheckIn] = useState(checkIn ? parseDate(checkIn) : null);
  const [tempCheckOut, setTempCheckOut] = useState(checkOut ? parseDate(checkOut) : null);
  const [flexDays, setFlexDays] = useState(0); // 0 = exatas, 1, 2, 3, 7, 14

  // Atualizar datas temporárias quando props mudarem
  useEffect(() => {
    setTempCheckIn(checkIn ? parseDate(checkIn) : null);
    setTempCheckOut(checkOut ? parseDate(checkOut) : null);
  }, [checkIn, checkOut]);

  const months = [
    t('calendar.months.january'), t('calendar.months.february'), t('calendar.months.march'),
    t('calendar.months.april'), t('calendar.months.may'), t('calendar.months.june'),
    t('calendar.months.july'), t('calendar.months.august'), t('calendar.months.september'),
    t('calendar.months.october'), t('calendar.months.november'), t('calendar.months.december'),
  ];

  // Abreviações de 1 letra para os dias (estilo Airbnb)
  const weekDays = t('calendar.weekDays.short', { returnObjects: true });

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
    return occupiedDates.some((range) => {
      // Parse dates without timezone issues - use local dates
      const [startYear, startMonth, startDay] = range.start.split('-').map(Number);
      const [endYear, endMonth, endDay] = range.end.split('-').map(Number);
      const start = new Date(startYear, startMonth - 1, startDay);
      const end = new Date(endYear, endMonth - 1, endDay);

      // Reset time to midnight for accurate comparison
      const checkDate = new Date(date);
      checkDate.setHours(0, 0, 0, 0);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);

      // FIX: O dia de check-out não deve bloquear novos check-ins
      // Apenas os dias entre check-in e (check-out - 1) estão ocupados
      return checkDate >= start && checkDate < end;
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

  // Format date to YYYY-MM-DD without timezone issues
  const formatDateForStorage = (date) => {
    if (!date) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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
        onChange({
          checkIn: formatDateForStorage(tempCheckIn),
          checkOut: formatDateForStorage(date)
        });
        // Não fechar automaticamente - removido
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

  // Renderizar um calendário
  const renderCalendar = (monthOffset = 0) => {
    const targetDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + monthOffset, 1);
    const days = getDaysInMonth(targetDate);

    return (
      <div className="flex-1">
        {/* Header do mês */}
        <div className="mb-6 text-center">
          <h3 className="text-base font-semibold text-airbnb-black dark:text-airbnb-grey-100">
            {months[targetDate.getMonth()]} de {targetDate.getFullYear()}
          </h3>
        </div>

        {/* Dias da semana */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day, idx) => (
            <div
              key={idx}
              className={`text-center text-xs font-medium text-airbnb-grey-600 dark:text-airbnb-grey-400 py-2 mx-auto ${
                compact ? 'w-8' : 'w-10'
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Grid de dias */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((date, index) => {
            if (!date) {
              return <div key={index} className={compact ? "w-8 h-8" : "w-10 h-10"} />;
            }

            const isOccupied = isDateOccupied(date);
            const isPast = isPastDate(date);
            const isDisabled = isPast || isOccupied;
            const isCheckIn = tempCheckIn && date.toDateString() === tempCheckIn.toDateString();
            const isCheckOut = tempCheckOut && date.toDateString() === tempCheckOut.toDateString();
            const isSelected = isCheckIn || isCheckOut;
            const inRange = isInRange(date);

            return (
              <button
                key={index}
                onClick={() => handleDateClick(date)}
                disabled={isDisabled}
                className={`
                  relative flex items-center justify-center
                  ${compact ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm'}
                  font-normal transition-all duration-200
                  ${isDisabled
                    ? "text-airbnb-grey-300 dark:text-airbnb-grey-600 cursor-not-allowed line-through"
                    : "text-airbnb-black dark:text-airbnb-grey-100 hover:border hover:border-airbnb-black dark:hover:border-airbnb-grey-300 rounded-full cursor-pointer"
                  }
                  ${isSelected
                    ? "bg-airbnb-black dark:bg-white text-white dark:text-airbnb-black rounded-full font-semibold"
                    : ""
                  }
                  ${inRange
                    ? "bg-airbnb-grey-100 dark:bg-airbnb-grey-800"
                    : ""
                  }
                  ${isCheckIn
                    ? "rounded-l-full rounded-r-none"
                    : ""
                  }
                  ${isCheckOut
                    ? "rounded-r-full rounded-l-none"
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

  return (
    <div className={`bg-white dark:bg-airbnb-grey-900 rounded-3xl shadow-2xl transition-all ${
      compact
        ? "p-4 md:p-5 w-full max-w-[700px]"
        : "p-6 md:p-8 w-[95vw] md:w-auto md:min-w-[850px]"
    }`}>
      {/* Navegação de meses (fora dos calendários, centralizada) */}
      <div className={`flex items-center justify-between ${compact ? 'mb-4' : 'mb-6'}`}>
        <button
          onClick={goToPreviousMonth}
          className="p-3 hover:bg-airbnb-grey-100 dark:hover:bg-airbnb-grey-800 rounded-full transition-all"
          aria-label="Mês anterior"
        >
          <FaChevronLeft className="text-airbnb-black dark:text-airbnb-grey-100" />
        </button>

        <div className="flex-1" />

        <button
          onClick={goToNextMonth}
          className="p-3 hover:bg-airbnb-grey-100 dark:hover:bg-airbnb-grey-800 rounded-full transition-all"
          aria-label="Próximo mês"
        >
          <FaChevronRight className="text-airbnb-black dark:text-airbnb-grey-100" />
        </button>
      </div>

      {/* Dois calendários lado a lado */}
      <div className={`flex flex-col md:flex-row ${
        compact ? 'gap-4 md:gap-8 mb-4' : 'gap-6 md:gap-12 mb-6'
      }`}>
        {renderCalendar(0)}
        {renderCalendar(1)}
      </div>

      {/* Filtros rápidos de flexibilidade */}
      <div className="border-t border-airbnb-grey-200 dark:border-airbnb-grey-700 pt-6">
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setFlexDays(0)}
            className={`
              px-4 py-2 rounded-full border transition-all text-sm font-medium
              ${flexDays === 0
                ? "bg-airbnb-black dark:bg-white text-white dark:text-airbnb-black border-airbnb-black dark:border-white"
                : "border-airbnb-grey-300 dark:border-airbnb-grey-600 text-airbnb-black dark:text-airbnb-grey-100 hover:border-airbnb-black dark:hover:border-white"
              }
            `}
          >
            {t('calendar.exactDates')}
          </button>

          <button
            onClick={() => setFlexDays(1)}
            className={`
              px-4 py-2 rounded-full border transition-all text-sm font-medium
              ${flexDays === 1
                ? "bg-airbnb-black dark:bg-white text-white dark:text-airbnb-black border-airbnb-black dark:border-white"
                : "border-airbnb-grey-300 dark:border-airbnb-grey-600 text-airbnb-black dark:text-airbnb-grey-100 hover:border-airbnb-black dark:hover:border-white"
              }
            `}
          >
            {t('calendar.plusDays', { count: 1 })}
          </button>

          <button
            onClick={() => setFlexDays(2)}
            className={`
              px-4 py-2 rounded-full border transition-all text-sm font-medium
              ${flexDays === 2
                ? "bg-airbnb-black dark:bg-white text-white dark:text-airbnb-black border-airbnb-black dark:border-white"
                : "border-airbnb-grey-300 dark:border-airbnb-grey-600 text-airbnb-black dark:text-airbnb-grey-100 hover:border-airbnb-black dark:hover:border-white"
              }
            `}
          >
            {t('calendar.plusDays', { count: 2 })}
          </button>

          <button
            onClick={() => setFlexDays(3)}
            className={`
              px-4 py-2 rounded-full border transition-all text-sm font-medium
              ${flexDays === 3
                ? "bg-airbnb-black dark:bg-white text-white dark:text-airbnb-black border-airbnb-black dark:border-white"
                : "border-airbnb-grey-300 dark:border-airbnb-grey-600 text-airbnb-black dark:text-airbnb-grey-100 hover:border-airbnb-black dark:hover:border-white"
              }
            `}
          >
            {t('calendar.plusDays', { count: 3 })}
          </button>

          <button
            onClick={() => setFlexDays(7)}
            className={`
              px-4 py-2 rounded-full border transition-all text-sm font-medium
              ${flexDays === 7
                ? "bg-airbnb-black dark:bg-white text-white dark:text-airbnb-black border-airbnb-black dark:border-white"
                : "border-airbnb-grey-300 dark:border-airbnb-grey-600 text-airbnb-black dark:text-airbnb-grey-100 hover:border-airbnb-black dark:hover:border-white"
              }
            `}
          >
            {t('calendar.plusDays', { count: 7 })}
          </button>

          <button
            onClick={() => setFlexDays(14)}
            className={`
              px-4 py-2 rounded-full border transition-all text-sm font-medium
              ${flexDays === 14
                ? "bg-airbnb-black dark:bg-white text-white dark:text-airbnb-black border-airbnb-black dark:border-white"
                : "border-airbnb-grey-300 dark:border-airbnb-grey-600 text-airbnb-black dark:text-airbnb-grey-100 hover:border-airbnb-black dark:hover:border-white"
              }
            `}
          >
            {t('calendar.plusDays', { count: 14 })}
          </button>
        </div>

        {flexDays > 0 && (
          <p className="text-sm text-airbnb-grey-600 dark:text-airbnb-grey-400 mt-4">
            Buscando datas {flexDays} {flexDays === 1 ? 'dia' : 'dias'} antes ou depois das selecionadas
          </p>
        )}

        {/* Botão Limpar */}
        {(tempCheckIn || tempCheckOut) && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => {
                setTempCheckIn(null);
                setTempCheckOut(null);
                setSelecting("checkIn");
                onChange({ checkIn: null, checkOut: null });
              }}
              className="px-4 py-2 text-sm font-medium text-airbnb-black dark:text-white hover:bg-airbnb-grey-100 dark:hover:bg-airbnb-grey-800 rounded-lg transition-all underline"
            >
              {t('common.clear')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DateRangePicker;
