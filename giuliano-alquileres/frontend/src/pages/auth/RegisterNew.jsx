import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FaUser, FaEnvelope, FaLock, FaPhone, FaGlobe,
  FaUserTie, FaHome, FaCheckCircle, FaArrowRight
} from "react-icons/fa";

const RegisterNew = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Escolher tipo, 2: Formulário
  const [accountType, setAccountType] = useState(""); // 'client' ou 'admin'

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    country: "Brasil",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleAccountTypeSelect = (type) => {
    setAccountType(type);
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validações
    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    if (formData.password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres");
      return;
    }

    if (!formData.name || !formData.email || !formData.phone) {
      setError("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            country: formData.country,
            role: accountType, // 'client' ou 'admin'
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Erro ao criar conta");
      }

      // Se for cliente, já está aprovado e pode fazer login automaticamente
      if (accountType === "client" && result.token) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));

        setSuccess("Conta criada com sucesso! Redirecionando...");

        setTimeout(() => {
          window.location.href = "/"; // Refresh completo para atualizar o AuthContext
        }, 1500);
      } else {
        // Admin precisa esperar aprovação
        setSuccess(
          "Cadastro realizado com sucesso! Sua conta de proprietário será analisada e você receberá um email quando for aprovada."
        );

        setTimeout(() => {
          navigate("/login");
        }, 4000);
      }
    } catch (err) {
      setError(err.message || "Erro ao criar conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-block mb-6">
            <h2 className="text-4xl font-bold text-airbnb-black">
              Giuliano <span className="text-rausch">Alquileres</span>
            </h2>
          </Link>
          <p className="body-large text-airbnb-grey-600">
            {step === 1 ? "Como você deseja usar nossa plataforma?" : "Complete seu cadastro"}
          </p>
        </div>

        {/* Step 1: Escolher Tipo de Conta */}
        {step === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Cliente / Hóspede */}
            <button
              onClick={() => handleAccountTypeSelect("client")}
              className="group card p-10 border-2 border-airbnb-grey-200 hover:border-rausch transition-all duration-300 transform hover:scale-105"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-rausch to-rausch-dark rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <FaUser className="text-white text-4xl" />
              </div>

              <h3 className="heading-3 mb-3">
                Sou Hóspede
              </h3>

              <p className="body-base text-airbnb-grey-600 mb-6 leading-relaxed">
                Quero buscar e reservar imóveis para minhas viagens e estadias
              </p>

              <div className="space-y-3 text-left mb-6">
                <div className="flex items-center gap-3 text-airbnb-grey-700">
                  <FaCheckCircle className="text-green-600" />
                  <span className="text-sm">Buscar imóveis disponíveis</span>
                </div>
                <div className="flex items-center gap-3 text-airbnb-grey-700">
                  <FaCheckCircle className="text-green-600" />
                  <span className="text-sm">Fazer reservas online</span>
                </div>
                <div className="flex items-center gap-3 text-airbnb-grey-700">
                  <FaCheckCircle className="text-green-600" />
                  <span className="text-sm">Avaliar hospedagens</span>
                </div>
                <div className="flex items-center gap-3 text-airbnb-grey-700">
                  <FaCheckCircle className="text-green-600" />
                  <span className="text-sm">Acesso imediato</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-rausch font-semibold group-hover:gap-4 transition-all">
                <span>Continuar</span>
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Proprietário / Admin */}
            <button
              onClick={() => handleAccountTypeSelect("admin")}
              className="group card p-10 border-2 border-airbnb-grey-200 hover:border-rausch transition-all duration-300 transform hover:scale-105"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-rausch to-rausch-dark rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <FaHome className="text-white text-4xl" />
              </div>

              <h3 className="heading-3 mb-3">
                Sou Proprietário
              </h3>

              <p className="body-base text-airbnb-grey-600 mb-6 leading-relaxed">
                Quero anunciar meus imóveis e gerenciar reservas
              </p>

              <div className="space-y-3 text-left mb-6">
                <div className="flex items-center gap-3 text-airbnb-grey-700">
                  <FaCheckCircle className="text-rausch" />
                  <span className="text-sm">Anunciar seus imóveis</span>
                </div>
                <div className="flex items-center gap-3 text-airbnb-grey-700">
                  <FaCheckCircle className="text-rausch" />
                  <span className="text-sm">Gerenciar reservas</span>
                </div>
                <div className="flex items-center gap-3 text-airbnb-grey-700">
                  <FaCheckCircle className="text-rausch" />
                  <span className="text-sm">Dashboard completo</span>
                </div>
                <div className="flex items-center gap-3 text-airbnb-grey-700">
                  <FaCheckCircle className="text-rausch" />
                  <span className="text-sm">Requer aprovação</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-rausch font-semibold group-hover:gap-4 transition-all">
                <span>Continuar</span>
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>
        )}

        {/* Step 2: Formulário */}
        {step === 2 && (
          <div className="max-w-md mx-auto">
            <div className="card">
              <div className="card-body">
                {/* Header do Formulário */}
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-rausch to-rausch-dark rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    {accountType === 'client' ? (
                      <FaUser className="text-white text-2xl" />
                    ) : (
                      <FaHome className="text-white text-2xl" />
                    )}
                  </div>
                  <h3 className="heading-3 mb-2">
                    {accountType === 'client' ? 'Cadastro de Hóspede' : 'Cadastro de Proprietário'}
                  </h3>
                  <p className="body-small text-airbnb-grey-600">
                    Preencha seus dados para continuar
                  </p>
                </div>

                {/* Mensagens */}
                {error && (
                  <div className="alert-error mb-6">
                    <p className="text-sm font-medium">{error}</p>
                  </div>
                )}

                {success && (
                  <div className="alert-success mb-6">
                    <p className="text-sm font-medium">{success}</p>
                  </div>
                )}

                {/* Formulário */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Nome */}
                  <div className="form-group">
                    <label className="label">
                      Nome Completo *
                    </label>
                    <div className="relative">
                      <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-airbnb-grey-400" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Seu nome completo"
                        required
                        className="input pl-12"
                        autoComplete="name"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="form-group">
                    <label className="label">
                      Email *
                    </label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-airbnb-grey-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="seu@email.com"
                        required
                        className="input pl-12"
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  {/* Telefone */}
                  <div className="form-group">
                    <label className="label">
                      Telefone (WhatsApp) *
                    </label>
                    <div className="relative">
                      <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-airbnb-grey-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="(XX) XXXXX-XXXX"
                        required
                        className="input pl-12"
                        autoComplete="tel"
                      />
                    </div>
                  </div>

                  {/* País */}
                  <div className="form-group">
                    <label className="label">
                      País
                    </label>
                    <div className="relative">
                      <FaGlobe className="absolute left-4 top-1/2 -translate-y-1/2 text-airbnb-grey-400" />
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="input pl-12 appearance-none"
                      >
                        <option value="Brasil">Brasil</option>
                        <option value="Argentina">Argentina</option>
                        <option value="Uruguai">Uruguai</option>
                        <option value="Paraguai">Paraguai</option>
                        <option value="Chile">Chile</option>
                        <option value="Outro">Outro</option>
                      </select>
                    </div>
                  </div>

                  {/* Senha */}
                  <div className="form-group">
                    <label className="label">
                      Senha *
                    </label>
                    <div className="relative">
                      <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-airbnb-grey-400" />
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Mínimo 6 caracteres"
                        required
                        className="input pl-12"
                        autoComplete="new-password"
                      />
                    </div>
                  </div>

                  {/* Confirmar Senha */}
                  <div className="form-group">
                    <label className="label">
                      Confirmar Senha *
                    </label>
                    <div className="relative">
                      <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-airbnb-grey-400" />
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Digite a senha novamente"
                        required
                        className="input pl-12"
                        autoComplete="new-password"
                      />
                    </div>
                  </div>

                  {/* Botões */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="btn-secondary flex-1"
                    >
                      Voltar
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary flex-1"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <div className="spinner-sm mr-2"></div>
                          Criando...
                        </div>
                      ) : (
                        'Criar Conta'
                      )}
                    </button>
                  </div>
                </form>

                {/* Link para Login */}
                <div className="mt-6 text-center">
                  <p className="body-small text-airbnb-grey-600">
                    Já tem uma conta?{' '}
                    <Link to="/login" className="link font-semibold">
                      Faça login
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Link para voltar ao início */}
        {step === 1 && (
          <div className="text-center mt-8">
            <p className="body-small text-airbnb-grey-600">
              Já tem uma conta?{' '}
              <Link to="/login" className="link font-semibold">
                Faça login
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterNew;
