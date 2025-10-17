import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";

const PaymentPending = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();

  const paymentId = searchParams.get("payment_id");
  const status = searchParams.get("status");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        {/* Ícone de Pending Animado */}
        <div className="mb-6">
          <div className="mx-auto w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center animate-pulse">
            <svg
              className="w-12 h-12 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        {/* Título */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Pagamento Pendente ⏳
        </h1>

        <p className="text-xl text-gray-600 mb-8">
          Seu pagamento está sendo processado
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
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800">
                ⏳ {status === "pending" ? "Pendente" : status}
              </span>
            </div>
          </div>
        </div>

        {/* Informações sobre o Pagamento Pendente */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8 text-left">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span>ℹ️</span>
            <span>O que isso significa?</span>
          </h3>

          <div className="space-y-3 text-sm text-gray-700">
            <p>
              <strong>PIX ou Boleto:</strong> Aguardando confirmação do pagamento.
              Isso pode levar alguns minutos (PIX) ou até 2 dias úteis (boleto).
            </p>

            <p>
              <strong>Cartão de Crédito:</strong> O pagamento está sendo processado
              pela operadora. Geralmente leva alguns minutos.
            </p>
          </div>
        </div>

        {/* Próximos Passos */}
        <div className="bg-blue-50 rounded-xl p-6 mb-8 text-left">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span>📋</span>
            <span>Próximos Passos</span>
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>
                Você receberá um email assim que o pagamento for confirmado
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>
                Acompanhe o status em "Minhas Reservas"
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>
                Se houver algum problema, entraremos em contato
              </span>
            </li>
          </ul>
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate("/bookings")}
            className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-105"
          >
            Ver Minhas Reservas
          </button>

          <button
            onClick={() => navigate("/properties")}
            className="bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-8 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-200"
          >
            Voltar para Início
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPending;
