import { useDarkMode } from "../../contexts/DarkModeContext";
import { FiSun, FiMoon } from "react-icons/fi";

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useDarkMode();

  return (
    <button
      onClick={toggleTheme}
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
      }}
      className="relative flex items-center justify-center w-10 h-10 rounded-full
                 border-2 hover:border-airbnb-black
                 transition-all duration-300 ease-in-out
                 hover:shadow-md active:scale-95
                 focus:outline-none focus:ring-2 focus:ring-rausch focus:ring-offset-2"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {/* Sun Icon - visible in dark mode */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
          isDark
            ? "opacity-100 rotate-0 scale-100"
            : "opacity-0 rotate-90 scale-0"
        }`}
      >
        <FiSun className="w-5 h-5 text-yellow-500" />
      </div>

      {/* Moon Icon - visible in light mode */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
          isDark
            ? "opacity-0 -rotate-90 scale-0"
            : "opacity-100 rotate-0 scale-100"
        }`}
      >
        <FiMoon className="w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} />
      </div>
    </button>
  );
};

export default ThemeToggle;
