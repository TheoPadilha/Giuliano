import { Link } from "react-router-dom";
import Footer from "../components/layout/Footer";
import { FaQuestionCircle, FaBook, FaHeadset } from "react-icons/fa";

const Help = () => {
  const helpCategories = [
    {
      title: "Reservas",
      icon: <FaBook className="text-2xl" />,
      topics: [
        "Como fazer uma reserva",
        "Alterar ou cancelar reserva",
        "Políticas de cancelamento",
        "Confirmação de reserva",
      ]
    },
    {
      title: "Pagamentos",
      icon: <FaQuestionCircle className="text-2xl" />,
      topics: [
        "Métodos de pagamento aceitos",
        "Quando serei cobrado",
        "Reembolsos e estornos",
        "Taxas e encargos",
      ]
    },
    {
      title: "Suporte",
      icon: <FaHeadset className="text-2xl" />,
      topics: [
        "Contatar suporte",
        "Reportar um problema",
        "Segurança e privacidade",
        "Dicas para hóspedes",
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-rausch to-rausch-dark text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Centro de Ajuda</h1>
          <p className="text-xl opacity-90">Encontre respostas para suas dúvidas</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Search */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar artigos de ajuda..."
              className="w-full px-6 py-4 border-2 border-airbnb-grey-300 rounded-full focus:ring-2 focus:ring-rausch focus:border-transparent text-lg"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {helpCategories.map((category, index) => (
            <div key={index} className="bg-white border border-airbnb-grey-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-rausch/10 rounded-full flex items-center justify-center text-rausch mb-4">
                {category.icon}
              </div>
              <h3 className="text-xl font-bold text-airbnb-black mb-4">{category.title}</h3>
              <ul className="space-y-2">
                {category.topics.map((topic, idx) => (
                  <li key={idx}>
                    <Link to="#" className="text-airbnb-grey-600 hover:text-rausch transition-colors">
                      {topic}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center bg-airbnb-grey-50 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-airbnb-black mb-4">Não encontrou o que procura?</h2>
          <p className="text-airbnb-grey-600 mb-6">Nossa equipe está pronta para ajudar você</p>
          <Link
            to="/contact"
            className="inline-block px-8 py-3 bg-rausch hover:bg-rausch-dark text-white font-semibold rounded-lg transition-colors"
          >
            Falar com Suporte
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Help;
