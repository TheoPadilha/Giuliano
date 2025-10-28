import React from "react";
import { useTranslation } from "react-i18next";
import { FiGlobe } from "react-icons/fi";

const LanguageSwitch = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const currentLanguage = i18n.language;

  return (
    <div className="relative group">
      <button
        className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-airbnb-grey-50 transition-colors text-sm font-semibold"
        aria-label="Mudar Idioma"
      >
        <FiGlobe className="text-lg" />
        <span className="hidden sm:inline">
          {currentLanguage.toUpperCase()}
        </span>
      </button>

      {/* Dropdown Menu */}
      <div className="absolute right-0 mt-2 w-32 bg-white rounded-xlarge shadow-elevation-high border border-airbnb-grey-200 py-1 overflow-hidden z-50">
        <button
          onClick={() => changeLanguage("pt")}
          className={`block w-full text-left px-4 py-2 text-sm hover:bg-airbnb-grey-50 ${
            currentLanguage === "pt"
              ? "font-bold text-rausch"
              : "text-airbnb-black"
          }`}
        >
          Português (PT)
        </button>
        <button
          onClick={() => changeLanguage("es")}
          className={`block w-full text-left px-4 py-2 text-sm hover:bg-airbnb-grey-50 ${
            currentLanguage === "es"
              ? "font-bold text-rausch"
              : "text-airbnb-black"
          }`}
        >
          Español (ES)
        </button>
        <button
          onClick={() => changeLanguage("en")}
          className={`block w-full text-left px-4 py-2 text-sm hover:bg-airbnb-grey-50 ${
            currentLanguage === "en"
              ? "font-bold text-rausch"
              : "text-airbnb-black"
          }`}
        >
          English (EN)
        </button>
      </div>
    </div>
  );
};

export default LanguageSwitch;
