// src/pages/auth/Login.jsx
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { FiMail, FiLock, FiAlertCircle } from "react-icons/fi";
import { FaHome, FaStar, FaArrowLeft, FaArrowRight } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🎯 ALTERADO: Redireciona para /admin por padrão após login
  const from = location.state?.from?.pathname || "/admin";

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
      // Verificar se o usuário tem permissão de admin
      if (result.user.role === "admin" || result.user.role === "admin_master") {
        navigate(from, { replace: true });
      } else {
        // Se for cliente, fazer logout e mostrar erro
        setError("Acesso negado. Esta área é exclusiva para administradores. Hóspedes devem usar a área de cliente.");
      }
    } else {
      // Exibir mensagem de erro com detalhes se disponível
      const errorMessage = result.message || result.error || "Erro ao fazer login";
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Lado Esquerdo - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075')",
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>

        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          {/* Badge */}
          <div className="inline-flex items-center bg-gradient-to-r from-rausch to-rausch-dark text-white px-4 py-2 rounded-full font-bold text-sm mb-8 w-fit shadow-lg">
            <span className="mr-2">✨</span>
            Gestão Imobiliária Premium
          </div>

          {/* Título Principal */}
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Acesse seu
            <span className="block bg-gradient-to-r from-rausch to-rausch-dark bg-clip-text text-transparent">
              Painel Admin
            </span>
          </h1>

          {/* Descrição */}
          <p className="text-xl text-gray-200 mb-12 leading-relaxed max-w-md">
            Gerencie propriedades, reservas e clientes com nossa plataforma
            completa de administração imobiliária.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">500+</div>
              <div className="text-gray-300 text-sm">Imóveis</div>
              <div className="w-12 h-1 bg-gradient-to-r from-rausch to-rausch-dark mx-auto mt-2 rounded-full"></div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">98%</div>
              <div className="text-gray-300 text-sm">Satisfação</div>
              <div className="w-12 h-1 bg-gradient-to-r from-rausch to-rausch-dark mx-auto mt-2 rounded-full"></div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">24/7</div>
              <div className="text-gray-300 text-sm">Suporte</div>
              <div className="w-12 h-1 bg-gradient-to-r from-rausch to-rausch-dark mx-auto mt-2 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Lado Direito - Formulário de Login */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo/Título */}
          <div className="text-center mb-10">
            <Link to="/" className="inline-block mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-rausch to-rausch-dark rounded-2xl shadow-lg hover:shadow-xl transition-all">
                <FaHome className="text-3xl text-white" />
              </div>
            </Link>

            {/* Badge */}
            <div className="inline-flex items-center bg-gradient-to-r from-rausch to-rausch-dark text-white px-3 py-1 rounded-full font-bold text-xs mb-6 shadow-md">
              <FaStar className="mr-1" />
              Área Administrativa
            </div>

            {/* Título */}
            <h2 className="heading-2 mb-3">
              Bem-vindo de volta!
            </h2>
            <p className="body-base text-airbnb-grey-600">
              Faça login para acessar o painel administrativo
            </p>
          </div>

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

            {/* Opções adicionais */}
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
                <div className="flex items-center justify-center">
                  <span>Entrar no Painel</span>
                  <FaArrowRight className="ml-2" />
                </div>
              )}
            </button>
          </form>

          {/* Links Adicionais */}
          <div className="mt-8 text-center space-y-4">
            <p className="body-small text-airbnb-grey-600">
              Não tem uma conta de administrador?{" "}
              <Link to="/register" className="link font-semibold">
                Cadastrar como proprietário
              </Link>
            </p>

            <div className="divider"></div>

            <p className="body-small text-airbnb-grey-500 mb-3">
              Você é hóspede?{" "}
              <Link to="/guest-login" className="link-subtle font-medium">
                Acesse a área de clientes
              </Link>
            </p>

            <Link
              to="/"
              className="inline-flex items-center text-sm text-airbnb-grey-600 hover:text-rausch transition-colors font-medium"
            >
              <FaArrowLeft className="mr-2" size={14} />
              Voltar para o site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
