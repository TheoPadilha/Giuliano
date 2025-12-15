import { Link } from "react-router-dom";
import Footer from "../components/layout/Footer";

const Sitemap = () => {
  const sitemapSections = [
    {
      title: "Principal",
      links: [
        { label: "Início", path: "/" },
        { label: "Buscar Imóveis", path: "/properties" },
        { label: "Como Funciona", path: "/about" },
      ]
    },
    {
      title: "Conta",
      links: [
        { label: "Login", path: "/guest-login" },
        { label: "Registro", path: "/guest-register" },
        { label: "Minhas Reservas", path: "/guest/reservations" },
        { label: "Favoritos", path: "/guest/favorites" },
      ]
    },
    {
      title: "Suporte",
      links: [
        { label: "FAQ", path: "/faq" },
        { label: "Centro de Ajuda", path: "/help" },
        { label: "Cancelamento", path: "/cancellation" },
        { label: "Contato", path: "/contact" },
      ]
    },
    {
      title: "Legal",
      links: [
        { label: "Termos de Serviço", path: "/terms" },
        { label: "Política de Privacidade", path: "/privacy" },
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-rausch to-rausch-dark text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Mapa do Site</h1>
          <p className="text-xl opacity-90">Navegue por todas as páginas</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {sitemapSections.map((section, index) => (
            <div key={index}>
              <h2 className="text-xl font-bold text-airbnb-black mb-4 pb-2 border-b-2 border-rausch">
                {section.title}
              </h2>
              <ul className="space-y-2">
                {section.links.map((link, idx) => (
                  <li key={idx}>
                    <Link
                      to={link.path}
                      className="text-airbnb-grey-600 hover:text-rausch transition-colors"
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

      <Footer />
    </div>
  );
};

export default Sitemap;
