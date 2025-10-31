// src/pages/auth/GuestRegister.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { FiMail, FiLock, FiUser, FiPhone, FiGlobe, FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import { FaHome, FaArrowLeft } from "react-icons/fa";

const GuestRegister = () => {
  const navigate = useNavigate();
  const { register, login } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    country: "Brasil",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: "",
    color: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError("");

    // Calcular força da senha
    if (name === "password") {
      calculatePasswordStrength(value);
    }
  };

  const calculatePasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z\d]/.test(password)) score++;

    const strengths = [
      { label: "", color: "" },
      { label: "Fraca", color: "bg-rausch" },
      { label: "Fraca", color: "bg-rausch" },
      { label: "Média", color: "bg-rausch" },
      { label: "Boa", color: "bg-green-500" },
      { label: "Forte", color: "bg-green-600" },
    ];

    setPasswordStrength({ score, ...strengths[score] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validações
    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    if (formData.password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres");
      return;
    }

    setLoading(true);

    // Registrar como cliente (role: 'client')
    const result = await register({
      ...formData,
      role: "client", // Força o role como client
    });

    if (result.success) {
      // Fazer login automaticamente após registro bem-sucedido
      const loginResult = await login(formData.email, formData.password);

      setLoading(false);

      if (loginResult.success) {
        navigate("/", { replace: true });
      } else {
        // Se o login automático falhar, redirecionar para página de login
        navigate("/guest-login", {
          state: { message: "Cadastro realizado com sucesso! Faça login para continuar." },
        });
      }
    } else {
      setLoading(false);
      setError(result.error || "Erro ao registrar. Tente novamente.");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-airbnb-grey-200">
        <div className="container-main py-4">
          <Link to="/" className="inline-flex items-center text-airbnb-grey-700 hover:text-rausch transition-colors font-medium">
            <FaArrowLeft className="mr-2" size={16} />
            Voltar
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-main py-12">
        <div className="max-w-lg mx-auto">
          {/* Logo/Título */}
          <div className="text-center mb-10">
            <Link to="/" className="inline-block mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-rausch to-rausch-dark rounded-2xl shadow-lg hover:shadow-xl transition-all">
                <FaHome className="text-3xl text-white" />
              </div>
            </Link>

            <h1 className="heading-2 mb-2">
              Crie sua conta
            </h1>
            <p className="body-base text-airbnb-grey-600">
              Junte-se a nós e comece a reservar seus imóveis favoritos
            </p>
          </div>

          {/* Card de Registro */}
          <div className="card">
            <div className="card-body">
              {/* Alerta de Erro */}
              {error && (
                <div className="alert-error mb-6">
                  <div className="flex items-start">
                    <FiAlertCircle className="flex-shrink-0 mr-3 mt-0.5" size={20} />
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
              )}

              {/* Formulário */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nome */}
                <div className="form-group">
                  <label htmlFor="name" className="label">
                    Nome completo
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-airbnb-grey-400" size={20} />
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      minLength={2}
                      value={formData.name}
                      onChange={handleChange}
                      className="input pl-12"
                      placeholder="Seu nome completo"
                      autoComplete="name"
                    />
                  </div>
                </div>

                {/* E-mail */}
                <div className="form-group">
                  <label htmlFor="email" className="label">
                    E-mail
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-airbnb-grey-400" size={20} />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="input pl-12"
                      placeholder="seu@email.com"
                      autoComplete="email"
                    />
                  </div>
                </div>

                {/* Telefone */}
                <div className="form-group">
                  <label htmlFor="phone" className="label">
                    Telefone <span className="text-airbnb-grey-400 font-normal">(opcional)</span>
                  </label>
                  <div className="relative">
                    <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-airbnb-grey-400" size={20} />
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className="input pl-12"
                      placeholder="+55 11 99999-9999"
                      autoComplete="tel"
                    />
                  </div>
                </div>

                {/* País */}
                <div className="form-group">
                  <label htmlFor="country" className="label">
                    País
                  </label>
                  <div className="relative">
                    <FiGlobe className="absolute left-4 top-1/2 -translate-y-1/2 text-airbnb-grey-400" size={20} />
                    <input
                      id="country"
                      name="country"
                      type="text"
                      value={formData.country}
                      onChange={handleChange}
                      className="input pl-12"
                      placeholder="Brasil"
                      autoComplete="country"
                    />
                  </div>
                </div>

                {/* Senha */}
                <div className="form-group">
                  <label htmlFor="password" className="label">
                    Senha
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-airbnb-grey-400" size={20} />
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      minLength={6}
                      value={formData.password}
                      onChange={handleChange}
                      className="input pl-12"
                      placeholder="••••••••"
                      autoComplete="new-password"
                    />
                  </div>
                  {/* Indicador de força da senha - usando cores Airbnb */}
                  {formData.password && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="text-airbnb-grey-600">Força da senha:</span>
                        <span className={`font-semibold ${
                          passwordStrength.score <= 2 ? "text-rausch" :
                          passwordStrength.score === 3 ? "text-rausch" :
                          "text-green-600"
                        }`}>
                          {passwordStrength.label}
                        </span>
                      </div>
                      <div className="h-2 bg-airbnb-grey-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            passwordStrength.score <= 2 ? "bg-rausch" :
                            passwordStrength.score === 3 ? "bg-rausch" :
                            "bg-green-600"
                          }`}
                          style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirmar Senha */}
                <div className="form-group">
                  <label htmlFor="confirmPassword" className="label">
                    Confirmar senha
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-airbnb-grey-400" size={20} />
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="input pl-12"
                      placeholder="••••••••"
                      autoComplete="new-password"
                    />
                    {formData.confirmPassword && formData.password === formData.confirmPassword && (
                      <FiCheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 text-green-600" size={20} />
                    )}
                  </div>
                </div>

                {/* Termos de Uso */}
                <div className="flex items-start pt-2">
                  <input
                    type="checkbox"
                    required
                    className="w-4 h-4 text-rausch border-2 border-airbnb-grey-300 rounded focus:ring-rausch focus:ring-2 focus:ring-offset-0 mt-1"
                  />
                  <label className="ml-3 text-sm text-airbnb-grey-600">
                    Concordo com os{" "}
                    <Link to="/terms" className="link">
                      Termos de Uso
                    </Link>{" "}
                    e{" "}
                    <Link to="/privacy" className="link">
                      Política de Privacidade
                    </Link>
                  </label>
                </div>

                {/* Botão de Registro */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="spinner-sm mr-2"></div>
                      Criando conta...
                    </div>
                  ) : (
                    "Criar conta"
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Links Adicionais */}
          <div className="mt-8 text-center space-y-4">
            <p className="body-small text-airbnb-grey-600">
              Já tem uma conta?{" "}
              <Link to="/guest-login" className="link font-semibold">
                Fazer login
              </Link>
            </p>

            <div className="divider"></div>

            <p className="body-small text-airbnb-grey-500">
              Você é proprietário?{" "}
              <Link to="/register" className="link-subtle font-medium">
                Cadastre-se como administrador
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestRegister;
