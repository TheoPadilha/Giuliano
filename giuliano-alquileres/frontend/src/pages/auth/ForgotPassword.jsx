import { useState } from "react";
import { Link } from "react-router-dom";
import { FaEnvelope, FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import api from "../../services/api";
import AirbnbHeader from "../../components/layout/AirbnbHeader";
import Footer from "../../components/layout/Footer";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/api/auth/forgot-password", { email });

      if (response.data.success) {
        setSuccess(true);
      }
    } catch (err) {
      console.error("Erro ao solicitar recuperação:", err);
      setError(err.response?.data?.error || "Erro ao processar solicitação. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

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
                Email Enviado!
              </h2>

              <p className="text-airbnb-grey-700 dark:text-airbnb-grey-300 mb-6">
                Se o email informado existir em nossa base de dados, você receberá as instruções para redefinir sua senha.
              </p>

              <div className="bg-airbnb-grey-50 dark:bg-airbnb-grey-700 rounded-lg p-4 mb-6">
                <p className="text-sm text-airbnb-grey-600 dark:text-airbnb-grey-400">
                  Não recebeu o email? Verifique sua caixa de spam ou aguarde alguns minutos.
                </p>
              </div>

              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-rausch hover:bg-rausch-dark text-white font-semibold rounded-lg transition-all"
              >
                <FaArrowLeft />
                Voltar para Login
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <AirbnbHeader />
      <div className="min-h-screen bg-airbnb-grey-50 dark:bg-airbnb-grey-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-white dark:bg-airbnb-grey-800 rounded-2xl shadow-xl p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-airbnb-black dark:text-white mb-2">
                Esqueceu sua senha?
              </h2>
              <p className="text-airbnb-grey-600 dark:text-airbnb-grey-400">
                Digite seu email e enviaremos as instruções para redefinir sua senha
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
                <label htmlFor="email" className="label">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-airbnb-grey-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input pl-10"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Enviando..." : "Enviar Instruções"}
              </button>
            </form>

            {/* Footer Links */}
            <div className="mt-6 text-center space-y-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-sm text-airbnb-grey-700 dark:text-airbnb-grey-300 hover:text-rausch dark:hover:text-rausch transition-colors"
              >
                <FaArrowLeft size={12} />
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

export default ForgotPassword;
