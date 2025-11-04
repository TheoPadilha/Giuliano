// src/pages/auth/GuestLogin.jsx - REDESENHADO COM IDENTIDADE AIRBNB
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { FiMail, FiLock, FiAlertCircle } from "react-icons/fi";
import { FaHome, FaArrowLeft } from "react-icons/fa";

const GuestLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redireciona para a página de origem ou para home após login
  const from = location.state?.from?.pathname || "/";

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(formData.email, formData.password);

    setLoading(false);

    if (result.success) {
      // Verificar se o usuário é realmente um hóspede (client)
      if (result.user.role === "client") {
        // Verificar se há uma reserva pendente no sessionStorage
        const pendingBooking = sessionStorage.getItem('pendingBooking');

        if (pendingBooking && from === "/booking-checkout") {
          // Se há reserva pendente e está tentando acessar checkout,
          // redirecionar diretamente para o checkout (os dados serão recuperados lá)
          navigate("/booking-checkout", { replace: true });
        } else {
          // Caso contrário, seguir o fluxo normal
          navigate(from, { replace: true });
        }
      } else {
        // Se não for cliente, fazer logout e mostrar erro
        setError("Esta área é apenas para hóspedes. Administradores devem usar o painel admin.");
      }
    } else {
      const errorMessage = result.message || result.error || "Erro ao fazer login";
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Simples */}
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
              Bem-vindo de volta
            </h1>
            <p className="body-base text-airbnb-grey-600">
              Entre para continuar sua reserva
            </p>
          </div>

          {/* Card de Login */}
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
                      value={formData.password}
                      onChange={handleChange}
                      className="input pl-12"
                      placeholder="••••••••"
                      autoComplete="current-password"
                    />
                  </div>
                </div>

                {/* Lembrar-me e Esqueceu a senha */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-rausch border-2 border-airbnb-grey-300 rounded focus:ring-rausch focus:ring-2 focus:ring-offset-0"
                    />
                    <span className="ml-2 text-sm text-airbnb-grey-700 group-hover:text-airbnb-black transition-colors">
                      Lembrar-me
                    </span>
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-sm link"
                  >
                    Esqueceu a senha?
                  </Link>
                </div>

                {/* Botão de Login */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="spinner-sm mr-2"></div>
                      Entrando...
                    </div>
                  ) : (
                    "Entrar"
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Links Adicionais */}
          <div className="mt-8 text-center space-y-4">
            <p className="body-small text-airbnb-grey-600">
              Não tem uma conta?{" "}
              <Link to="/guest-register" className="link font-semibold">
                Criar conta grátis
              </Link>
            </p>

            <div className="divider"></div>

            <p className="body-small text-airbnb-grey-500">
              Você é proprietário?{" "}
              <Link to="/login" className="link-subtle font-medium">
                Acesse o painel administrativo
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestLogin;
