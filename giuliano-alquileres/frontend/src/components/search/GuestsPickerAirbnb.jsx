import { useTranslation } from "react-i18next";
import { FiMinus, FiPlus } from "react-icons/fi";

const GuestsPickerAirbnb = ({ guests, onChange, onClose }) => {
  const { t } = useTranslation();

  const updateGuests = (field, value) => {
    const newValue = Math.max(0, value);
    onChange({ ...guests, [field]: newValue });
  };

  const getTotalGuests = () => {
    return guests.adults + guests.children;
  };

  return (
    <div className="absolute top-full right-0 mt-2 w-96 bg-white dark:bg-airbnb-grey-900 rounded-2xl shadow-elevation-high border border-airbnb-grey-200 dark:border-airbnb-grey-700 overflow-hidden z-50">
      <div className="p-6">
        {/* Adultos */}
        <div className="flex items-center justify-between py-4 border-b border-airbnb-grey-200 dark:border-airbnb-grey-700">
          <div>
            <div className="text-base font-medium text-airbnb-black dark:text-white">
              {t('guests.adults')}
            </div>
            <div className="text-sm text-airbnb-grey-600 dark:text-airbnb-grey-400">
              {t('guests.adultsDesc')}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => updateGuests('adults', guests.adults - 1)}
              disabled={guests.adults === 0}
              className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                guests.adults === 0
                  ? 'border-airbnb-grey-200 dark:border-airbnb-grey-700 text-airbnb-grey-300 dark:text-airbnb-grey-600 cursor-not-allowed'
                  : 'border-airbnb-grey-400 dark:border-airbnb-grey-500 text-airbnb-black dark:text-white hover:border-airbnb-black dark:hover:border-white'
              }`}
            >
              <FiMinus className="text-sm" />
            </button>
            <span className="w-8 text-center text-base font-medium text-airbnb-black dark:text-white">
              {guests.adults}
            </span>
            <button
              onClick={() => updateGuests('adults', guests.adults + 1)}
              className="w-8 h-8 rounded-full border border-airbnb-grey-400 dark:border-airbnb-grey-500 text-airbnb-black dark:text-white hover:border-airbnb-black dark:hover:border-white flex items-center justify-center transition-all"
            >
              <FiPlus className="text-sm" />
            </button>
          </div>
        </div>

        {/* Crianças */}
        <div className="flex items-center justify-between py-4 border-b border-airbnb-grey-200 dark:border-airbnb-grey-700">
          <div>
            <div className="text-base font-medium text-airbnb-black dark:text-white">
              {t('guests.children')}
            </div>
            <div className="text-sm text-airbnb-grey-600 dark:text-airbnb-grey-400">
              {t('guests.childrenDesc')}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => updateGuests('children', guests.children - 1)}
              disabled={guests.children === 0}
              className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                guests.children === 0
                  ? 'border-airbnb-grey-200 dark:border-airbnb-grey-700 text-airbnb-grey-300 dark:text-airbnb-grey-600 cursor-not-allowed'
                  : 'border-airbnb-grey-400 dark:border-airbnb-grey-500 text-airbnb-black dark:text-white hover:border-airbnb-black dark:hover:border-white'
              }`}
            >
              <FiMinus className="text-sm" />
            </button>
            <span className="w-8 text-center text-base font-medium text-airbnb-black dark:text-white">
              {guests.children}
            </span>
            <button
              onClick={() => updateGuests('children', guests.children + 1)}
              className="w-8 h-8 rounded-full border border-airbnb-grey-400 dark:border-airbnb-grey-500 text-airbnb-black dark:text-white hover:border-airbnb-black dark:hover:border-white flex items-center justify-center transition-all"
            >
              <FiPlus className="text-sm" />
            </button>
          </div>
        </div>

        {/* Bebês */}
        <div className="flex items-center justify-between py-4 border-b border-airbnb-grey-200 dark:border-airbnb-grey-700">
          <div>
            <div className="text-base font-medium text-airbnb-black dark:text-white">
              {t('guests.infants')}
            </div>
            <div className="text-sm text-airbnb-grey-600 dark:text-airbnb-grey-400">
              {t('guests.infantsDesc')}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => updateGuests('infants', guests.infants - 1)}
              disabled={guests.infants === 0}
              className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                guests.infants === 0
                  ? 'border-airbnb-grey-200 dark:border-airbnb-grey-700 text-airbnb-grey-300 dark:text-airbnb-grey-600 cursor-not-allowed'
                  : 'border-airbnb-grey-400 dark:border-airbnb-grey-500 text-airbnb-black dark:text-white hover:border-airbnb-black dark:hover:border-white'
              }`}
            >
              <FiMinus className="text-sm" />
            </button>
            <span className="w-8 text-center text-base font-medium text-airbnb-black dark:text-white">
              {guests.infants}
            </span>
            <button
              onClick={() => updateGuests('infants', guests.infants + 1)}
              className="w-8 h-8 rounded-full border border-airbnb-grey-400 dark:border-airbnb-grey-500 text-airbnb-black dark:text-white hover:border-airbnb-black dark:hover:border-white flex items-center justify-center transition-all"
            >
              <FiPlus className="text-sm" />
            </button>
          </div>
        </div>

        {/* Animais de estimação */}
        <div className="flex items-center justify-between py-4">
          <div>
            <div className="text-base font-medium text-airbnb-black dark:text-white">
              {t('guests.pets')}
            </div>
            <div className="text-sm text-airbnb-grey-600 dark:text-airbnb-grey-400">
              {t('guests.petsDesc')}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => updateGuests('pets', guests.pets - 1)}
              disabled={guests.pets === 0}
              className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                guests.pets === 0
                  ? 'border-airbnb-grey-200 dark:border-airbnb-grey-700 text-airbnb-grey-300 dark:text-airbnb-grey-600 cursor-not-allowed'
                  : 'border-airbnb-grey-400 dark:border-airbnb-grey-500 text-airbnb-black dark:text-white hover:border-airbnb-black dark:hover:border-white'
              }`}
            >
              <FiMinus className="text-sm" />
            </button>
            <span className="w-8 text-center text-base font-medium text-airbnb-black dark:text-white">
              {guests.pets}
            </span>
            <button
              onClick={() => updateGuests('pets', guests.pets + 1)}
              className="w-8 h-8 rounded-full border border-airbnb-grey-400 dark:border-airbnb-grey-500 text-airbnb-black dark:text-white hover:border-airbnb-black dark:hover:border-white flex items-center justify-center transition-all"
            >
              <FiPlus className="text-sm" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestsPickerAirbnb;
