const Loading = ({
  size = "md",
  text = "Carregando...",
  variant = "default",
  overlay = false,
  className = "",
}) => {
  const sizeClasses = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  const variantClasses = {
    default: "border-gray-200 border-t-blue-600",
    primary: "border-blue-200 border-t-blue-600",
    success: "border-green-200 border-t-green-600",
    warning: "border-yellow-200 border-t-yellow-600",
    danger: "border-red-200 border-t-red-600",
  };

  const textSizes = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center p-8">
      {/* Spinner */}
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-4 ${variantClasses[variant]} mb-4 ${className}`}
      ></div>

      {/* Texto */}
      {text && (
        <p
          className={`text-gray-600 font-medium ${textSizes[size]} animate-pulse`}
        >
          {text}
        </p>
      )}
    </div>
  );

  const LoadingDots = () => (
    <div className="flex flex-col items-center justify-center p-8">
      {/* Dots animation */}
      <div className="flex space-x-2 mb-4">
        <div
          className={`${sizeClasses[size]} bg-blue-600 rounded-full animate-bounce`}
        ></div>
        <div
          className={`${sizeClasses[size]} bg-blue-600 rounded-full animate-bounce`}
          style={{ animationDelay: "0.1s" }}
        ></div>
        <div
          className={`${sizeClasses[size]} bg-blue-600 rounded-full animate-bounce`}
          style={{ animationDelay: "0.2s" }}
        ></div>
      </div>

      {text && (
        <p className={`text-gray-600 font-medium ${textSizes[size]}`}>{text}</p>
      )}
    </div>
  );

  const LoadingPulse = () => (
    <div className="flex flex-col items-center justify-center p-8">
      {/* Pulse animation */}
      <div
        className={`${sizeClasses[size]} bg-blue-600 rounded-full animate-ping mb-4`}
      ></div>

      {text && (
        <p
          className={`text-gray-600 font-medium ${textSizes[size]} animate-pulse`}
        >
          {text}
        </p>
      )}
    </div>
  );

  // Skeleton loading para conteúdo
  const LoadingSkeleton = ({ lines = 3 }) => (
    <div className="animate-pulse p-6">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, index) => (
          <div key={index} className="h-3 bg-gray-200 rounded"></div>
        ))}
      </div>
    </div>
  );

  // Loading específico para cards
  const LoadingCards = ({ count = 3 }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse"
        >
          <div className="h-48 bg-gray-200"></div>
          <div className="p-4">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-4/5"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Loading para tabelas
  const LoadingTable = ({ rows = 5, columns = 4 }) => (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="animate-pulse">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4">
          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
          >
            {Array.from({ length: columns }).map((_, index) => (
              <div key={index} className="h-3 bg-gray-200 rounded w-3/4"></div>
            ))}
          </div>
        </div>

        {/* Rows */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="px-6 py-4 border-t border-gray-200">
            <div
              className="grid gap-4"
              style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
            >
              {Array.from({ length: columns }).map((_, colIndex) => (
                <div key={colIndex} className="h-3 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Componente principal baseado na variante
  let LoadingComponent;

  switch (variant) {
    case "dots":
      LoadingComponent = LoadingDots;
      break;
    case "pulse":
      LoadingComponent = LoadingPulse;
      break;
    case "skeleton":
      LoadingComponent = LoadingSkeleton;
      break;
    case "cards":
      LoadingComponent = LoadingCards;
      break;
    case "table":
      LoadingComponent = LoadingTable;
      break;
    default:
      LoadingComponent = LoadingSpinner;
  }

  // Se for overlay, renderiza com fundo
  if (overlay) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-sm mx-auto">
          <LoadingComponent />
        </div>
      </div>
    );
  }

  return <LoadingComponent />;
};

// Componente para loading inline (pequeno)
export const LoadingInline = ({ text = "Carregando...", className = "" }) => (
  <span
    className={`inline-flex items-center text-sm text-gray-600 ${className}`}
  >
    <div className="w-4 h-4 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin mr-2"></div>
    {text}
  </span>
);

// Componente para loading de botão
export const LoadingButton = ({
  loading = false,
  children,
  className = "",
  loadingText = "Carregando...",
  ...props
}) => (
  <button
    {...props}
    disabled={loading || props.disabled}
    className={`relative ${className} ${
      loading ? "cursor-not-allowed opacity-75" : ""
    }`}
  >
    {loading ? (
      <span className="flex items-center justify-center">
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
        {loadingText}
      </span>
    ) : (
      children
    )}
  </button>
);

// Componente para seções de página inteira
export const LoadingPage = ({ title = "Carregando página...", subtitle }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
      {subtitle && <p className="text-gray-600">{subtitle}</p>}
    </div>
  </div>
);

export default Loading;
