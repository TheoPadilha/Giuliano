import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  FaLock, FaCheckCircle, FaCalendarAlt, FaUsers, FaHome,
  FaEnvelope, FaPhone, FaUser, FaCreditCard, FaBarcode,
  FaMoneyBillWave, FaShieldAlt, FaArrowLeft, FaInfoCircle
} from "react-icons/fa";
import api from "../services/api";
import Loading from "../components/common/Loading";
import { BetaNotice } from "../components/common/BetaBadge";

const BookingCheckout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // Dados da reserva vindos do PropertyDetails
  const { property, bookingData } = location.state || {};

  // Estados do formulário
  const [guestInfo, setGuestInfo] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: "",
    document: "",
    country: "Brasil",
    specialRequests: ""
  });

  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1); // 1: Dados, 2: Pagamento

  useEffect(() => {
    if (!isAuthenticated) {
      // Salvar dados da reserva no sessionStorage antes de redirecionar
      if (property && bookingData) {
        sessionStorage.setItem('pendingBooking', JSON.stringify({
          property,
          bookingData,
          timestamp: Date.now()
        }));
      }
      navigate("/guest-login", { state: { from: location } });
      return;
    }

    // Se não tem dados no state mas tem no sessionStorage, recuperar
    if (!property || !bookingData) {
      const pendingBooking = sessionStorage.getItem('pendingBooking');
      if (pendingBooking) {
        try {
          const { property: savedProperty, bookingData: savedBookingData, timestamp } = JSON.parse(pendingBooking);

          // Verificar se os dados não estão muito antigos (30 minutos)
          const thirtyMinutes = 30 * 60 * 1000;
          if (Date.now() - timestamp < thirtyMinutes) {
            // Restaurar os dados no state do location
            navigate("/booking-checkout", {
              state: { property: savedProperty, bookingData: savedBookingData },
              replace: true
            });
            sessionStorage.removeItem('pendingBooking');
            return;
          } else {
            // Dados muito antigos, limpar
            sessionStorage.removeItem('pendingBooking');
          }
        } catch (error) {
          console.error('Erro ao recuperar dados da reserva:', error);
          sessionStorage.removeItem('pendingBooking');
        }
      }

      // Se não conseguiu recuperar, redirecionar para properties
      navigate("/properties");
      return;
    }
  }, [isAuthenticated, property, bookingData, navigate, location]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGuestInfo(prev => ({ ...prev, [name]: value }));
  };

  const validateStep1 = () => {
    if (!guestInfo.fullName || !guestInfo.email || !guestInfo.phone || !guestInfo.document) {
      setError("Por favor, preencha todos os campos obrigatórios");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(guestInfo.email)) {
      setError("Email inválido");
      return false;
    }

    const phoneRegex = /^(\(?\d{2}\)?\s?)?\d{4,5}-?\d{4}$/;
    if (!phoneRegex.test(guestInfo.phone)) {
      setError("Telefone inválido. Use o formato (XX) XXXXX-XXXX ou XX XXXXX-XXXX");
      return false;
    }

    setError("");
    return true;
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (validateStep1()) {
        setStep(2);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleCreateBooking = async () => {
    if (!agreeToTerms) {
      setError("Você precisa concordar com os termos e condições");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const isBetaMode = import.meta.env.VITE_BETA_MODE === "true";

      // Normalizar telefone (remover parênteses, espaços e traços)
      const normalizedPhone = guestInfo.phone.replace(/[^\d]/g, '');

      // Criar reserva
      const bookingResponse = await api.post("/api/bookings", {
        property_id: property.id,
        check_in: bookingData.checkIn,
        check_out: bookingData.checkOut,
        guests: bookingData.totalGuests,
        guest_name: guestInfo.fullName,
        guest_email: guestInfo.email,
        guest_phone: normalizedPhone,
        guest_document: guestInfo.document,
        special_requests: guestInfo.specialRequests,
        payment_method: paymentMethod,
        rooms_data: bookingData.rooms ? JSON.stringify(bookingData.rooms) : JSON.stringify([])
      });

      const booking = bookingResponse.data.booking;

      // Modo Beta: Reserva criada sem pagamento
      if (isBetaMode || bookingResponse.data.betaMode) {
        // Limpar dados pendentes do sessionStorage
        sessionStorage.removeItem('pendingBooking');

        // Redirecionar para página de sucesso com mensagem Beta
        navigate("/booking-success", {
          state: {
            booking,
            betaMode: true,
            message: bookingResponse.data.message,
            betaNotice: bookingResponse.data.betaNotice,
          },
        });
        return;
      }

      // Modo Produção: Criar preferência de pagamento no Mercado Pago
      const paymentResponse = await api.post("/api/payments/create-preference", {
        booking_id: booking.id,
        payment_method: paymentMethod
      });

      const { init_point, sandbox_init_point } = paymentResponse.data.payment;

      // Limpar dados pendentes do sessionStorage antes de redirecionar para MP
      sessionStorage.removeItem('pendingBooking');

      // Redirecionar para Mercado Pago
      const paymentUrl = import.meta.env.MODE === "production" ? init_point : sandbox_init_point;
      window.location.href = paymentUrl;

    } catch (error) {
      console.error("Erro ao criar reserva:", error);
      setError(error.response?.data?.error || "Erro ao processar reserva. Tente novamente.");
      setLoading(false);
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
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (!property || !bookingData) {
    return <Loading text="Carregando..." />;
  }

  const isBetaMode = import.meta.env.VITE_BETA_MODE === "true";

  // Cálculo de preços
  const nights = bookingData.nights;
  const basePrice = property.price_per_night * nights;
  const serviceFee = basePrice * 0.10;
  const cleaningFee = 50;
  const totalPrice = basePrice + serviceFee + cleaningFee;

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="text-rausch hover:text-rausch-dark flex items-center gap-2 mb-4 font-semibold transition-colors"
          >
            <FaArrowLeft />
            <span>Voltar aos detalhes</span>
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Finalizar Reserva
              </h1>
              <p className="text-gray-600">
                Você está a poucos passos de garantir sua hospedagem
              </p>
            </div>

            {/* Progress Steps */}
            <div className="hidden md:flex items-center gap-4">
              <div className={`flex items-center gap-2 ${step >= 1 ? 'text-rausch' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-rausch text-white' : 'bg-gray-300 text-gray-600'}`}>
                  {step > 1 ? <FaCheckCircle /> : '1'}
                </div>
                <span className="font-semibold">Dados</span>
              </div>
              <div className="w-16 h-1 bg-gray-300" />
              <div className={`flex items-center gap-2 ${step >= 2 ? 'text-rausch' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-rausch text-white' : 'bg-gray-300 text-gray-600'}`}>
                  2
                </div>
                <span className="font-semibold">Pagamento</span>
              </div>
            </div>
          </div>
        </div>

        {/* Beta Mode Notice */}
        {isBetaMode && (
          <div className="mb-8">
            <BetaNotice />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Formulário */}
          <div className="lg:col-span-2 space-y-6">
            {step === 1 && (
              <>
                {/* Dados do Hóspede */}
                <div className="card p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-rausch/10 rounded-full flex items-center justify-center">
                      <FaUser className="text-rausch" size={20} />
                    </div>
                    <div>
                      <h2 className="heading-2">Dados do Hóspede</h2>
                      <p className="text-sm text-airbnb-grey-600">Preencha suas informações pessoais</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nome Completo */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nome Completo <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-airbnb-grey-400" size={20} />
                        <input
                          type="text"
                          name="fullName"
                          value={guestInfo.fullName}
                          onChange={handleInputChange}
                          placeholder="Digite seu nome completo"
                          className="input pl-12"
                          required
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-airbnb-grey-400" size={20} />
                        <input
                          type="email"
                          name="email"
                          value={guestInfo.email}
                          onChange={handleInputChange}
                          placeholder="seu@email.com"
                          className="input pl-12"
                          required
                        />
                      </div>
                    </div>

                    {/* Telefone */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Telefone <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-airbnb-grey-400" size={20} />
                        <input
                          type="tel"
                          name="phone"
                          value={guestInfo.phone}
                          onChange={handleInputChange}
                          placeholder="(XX) XXXXX-XXXX ou XX XXXXX-XXXX"
                          className="input pl-12"
                          required
                        />
                      </div>
                    </div>

                    {/* CPF/Documento */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        CPF <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="document"
                        value={guestInfo.document}
                        onChange={handleInputChange}
                        placeholder="000.000.000-00"
                        className="input"
                        required
                      />
                    </div>

                    {/* País */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        País
                      </label>
                      <select
                        name="country"
                        value={guestInfo.country}
                        onChange={handleInputChange}
                        className="input"
                      >
                        <option value="Brasil">Brasil</option>
                        <option value="Argentina">Argentina</option>
                        <option value="Uruguai">Uruguai</option>
                        <option value="Paraguai">Paraguai</option>
                        <option value="Chile">Chile</option>
                        <option value="Outro">Outro</option>
                      </select>
                    </div>

                    {/* Observações */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Observações / Pedidos Especiais (Opcional)
                      </label>
                      <textarea
                        name="specialRequests"
                        value={guestInfo.specialRequests}
                        onChange={handleInputChange}
                        placeholder="Horário de chegada estimado, necessidades especiais, etc."
                        rows={4}
                        className="input resize-none"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                {/* Método de Pagamento */}
                <div className="card p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-rausch/10 rounded-full flex items-center justify-center">
                      <FaCreditCard className="text-rausch" size={20} />
                    </div>
                    <div>
                      <h2 className="heading-2">Método de Pagamento</h2>
                      <p className="text-sm text-airbnb-grey-600">Escolha como deseja pagar</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Cartão de Crédito */}
                    <button
                      onClick={() => setPaymentMethod("credit_card")}
                      className={`p-6 border-2 rounded-xl transition-all ${
                        paymentMethod === "credit_card"
                          ? "border-rausch bg-rausch/5 shadow-lg"
                          : "border-airbnb-grey-300 hover:border-airbnb-grey-400"
                      }`}
                    >
                      <FaCreditCard className={`text-4xl mx-auto mb-3 ${paymentMethod === "credit_card" ? "text-rausch" : "text-airbnb-grey-400"}`} />
                      <p className="font-bold text-gray-900 mb-1">Cartão de Crédito</p>
                      <p className="text-xs text-airbnb-grey-600">Em até 12x</p>
                    </button>

                    {/* PIX */}
                    <button
                      onClick={() => setPaymentMethod("pix")}
                      className={`p-6 border-2 rounded-xl transition-all ${
                        paymentMethod === "pix"
                          ? "border-rausch bg-rausch/5 shadow-lg"
                          : "border-airbnb-grey-300 hover:border-airbnb-grey-400"
                      }`}
                    >
                      <FaMoneyBillWave className={`text-4xl mx-auto mb-3 ${paymentMethod === "pix" ? "text-rausch" : "text-airbnb-grey-400"}`} />
                      <p className="font-bold text-gray-900 mb-1">PIX</p>
                      <p className="text-xs text-airbnb-grey-600">À vista</p>
                    </button>

                    {/* Boleto */}
                    <button
                      onClick={() => setPaymentMethod("boleto")}
                      className={`p-6 border-2 rounded-xl transition-all ${
                        paymentMethod === "boleto"
                          ? "border-rausch bg-rausch/5 shadow-lg"
                          : "border-airbnb-grey-300 hover:border-airbnb-grey-400"
                      }`}
                    >
                      <FaBarcode className={`text-4xl mx-auto mb-3 ${paymentMethod === "boleto" ? "text-rausch" : "text-airbnb-grey-400"}`} />
                      <p className="font-bold text-gray-900 mb-1">Boleto</p>
                      <p className="text-xs text-airbnb-grey-600">Vence em 3 dias</p>
                    </button>
                  </div>

                  {/* Info de Segurança */}
                  <div className="mt-6 bg-airbnb-grey-50 border border-airbnb-grey-200 rounded-xl p-4 flex items-start gap-3">
                    <FaShieldAlt className="text-rausch" size={20} />
                    <div>
                      <p className="font-semibold text-airbnb-black mb-1">Pagamento 100% Seguro</p>
                      <p className="text-sm text-airbnb-grey-700">
                        Todos os pagamentos são processados pelo Mercado Pago com criptografia de ponta a ponta.
                        Seus dados estão protegidos.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Termos e Condições */}
                <div className="card p-8">
                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={agreeToTerms}
                      onChange={(e) => setAgreeToTerms(e.target.checked)}
                      className="mt-1 w-5 h-5 text-rausch border-gray-300 rounded focus:ring-rausch"
                    />
                    <label htmlFor="terms" className="text-sm text-airbnb-grey-700">
                      <span className="font-semibold">Li e concordo com </span>
                      <a href="/terms" target="_blank" className="link">
                        os Termos e Condições
                      </a>
                      {" e a "}
                      <a href="/privacy" target="_blank" className="link">
                        Política de Privacidade
                      </a>
                      . Estou ciente da política de cancelamento e aceito as condições da reserva.
                    </label>
                  </div>
                </div>
              </>
            )}

            {/* Error Message */}
            {error && (
              <div className="alert-error flex items-center gap-3">
                <FaInfoCircle size={20} />
                <p className="font-medium">{error}</p>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between gap-4">
              {step === 2 && (
                <button
                  onClick={() => setStep(1)}
                  className="btn-secondary"
                >
                  ← Voltar
                </button>
              )}

              {step === 1 ? (
                <button
                  onClick={handleNextStep}
                  className="ml-auto btn-primary"
                >
                  Continuar para Pagamento →
                </button>
              ) : (
                <button
                  onClick={handleCreateBooking}
                  disabled={loading || !agreeToTerms}
                  className="ml-auto btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="spinner-sm"></div>
                      <span>Processando...</span>
                    </>
                  ) : (
                    <>
                      <FaLock />
                      <span>Confirmar e Pagar</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Sidebar - Resumo da Reserva (Sticky) */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-6">
              {/* Propriedade */}
              <div className="mb-6">
                <h3 className="heading-3 mb-4">Resumo da Reserva</h3>
                {property.photos && property.photos[0] && (
                  <img
                    src={property.photos[0].url}
                    alt={property.title}
                    className="w-full h-40 object-cover rounded-xl mb-4"
                  />
                )}
                <h4 className="font-bold text-gray-900 mb-2">{property.title}</h4>
                <p className="text-sm text-airbnb-grey-600 flex items-center gap-2">
                  <FaHome className="text-rausch" size={16} />
                  {property.type === "house" ? "Casa" : property.type === "apartment" ? "Apartamento" : "Imóvel"}
                </p>
              </div>

              {/* Datas */}
              <div className="mb-6 pb-6 divider">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-airbnb-grey-600 mb-1 flex items-center gap-1">
                      <FaCalendarAlt className="text-rausch" size={14} />
                      <span>Check-in</span>
                    </p>
                    <p className="font-semibold text-airbnb-black text-sm">
                      {formatDate(bookingData.checkIn)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-airbnb-grey-600 mb-1 flex items-center gap-1">
                      <FaCalendarAlt className="text-rausch" size={14} />
                      <span>Check-out</span>
                    </p>
                    <p className="font-semibold text-airbnb-black text-sm">
                      {formatDate(bookingData.checkOut)}
                    </p>
                  </div>
                </div>

                <div className="bg-airbnb-grey-50 rounded-lg p-3">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-airbnb-grey-600">Noites:</span>
                    <span className="font-bold text-airbnb-black">{nights}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-airbnb-grey-600 flex items-center gap-2">
                      <FaUsers className="text-rausch" size={14} />
                      Hóspedes:
                    </span>
                    <span className="font-bold text-airbnb-black">{bookingData.totalGuests}</span>
                  </div>
                  {bookingData.rooms && bookingData.rooms.length > 0 && (
                    <div className="flex items-center justify-between text-sm mt-2">
                      <span className="text-airbnb-grey-600">Quartos:</span>
                      <span className="font-bold text-airbnb-black">{bookingData.rooms.length}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Breakdown de Preços */}
              <div className="mb-6 space-y-3">
                <h4 className="heading-3 mb-3">Detalhamento do Preço</h4>

                <div className="flex justify-between text-sm">
                  <span className="text-airbnb-grey-600">
                    {formatCurrency(property.price_per_night)} x {nights} noites
                  </span>
                  <span className="font-semibold text-airbnb-black">
                    {formatCurrency(basePrice)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-airbnb-grey-600">Taxa de serviço (10%)</span>
                  <span className="font-semibold text-airbnb-black">
                    {formatCurrency(serviceFee)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-airbnb-grey-600">Taxa de limpeza</span>
                  <span className="font-semibold text-airbnb-black">
                    {formatCurrency(cleaningFee)}
                  </span>
                </div>
              </div>

              {/* Total */}
              <div className="pt-6 border-t-2 border-airbnb-grey-200">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-airbnb-black">Total</span>
                  <span className="text-3xl font-bold text-rausch">
                    {formatCurrency(totalPrice)}
                  </span>
                </div>
                <p className="text-xs text-airbnb-grey-500 mt-2 text-right">
                  Você não será cobrado ainda
                </p>
              </div>

              {/* Política de Cancelamento */}
              <div className="mt-6 bg-airbnb-grey-50 border border-airbnb-grey-200 rounded-xl p-4">
                <p className="font-semibold text-airbnb-black mb-2 text-sm">
                  Cancelamento Flexível
                </p>
                <ul className="text-xs text-airbnb-grey-700 space-y-1">
                  <li>Reembolso total até 7 dias antes</li>
                  <li>Reembolso de 50% entre 3-7 dias</li>
                  <li>Sem reembolso em menos de 3 dias</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCheckout;
