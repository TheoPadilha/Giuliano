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
      navigate("/login", { state: { from: location } });
      return;
    }

    if (!property || !bookingData) {
      navigate("/properties");
      return;
    }
  }, [isAuthenticated, property, bookingData]);

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

    const phoneRegex = /^\(\d{2}\)\s?\d{4,5}-?\d{4}$/;
    if (!phoneRegex.test(guestInfo.phone)) {
      setError("Telefone inválido. Use o formato (XX) XXXXX-XXXX");
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

      // Criar reserva
      const bookingResponse = await api.post("/api/bookings", {
        property_id: property.id,
        check_in: bookingData.checkIn,
        check_out: bookingData.checkOut,
        guests: bookingData.totalGuests,
        guest_name: guestInfo.fullName,
        guest_email: guestInfo.email,
        guest_phone: guestInfo.phone,
        guest_document: guestInfo.document,
        special_requests: guestInfo.specialRequests,
        payment_method: paymentMethod,
        rooms_data: JSON.stringify(bookingData.rooms)
      });

      const booking = bookingResponse.data.booking;

      // Criar preferência de pagamento no Mercado Pago
      const paymentResponse = await api.post("/api/payments/create-preference", {
        booking_id: booking.id,
        payment_method: paymentMethod
      });

      const { init_point, sandbox_init_point } = paymentResponse.data.payment;

      // Redirecionar para Mercado Pago
      const paymentUrl = process.env.NODE_ENV === "production" ? init_point : sandbox_init_point;
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

  // Cálculo de preços
  const nights = bookingData.nights;
  const basePrice = property.price_per_night * nights;
  const serviceFee = basePrice * 0.10;
  const cleaningFee = 50;
  const totalPrice = basePrice + serviceFee + cleaningFee;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="text-primary-600 hover:text-primary-700 flex items-center gap-2 mb-4 font-semibold transition-colors"
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
              <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary-600' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                  {step > 1 ? <FaCheckCircle /> : '1'}
                </div>
                <span className="font-semibold">Dados</span>
              </div>
              <div className="w-16 h-1 bg-gray-300" />
              <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary-600' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                  2
                </div>
                <span className="font-semibold">Pagamento</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Formulário */}
          <div className="lg:col-span-2 space-y-6">
            {step === 1 && (
              <>
                {/* Dados do Hóspede */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <FaUser className="text-primary-600 text-xl" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Dados do Hóspede</h2>
                      <p className="text-sm text-gray-600">Preencha suas informações pessoais</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nome Completo */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nome Completo <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          name="fullName"
                          value={guestInfo.fullName}
                          onChange={handleInputChange}
                          placeholder="Digite seu nome completo"
                          className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all"
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
                        <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={guestInfo.email}
                          onChange={handleInputChange}
                          placeholder="seu@email.com"
                          className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all"
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
                        <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={guestInfo.phone}
                          onChange={handleInputChange}
                          placeholder="(XX) XXXXX-XXXX"
                          className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all"
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
                        className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all"
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
                        className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all"
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
                        className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all resize-none"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                {/* Método de Pagamento */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <FaCreditCard className="text-green-600 text-xl" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Método de Pagamento</h2>
                      <p className="text-sm text-gray-600">Escolha como deseja pagar</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Cartão de Crédito */}
                    <button
                      onClick={() => setPaymentMethod("credit_card")}
                      className={`p-6 border-2 rounded-xl transition-all ${
                        paymentMethod === "credit_card"
                          ? "border-primary-600 bg-primary-50 shadow-lg"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <FaCreditCard className={`text-4xl mx-auto mb-3 ${paymentMethod === "credit_card" ? "text-primary-600" : "text-gray-400"}`} />
                      <p className="font-bold text-gray-900 mb-1">Cartão de Crédito</p>
                      <p className="text-xs text-gray-600">Em até 12x</p>
                    </button>

                    {/* PIX */}
                    <button
                      onClick={() => setPaymentMethod("pix")}
                      className={`p-6 border-2 rounded-xl transition-all ${
                        paymentMethod === "pix"
                          ? "border-primary-600 bg-primary-50 shadow-lg"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <FaMoneyBillWave className={`text-4xl mx-auto mb-3 ${paymentMethod === "pix" ? "text-primary-600" : "text-gray-400"}`} />
                      <p className="font-bold text-gray-900 mb-1">PIX</p>
                      <p className="text-xs text-gray-600">À vista</p>
                    </button>

                    {/* Boleto */}
                    <button
                      onClick={() => setPaymentMethod("boleto")}
                      className={`p-6 border-2 rounded-xl transition-all ${
                        paymentMethod === "boleto"
                          ? "border-primary-600 bg-primary-50 shadow-lg"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <FaBarcode className={`text-4xl mx-auto mb-3 ${paymentMethod === "boleto" ? "text-primary-600" : "text-gray-400"}`} />
                      <p className="font-bold text-gray-900 mb-1">Boleto</p>
                      <p className="text-xs text-gray-600">Vence em 3 dias</p>
                    </button>
                  </div>

                  {/* Info de Segurança */}
                  <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-xl p-4 flex items-start gap-3">
                    <FaShieldAlt className="text-blue-600 text-xl mt-0.5" />
                    <div>
                      <p className="font-semibold text-blue-900 mb-1">Pagamento 100% Seguro</p>
                      <p className="text-sm text-blue-800">
                        Todos os pagamentos são processados pelo Mercado Pago com criptografia de ponta a ponta.
                        Seus dados estão protegidos.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Termos e Condições */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={agreeToTerms}
                      onChange={(e) => setAgreeToTerms(e.target.checked)}
                      className="mt-1 w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-700">
                      <span className="font-semibold">Li e concordo com </span>
                      <a href="/terms" target="_blank" className="text-primary-600 hover:underline">
                        os Termos e Condições
                      </a>
                      {" e a "}
                      <a href="/privacy" target="_blank" className="text-primary-600 hover:underline">
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
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-center gap-3">
                <FaInfoCircle className="text-red-600 text-xl" />
                <p className="text-red-800 font-medium">{error}</p>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between gap-4">
              {step === 2 && (
                <button
                  onClick={() => setStep(1)}
                  className="px-8 py-4 border-2 border-gray-300 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-all"
                >
                  ← Voltar
                </button>
              )}

              {step === 1 ? (
                <button
                  onClick={handleNextStep}
                  className="ml-auto px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-bold hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Continuar para Pagamento →
                </button>
              ) : (
                <button
                  onClick={handleCreateBooking}
                  disabled={loading || !agreeToTerms}
                  className="ml-auto px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-bold hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
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
            <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-6 sticky top-6">
              {/* Propriedade */}
              <div className="mb-6">
                <h3 className="font-bold text-gray-900 mb-4 text-lg">Resumo da Reserva</h3>
                {property.photos && property.photos[0] && (
                  <img
                    src={property.photos[0].url}
                    alt={property.title}
                    className="w-full h-40 object-cover rounded-xl mb-4"
                  />
                )}
                <h4 className="font-bold text-gray-900 mb-2">{property.title}</h4>
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <FaHome className="text-primary-600" />
                  {property.type === "house" ? "Casa" : property.type === "apartment" ? "Apartamento" : "Imóvel"}
                </p>
              </div>

              {/* Datas */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                      <FaCalendarAlt className="text-primary-600" />
                      <span>Check-in</span>
                    </p>
                    <p className="font-semibold text-gray-900 text-sm">
                      {formatDate(bookingData.checkIn)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                      <FaCalendarAlt className="text-primary-600" />
                      <span>Check-out</span>
                    </p>
                    <p className="font-semibold text-gray-900 text-sm">
                      {formatDate(bookingData.checkOut)}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Noites:</span>
                    <span className="font-bold text-gray-900">{nights}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-2">
                      <FaUsers className="text-primary-600" />
                      Hóspedes:
                    </span>
                    <span className="font-bold text-gray-900">{bookingData.totalGuests}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-gray-600">Quartos:</span>
                    <span className="font-bold text-gray-900">{bookingData.rooms.length}</span>
                  </div>
                </div>
              </div>

              {/* Breakdown de Preços */}
              <div className="mb-6 space-y-3">
                <h4 className="font-bold text-gray-900 mb-3">Detalhamento do Preço</h4>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {formatCurrency(property.price_per_night)} x {nights} noites
                  </span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(basePrice)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Taxa de serviço (10%)</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(serviceFee)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Taxa de limpeza</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(cleaningFee)}
                  </span>
                </div>
              </div>

              {/* Total */}
              <div className="pt-6 border-t-2 border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-3xl font-bold text-primary-600">
                    {formatCurrency(totalPrice)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-right">
                  Você não será cobrado ainda
                </p>
              </div>

              {/* Política de Cancelamento */}
              <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <p className="font-semibold text-yellow-900 mb-2 text-sm">
                  📋 Cancelamento Flexível
                </p>
                <ul className="text-xs text-yellow-800 space-y-1">
                  <li>✅ Reembolso total até 7 dias antes</li>
                  <li>⚠️ Reembolso de 50% entre 3-7 dias</li>
                  <li>❌ Sem reembolso em menos de 3 dias</li>
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
