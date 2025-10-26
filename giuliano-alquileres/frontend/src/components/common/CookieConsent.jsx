// CookieConsent.jsx - Banner Profissional de Consentimento de Cookies
import { useState, useEffect } from "react";
import { FaCookie, FaTimes, FaShieldAlt, FaCog } from "react-icons/fa";

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [hasConsented, setHasConsented] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Sempre true, não pode desabilitar
    analytics: false,
    marketing: false,
    functional: false,
  });

  useEffect(() => {
    // Verificar se o usuário já deu consentimento
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      // Delay para não aparecer imediatamente
      setTimeout(() => setIsVisible(true), 1000);
      setHasConsented(false);
    } else {
      // Carregar preferências salvas
      const savedPreferences = JSON.parse(consent);
      setPreferences(savedPreferences);
      setHasConsented(true);
      // Ativar cookies baseado nas preferências
      activateCookies(savedPreferences);
    }
  }, []);

  const activateCookies = (prefs) => {
    // Google Analytics
    if (prefs.analytics && window.gtag) {
      window.gtag("consent", "update", {
        analytics_storage: "granted",
      });
    }

    // Marketing (Google Ads, etc)
    if (prefs.marketing && window.gtag) {
      window.gtag("consent", "update", {
        ad_storage: "granted",
        ad_user_data: "granted",
        ad_personalization: "granted",
      });
    }
  };

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
    };
    setPreferences(allAccepted);
    localStorage.setItem("cookieConsent", JSON.stringify(allAccepted));
    activateCookies(allAccepted);
    setHasConsented(true);
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false,
    };
    setPreferences(onlyNecessary);
    localStorage.setItem("cookieConsent", JSON.stringify(onlyNecessary));
    activateCookies(onlyNecessary);
    setHasConsented(true);
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem("cookieConsent", JSON.stringify(preferences));
    activateCookies(preferences);
    setHasConsented(true);
    setIsVisible(false);
    setShowPreferences(false);
  };

  const togglePreference = (key) => {
    if (key === "necessary") return; // Não pode desabilitar cookies necessários
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Não renderizar nada se já tiver consentimento e banner estiver fechado
  if (hasConsented && !isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-end justify-center pointer-events-none">
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-300 pointer-events-auto ${
          showPreferences ? "bg-opacity-50" : "bg-opacity-0"
        }`}
        onClick={() => setShowPreferences(false)}
      />

      {/* Banner Principal */}
      <div
        className={`relative bg-white border-t-2 border-airbnb-grey-200 shadow-elevation-high w-full max-w-[2520px] mx-auto pointer-events-auto transition-all duration-500 ease-out ${
          showPreferences ? "translate-y-0" : "translate-y-0"
        }`}
      >
        {/* Conteúdo do Banner */}
        <div className="px-6 sm:px-10 lg:px-20 py-6">
          {!showPreferences ? (
            // Vista Simplificada
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              {/* Ícone e Texto */}
              <div className="flex items-start gap-4 flex-1">
                <div className="flex-shrink-0 w-12 h-12 bg-rausch/10 rounded-xlarge flex items-center justify-center">
                  <FaCookie className="text-2xl text-rausch" />
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-airbnb-black mb-2">
                    Este site usa cookies
                  </h3>
                  <p className="text-sm text-airbnb-grey-600 leading-relaxed">
                    Utilizamos cookies para melhorar sua experiência de
                    navegação, personalizar conteúdo e analisar nosso tráfego.
                    Ao clicar em "Aceitar todos", você concorda com o uso de
                    todos os cookies. Você pode gerenciar suas preferências a
                    qualquer momento.
                  </p>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
                <button
                  onClick={() => setShowPreferences(true)}
                  className="px-6 py-3 bg-white border-2 border-airbnb-grey-300 text-airbnb-black rounded-lg font-semibold hover:border-airbnb-black transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <FaCog className="text-sm" />
                  <span>Preferências</span>
                </button>

                <button
                  onClick={handleRejectAll}
                  className="px-6 py-3 bg-white border-2 border-airbnb-grey-300 text-airbnb-grey-600 rounded-lg font-semibold hover:border-airbnb-grey-600 hover:text-airbnb-black transition-all whitespace-nowrap"
                >
                  Rejeitar todos
                </button>

                <button
                  onClick={handleAcceptAll}
                  className="px-8 py-3 bg-rausch hover:bg-rausch-dark text-white rounded-lg font-semibold transition-all shadow-sm whitespace-nowrap"
                >
                  Aceitar todos
                </button>
              </div>
            </div>
          ) : (
            // Vista de Preferências Detalhadas
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-airbnb-grey-200">
                <div className="flex items-center gap-3">
                  <FaShieldAlt className="text-2xl text-rausch" />
                  <h3 className="text-xl font-semibold text-airbnb-black">
                    Gerenciar preferências de cookies
                  </h3>
                </div>
                <button
                  onClick={() => setShowPreferences(false)}
                  className="p-2 hover:bg-airbnb-grey-50 rounded-lg transition-colors"
                >
                  <FaTimes className="text-airbnb-grey-600" />
                </button>
              </div>

              {/* Lista de Categorias */}
              <div className="space-y-4 mb-6">
                {/* Cookies Necessários */}
                <div className="p-4 bg-airbnb-grey-50 rounded-xlarge">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-airbnb-black">
                          Cookies Necessários
                        </h4>
                        <span className="px-2 py-0.5 bg-airbnb-grey-200 text-airbnb-grey-600 text-xs font-medium rounded">
                          Sempre ativo
                        </span>
                      </div>
                      <p className="text-sm text-airbnb-grey-600">
                        Estes cookies são essenciais para o funcionamento do
                        site e não podem ser desativados. Eles geralmente são
                        definidos em resposta a ações suas, como configurar
                        suas preferências de privacidade.
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="w-12 h-6 bg-rausch rounded-full flex items-center justify-end px-1 cursor-not-allowed opacity-50">
                        <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cookies Analíticos */}
                <div className="p-4 border border-airbnb-grey-200 rounded-xlarge hover:border-airbnb-grey-400 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="font-semibold text-airbnb-black mb-2">
                        Cookies Analíticos
                      </h4>
                      <p className="text-sm text-airbnb-grey-600">
                        Estes cookies nos permitem contar visitas e fontes de
                        tráfego para medir e melhorar o desempenho do nosso
                        site. Utilizamos Google Analytics para entender melhor
                        como os visitantes usam nosso site.
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <button
                        onClick={() => togglePreference("analytics")}
                        className={`w-12 h-6 rounded-full flex items-center transition-all ${
                          preferences.analytics
                            ? "bg-rausch justify-end"
                            : "bg-airbnb-grey-300 justify-start"
                        }`}
                      >
                        <div className="w-4 h-4 bg-white rounded-full shadow-sm mx-1"></div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Cookies de Marketing */}
                <div className="p-4 border border-airbnb-grey-200 rounded-xlarge hover:border-airbnb-grey-400 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="font-semibold text-airbnb-black mb-2">
                        Cookies de Marketing
                      </h4>
                      <p className="text-sm text-airbnb-grey-600">
                        Estes cookies podem ser definidos através do nosso site
                        por nossos parceiros de publicidade. Eles podem ser
                        usados por essas empresas para construir um perfil de
                        seus interesses e mostrar anúncios relevantes.
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <button
                        onClick={() => togglePreference("marketing")}
                        className={`w-12 h-6 rounded-full flex items-center transition-all ${
                          preferences.marketing
                            ? "bg-rausch justify-end"
                            : "bg-airbnb-grey-300 justify-start"
                        }`}
                      >
                        <div className="w-4 h-4 bg-white rounded-full shadow-sm mx-1"></div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Cookies Funcionais */}
                <div className="p-4 border border-airbnb-grey-200 rounded-xlarge hover:border-airbnb-grey-400 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="font-semibold text-airbnb-black mb-2">
                        Cookies Funcionais
                      </h4>
                      <p className="text-sm text-airbnb-grey-600">
                        Estes cookies permitem que o site forneça
                        funcionalidades e personalização aprimoradas. Eles podem
                        ser definidos por nós ou por fornecedores terceiros
                        cujos serviços adicionamos às nossas páginas.
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <button
                        onClick={() => togglePreference("functional")}
                        className={`w-12 h-6 rounded-full flex items-center transition-all ${
                          preferences.functional
                            ? "bg-rausch justify-end"
                            : "bg-airbnb-grey-300 justify-start"
                        }`}
                      >
                        <div className="w-4 h-4 bg-white rounded-full shadow-sm mx-1"></div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Links de Política */}
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-airbnb-grey-600">
                  Para mais informações sobre como usamos cookies, consulte
                  nossa{" "}
                  <a
                    href="/politica-de-privacidade"
                    className="text-rausch hover:underline font-medium"
                  >
                    Política de Privacidade
                  </a>{" "}
                  e{" "}
                  <a
                    href="/politica-de-cookies"
                    className="text-rausch hover:underline font-medium"
                  >
                    Política de Cookies
                  </a>
                  .
                </p>
              </div>

              {/* Botões de Ação */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
                <button
                  onClick={handleRejectAll}
                  className="px-6 py-3 bg-white border-2 border-airbnb-grey-300 text-airbnb-grey-600 rounded-lg font-semibold hover:border-airbnb-grey-600 hover:text-airbnb-black transition-all"
                >
                  Rejeitar todos
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-6 py-3 bg-white border-2 border-airbnb-grey-300 text-airbnb-black rounded-lg font-semibold hover:border-airbnb-black transition-all"
                >
                  Aceitar todos
                </button>
                <button
                  onClick={handleSavePreferences}
                  className="px-8 py-3 bg-rausch hover:bg-rausch-dark text-white rounded-lg font-semibold transition-all shadow-sm"
                >
                  Salvar preferências
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
