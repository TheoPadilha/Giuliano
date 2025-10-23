import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  FaUser, FaEnvelope, FaLock, FaPhone, FaGlobe,
  FaUserTie, FaHome, FaCheckCircle, FaArrowRight
} from "react-icons/fa";

const RegisterNew = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

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

    if (!formData.name || !formData.email) {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <h2 className="text-4xl font-bold text-gray-900">
              Giuliano <span className="text-primary-600">Alquileres</span>
            </h2>
          </Link>
          <p className="text-gray-600 text-lg">
            {step === 1 ? "Como você deseja usar nossa plataforma?" : "Complete seu cadastro"}
          </p>
        </div>

        {/* Step 1: Escolher Tipo de Conta */}
        {step === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Cliente / Hóspede */}
            <button
              onClick={() => handleAccountTypeSelect("client")}
              className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-10 border-2 border-gray-200 hover:border-primary-500 transform hover:scale-105"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <FaUser className="text-white text-4xl" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Sou Hóspede
              </h3>

              <p className="text-gray-600 mb-6 leading-relaxed">
                Quero buscar e reservar imóveis para minhas viagens e estadias
              </p>

              <div className="space-y-3 text-left mb-6">
                <div className="flex items-center gap-3 text-gray-700">
                  <FaCheckCircle className="text-green-600" />
                  <span className="text-sm">Buscar imóveis disponíveis</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <FaCheckCircle className="text-green-600" />
                  <span className="text-sm">Fazer reservas online</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <FaCheckCircle className="text-green-600" />
                  <span className="text-sm">Avaliar hospedagens</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <FaCheckCircle className="text-green-600" />
                  <span className="text-sm">Acesso imediato</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-primary-600 font-semibold group-hover:gap-4 transition-all">
                <span>Continuar</span>
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Proprietário / Admin */}
            <button
              onClick={() => handleAccountTypeSelect("admin")}
              className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-10 border-2 border-gray-200 hover:border-amber-500 transform hover:scale-105"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <FaHome className="text-white text-4xl" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Sou Proprietário
              </h3>

              <p className="text-gray-600 mb-6 leading-relaxed">
                Quero anunciar meus imóveis e gerenciar reservas
              </p>

              <div className="space-y-3 text-left mb-6">
                <div className="flex items-center gap-3 text-gray-700">
                  <FaCheckCircle className="text-amber-600" />
                  <span className="text-sm">Anunciar seus imóveis</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <FaCheckCircle className="text-amber-600" />
                  <span className="text-sm">Gerenciar reservas</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <FaCheckCircle className="text-amber-600" />
                  <span className="text-sm">Dashboard completo</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <FaCheckCircle className="text-amber-600" />
                  <span className="text-sm">Requer aprovação</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-amber-600 font-semibold group-hover:gap-4 transition-all">
                <span>Continuar</span>
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>
        )}

        {/* Step 2: Formulário */}
        {step === 2 && (
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-gray-200">
              {/* Header do Formulário */}
              <div className="text-center mb-8">
                <div className={`w-16 h-16 ${accountType === 'client' ? 'bg-blue-100' : 'bg-amber-100'} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  {accountType === 'client' ? (
                    <FaUser className="text-blue-600 text-2xl" />
                  ) : (
                    <FaHome className="text-amber-600 text-2xl" />
                  )}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {accountType === 'client' ? 'Cadastro de Hóspede' : 'Cadastro de Proprietário'}
                </h3>
                <p className="text-gray-600 text-sm">
                  Preencha seus dados para continuar
                </p>
              </div>

              {/* Mensagens */}
              {error && (
                <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-xl p-4">
                  <p className="text-red-800 text-sm font-medium">{error}</p>
                </div>
              )}

              {success && (
                <div className="mb-6 bg-green-50 border-2 border-green-200 rounded-xl p-4">
                  <p className="text-green-800 text-sm font-medium">{success}</p>
                </div>
              )}

              {/* Formulário */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Nome */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nome Completo *
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Seu nome completo"
                      required
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email *
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="seu@email.com"
                      required
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all"
                    />
                  </div>
                </div>

                {/* Telefone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Telefone (Opcional)
                  </label>
                  <div className="relative">
                    <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="(XX) XXXXX-XXXX"
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all"
                    />
                  </div>
                </div>

                {/* País */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    País
                  </label>
                  <div className="relative">
                    <FaGlobe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all appearance-none bg-white"
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
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Senha *
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Mínimo 6 caracteres"
                      required
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all"
                    />
                  </div>
                </div>

                {/* Confirmar Senha */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirmar Senha *
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Digite a senha novamente"
                      required
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all"
                    />
                  </div>
                </div>

                {/* Botões */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 py-3 px-6 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`flex-1 py-3 px-6 rounded-xl font-bold text-white transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                      accountType === 'client'
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                        : 'bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700'
                    }`}
                  >
                    {loading ? 'Criando...' : 'Criar Conta'}
                  </button>
                </div>
              </form>

              {/* Link para Login */}
              <div className="mt-6 text-center">
                <p className="text-gray-600 text-sm">
                  Já tem uma conta?{' '}
                  <Link to="/login" className="text-primary-600 font-semibold hover:underline">
                    Faça login
                  </Link>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Link para voltar ao início */}
        {step === 1 && (
          <div className="text-center mt-8">
            <p className="text-gray-600 text-sm">
              Já tem uma conta?{' '}
              <Link to="/login" className="text-primary-600 font-semibold hover:underline">
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
