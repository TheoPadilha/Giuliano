// CookieSettingsButton.jsx - Botão Flutuante para Gerenciar Cookies
import { FaCookie } from "react-icons/fa";

const CookieSettingsButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-24 right-6 z-[9998] w-14 h-14 bg-airbnb-grey-600 hover:bg-airbnb-black text-white rounded-full shadow-elevation-primary hover:shadow-elevation-high transition-all duration-300 flex items-center justify-center group"
      title="Gerenciar cookies"
      aria-label="Gerenciar preferências de cookies"
    >
      <FaCookie className="text-xl group-hover:scale-110 transition-transform" />
    </button>
  );
};

export default CookieSettingsButton;
