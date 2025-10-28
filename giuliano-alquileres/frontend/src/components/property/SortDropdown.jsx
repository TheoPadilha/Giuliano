// SortDropdown.jsx - Componente de Ordenação
import { useState, useRef, useEffect } from "react";
import { FaSortAmountDown, FaCheck } from "react-icons/fa";

const SortDropdown = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const sortOptions = [
    { value: "", label: "Relevância" },
    { value: "price_asc", label: "Menor preço" },
    { value: "price_desc", label: "Maior preço" },
    { value: "rating", label: "Melhor avaliação" },
    { value: "newest", label: "Mais recentes" },
  ];

  const currentOption = sortOptions.find((opt) => opt.value === value) || sortOptions[0];

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2.5 border border-airbnb-grey-300 rounded-lg text-sm font-medium hover:border-airbnb-black transition-all flex items-center gap-2 bg-white min-w-[180px] justify-between"
      >
        <div className="flex items-center gap-2">
          <FaSortAmountDown className="text-sm text-airbnb-grey-600" />
          <span className="text-airbnb-black">{currentOption.label}</span>
        </div>
        <svg
          className={`w-4 h-4 text-airbnb-grey-600 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full mt-2 w-full bg-white border border-airbnb-grey-200 rounded-lg shadow-lg py-1 z-50">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`w-full px-4 py-2.5 text-left text-sm hover:bg-airbnb-grey-50 transition-colors flex items-center justify-between ${
                value === option.value ? "bg-airbnb-grey-50" : ""
              }`}
            >
              <span
                className={
                  value === option.value
                    ? "font-semibold text-airbnb-black"
                    : "text-airbnb-grey-600"
                }
              >
                {option.label}
              </span>
              {value === option.value && (
                <FaCheck className="text-sm text-rausch" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SortDropdown;
