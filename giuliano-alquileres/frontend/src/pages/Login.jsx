
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

    try {
      await login(formData.email, formData.password);
      navigate("/admin");
    } catch (err) {
      setError(
        err.response?.data?.message || "Erro ao fazer login. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex">
      {/* Lado Esquerdo - Hero Section Inspirado no Site */}
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
          {/* Badge Dourado */}
          <div className="inline-flex items-center bg-gradient-to-r from-amber-400 to-yellow-500 text-gray-900 px-4 py-2 rounded-full font-bold text-sm mb-8 w-fit">
            <span className="mr-2">✨</span>
            Gestão Imobiliária Premium
          </div>

          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Acesse seu
            <span className="block bg-gradient-to-r from-primary-500 to-amber-400 bg-clip-text text-transparent">
              Painel Admin
            </span>
          </h1>

          <p className="text-xl text-gray-200 mb-12 leading-relaxed max-w-md">
            Gerencie propriedades, reservas e clientes com nossa plataforma completa de administração imobiliária.
          </p>

          {/* Stats com detalhes dourados */}
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">500+</div>
              <div className="text-gray-300 text-sm">Imóveis</div>
              <div className="w-12 h-1 bg-gradient-to-r from-amber-400 to-yellow-500 mx-auto mt-2 rounded-full"></div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">98%</div>
              <div className="text-gray-300 text-sm">Satisfação</div>
              <div className="w-12 h-1 bg-gradient-to-r from-amber-400 to-yellow-500 mx-auto mt-2 rounded-full"></div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">24/7</div>
              <div className="text-gray-300 text-sm">Suporte</div>
              <div className="w-12 h-1 bg-gradient-to-r from-amber-400 to-yellow-500 mx-auto mt-2 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Lado Direito - Formulário */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo/Título */}
          <div className="text-center mb-12">
            <Link to="/" className="inline-block mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-600 to-amber-500 rounded-2xl mb-4 shadow-lg">
                <span className="text-3xl">🏢</span>
              </div>
            </Link>

            {/* Badge Dourado */}
            <div className="inline-flex items-center bg-gradient-to-r from-amber-400 to-yellow-500 text-gray-900 px-3 py-1 rounded-full font-bold text-xs mb-6">
              <span className="mr-1">⭐</span>
              Área Administrativa
            </div>

            <h2 className="text-4xl font-bold text-gray-900 mb-3">
              Bem-vindo de volta
            </h2>
            <p className="text-gray-600">
              Faça login para acessar o painel administrativo
            </p>
            <div className="w-16 h-1 bg-gradient-to-r from-primary-600 via-amber-400 to-primary-600 mx-auto mt-4 rounded-full"></div>
          </div>

          {/* Alerta de Erro */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-2xl">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                E-mail
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="seu@email.com"
                required
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-primary-500 focus:ring-0 transition-all duration-300 hover:border-gray-300"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Senha
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-primary-500 focus:ring-0 transition-all duration-300 hover:border-gray-300"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-primary-600 border-2 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
                />
                <span className="ml-2 text-gray-700 group-hover:text-gray-900 transition-colors">
                  Lembrar-me
                </span>
              </label>
              <a 
                href="#" 
                className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                Esqueceu a senha?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Entrando...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <span>Entrar no Painel</span>
                  <span className="ml-2 text-lg">→</span>
                </div>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link
              to="/"
              className="inline-flex items-center text-sm text-gray-600 hover:text-primary-700 transition-colors font-medium"
            >
              <span className="mr-1">←</span>
              Voltar para o site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;