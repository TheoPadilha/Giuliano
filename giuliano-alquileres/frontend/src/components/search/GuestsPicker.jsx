import { FiMinus, FiPlus } from "react-icons/fi";

const GuestsPicker = ({ guests, onChange, onClose }) => {
  const { adults = 0, children = 0, infants = 0, pets = 0 } = guests;

  const updateGuests = (type, value) => {
    onChange({ ...guests, [type]: value });
  };

  const getTotalGuests = () => {
    return adults + children;
  };

  const formatSummary = () => {
    const total = getTotalGuests();
    const parts = [];

    if (total > 0) {
      parts.push(`${total} ${total === 1 ? "hóspede" : "hóspedes"}`);
    }

    if (infants > 0) {
      parts.push(`${infants} ${infants === 1 ? "bebê" : "bebês"}`);
    }

    if (pets > 0) {
      parts.push(`${pets} ${pets === 1 ? "animal" : "animais"}`);
    }

    return parts.length > 0 ? parts.join(", ") : "Adicionar hóspedes";
  };

  return (
    <div className="absolute top-full right-0 mt-2 w-[380px] bg-white border border-airbnb-grey-200 rounded-xlarge shadow-elevation-high z-50">
      <div className="p-6">
        {/* Adultos */}
        <GuestRow
          label="Adultos"
          description="13 anos ou mais"
          value={adults}
          onIncrement={() => updateGuests("adults", adults + 1)}
          onDecrement={() => updateGuests("adults", adults - 1)}
          min={0}
          max={16}
        />

        {/* Crianças */}
        <GuestRow
          label="Crianças"
          description="De 2 a 12 anos"
          value={children}
          onIncrement={() => updateGuests("children", children + 1)}
          onDecrement={() => updateGuests("children", children - 1)}
          min={0}
          max={15}
        />

        {/* Bebês */}
        <GuestRow
          label="Bebês"
          description="Menor de 2 anos"
          value={infants}
          onIncrement={() => updateGuests("infants", infants + 1)}
          onDecrement={() => updateGuests("infants", infants - 1)}
          min={0}
          max={5}
        />

        {/* Animais de Estimação */}
        <GuestRow
          label="Animais de estimação"
          description={
            <button className="text-sm text-airbnb-black underline hover:text-airbnb-grey-600 transition-colors">
              Vai levar um animal de serviço?
            </button>
          }
          value={pets}
          onIncrement={() => updateGuests("pets", pets + 1)}
          onDecrement={() => updateGuests("pets", pets - 1)}
          min={0}
          max={5}
          isLast
        />
      </div>
    </div>
  );
};

// Componente de linha de hóspedes
const GuestRow = ({
  label,
  description,
  value,
  onIncrement,
  onDecrement,
  min = 0,
  max = 16,
  isLast = false,
}) => {
  return (
    <div
      className={`flex items-center justify-between py-4 ${
        !isLast ? "border-b border-airbnb-grey-200" : ""
      }`}
    >
      <div className="flex-1">
        <div className="text-base font-semibold text-airbnb-black">{label}</div>
        <div className="text-sm text-airbnb-grey-400 mt-0.5">
          {typeof description === "string" ? description : description}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={onDecrement}
          disabled={value <= min}
          className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
            value <= min
              ? "border-airbnb-grey-200 text-airbnb-grey-300 cursor-not-allowed"
              : "border-airbnb-grey-400 text-airbnb-grey-600 hover:border-airbnb-black hover:text-airbnb-black"
          }`}
          aria-label={`Diminuir ${label}`}
        >
          <FiMinus className="text-lg" />
        </button>

        <span className="min-w-[32px] text-center text-base font-semibold text-airbnb-black">
          {value}
        </span>

        <button
          onClick={onIncrement}
          disabled={value >= max}
          className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
            value >= max
              ? "border-airbnb-grey-200 text-airbnb-grey-300 cursor-not-allowed"
              : "border-airbnb-grey-400 text-airbnb-grey-600 hover:border-airbnb-black hover:text-airbnb-black"
          }`}
          aria-label={`Aumentar ${label}`}
        >
          <FiPlus className="text-lg" />
        </button>
      </div>
    </div>
  );
};

export default GuestsPicker;
