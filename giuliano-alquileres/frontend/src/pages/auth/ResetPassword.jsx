import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FaLock, FaCheckCircle, FaExclamationTriangle, FaEye, FaEyeSlash } from "react-icons/fa";
import api from "../../services/api";
import AirbnbHeader from "../../components/layout/AirbnbHeader";
import Footer from "../../components/layout/Footer";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (!tokenFromUrl) {
      setError("Token de recuperação não encontrado na URL");
    } else {
      setToken(tokenFromUrl);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validações
    if (newPassword !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    if (newPassword.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres");
      return;
    }

    if (!token) {
      setError("Token inválido");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/api/auth/reset-password", {
        token,
        newPassword,
      });

      if (response.data.success) {
        setSuccess(true);
        // Redirecionar para login após 3 segundos
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (err) {
      console.error("Erro ao redefinir senha:", err);
      setError(err.response?.data?.error || "Erro ao redefinir senha. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // Se não tem token na URL
  if (!token && !error) {
    return (
      <>
        <AirbnbHeader />
        <div className="min-h-screen bg-airbnb-grey-50 dark:bg-airbnb-grey-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full">
            <div className="bg-white dark:bg-airbnb-grey-800 rounded-2xl shadow-xl p-8 text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 dark:bg-yellow-900 mb-4">
                <FaExclamationTriangle className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h2 className="text-2xl font-bold text-airbnb-black dark:text-white mb-4">
                Token não encontrado
              </h2>
              <p className="text-airbnb-grey-700 dark:text-airbnb-grey-300 mb-6">
                Não foi possível encontrar o token de recuperação na URL.
              </p>
              <Link to="/forgot-password" className="btn-primary inline-block">
                Solicitar Nova Recuperação
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Sucesso
  if (success) {
    return (
      <>
        <AirbnbHeader />
        <div className="min-h-screen bg-airbnb-grey-50 dark:bg-airbnb-grey-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full">
            <div className="bg-white dark:bg-airbnb-grey-800 rounded-2xl shadow-xl p-8 text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 mb-4">
                <FaCheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>

              <h2 className="text-2xl font-bold text-airbnb-black dark:text-white mb-4">
                Senha Redefinida!
              </h2>

              <p className="text-airbnb-grey-700 dark:text-airbnb-grey-300 mb-6">
                Sua senha foi redefinida com sucesso! Você será redirecionado para a página de login em alguns segundos...
              </p>

              <Link
                to="/login"
                className="btn-primary inline-block"
              >
                Ir para Login Agora
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Formulário de redefinição
  return (
    <>
      <AirbnbHeader />
      <div className="min-h-screen bg-airbnb-grey-50 dark:bg-airbnb-grey-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-white dark:bg-airbnb-grey-800 rounded-2xl shadow-xl p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-airbnb-black dark:text-white mb-2">
                Redefinir Senha
              </h2>
              <p className="text-airbnb-grey-600 dark:text-airbnb-grey-400">
                Digite sua nova senha
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="newPassword" className="label">
                  Nova Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-airbnb-grey-400" />
                  </div>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="input pl-10 pr-10"
                    placeholder="Digite sua nova senha"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-airbnb-grey-400 hover:text-airbnb-grey-600 dark:hover:text-airbnb-grey-300"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <p className="text-xs text-airbnb-grey-500 dark:text-airbnb-grey-400 mt-1">
                  Mínimo de 6 caracteres
                </p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="label">
                  Confirmar Nova Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-airbnb-grey-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input pl-10 pr-10"
                    placeholder="Confirme sua nova senha"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-airbnb-grey-400 hover:text-airbnb-grey-600 dark:hover:text-airbnb-grey-300"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Redefinindo..." : "Redefinir Senha"}
              </button>
            </form>

            {/* Footer Links */}
            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="text-sm text-airbnb-grey-700 dark:text-airbnb-grey-300 hover:text-rausch dark:hover:text-rausch transition-colors"
              >
                Voltar para Login
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ResetPassword;
