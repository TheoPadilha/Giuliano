import { useState } from 'react';
import { FaInfoCircle, FaTimes } from 'react-icons/fa';

/**
 * Badge Beta - Aviso sobre versão Beta
 *
 * Componente que exibe um aviso discreto informando que o sistema
 * está em versão Beta e as reservas são sem pagamento online.
 *
 * Props:
 * - position: 'header' | 'footer' | 'floating' (default: 'header')
 * - dismissible: boolean (permite fechar o aviso)
 */
const BetaBadge = ({ position = 'header', dismissible = true }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);

  // Verifica se o modo Beta está ativo
  const isBetaMode = import.meta.env.VITE_BETA_MODE === 'true';

  // Se não está em modo Beta ou foi fechado, não renderiza
  if (!isBetaMode || !isVisible) return null;

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('betaBadgeDismissed', 'true');
  };

  // Verifica se já foi fechado anteriormente
  if (dismissible && localStorage.getItem('betaBadgeDismissed') === 'true') {
    return null;
  }

  // Estilos baseados na posição
  const positionStyles = {
    header: 'bg-gradient-to-r from-rausch to-rausch-dark text-white py-2 px-4',
    footer: 'bg-airbnb-grey-800 text-white py-3 px-4 border-t border-airbnb-grey-700',
    floating:
      'fixed bottom-4 right-4 bg-rausch text-white py-3 px-4 rounded-lg shadow-2xl z-50',
  };

  return (
    <div className={`${positionStyles[position]} relative`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Conteúdo */}
        <div className="flex items-center gap-3">
          {/* Badge "BETA" */}
          <span className="bg-white text-rausch text-xs font-bold px-2 py-1 rounded-md">
            BETA
          </span>

          {/* Mensagem */}
          <p className="text-sm font-medium">
            Versão Beta – Reservas sem pagamento online
          </p>

          {/* Ícone de info com tooltip */}
          <div className="relative">
            <button
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="text-white hover:text-gray-200 transition-colors"
              aria-label="Mais informações"
            >
              <FaInfoCircle className="text-base" />
            </button>

            {/* Tooltip */}
            {showTooltip && (
              <div className="absolute bottom-full right-0 mb-2 w-72 bg-white text-airbnb-black text-xs rounded-lg shadow-xl p-3 z-10">
                <div className="font-semibold mb-1">Sobre a versão Beta:</div>
                <ul className="space-y-1 text-airbnb-grey-700">
                  <li>✓ Reservas funcionam normalmente</li>
                  <li>✓ Datas são bloqueadas automaticamente</li>
                  <li>✓ Proprietário confirma reservas</li>
                  <li>✗ Pagamento online indisponível</li>
                </ul>
                <div className="mt-2 pt-2 border-t border-gray-200 text-airbnb-grey-600">
                  O proprietário entrará em contato para combinar o pagamento.
                </div>
                {/* Seta do tooltip */}
                <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
              </div>
            )}
          </div>
        </div>

        {/* Botão fechar (se dismissible) */}
        {dismissible && (
          <button
            onClick={handleDismiss}
            className="text-white hover:text-gray-200 transition-colors"
            aria-label="Fechar aviso"
          >
            <FaTimes className="text-base" />
          </button>
        )}
      </div>
    </div>
  );
};

/**
 * Badge Beta Flutuante - Versão compacta
 */
export const BetaBadgeFloating = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isBetaMode = import.meta.env.VITE_BETA_MODE === 'true';

  if (!isBetaMode) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-50 transition-all duration-300"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div
        className={`bg-rausch text-white rounded-full shadow-2xl transition-all duration-300 ${
          isExpanded ? 'px-4 py-3' : 'w-12 h-12'
        } flex items-center justify-center gap-2 cursor-pointer`}
      >
        <span className="font-bold text-sm whitespace-nowrap">BETA</span>
        {isExpanded && (
          <span className="text-xs whitespace-nowrap animate-fade-in">
            Sem pagamento online
          </span>
        )}
      </div>
    </div>
  );
};

/**
 * Aviso Beta Inline - Para usar em páginas específicas
 */
export const BetaNotice = ({ className = '' }) => {
  const isBetaMode = import.meta.env.VITE_BETA_MODE === 'true';

  if (!isBetaMode) return null;

  return (
    <div
      className={`bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg ${className}`}
    >
      <div className="flex items-start gap-3">
        <FaInfoCircle className="text-blue-500 text-xl flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-blue-900 font-semibold mb-1">
            Versão Beta – Reservas Simplificadas
          </h4>
          <p className="text-blue-800 text-sm">
            Nesta versão, as reservas são registradas sem pagamento online. O
            proprietário entrará em contato para confirmar e combinar a forma de
            pagamento.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BetaBadge;
