// Footer - Estilo Airbnb
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter, FaGlobe, FaDollarSign } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Sobre",
      links: [
        { label: "Como funciona", href: "/about" },
      ]
    },
    {
      title: "Comunidade",
      links: [
        { label: "Diversidade e pertencimento", href: "/diversity" },
        { label: "Acessibilidade", href: "/accessibility" },
        { label: "Indicar anfitriões", href: "/refer" },
        { label: "Visitar", href: "/visit" },
      ]
    },
    {
      title: "Anfitrião",
      links: [
        { label: "Anuncie seu espaço", href: "/host" },
        { label: "Recursos para anfitriões", href: "/host-resources" },
        { label: "Fórum da comunidade", href: "/forum" },
        { label: "Hospedagem responsável", href: "/responsible-hosting" },
      ]
    },
    {
      title: "Suporte",
      links: [
        { label: "FAQ - Perguntas Frequentes", href: "/faq" },
        { label: "Centro de ajuda", href: "/help" },
        { label: "Cancelamento", href: "/cancellation" },
        { label: "Entre em contato", href: "/contact" },
      ]
    },
  ];

  return (
    <footer className="relative z-[100] bg-airbnb-grey-50 border-t border-airbnb-grey-200">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="text-airbnb-black text-sm font-semibold mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      to={link.href}
                      className="text-airbnb-black text-sm hover:underline transition-all"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-airbnb-grey-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Left Side - Copyright & Links */}
            <div className="flex flex-wrap items-center gap-2 text-sm text-airbnb-black">
              <span>© {currentYear} Giuliano Alquileres, Inc.</span>
              <span className="hidden md:inline">·</span>
              <Link to="/privacy" className="hover:underline">
                Privacidade
              </Link>
              <span>·</span>
              <Link to="/terms" className="hover:underline">
                Termos
              </Link>
              <span>·</span>
              <Link to="/sitemap" className="hover:underline">
                Mapa do site
              </Link>
            </div>

            {/* Right Side - Language, Currency & Social */}
            <div className="flex items-center gap-4">
              {/* Language Selector */}
              <button className="flex items-center gap-2 px-3 py-2 hover:bg-airbnb-grey-50 rounded-medium transition-colors">
                <FaGlobe className="text-airbnb-black" />
                <span className="text-sm text-airbnb-black font-semibold">Português (BR)</span>
              </button>

              {/* Currency Selector */}
              <button className="flex items-center gap-2 px-3 py-2 hover:bg-airbnb-grey-50 rounded-medium transition-colors">
                <FaDollarSign className="text-airbnb-black" />
                <span className="text-sm text-airbnb-black font-semibold">BRL</span>
              </button>

              {/* Social Icons */}
              <div className="flex items-center gap-3">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-airbnb-black hover:text-rausch transition-colors"
                  aria-label="Facebook"
                >
                  <FaFacebook size={18} />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-airbnb-black hover:text-rausch transition-colors"
                  aria-label="Instagram"
                >
                  <FaInstagram size={18} />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-airbnb-black hover:text-rausch transition-colors"
                  aria-label="Twitter"
                >
                  <FaTwitter size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
