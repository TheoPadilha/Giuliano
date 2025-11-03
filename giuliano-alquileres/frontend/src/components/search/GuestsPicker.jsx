import { useEffect } from "react";
import { FiMinus, FiPlus } from "react-icons/fi";

const GuestsPicker = ({ guests, onChange, maxGuests = 16, allowsPets = false, onClose }) => {
  const { adults = 1, children = 0, infants = 0, pets = 0 } = guests;

  // Handler para tecla ESC
  useEffect(() => {
    if (!onClose) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const updateGuests = (type, value) => {
    // Verificar limites antes de atualizar
    if (type === "adults" || type === "children") {
      const newAdults = type === "adults" ? value : adults;
      const newChildren = type === "children" ? value : children;
      const newTotal = newAdults + newChildren;

      // Não permitir ultrapassar o limite máximo
      if (newTotal > maxGuests) return;

      // Adultos: mínimo 1
      if (type === "adults" && value < 1) return;
    }

    onChange({ ...guests, [type]: value });
  };

  const getTotalGuests = () => {
    return adults + children;
  };

  // Verificar se atingiu o limite máximo
  const isAtMaxCapacity = () => {
    return getTotalGuests() >= maxGuests;
  };

  return (
    <>
      {/* Overlay para fechar ao clicar fora */}
      {onClose && (
        <div
          className="fixed inset-0 z-40"
          onClick={onClose}
        />
      )}

      {/* Popup do Picker - Estilo Airbnb */}
      <div className="absolute top-full right-0 mt-2 w-[380px] bg-white border border-airbnb-grey-200 rounded-xlarge shadow-elevation-high z-50">
        <div className="p-6">
        {/* Adultos */}
        <GuestRow
          label="Adultos"
          description="13 anos ou mais"
          value={adults}
          onIncrement={() => updateGuests("adults", adults + 1)}
          onDecrement={() => updateGuests("adults", adults - 1)}
          min={1}
          max={maxGuests}
          disabled={isAtMaxCapacity()}
        />

        {/* Crianças */}
        <GuestRow
          label="Crianças"
          description="2 a 12 anos"
          value={children}
          onIncrement={() => updateGuests("children", children + 1)}
          onDecrement={() => updateGuests("children", children - 1)}
          min={0}
          max={maxGuests}
          disabled={isAtMaxCapacity()}
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

        {/* Animais de Estimação - Apenas se permitido */}
        {allowsPets && (
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
        )}

        {/* Mensagem de rodapé com limite */}
        {!allowsPets && (
          <div className="pt-4 border-t border-airbnb-grey-200">
            <p className="text-sm text-airbnb-grey-500">
              Este espaço acomoda no máximo <span className="font-semibold text-airbnb-black">{maxGuests} hóspedes</span>, não incluindo bebês.
            </p>
          </div>
        )}

        {allowsPets && (
          <div className="pt-4 border-t border-airbnb-grey-200 mt-4">
            <p className="text-sm text-airbnb-grey-500">
              Este espaço acomoda no máximo <span className="font-semibold text-airbnb-black">{maxGuests} hóspedes</span>, não incluindo bebês.
            </p>
          </div>
        )}
      </div>
    </div>
    </>
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
  disabled = false,
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
          disabled={value >= max || disabled}
          className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
            value >= max || disabled
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
