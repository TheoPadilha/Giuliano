// PropertyAmenities.jsx - Componente de Comodidades Estilo Airbnb
import { useState } from "react";
import {
  Wifi,
  Snowflake,
  Waves,
  Sun,
  Car,
  Flame,
  PawPrint,
  Dumbbell,
  Coffee,
  UtensilsCrossed,
  WashingMachine,
  Home,
  Tv,
  ShieldCheck,
  Accessibility,
  Sparkles,
  Laptop,
  Bath,
  Leaf,
  Wind,
  Baby,
  Soup,
  Camera,
  Lock,
  Utensils,
  Users,
  Phone,
  ShirtIcon,
  Globe,
  CigaretteOff,
  Dog,
  Mountain,
  Building,
  CheckCircle2,
} from "lucide-react";

// Mapeamento de ícones baseado nos nomes do backend
const ICON_MAP = {
  wifi: Wifi,
  snowflake: Snowflake,
  waves: Waves,
  sun: Sun,
  eye: Sun, // Vista para o mar usa Sun como alternativa
  car: Car,
  flame: Flame,
  "chef-hat": UtensilsCrossed,
  tv: Tv,
  "washing-machine": WashingMachine,
  home: Home,
  shield: ShieldCheck,
  "move-vertical": Accessibility, // Elevador
};

const PropertyAmenities = ({ amenities = [], showAll = false }) => {
  const [isExpanded, setIsExpanded] = useState(showAll);

  // Obter ícone do Lucide baseado no nome do ícone do backend
  const getIconComponent = (iconName) => {
    return ICON_MAP[iconName] || Sparkles; // Fallback para Sparkles
  };

  // Remover duplicações baseado no ID
  const uniqueAmenities = amenities.filter((amenity, index, self) =>
    index === self.findIndex((a) => a.id === amenity.id)
  );

  // Limitar quantidade exibida se não expandido
  const displayedAmenities = isExpanded ? uniqueAmenities : uniqueAmenities.slice(0, 10);
  const hasMore = uniqueAmenities.length > 10;

  if (!uniqueAmenities || uniqueAmenities.length === 0) {
    return null;
  }

  return (
    <div className="border-b border-airbnb-grey-200 pb-8">
      <h2 className="text-2xl font-bold text-airbnb-black mb-6">
        O que este lugar oferece
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayedAmenities.map((amenity) => {
          const IconComponent = getIconComponent(amenity.icon);
          const isAvailable = amenity.available !== false;

          return (
            <div
              key={amenity.id}
              className={`flex items-center gap-4 py-3 px-2 rounded-lg transition-all ${
                isAvailable
                  ? "hover:bg-airbnb-grey-50"
                  : "opacity-50"
              }`}
            >
              <IconComponent
                className={`w-6 h-6 flex-shrink-0 ${
                  isAvailable ? "text-airbnb-black" : "text-airbnb-grey-400"
                }`}
              />
              <span
                className={`font-medium ${
                  isAvailable ? "text-airbnb-black" : "text-airbnb-grey-500"
                }`}
              >
                {amenity.name}
              </span>
              {!isAvailable && (
                <span className="ml-auto text-xs text-airbnb-grey-500 italic">
                  Indisponível
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Botão "Mostrar todas" */}
      {hasMore && !showAll && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-6 px-6 py-3 border-2 border-airbnb-black rounded-xl font-semibold hover:bg-airbnb-grey-50 transition-all"
        >
          {isExpanded
            ? "Mostrar menos"
            : `Mostrar todas as ${uniqueAmenities.length} comodidades`}
        </button>
      )}
    </div>
  );
};

export default PropertyAmenities;
