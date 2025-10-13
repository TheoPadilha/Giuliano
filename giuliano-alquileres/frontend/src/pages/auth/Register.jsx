// src/pages/auth/Register.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
// import { useAuth } from "../../contexts/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  // const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
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
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validação de senha
    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    if (formData.password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      // --- ALTERAÇÃO 3: Chamar a API diretamente ---
      // Substitua 'api.post' pela sua forma de chamar a API (pode ser fetch)
      // O importante é que esta chamada NÃO faz o login, apenas registra.
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            phone: formData.phone, // Adicionado
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        // Se a resposta da API não for 2xx, trata como erro
        throw new Error(
          result.error || result.message || "Erro ao criar conta."
        );
      }

      // --- ALTERAÇÃO 4: Lógica de sucesso ---
      // Em vez de navegar, mostramos uma mensagem de sucesso.
      setSuccess(
        "Cadastro realizado com sucesso! Sua conta está aguardando aprovação. Você será redirecionado para a página de login."
      );

      // Opcional: Limpar o formulário
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
      });

      // Redireciona para a página de login após alguns segundos
      setTimeout(() => {
        navigate("/login");
      }, 4000); // 4 segundos
    } catch (err) {
      setError(err.message || "Erro ao criar conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex">
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
          <div className="inline-flex items-center bg-gradient-to-r from-amber-400 to-yellow-500 text-gray-900 px-4 py-2 rounded-full font-bold text-sm mb-8 w-fit">
            <span className="mr-2">✨</span>
            Crie sua Conta Admin
          </div>

          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Comece a gerenciar
            <span className="block bg-gradient-to-r from-primary-500 to-amber-400 bg-clip-text text-transparent">
              Seus Imóveis
            </span>
          </h1>

          <p className="text-xl text-gray-200 mb-12 leading-relaxed max-w-md">
            Cadastre-se agora e tenha acesso completo à plataforma de gestão
            imobiliária mais moderna do mercado.
          </p>

          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">Fácil</div>
              <div className="text-gray-300 text-sm">Configuração</div>
              <div className="w-12 h-1 bg-gradient-to-r from-amber-400 to-yellow-500 mx-auto mt-2 rounded-full"></div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">Rápido</div>
              <div className="text-gray-300 text-sm">Cadastro</div>
              <div className="w-12 h-1 bg-gradient-to-r from-amber-400 to-yellow-500 mx-auto mt-2 rounded-full"></div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">Seguro</div>
              <div className="text-gray-300 text-sm">Proteção</div>
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

            <div className="inline-flex items-center bg-gradient-to-r from-amber-400 to-yellow-500 text-gray-900 px-3 py-1 rounded-full font-bold text-xs mb-6">
              <span className="mr-1">⭐</span>
              Cadastro Administrativo
            </div>

            <h2 className="text-4xl font-bold text-gray-900 mb-3">
              Crie sua conta
            </h2>
            <p className="text-gray-600">Preencha os dados para começar</p>
            <div className="w-16 h-1 bg-gradient-to-r from-primary-600 via-amber-400 to-primary-600 mx-auto mt-4 rounded-full"></div>
          </div>

          {/* Alerta de Erro */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-2xl">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* --- NOVO: Alerta de Sucesso --- */}
          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-r-2xl">
              <p className="text-green-800 text-sm">{success}</p>
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Nome Completo
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="João Silva"
                required
                minLength={2}
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-primary-500 focus:ring-0 transition-all duration-300 hover:border-gray-300"
              />
            </div>

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

            {/* --- ALTERAÇÃO 5: Adicionar campo de Telefone --- */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Telefone (WhatsApp)
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(XX) XXXXX-XXXX"
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
                minLength={6}
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-primary-500 focus:ring-0 transition-all duration-300 hover:border-gray-300"
              />
              <p className="text-xs text-gray-500 mt-1">Mínimo 6 caracteres</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Confirmar Senha
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-primary-500 focus:ring-0 transition-all duration-300 hover:border-gray-300"
              />
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Criando conta...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <span>Criar Conta Admin</span>
                  <span className="ml-2 text-lg">→</span>
                </div>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 mb-3">
              Já tem uma conta?{" "}
              <Link
                to="/login"
                className="text-primary-700 hover:text-primary-800 font-bold transition-colors"
              >
                Fazer login
              </Link>
            </p>
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

export default Register;
