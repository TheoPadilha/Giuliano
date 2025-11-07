import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Componente que rola a página para o topo quando a rota muda
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Rolar para o topo quando a rota mudar
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant" // Instantâneo, sem animação suave
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
