import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Loading from "../components/common/Loading";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState("");

  const { login, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Redirecionar se já estiver logado
  useEffect(() => {
    if (isAuthenticated() && isAdmin()) {
      navigate("/admin");
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    console.log("Tentativa de login iniciada..."); // Debug

    setLoading(true);
    setError("");

    try {
      const result = await login(email, password);
      console.log("Resultado do login:", result); // Debug

      if (result.success) {
        navigate("/admin");
      } else {
        // Mensagens de erro mais específicas
        let errorMessage = result.error || "Erro desconhecido";

        // Personalizar mensagens baseado no tipo de erro
        if (
          errorMessage.includes("Email ou senha incorretos") ||
          errorMessage.includes("401")
        ) {
          errorMessage =
            "Email ou senha incorretos. Verifique suas credenciais e tente novamente.";
        } else if (
          errorMessage.includes("Usuário não encontrado") ||
          errorMessage.includes("404")
        ) {
          errorMessage = "Este email não está cadastrado no sistema.";
        } else if (errorMessage.includes("Acesso negado")) {
          errorMessage =
            "Acesso negado. Apenas administradores podem acessar o painel.";
        }

        console.log("Definindo erro:", errorMessage); // Debug
        setError(errorMessage);

        // Garantir que o erro persista
        setTimeout(() => {
          console.log("Error state após timeout:", errorMessage);
        }, 100);
      }
    } catch (err) {
      console.error("Erro na tentativa de login:", err); // Debug
      const errorMsg =
        "Erro de conexão. Verifique sua internet e tente novamente.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotPasswordMessage("");

    if (!forgotPasswordEmail) {
      setForgotPasswordMessage("Por favor, digite seu email.");
      return;
    }

    try {
      // Aqui você implementaria a lógica de recuperação de senha
      // Por enquanto, vamos simular
      setForgotPasswordMessage(
        "Se este email estiver cadastrado, você receberá instruções para redefinir sua senha. Para suporte técnico, entre em contato pelo WhatsApp: (47) 99999-9999"
      );

      // Em produção, você faria algo como:
      // await api.post('/auth/forgot-password', { email: forgotPasswordEmail });
    } catch (err) {
      setForgotPasswordMessage(
        "Erro ao processar solicitação. Tente novamente."
      );
    }
  };

  // Modal de Esqueci Minha Senha
  const ForgotPasswordModal = () => (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Recuperar Senha
          </h3>

          <form onSubmit={handleForgotPassword}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email do Administrador
              </label>
              <input
                type="email"
                value={forgotPasswordEmail}
                onChange={(e) => setForgotPasswordEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="seu-email@exemplo.com"
                required
              />
            </div>

            {forgotPasswordMessage && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-700">{forgotPasswordMessage}</p>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(false);
                  setForgotPasswordEmail("");
                  setForgotPasswordMessage("");
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Enviar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Header */}
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Painel Administrativo
          </h2>
          <p className="mt-2 text-sm text-gray-600">Giuliano Alquileres</p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Digite seu email"
                />
              </div>
            </div>

            {/* Senha */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Senha
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Digite sua senha"
                />
              </div>
            </div>

            {/* Link Esqueci Minha Senha */}
            <div className="text-right">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Esqueci minha senha
              </button>
            </div>

            {/* Erro */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <span className="text-red-500">⚠️</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Botão de Login */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Entrando...
                  </span>
                ) : (
                  "Entrar"
                )}
              </button>
            </div>
          </form>

          {/* Links */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">ou</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <a
                href="/"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                ← Voltar para o site
              </a>
            </div>
          </div>

          {/* Informações de ajuda */}
          <div className="mt-6 p-4 bg-blue-50 rounded-md">
            <h3 className="text-sm font-medium text-blue-900 mb-2">
              Precisa de ajuda?
            </h3>
            <div className="text-sm text-blue-700 space-y-1">
              <p>• Use o email e senha de administrador</p>
              <p>• Se esqueceu a senha, clique em "Esqueci minha senha"</p>
              <p>• Suporte: (47) 99999-9999 (WhatsApp)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Esqueci Minha Senha */}
      {showForgotPassword && <ForgotPasswordModal />}
    </div>
  );
};

export default Login;
