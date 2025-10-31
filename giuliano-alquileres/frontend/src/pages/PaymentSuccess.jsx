import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  const [countdown, setCountdown] = useState(5);

  // Parâmetros do Mercado Pago
  const paymentId = searchParams.get("payment_id");
  const status = searchParams.get("status");
  const externalReference = searchParams.get("external_reference");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/guest-login");
      return;
    }

    // Countdown para redirecionar
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/bookings");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        {/* Ícone de Sucesso Animado */}
        <div className="mb-6">
          <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
            <svg
              className="w-12 h-12 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Título */}
        <h1 className="heading-2 mb-4">
          Pagamento Aprovado! 🎉
        </h1>

        <p className="text-xl text-gray-600 mb-8">
          Sua reserva foi confirmada com sucesso!
        </p>

        {/* Card de Informações */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div>
              <p className="text-sm text-gray-600 mb-1">ID do Pagamento</p>
              <p className="font-mono text-sm font-semibold text-gray-900">
                #{paymentId || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Status</p>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                ✓ {status === "approved" ? "Aprovado" : status}
              </span>
            </div>
          </div>

          {externalReference && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Referência</p>
              <p className="font-mono text-sm font-semibold text-gray-900">
                {externalReference}
              </p>
            </div>
          )}
        </div>

        {/* Próximos Passos */}
        <div className="bg-blue-50 rounded-xl p-6 mb-8 text-left">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span>📋</span>
            <span>Próximos Passos</span>
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>Você receberá um email de confirmação em instantes</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>Os detalhes da reserva já estão disponíveis em "Minhas Reservas"</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>O proprietário entrará em contato antes do check-in</span>
            </li>
          </ul>
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate("/bookings")}
            className="btn-primary"
          >
            Ver Minhas Reservas
          </button>

          <button
            onClick={() => navigate("/properties")}
            className="btn-secondary"
          >
            Explorar Mais Imóveis
          </button>
        </div>

        {/* Redirecionamento Automático */}
        <div className="mt-8 text-sm text-gray-500">
          <p>
            Redirecionando automaticamente em{" "}
            <span className="font-semibold text-gray-700">{countdown}</span>{" "}
            segundo{countdown !== 1 ? "s" : ""}...
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
