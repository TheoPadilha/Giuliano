import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";
import {
  FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaHome,
  FaFilter, FaSearch, FaStar, FaBan, FaEye,
  FaDownload, FaWhatsapp, FaClock, FaCheckCircle
} from "react-icons/fa";
import Loading from "../components/common/Loading";
import BookingStatusBadge from "../components/booking/BookingStatusBadge";
import PaymentStatusBadge from "../components/booking/PaymentStatusBadge";
import CreateReviewModal from "../components/property/CreateReviewModal";

const MyBookingsNew = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/bookings/my");
      setBookings(response.data.bookings || []);
    } catch (error) {
      console.error("Erro ao buscar reservas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Tem certeza que deseja cancelar esta reserva?")) {
      return;
    }

    try {
      setCancelling(bookingId);
      await api.put(`/api/bookings/${bookingId}/cancel`);
      await fetchBookings();
      alert("Reserva cancelada com sucesso!");
    } catch (error) {
      console.error("Erro ao cancelar reserva:", error);
      alert(error.response?.data?.error || "Erro ao cancelar reserva");
    } finally {
      setCancelling(null);
    }
  };

  const handleOpenReviewModal = (booking) => {
    setSelectedBooking(booking);
    setShowReviewModal(true);
  };

  const handleReviewSuccess = () => {
    setShowReviewModal(false);
    setSelectedBooking(null);
    fetchBookings();
  };

  // Filtros e busca
  const filteredBookings = bookings.filter((booking) => {
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
    const matchesSearch =
      booking.property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.property.address.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Estatísticas
  const stats = {
    total: bookings.length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    pending: bookings.filter((b) => b.status === "pending").length,
    completed: bookings.filter((b) => b.status === "completed").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
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
      month: "short",
      year: "numeric",
    });
  };

  const formatDateLong = (date) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return <Loading text="Carregando suas reservas..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Minhas Reservas
          </h1>
          <p className="text-gray-600">
            Gerencie e acompanhe todas as suas reservas em um só lugar
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-2 border-gray-200 hover:border-primary-500 transition-all cursor-pointer"
               onClick={() => setStatusFilter("all")}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Total</span>
              <FaHome className="text-gray-400 text-xl" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-2 border-green-200 hover:border-green-500 transition-all cursor-pointer"
               onClick={() => setStatusFilter("confirmed")}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-green-600 text-sm font-medium">Confirmadas</span>
              <FaCheckCircle className="text-green-500 text-xl" />
            </div>
            <p className="text-3xl font-bold text-green-700">{stats.confirmed}</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-2 border-yellow-200 hover:border-yellow-500 transition-all cursor-pointer"
               onClick={() => setStatusFilter("pending")}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-yellow-600 text-sm font-medium">Pendentes</span>
              <FaClock className="text-yellow-500 text-xl" />
            </div>
            <p className="text-3xl font-bold text-yellow-700">{stats.pending}</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-2 border-blue-200 hover:border-blue-500 transition-all cursor-pointer"
               onClick={() => setStatusFilter("completed")}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-600 text-sm font-medium">Concluídas</span>
              <FaStar className="text-blue-500 text-xl" />
            </div>
            <p className="text-3xl font-bold text-blue-700">{stats.completed}</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-2 border-red-200 hover:border-red-500 transition-all cursor-pointer"
               onClick={() => setStatusFilter("cancelled")}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-red-600 text-sm font-medium">Canceladas</span>
              <FaBan className="text-red-500 text-xl" />
            </div>
            <p className="text-3xl font-bold text-red-700">{stats.cancelled}</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por imóvel ou localização..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="md:w-64">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all font-semibold"
              >
                <option value="all">🔍 Todas</option>
                <option value="confirmed">✅ Confirmadas</option>
                <option value="pending">⏳ Pendentes</option>
                <option value="in_progress">🏠 Em Andamento</option>
                <option value="completed">⭐ Concluídas</option>
                <option value="cancelled">❌ Canceladas</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">📭</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Nenhuma reserva encontrada
            </h3>
            <p className="text-gray-600 mb-6">
              {statusFilter === "all"
                ? "Você ainda não fez nenhuma reserva"
                : `Não há reservas com o status "${statusFilter}"`}
            </p>
            <Link
              to="/properties"
              className="inline-block bg-primary-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-all shadow-lg"
            >
              Explorar Imóveis
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 hover:border-primary-500 transition-all overflow-hidden"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Property Image */}
                  <div className="md:w-80 h-64 md:h-auto relative">
                    {booking.property.photos && booking.property.photos[0] && (
                      <img
                        src={booking.property.photos[0].url}
                        alt={booking.property.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute top-4 left-4 flex gap-2">
                      <BookingStatusBadge status={booking.status} />
                      <PaymentStatusBadge status={booking.payment_status} />
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          {booking.property.title}
                        </h3>
                        <p className="text-gray-600 flex items-center gap-2">
                          <FaMapMarkerAlt className="text-primary-600" />
                          {booking.property.address}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-gray-600 mb-1">Reserva</p>
                        <p className="text-lg font-mono font-bold text-primary-600">
                          #{booking.uuid?.slice(0, 8).toUpperCase()}
                        </p>
                      </div>
                    </div>

                    {/* Dates and Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-gray-50 rounded-xl p-4">
                      <div>
                        <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                          <FaCalendarAlt className="text-green-600" />
                          <span>Check-in</span>
                        </p>
                        <p className="font-bold text-gray-900">
                          {formatDate(booking.check_in)}
                        </p>
                        <p className="text-xs text-gray-500">Após 14:00</p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                          <FaCalendarAlt className="text-orange-600" />
                          <span>Check-out</span>
                        </p>
                        <p className="font-bold text-gray-900">
                          {formatDate(booking.check_out)}
                        </p>
                        <p className="text-xs text-gray-500">Até 12:00</p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                          <FaUsers className="text-blue-600" />
                          <span>Hóspedes</span>
                        </p>
                        <p className="font-bold text-gray-900">
                          {booking.guests} {booking.guests === 1 ? "pessoa" : "pessoas"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {booking.nights} {booking.nights === 1 ? "noite" : "noites"}
                        </p>
                      </div>
                    </div>

                    {/* Price and Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Total Pago</p>
                        <p className="text-3xl font-bold text-green-600">
                          {formatCurrency(booking.final_price || booking.total_price)}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* View Details */}
                        <Link
                          to={`/booking/${booking.uuid}`}
                          className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all flex items-center gap-2"
                        >
                          <FaEye />
                          <span>Detalhes</span>
                        </Link>

                        {/* Review (if completed and not reviewed) */}
                        {booking.status === "completed" && !booking.has_review && (
                          <button
                            onClick={() => handleOpenReviewModal(booking)}
                            className="px-4 py-2.5 bg-yellow-500 text-white rounded-xl font-semibold hover:bg-yellow-600 transition-all flex items-center gap-2"
                          >
                            <FaStar />
                            <span>Avaliar</span>
                          </button>
                        )}

                        {/* Cancel (if confirmed or pending) */}
                        {(booking.status === "confirmed" || booking.status === "pending") && (
                          <button
                            onClick={() => handleCancelBooking(booking.uuid)}
                            disabled={cancelling === booking.uuid}
                            className="px-4 py-2.5 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all flex items-center gap-2 disabled:opacity-50"
                          >
                            {cancelling === booking.uuid ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                <span>Cancelando...</span>
                              </>
                            ) : (
                              <>
                                <FaBan />
                                <span>Cancelar</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedBooking && (
        <CreateReviewModal
          booking={selectedBooking}
          onClose={() => {
            setShowReviewModal(false);
            setSelectedBooking(null);
          }}
          onSuccess={handleReviewSuccess}
        />
      )}
    </div>
  );
};

export default MyBookingsNew;
