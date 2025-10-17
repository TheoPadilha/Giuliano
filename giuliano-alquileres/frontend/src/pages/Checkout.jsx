import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";
import Loading from "../components/common/Loading";

const Checkout = () => {
  const { bookingId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login?redirect=/checkout/" + bookingId);
      return;
    }

    fetchBookingDetails();
  }, [bookingId, isAuthenticated]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/bookings/${bookingId}`);
      setBooking(response.data.booking);

      // Verificar se já foi pago
      if (response.data.booking.payment_status === "paid") {
        navigate(`/bookings/${bookingId}`);
      }
    } catch (error) {
      console.error("Erro ao carregar reserva:", error);
      setError("Reserva não encontrada ou você não tem permissão para acessá-la");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    try {
      setProcessingPayment(true);
      setError("");

      // Criar preferência de pagamento
      const response = await api.post("/api/payments/create-preference", {
        booking_id: booking.id,
      });

      const { init_point, sandbox_init_point } = response.data.payment;

      // Redirecionar para o Mercado Pago
      const paymentUrl =
        process.env.NODE_ENV === "production" ? init_point : sandbox_init_point;

      window.location.href = paymentUrl;
    } catch (error) {
      console.error("Erro ao processar pagamento:", error);
      setError(
        error.response?.data?.error || "Erro ao processar pagamento. Tente novamente."
      );
      setProcessingPayment(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return <Loading text="Carregando detalhes da reserva..." />;
  }

  if (error && !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Ops!</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/properties")}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Voltar para Propriedades
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-900 flex items-center gap-2 mb-4"
          >
            <span>←</span>
            <span>Voltar</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Finalizar Pagamento
          </h1>
          <p className="text-gray-600 mt-2">
            Revise os detalhes da sua reserva antes de prosseguir
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Detalhes da Reserva */}
          <div className="lg:col-span-2 space-y-6">
            {/* Card da Propriedade */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Detalhes da Propriedade
              </h2>

              <div className="flex gap-4">
                {booking.property.photos && booking.property.photos[0] && (
                  <img
                    src={`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/uploads/properties/${
                      booking.property.photos[0].filename
                    }`}
                    alt={booking.property.title}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                )}

                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">
                    {booking.property.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    📍 {booking.property.address}
                  </p>
                  <div className="flex gap-4 text-sm text-gray-600">
                    <span>🛏️ {booking.property.bedrooms} quartos</span>
                    <span>🚿 {booking.property.bathrooms} banheiros</span>
                    <span>👥 Até {booking.property.max_guests} hóspedes</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card de Datas e Hóspedes */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Sua Reserva
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Check-in</p>
                  <p className="font-semibold text-gray-900">
                    {formatDate(booking.check_in)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Check-out</p>
                  <p className="font-semibold text-gray-900">
                    {formatDate(booking.check_out)}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Número de noites:</span>
                  <span className="font-semibold text-gray-900">
                    {booking.nights} noite{booking.nights > 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-gray-600">Hóspedes:</span>
                  <span className="font-semibold text-gray-900">
                    {booking.guests} pessoa{booking.guests > 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            </div>

            {/* Card de Informações do Hóspede */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Informações do Hóspede
              </h2>

              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Nome</p>
                  <p className="font-medium text-gray-900">{booking.guest_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-900">{booking.guest_email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Telefone</p>
                  <p className="font-medium text-gray-900">{booking.guest_phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Resumo do Pagamento (Sticky) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Resumo do Pagamento
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {formatCurrency(booking.base_price)} x {booking.nights} noites
                  </span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(booking.base_price * booking.nights)}
                  </span>
                </div>

                {booking.service_fee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Taxa de serviço</span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(booking.service_fee)}
                    </span>
                  </div>
                )}

                {booking.cleaning_fee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Taxa de limpeza</span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(booking.cleaning_fee)}
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-gray-200 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-primary-600">
                    {formatCurrency(booking.total_price)}
                  </span>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <button
                onClick={handlePayment}
                disabled={processingPayment}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {processingPayment ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Processando...</span>
                  </>
                ) : (
                  <>
                    <span>💳</span>
                    <span>Pagar com Mercado Pago</span>
                  </>
                )}
              </button>

              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  🔒 Pagamento seguro via Mercado Pago
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Aceitamos PIX, cartão e boleto
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Política de Cancelamento */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-2">
            📋 Política de Cancelamento
          </h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>✅ Cancelamento com 7 dias ou mais: Reembolso total</li>
            <li>⚠️ Cancelamento entre 3 e 7 dias: Reembolso de 50%</li>
            <li>❌ Cancelamento com menos de 3 dias: Sem reembolso</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
