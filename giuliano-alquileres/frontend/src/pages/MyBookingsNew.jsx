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
import CreateReviewModal from "../components/property/CreateReviewModal";

const MyBookingsNew = () => {
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
    // Adiciona horário meio-dia para evitar problemas de timezone
    const dateWithTime = date.includes('T') ? date : `${date}T12:00:00`;
    return new Date(dateWithTime).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateLong = (date) => {
    // Adiciona horário meio-dia para evitar problemas de timezone
    const dateWithTime = date.includes('T') ? date : `${date}T12:00:00`;
    return new Date(dateWithTime).toLocaleDateString("pt-BR", {
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
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="heading-2 mb-2">
            Minhas Reservas
          </h1>
          <p className="text-airbnb-grey-600">
            Gerencie e acompanhe todas as suas reservas em um só lugar
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="card p-6 border-2 border-airbnb-grey-200 hover:border-rausch transition-all cursor-pointer"
               onClick={() => setStatusFilter("all")}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-airbnb-grey-600 text-sm font-medium">Total</span>
              <FaHome className="text-airbnb-grey-400 text-xl" />
            </div>
            <p className="text-3xl font-bold text-airbnb-black">{stats.total}</p>
          </div>

          <div className="card p-6 border-2 border-airbnb-grey-200 hover:border-rausch transition-all cursor-pointer"
               onClick={() => setStatusFilter("confirmed")}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-rausch text-sm font-medium">Confirmadas</span>
              <FaCheckCircle className="text-rausch text-xl" />
            </div>
            <p className="text-3xl font-bold text-rausch">{stats.confirmed}</p>
          </div>

          <div className="card p-6 border-2 border-airbnb-grey-200 hover:border-rausch transition-all cursor-pointer"
               onClick={() => setStatusFilter("pending")}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-airbnb-grey-600 text-sm font-medium">Pendentes</span>
              <FaClock className="text-airbnb-grey-500 text-xl" />
            </div>
            <p className="text-3xl font-bold text-airbnb-grey-700">{stats.pending}</p>
          </div>

          <div className="card p-6 border-2 border-airbnb-grey-200 hover:border-rausch transition-all cursor-pointer"
               onClick={() => setStatusFilter("completed")}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-airbnb-grey-600 text-sm font-medium">Concluídas</span>
              <FaStar className="text-airbnb-grey-500 text-xl" />
            </div>
            <p className="text-3xl font-bold text-airbnb-grey-700">{stats.completed}</p>
          </div>

          <div className="card p-6 border-2 border-airbnb-grey-200 hover:border-rausch transition-all cursor-pointer"
               onClick={() => setStatusFilter("cancelled")}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-airbnb-grey-600 text-sm font-medium">Canceladas</span>
              <FaBan className="text-airbnb-grey-500 text-xl" />
            </div>
            <p className="text-3xl font-bold text-airbnb-grey-700">{stats.cancelled}</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="card p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-airbnb-grey-400" />
                <input
                  type="text"
                  placeholder="Buscar por imóvel ou localização..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-12"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="md:w-64">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input font-semibold"
              >
                <option value="all">Todas</option>
                <option value="confirmed">Confirmadas</option>
                <option value="pending">Pendentes</option>
                <option value="in_progress">Em Andamento</option>
                <option value="completed">Concluídas</option>
                <option value="cancelled">Canceladas</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-airbnb-grey-400 text-6xl mb-4">📭</div>
            <h3 className="heading-2 mb-2">
              Nenhuma reserva encontrada
            </h3>
            <p className="text-airbnb-grey-600 mb-6">
              {statusFilter === "all"
                ? "Você ainda não fez nenhuma reserva"
                : `Não há reservas com o status "${statusFilter}"`}
            </p>
            <Link
              to="/properties"
              className="btn-primary inline-block"
            >
              Explorar Imóveis
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="card border-2 border-airbnb-grey-200 hover:border-rausch transition-all overflow-hidden"
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
                    <div className="absolute top-4 left-4">
                      <BookingStatusBadge status={booking.status} />
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          {booking.property.title}
                        </h3>
                        <p className="text-airbnb-grey-600 flex items-center gap-2">
                          <FaMapMarkerAlt className="text-rausch" />
                          {booking.property.address}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-airbnb-grey-600 mb-1">Reserva</p>
                        <p className="text-lg font-mono font-bold text-rausch">
                          #{booking.uuid?.slice(0, 8).toUpperCase()}
                        </p>
                      </div>
                    </div>

                    {/* Dates and Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-airbnb-grey-50 rounded-xl p-4">
                      <div>
                        <p className="text-xs text-airbnb-grey-600 mb-1 flex items-center gap-1">
                          <FaCalendarAlt className="text-rausch" />
                          <span>Check-in</span>
                        </p>
                        <p className="font-bold text-airbnb-black">
                          {formatDate(booking.check_in)}
                        </p>
                        <p className="text-xs text-airbnb-grey-500">Após 14:00</p>
                      </div>

                      <div>
                        <p className="text-xs text-airbnb-grey-600 mb-1 flex items-center gap-1">
                          <FaCalendarAlt className="text-rausch" />
                          <span>Check-out</span>
                        </p>
                        <p className="font-bold text-airbnb-black">
                          {formatDate(booking.check_out)}
                        </p>
                        <p className="text-xs text-airbnb-grey-500">Até 12:00</p>
                      </div>

                      <div>
                        <p className="text-xs text-airbnb-grey-600 mb-1 flex items-center gap-1">
                          <FaUsers className="text-rausch" />
                          <span>Hóspedes</span>
                        </p>
                        <p className="font-bold text-airbnb-black">
                          {booking.guests} {booking.guests === 1 ? "pessoa" : "pessoas"}
                        </p>
                        <p className="text-xs text-airbnb-grey-500">
                          {booking.nights} {booking.nights === 1 ? "noite" : "noites"}
                        </p>
                      </div>
                    </div>

                    {/* Price and Actions */}
                    <div className="flex items-center justify-between pt-4 divider">
                      <div>
                        <p className="text-sm text-airbnb-grey-600 mb-1">Total Pago</p>
                        <p className="text-3xl font-bold text-rausch">
                          {formatCurrency(booking.final_price || booking.total_price)}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* View Details */}
                        <Link
                          to={`/my-bookings/${booking.uuid}`}
                          className="btn-secondary flex items-center gap-2"
                        >
                          <FaEye />
                          <span>Detalhes</span>
                        </Link>

                        {/* Review (if completed and not reviewed) */}
                        {booking.status === "completed" && !booking.has_review && (
                          <button
                            onClick={() => handleOpenReviewModal(booking)}
                            className="btn-secondary flex items-center gap-2 !bg-yellow-500 !text-white hover:!bg-yellow-600"
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
                            className="btn-secondary flex items-center gap-2 !bg-red-600 !text-white hover:!bg-red-700 disabled:opacity-50"
                          >
                            {cancelling === booking.uuid ? (
                              <>
                                <div className="spinner-sm"></div>
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
