import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";
import {
  FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaHome, FaCreditCard,
  FaFileDownload, FaArrowLeft, FaCheckCircle, FaClock, FaBan,
  FaPhone, FaEnvelope, FaUser, FaMoneyBillWave, FaStar
} from "react-icons/fa";
import Loading from "../components/common/Loading";
import BookingStatusBadge from "../components/booking/BookingStatusBadge";
import PaymentStatusBadge from "../components/booking/PaymentStatusBadge";
import AirbnbHeader from "../components/layout/AirbnbHeader";
import Footer from "../components/layout/Footer";
import CreateReviewModal from "../components/property/CreateReviewModal";

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  useEffect(() => {
    fetchBookingDetails();
  }, [id]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/bookings/${id}`);
      setBooking(response.data.booking);
    } catch (error) {
      console.error("Erro ao buscar detalhes da reserva:", error);
      setError(error.response?.data?.error || "Erro ao carregar reserva");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!window.confirm("Tem certeza que deseja cancelar esta reserva? Esta ação não pode ser desfeita.")) {
      return;
    }

    const reason = window.prompt("Por favor, informe o motivo do cancelamento:");
    if (!reason) return;

    setCancelling(true);

    try {
      console.log('[BookingDetails] Cancelando reserva:', booking.uuid);
      const response = await api.put(`/api/bookings/${booking.uuid}/cancel`, { reason });
      console.log('[BookingDetails] Resposta do cancelamento:', response.data);

      // Atualizar os detalhes da reserva
      await fetchBookingDetails();

      // Feedback de sucesso
      alert("✅ Reserva cancelada com sucesso!");
      console.log('[BookingDetails] Reserva cancelada e detalhes atualizados');
    } catch (error) {
      console.error("[BookingDetails] Erro ao cancelar reserva:", error);
      console.error("[BookingDetails] Detalhes do erro:", error.response?.data);

      const errorMessage = error.response?.data?.error || error.response?.data?.message || "Erro ao cancelar reserva";
      alert(`❌ ${errorMessage}`);
    } finally {
      setCancelling(false);
    }
  };

  const handleReviewSuccess = () => {
    setShowReviewModal(false);
    fetchBookingDetails();
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatDateShort = (date) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getCancelledByLabel = (cancelledBy) => {
    const labels = {
      guest: "Hóspede",
      owner: "Proprietário",
      admin: "Administrador",
      system: "Sistema",
    };
    return labels[cancelledBy] || cancelledBy;
  };

  const canCancel = booking && ["pending", "confirmed"].includes(booking.status);
  const canReview = booking && booking.status === "completed" && !booking.has_review;

  if (loading) {
    return (
      <>
        <AirbnbHeader />
        <Loading text="Carregando detalhes da reserva..." />
        <Footer />
      </>
    );
  }

  if (error || !booking) {
    return (
      <>
        <AirbnbHeader />
        <div className="min-h-screen bg-white py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <FaBan className="mx-auto text-6xl text-red-500 mb-4" />
              <h1 className="heading-2 mb-2">Reserva não encontrada</h1>
              <p className="text-airbnb-grey-600 mb-6">{error}</p>
              <Link to="/my-bookings" className="btn-primary inline-block">
                <FaArrowLeft className="inline mr-2" />
                Voltar para Minhas Reservas
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <AirbnbHeader />
      <div className="min-h-screen bg-airbnb-grey-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb & Back Button */}
          <div className="mb-6">
            <Link
              to="/my-bookings"
              className="inline-flex items-center text-airbnb-grey-700 hover:text-rausch transition-colors font-medium"
            >
              <FaArrowLeft className="mr-2" size={16} />
              Voltar para Minhas Reservas
            </Link>
          </div>

          {/* Header */}
          <div className="card mb-6">
            <div className="card-body">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="heading-2 mb-2">
                    Detalhes da Reserva
                  </h1>
                  <p className="text-airbnb-grey-600">
                    Código: <span className="font-mono font-semibold">{booking.uuid}</span>
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {/* Mostrar badge unificado quando ambos são pending para evitar redundância */}
                  {booking.status === 'pending' && booking.payment_status === 'pending' ? (
                    <span className="inline-flex items-center gap-2 font-semibold rounded-full border-2 bg-yellow-100 text-yellow-800 border-yellow-300 text-sm px-3 py-1.5">
                      <FaClock className="text-sm" />
                      <span>Aguardando Pagamento</span>
                    </span>
                  ) : (
                    <>
                      <BookingStatusBadge status={booking.status} />
                      {booking.payment_status !== 'pending' && (
                        <PaymentStatusBadge status={booking.payment_status} />
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Property Info */}
              <div className="card">
                <div className="card-body">
                  <h2 className="heading-3 mb-4 flex items-center gap-2">
                    <FaHome className="text-rausch" />
                    Informações do Imóvel
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-airbnb-black mb-1">
                        {booking.property?.title}
                      </h3>
                      <p className="text-airbnb-grey-700 flex items-center gap-2">
                        <FaMapMarkerAlt className="text-rausch" size={14} />
                        {booking.property?.address}
                      </p>
                      {booking.property?.city && (
                        <p className="text-sm text-airbnb-grey-600 mt-1">
                          {booking.property.city.name} - {booking.property.city.state}
                        </p>
                      )}
                    </div>
                    <Link
                      to={`/property/${booking.property?.uuid}`}
                      className="btn-secondary inline-block"
                    >
                      Ver Detalhes do Imóvel
                    </Link>
                  </div>
                </div>
              </div>

              {/* Reservation Details */}
              <div className="card">
                <div className="card-body">
                  <h2 className="heading-3 mb-4 flex items-center gap-2">
                    <FaCalendarAlt className="text-rausch" />
                    Detalhes da Estadia
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="label">Check-in</label>
                      <p className="text-lg font-semibold text-airbnb-black">
                        {formatDate(booking.check_in)}
                      </p>
                      <p className="text-sm text-airbnb-grey-600">
                        A partir das 14:00
                      </p>
                    </div>
                    <div>
                      <label className="label">Check-out</label>
                      <p className="text-lg font-semibold text-airbnb-black">
                        {formatDate(booking.check_out)}
                      </p>
                      <p className="text-sm text-airbnb-grey-600">
                        Até as 12:00
                      </p>
                    </div>
                    <div>
                      <label className="label">Número de Hóspedes</label>
                      <p className="text-lg font-semibold text-airbnb-black flex items-center gap-2">
                        <FaUsers className="text-rausch" />
                        {booking.guests} {booking.guests === 1 ? "hóspede" : "hóspedes"}
                      </p>
                    </div>
                    <div>
                      <label className="label">Duração</label>
                      <p className="text-lg font-semibold text-airbnb-black">
                        {booking.nights} {booking.nights === 1 ? "noite" : "noites"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Guest Info */}
              <div className="card">
                <div className="card-body">
                  <h2 className="heading-3 mb-4 flex items-center gap-2">
                    <FaUser className="text-rausch" />
                    Informações do Hóspede
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="label">Nome Completo</label>
                      <p className="text-airbnb-black font-medium">{booking.guest_name}</p>
                    </div>
                    <div>
                      <label className="label">Email</label>
                      <p className="text-airbnb-black font-medium flex items-center gap-2">
                        <FaEnvelope className="text-airbnb-grey-400" size={14} />
                        {booking.guest_email}
                      </p>
                    </div>
                    <div>
                      <label className="label">Telefone</label>
                      <p className="text-airbnb-black font-medium flex items-center gap-2">
                        <FaPhone className="text-airbnb-grey-400" size={14} />
                        {booking.guest_phone}
                      </p>
                    </div>
                    {booking.guest_document && (
                      <div>
                        <label className="label">Documento</label>
                        <p className="text-airbnb-black font-medium">{booking.guest_document}</p>
                      </div>
                    )}
                  </div>
                  {booking.special_requests && (
                    <div className="mt-4 pt-4 border-t border-airbnb-grey-200">
                      <label className="label">Solicitações Especiais</label>
                      <p className="text-airbnb-grey-700 bg-airbnb-grey-50 p-4 rounded-lg">
                        {booking.special_requests}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Cancellation Info */}
              {booking.status === "cancelled" && (
                <div className="card border-2 border-red-200 bg-red-50">
                  <div className="card-body">
                    <h2 className="heading-3 mb-4 flex items-center gap-2 text-red-700">
                      <FaBan />
                      Cancelamento
                    </h2>
                    <div className="space-y-2">
                      <div>
                        <label className="label text-red-700">Data do Cancelamento</label>
                        <p className="text-red-900 font-medium">
                          {formatDateShort(booking.cancelled_at)}
                        </p>
                      </div>
                      {booking.cancellation_reason && (
                        <div>
                          <label className="label text-red-700">Motivo</label>
                          <p className="text-red-900">{booking.cancellation_reason}</p>
                        </div>
                      )}
                      {booking.cancelled_by && (
                        <div>
                          <label className="label text-red-700">Cancelado por</label>
                          <p className="text-red-900">{getCancelledByLabel(booking.cancelled_by)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Price Summary */}
              <div className="card sticky top-6">
                <div className="card-body">
                  <h2 className="heading-3 mb-4 flex items-center gap-2">
                    <FaMoneyBillWave className="text-rausch" />
                    Resumo do Pagamento
                  </h2>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-airbnb-grey-700">
                        {formatCurrency(booking.price_per_night)} x {booking.nights} noites
                      </span>
                      <span className="font-semibold text-airbnb-black">
                        {formatCurrency(booking.total_price)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-airbnb-grey-700">Taxa de serviço</span>
                      <span className="font-semibold text-airbnb-black">
                        {formatCurrency(booking.service_fee)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-airbnb-grey-700">Taxa de limpeza</span>
                      <span className="font-semibold text-airbnb-black">
                        {formatCurrency(booking.cleaning_fee)}
                      </span>
                    </div>
                    <div className="pt-3 border-t-2 border-airbnb-grey-200 flex justify-between">
                      <span className="font-bold text-airbnb-black">Total</span>
                      <span className="text-xl font-bold text-rausch">
                        {formatCurrency(booking.final_price)}
                      </span>
                    </div>
                  </div>

                  {booking.payment_method && (
                    <div className="mt-4 pt-4 border-t border-airbnb-grey-200">
                      <label className="label">Método de Pagamento</label>
                      <p className="text-airbnb-black font-medium flex items-center gap-2">
                        <FaCreditCard className="text-rausch" />
                        {booking.payment_method === "credit_card" && "Cartão de Crédito"}
                        {booking.payment_method === "pix" && "PIX"}
                        {booking.payment_method === "bank_transfer" && "Transferência Bancária"}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="card">
                <div className="card-body space-y-3">
                  <h2 className="heading-3 mb-4">Ações</h2>

                  {canReview && (
                    <button
                      onClick={() => setShowReviewModal(true)}
                      className="btn-primary w-full flex items-center justify-center gap-2"
                    >
                      <FaStar />
                      Avaliar Estadia
                    </button>
                  )}

                  {canCancel && (
                    <button
                      onClick={handleCancelBooking}
                      disabled={cancelling}
                      className="btn-secondary w-full text-red-600 hover:bg-red-50 hover:border-red-300 disabled:opacity-50"
                    >
                      {cancelling ? "Cancelando..." : "Cancelar Reserva"}
                    </button>
                  )}

                  <button
                    className="btn-secondary w-full flex items-center justify-center gap-2"
                    onClick={() => window.print()}
                  >
                    <FaFileDownload />
                    Baixar Comprovante
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <CreateReviewModal
          booking={booking}
          onClose={() => setShowReviewModal(false)}
          onSuccess={handleReviewSuccess}
        />
      )}

      <Footer />
    </>
  );
};

export default BookingDetails;
