import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";

const PaymentFailure = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();

  const paymentId = searchParams.get("payment_id");
  const status = searchParams.get("status");
  const statusDetail = searchParams.get("status_detail");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/guest-login");
    }
  }, [isAuthenticated, navigate]);

  const getErrorMessage = () => {
    if (statusDetail) {
      const messages = {
        cc_rejected_insufficient_amount: "Saldo insuficiente no cartão",
        cc_rejected_bad_filled_security_code: "Código de segurança incorreto",
        cc_rejected_bad_filled_date: "Data de validade incorreta",
        cc_rejected_bad_filled_other: "Dados do cartão incorretos",
        cc_rejected_call_for_authorize: "Cartão precisa de autorização",
        cc_rejected_card_disabled: "Cartão desabilitado",
        cc_rejected_duplicated_payment: "Pagamento duplicado detectado",
        cc_rejected_high_risk: "Pagamento rejeitado por segurança",
        cc_rejected_max_attempts: "Número máximo de tentativas excedido",
        cc_rejected_other_reason: "Pagamento rejeitado pelo emissor do cartão",
      };

      return messages[statusDetail] || "O pagamento foi recusado. Tente outro método.";
    }

    return "Não foi possível processar o pagamento. Tente novamente.";
  };

  return (
    <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        {/* Ícone de Erro */}
        <div className="mb-6">
          <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>

        {/* Título */}
        <h1 className="heading-2 mb-4">
          Pagamento Recusado ❌
        </h1>

        <p className="text-xl text-gray-600 mb-8">
          {getErrorMessage()}
        </p>

        {/* Card de Informações */}
        {paymentId && (
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div>
                <p className="text-sm text-gray-600 mb-1">ID da Tentativa</p>
                <p className="font-mono text-sm font-semibold text-gray-900">
                  #{paymentId}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800">
                  ✗ {status === "rejected" ? "Rejeitado" : status || "Falha"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Possíveis Soluções */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8 text-left">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span>💡</span>
            <span>O que você pode fazer?</span>
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-rausch mt-0.5">•</span>
              <span>Verifique se os dados do cartão estão corretos</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rausch mt-0.5">•</span>
              <span>Confirme se há saldo/limite disponível</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rausch mt-0.5">•</span>
              <span>Tente usar outro cartão ou método de pagamento</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rausch mt-0.5">•</span>
              <span>Entre em contato com seu banco se o problema persistir</span>
            </li>
          </ul>
        </div>

        {/* Métodos de Pagamento Aceitos */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <h3 className="font-semibold text-gray-900 mb-3">
            Métodos de Pagamento Aceitos
          </h3>
          <div className="flex justify-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <span>💳</span>
              <span>Cartão de Crédito</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <span>💸</span>
              <span>PIX</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <span>🎫</span>
              <span>Boleto</span>
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="btn-primary"
          >
            Tentar Novamente
          </button>

          <button
            onClick={() => navigate("/bookings")}
            className="btn-secondary"
          >
            Ver Minhas Reservas
          </button>
        </div>

        {/* Suporte */}
        <div className="mt-8 text-sm text-gray-500">
          <p>
            Precisa de ajuda?{" "}
            <a
              href="https://wa.me/5547989105580"
              target="_blank"
              rel="noopener noreferrer"
              className="link"
            >
              Entre em contato conosco
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;
