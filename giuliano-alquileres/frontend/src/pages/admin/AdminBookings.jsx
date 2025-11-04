import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AdminLayout from "../../components/admin/AdminLayout";
import api from "../../services/api";
import Loading from "../../components/common/Loading";
import { useAuth } from "../../contexts/AuthContext";
import {
  FaCalendarAlt,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaHome,
  FaCheckCircle,
  FaClock,
  FaBan,
  FaEye,
  FaFilter,
  FaMoneyBillWave,
  FaUsers,
} from "react-icons/fa";

const AdminBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [isAdminMaster, setIsAdminMaster] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, [user]);

  useEffect(() => {
    filterBookings();
  }, [selectedStatus, bookings]);

  const fetchBookings = async () => {
    try {
      setLoading(true);

      // Buscar todas as reservas das propriedades do admin/proprietário
      let allBookings = [];
      try {
        const bookingsResponse = await api.get("/api/bookings/owner/all");
        allBookings = bookingsResponse.data.bookings || [];
        setIsAdminMaster(bookingsResponse.data.isAdminMaster || false);
        console.log("Reservas carregadas:", allBookings.length);
        console.log("Admin Master:", bookingsResponse.data.isAdminMaster);
      } catch (error) {
        console.error("Erro ao buscar reservas:", error);
      }

      // Ordenar por data de criação (mais recentes primeiro)
      allBookings.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      setBookings(allBookings);
    } catch (error) {
      console.error("Erro ao carregar reservas:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    if (selectedStatus === "all") {
      setFilteredBookings(bookings);
    } else {
      setFilteredBookings(bookings.filter(b => b.status === selectedStatus));
    }
  };

  const handleConfirmBooking = async (booking) => {
    if (!window.confirm("Deseja confirmar esta reserva?")) return;

    try {
      setActionLoading(true);
      await api.put(`/api/bookings/${booking.uuid}/confirm`);

      // Atualizar lista
      await fetchBookings();
      setShowModal(false);
      alert("Reserva confirmada com sucesso!");
    } catch (error) {
      console.error("Erro ao confirmar reserva:", error);
      alert(error.response?.data?.error || "Erro ao confirmar reserva");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelBooking = async (booking) => {
    const reason = window.prompt("Motivo do cancelamento:");
    if (!reason) return;

    try {
      setActionLoading(true);
      await api.put(`/api/bookings/${booking.uuid}/cancel`, { reason });

      // Atualizar lista
      await fetchBookings();
      setShowModal(false);
      alert("Reserva cancelada com sucesso!");
    } catch (error) {
      console.error("Erro ao cancelar reserva:", error);
      alert(error.response?.data?.error || "Erro ao cancelar reserva");
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        label: "Pendente",
        icon: FaClock,
        color: "text-yellow-600",
        bg: "bg-yellow-100",
      },
      confirmed: {
        label: "Confirmada",
        icon: FaCheckCircle,
        color: "text-green-600",
        bg: "bg-green-100",
      },
      cancelled: {
        label: "Cancelada",
        icon: FaBan,
        color: "text-red-600",
        bg: "bg-red-100",
      },
    };
    return configs[status] || configs.pending;
  };

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === "pending").length,
    confirmed: bookings.filter(b => b.status === "confirmed").length,
    cancelled: bookings.filter(b => b.status === "cancelled").length,
    revenue: bookings
      .filter(b => b.status === "confirmed")
      .reduce((sum, b) => sum + parseFloat(b.final_price || 0), 0),
  };

  if (loading) {
    return (
      <AdminLayout>
        <Loading text="Carregando reservas..." />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <h1 className="heading-2 text-airbnb-black">
            Gerenciar Reservas
          </h1>
          {isAdminMaster && (
            <span className="px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-bold rounded-full shadow-lg">
              ADMIN MASTER
            </span>
          )}
        </div>
        <p className="body-large text-airbnb-grey-700">
          {isAdminMaster
            ? "Visualize e gerencie todas as reservas do sistema"
            : "Visualize e gerencie todas as solicitações de reserva"}
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <StatCard
          label="Total"
          value={stats.total}
          icon={FaCalendarAlt}
          color="blue"
        />
        <StatCard
          label="Pendentes"
          value={stats.pending}
          icon={FaClock}
          color="yellow"
        />
        <StatCard
          label="Confirmadas"
          value={stats.confirmed}
          icon={FaCheckCircle}
          color="green"
        />
        <StatCard
          label="Canceladas"
          value={stats.cancelled}
          icon={FaBan}
          color="red"
        />
        <StatCard
          label="Receita"
          value={formatCurrency(stats.revenue)}
          icon={FaMoneyBillWave}
          color="purple"
          isAmount
        />
      </div>

      {/* Filters */}
      <div className="card p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <FaFilter className="text-rausch" size={20} />
          <h3 className="heading-3">Filtros</h3>
        </div>

        <div className="flex flex-wrap gap-3">
          {[
            { value: "all", label: "Todas" },
            { value: "pending", label: "Pendentes" },
            { value: "confirmed", label: "Confirmadas" },
            { value: "cancelled", label: "Canceladas" },
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => setSelectedStatus(filter.value)}
              className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                selectedStatus === filter.value
                  ? "bg-rausch text-white shadow-lg"
                  : "bg-airbnb-grey-100 text-airbnb-grey-700 hover:bg-airbnb-grey-200"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="card p-12 text-center">
          <FaCalendarAlt className="text-airbnb-grey-400 text-5xl mx-auto mb-4" />
          <h3 className="heading-3 text-airbnb-grey-600 mb-2">
            Nenhuma reserva encontrada
          </h3>
          <p className="text-airbnb-grey-500">
            {selectedStatus === "all"
              ? "Não há reservas no momento"
              : `Não há reservas ${getStatusConfig(selectedStatus).label.toLowerCase()}`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredBookings.map((booking) => {
            const statusConfig = getStatusConfig(booking.status);
            const StatusIcon = statusConfig.icon;

            return (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Booking Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="heading-3 text-airbnb-black mb-1">
                          {booking.property?.title || "Propriedade"}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-airbnb-grey-600">
                          <FaHome size={14} />
                          <span>{booking.property?.address || "Endereço não disponível"}</span>
                        </div>
                        {isAdminMaster && booking.property?.owner && (
                          <div className="flex items-center gap-2 mt-1">
                            <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full font-semibold">
                              Proprietário: {booking.property.owner.name}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${statusConfig.bg}`}>
                        <StatusIcon className={statusConfig.color} size={14} />
                        <span className={`text-sm font-semibold ${statusConfig.color}`}>
                          {statusConfig.label}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2 text-sm text-airbnb-grey-700">
                        <FaUser className="text-rausch" size={14} />
                        <span>{booking.guest_name}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-airbnb-grey-700">
                        <FaCalendarAlt className="text-rausch" size={14} />
                        <span>
                          {formatDate(booking.check_in)} - {formatDate(booking.check_out)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-airbnb-grey-700">
                        <FaUsers className="text-rausch" size={14} />
                        <span>{booking.guests} hóspede(s) • {booking.nights} noite(s)</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-airbnb-grey-200">
                      <span className="text-lg font-bold text-airbnb-black">
                        {formatCurrency(booking.final_price)}
                      </span>
                      <span className="text-sm text-airbnb-grey-600 ml-2">
                        (Total)
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex lg:flex-col gap-2">
                    <button
                      onClick={() => {
                        setSelectedBooking(booking);
                        setShowModal(true);
                      }}
                      className="btn-secondary flex items-center gap-2 justify-center"
                    >
                      <FaEye />
                      <span>Detalhes</span>
                    </button>

                    {booking.status === "pending" && (
                      <button
                        onClick={() => handleConfirmBooking(booking)}
                        disabled={actionLoading}
                        className="btn-primary flex items-center gap-2 justify-center disabled:opacity-50"
                      >
                        <FaCheckCircle />
                        <span>Confirmar</span>
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Modal de Detalhes */}
      {showModal && selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          onClose={() => {
            setShowModal(false);
            setSelectedBooking(null);
          }}
          onConfirm={handleConfirmBooking}
          onCancel={handleCancelBooking}
          actionLoading={actionLoading}
          isAdminMaster={isAdminMaster}
        />
      )}
    </AdminLayout>
  );
};

// Componente de Card de Estatística
const StatCard = ({ label, value, icon: Icon, color, isAmount }) => {
  const colors = {
    blue: "bg-blue-100 text-blue-600",
    yellow: "bg-yellow-100 text-yellow-600",
    green: "bg-green-100 text-green-600",
    red: "bg-red-100 text-red-600",
    purple: "bg-purple-100 text-purple-600",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="card p-6"
    >
      <div className={`w-12 h-12 rounded-xl ${colors[color]} flex items-center justify-center mb-3`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm text-airbnb-grey-600 font-medium mb-1">{label}</p>
        <p className={`${isAmount ? "text-2xl" : "text-3xl"} font-bold text-airbnb-black`}>
          {value}
        </p>
      </div>
    </motion.div>
  );
};

// Modal de Detalhes da Reserva
const BookingDetailsModal = ({ booking, onClose, onConfirm, onCancel, actionLoading, isAdminMaster }) => {
  const statusConfig = {
    pending: { label: "Pendente", color: "yellow" },
    confirmed: { label: "Confirmada", color: "green" },
    cancelled: { label: "Cancelada", color: "red" },
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="p-6 border-b border-airbnb-grey-200">
          <div className="flex items-center justify-between">
            <h2 className="heading-2">Detalhes da Reserva</h2>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full hover:bg-airbnb-grey-100 flex items-center justify-center transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status */}
          <div>
            <label className="block text-sm font-semibold text-airbnb-grey-600 mb-2">
              Status
            </label>
            <span className={`inline-block px-4 py-2 rounded-full font-semibold bg-${statusConfig[booking.status].color}-100 text-${statusConfig[booking.status].color}-600`}>
              {statusConfig[booking.status].label}
            </span>
          </div>

          {/* Propriedade */}
          <div>
            <label className="block text-sm font-semibold text-airbnb-grey-600 mb-2">
              Propriedade
            </label>
            <p className="text-lg font-semibold text-airbnb-black">
              {booking.property?.title}
            </p>
            <p className="text-sm text-airbnb-grey-700">
              {booking.property?.address}
            </p>
          </div>

          {/* Proprietário (apenas Admin Master) */}
          {isAdminMaster && booking.property?.owner && (
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
              <label className="block text-sm font-semibold text-purple-700 mb-2">
                Proprietário da Propriedade
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-purple-600 mb-1">Nome</p>
                  <p className="text-purple-900 font-semibold">{booking.property.owner.name}</p>
                </div>
                <div>
                  <p className="text-xs text-purple-600 mb-1">Email</p>
                  <p className="text-purple-900 font-medium">{booking.property.owner.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Hóspede */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-airbnb-grey-600 mb-2">
                Nome do Hóspede
              </label>
              <p className="text-airbnb-black font-medium">{booking.guest_name}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-airbnb-grey-600 mb-2">
                Email
              </label>
              <p className="text-airbnb-black font-medium">{booking.guest_email}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-airbnb-grey-600 mb-2">
                Telefone
              </label>
              <p className="text-airbnb-black font-medium">{booking.guest_phone}</p>
            </div>

            {booking.guest_document && (
              <div>
                <label className="block text-sm font-semibold text-airbnb-grey-600 mb-2">
                  Documento
                </label>
                <p className="text-airbnb-black font-medium">{booking.guest_document}</p>
              </div>
            )}
          </div>

          {/* Datas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-airbnb-grey-600 mb-2">
                Check-in
              </label>
              <p className="text-airbnb-black font-medium">{formatDate(booking.check_in)}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-airbnb-grey-600 mb-2">
                Check-out
              </label>
              <p className="text-airbnb-black font-medium">{formatDate(booking.check_out)}</p>
            </div>
          </div>

          {/* Detalhes da Estadia */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-airbnb-grey-600 mb-2">
                Hóspedes
              </label>
              <p className="text-airbnb-black font-medium">{booking.guests}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-airbnb-grey-600 mb-2">
                Noites
              </label>
              <p className="text-airbnb-black font-medium">{booking.nights}</p>
            </div>
          </div>

          {/* Valores */}
          <div className="bg-airbnb-grey-50 rounded-xl p-4 space-y-3">
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

          {/* Observações */}
          {booking.special_requests && (
            <div>
              <label className="block text-sm font-semibold text-airbnb-grey-600 mb-2">
                Observações do Hóspede
              </label>
              <p className="text-airbnb-black bg-airbnb-grey-50 rounded-xl p-4">
                {booking.special_requests}
              </p>
            </div>
          )}
        </div>

        {/* Footer com Ações */}
        <div className="p-6 border-t border-airbnb-grey-200 flex gap-3">
          <button
            onClick={onClose}
            className="btn-secondary flex-1"
          >
            Fechar
          </button>

          {booking.status === "pending" && (
            <>
              <button
                onClick={() => onCancel(booking)}
                disabled={actionLoading}
                className="btn-secondary text-red-600 hover:bg-red-50 flex-1 disabled:opacity-50"
              >
                Recusar
              </button>

              <button
                onClick={() => onConfirm(booking)}
                disabled={actionLoading}
                className="btn-primary flex-1 disabled:opacity-50"
              >
                Confirmar Reserva
              </button>
            </>
          )}

          {booking.status === "confirmed" && (
            <button
              onClick={() => onCancel(booking)}
              disabled={actionLoading}
              className="btn-secondary text-red-600 hover:bg-red-50 flex-1 disabled:opacity-50"
            >
              Cancelar Reserva
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminBookings;
