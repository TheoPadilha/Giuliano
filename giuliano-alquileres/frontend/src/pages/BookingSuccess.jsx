import { useLocation, useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";
import {
  FaCheckCircle,
  FaCalendarAlt,
  FaHome,
  FaUsers,
  FaEnvelope,
  FaPhone,
  FaInfoCircle,
  FaArrowRight,
  FaClock,
} from "react-icons/fa";
import { BetaNotice } from "../components/common/BetaBadge";

const BookingSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { booking, betaMode, message, betaNotice } = location.state || {};

  useEffect(() => {
    // Se não tiver dados da reserva, redirecionar para home
    if (!booking) {
      navigate("/");
    }
  }, [booking, navigate]);

  if (!booking) {
    return null;
  }

  const formatDate = (date) => {
    // Adiciona horário meio-dia para evitar problemas de timezone
    const dateWithTime = date.includes('T') ? date : `${date}T12:00:00`;
    return new Date(dateWithTime).toLocaleDateString("pt-BR", {
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6 animate-bounce">
            <FaCheckCircle className="text-green-600" size={48} />
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            {betaMode ? "Reserva Solicitada!" : "Reserva Confirmada!"}
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {message || "Sua reserva foi criada com sucesso!"}
          </p>
        </div>

        {/* Beta Mode Notice */}
        {betaMode && (
          <div className="mb-8">
            <BetaNotice />
            {betaNotice && (
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-5">
                <div className="flex items-start gap-3">
                  <FaInfoCircle className="text-blue-600 mt-1" size={20} />
                  <div>
                    <p className="font-semibold text-blue-900 mb-2">
                      O que acontece agora?
                    </p>
                    <p className="text-sm text-blue-800 mb-3">{betaNotice}</p>
                    <ul className="text-sm text-blue-800 space-y-2">
                      <li className="flex items-start gap-2">
                        <FaClock className="text-blue-600 mt-1" size={14} />
                        <span>
                          <strong>Aguarde a confirmação:</strong> O proprietário irá revisar sua solicitação e entrará em contato
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <FaEnvelope className="text-blue-600 mt-1" size={14} />
                        <span>
                          <strong>Verifique seu email:</strong> Enviamos os detalhes da reserva para {booking.guest_email || booking.guest?.email}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <FaPhone className="text-blue-600 mt-1" size={14} />
                        <span>
                          <strong>Mantenha contato:</strong> O proprietário poderá ligar para confirmar detalhes
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Booking Details Card */}
        <div className="card p-8 mb-6">
          <h2 className="heading-2 mb-6 pb-4 border-b border-airbnb-grey-200">
            Detalhes da Reserva
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Propriedade */}
            <div className="space-y-4">
              <div>
                <p className="text-sm text-airbnb-grey-600 mb-2 flex items-center gap-2">
                  <FaHome className="text-rausch" />
                  Propriedade
                </p>
                <p className="font-semibold text-lg text-airbnb-black">
                  {booking.property?.title || "Propriedade"}
                </p>
                {booking.property?.city && (
                  <p className="text-sm text-airbnb-grey-600">
                    {booking.property.city.name}
                  </p>
                )}
              </div>

              {/* Check-in / Check-out */}
              <div>
                <p className="text-sm text-airbnb-grey-600 mb-2 flex items-center gap-2">
                  <FaCalendarAlt className="text-rausch" />
                  Período da Estadia
                </p>
                <div className="bg-airbnb-grey-50 rounded-lg p-4 space-y-2">
                  <div>
                    <p className="text-xs text-airbnb-grey-600">Check-in</p>
                    <p className="font-semibold text-airbnb-black">
                      {formatDate(booking.check_in)}
                    </p>
                  </div>
                  <div className="border-t border-airbnb-grey-200 pt-2">
                    <p className="text-xs text-airbnb-grey-600">Check-out</p>
                    <p className="font-semibold text-airbnb-black">
                      {formatDate(booking.check_out)}
                    </p>
                  </div>
                  <div className="border-t border-airbnb-grey-200 pt-2">
                    <p className="text-xs text-airbnb-grey-600">Total de noites</p>
                    <p className="font-bold text-lg text-rausch">
                      {booking.nights} {booking.nights === 1 ? "noite" : "noites"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Hóspedes e Valores */}
            <div className="space-y-4">
              <div>
                <p className="text-sm text-airbnb-grey-600 mb-2 flex items-center gap-2">
                  <FaUsers className="text-rausch" />
                  Hóspedes
                </p>
                <p className="font-semibold text-lg text-airbnb-black">
                  {booking.guests} {booking.guests === 1 ? "hóspede" : "hóspedes"}
                </p>
              </div>

              {/* Valores */}
              <div>
                <p className="text-sm text-airbnb-grey-600 mb-2">Valores</p>
                <div className="bg-airbnb-grey-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-airbnb-grey-600">
                      {formatCurrency(booking.price_per_night)} x {booking.nights} noites
                    </span>
                    <span className="font-semibold text-airbnb-black">
                      {formatCurrency(booking.total_price)}
                    </span>
                  </div>
                  {booking.service_fee > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-airbnb-grey-600">Taxa de serviço</span>
                      <span className="font-semibold text-airbnb-black">
                        {formatCurrency(booking.service_fee)}
                      </span>
                    </div>
                  )}
                  {booking.cleaning_fee > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-airbnb-grey-600">Taxa de limpeza</span>
                      <span className="font-semibold text-airbnb-black">
                        {formatCurrency(booking.cleaning_fee)}
                      </span>
                    </div>
                  )}
                  <div className="border-t border-airbnb-grey-300 pt-2 flex justify-between">
                    <span className="font-bold text-airbnb-black">Total</span>
                    <span className="font-bold text-xl text-rausch">
                      {formatCurrency(booking.final_price || booking.total_price)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Reference */}
          <div className="mt-6 pt-6 border-t border-airbnb-grey-200">
            <p className="text-sm text-airbnb-grey-600 mb-2">Código da Reserva</p>
            <div className="bg-gradient-to-r from-rausch/10 to-kazan/10 rounded-lg p-4">
              <p className="text-2xl font-mono font-bold text-airbnb-black tracking-wider">
                #{booking.id}
              </p>
              <p className="text-xs text-airbnb-grey-600 mt-1">
                Use este código para consultar sua reserva
              </p>
            </div>
          </div>

          {/* Guest Info */}
          {(booking.guest_name || booking.guest_email) && (
            <div className="mt-6 pt-6 border-t border-airbnb-grey-200">
              <p className="text-sm text-airbnb-grey-600 mb-3">Dados do Hóspede</p>
              <div className="bg-airbnb-grey-50 rounded-lg p-4 space-y-2">
                {booking.guest_name && (
                  <p className="text-sm">
                    <span className="text-airbnb-grey-600">Nome:</span>{" "}
                    <span className="font-semibold text-airbnb-black">{booking.guest_name}</span>
                  </p>
                )}
                {booking.guest_email && (
                  <p className="text-sm">
                    <span className="text-airbnb-grey-600">Email:</span>{" "}
                    <span className="font-semibold text-airbnb-black">{booking.guest_email}</span>
                  </p>
                )}
                {booking.guest_phone && (
                  <p className="text-sm">
                    <span className="text-airbnb-grey-600">Telefone:</span>{" "}
                    <span className="font-semibold text-airbnb-black">{booking.guest_phone}</span>
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/my-bookings"
            className="btn-primary flex items-center justify-center gap-2"
          >
            Ver Minhas Reservas
            <FaArrowRight />
          </Link>
          <Link
            to="/properties"
            className="btn-secondary flex items-center justify-center gap-2"
          >
            Explorar Mais Propriedades
          </Link>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-airbnb-grey-600">
            Dúvidas? Entre em contato conosco pelo email{" "}
            <a href="mailto:contato@giulianoalquileres.com" className="link">
              contato@giulianoalquileres.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;
