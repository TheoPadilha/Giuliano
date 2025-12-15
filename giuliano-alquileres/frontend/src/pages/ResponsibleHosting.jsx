import Footer from "../components/layout/Footer";
import { FaLeaf, FaRecycle, FaHandHoldingHeart, FaShieldAlt } from "react-icons/fa";

const ResponsibleHosting = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-rausch to-rausch-dark text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Hospedagem Responsável</h1>
          <p className="text-xl opacity-90">Compromisso com sustentabilidade e comunidade</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <p className="text-lg text-airbnb-grey-600 leading-relaxed mb-12">
          Acreditamos que a hospedagem responsável beneficia todos: hóspedes, anfitriões, comunidades locais e o meio ambiente.
        </p>

        {/* Pillars */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white border border-airbnb-grey-200 rounded-xl p-6">
            <div className="w-14 h-14 bg-rausch/10 rounded-full flex items-center justify-center text-rausch mb-4">
              <FaLeaf className="text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-airbnb-black mb-3">Sustentabilidade Ambiental</h3>
            <ul className="space-y-2 text-airbnb-grey-600">
              <li>• Redução do consumo de energia</li>
              <li>• Uso consciente da água</li>
              <li>• Produtos de limpeza ecológicos</li>
              <li>• Incentivo à reciclagem</li>
            </ul>
          </div>

          <div className="bg-white border border-airbnb-grey-200 rounded-xl p-6">
            <div className="w-14 h-14 bg-rausch/10 rounded-full flex items-center justify-center text-rausch mb-4">
              <FaHandHoldingHeart className="text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-airbnb-black mb-3">Impacto na Comunidade</h3>
            <ul className="space-y-2 text-airbnb-grey-600">
              <li>• Respeito aos vizinhos</li>
              <li>• Apoio ao comércio local</li>
              <li>• Preservação cultural</li>
              <li>• Contribuição social</li>
            </ul>
          </div>

          <div className="bg-white border border-airbnb-grey-200 rounded-xl p-6">
            <div className="w-14 h-14 bg-rausch/10 rounded-full flex items-center justify-center text-rausch mb-4">
              <FaRecycle className="text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-airbnb-black mb-3">Práticas Sustentáveis</h3>
            <ul className="space-y-2 text-airbnb-grey-600">
              <li>• Redução de desperdício</li>
              <li>• Amenidades reutilizáveis</li>
              <li>• Fornecedores locais</li>
              <li>• Eficiência energética</li>
            </ul>
          </div>

          <div className="bg-white border border-airbnb-grey-200 rounded-xl p-6">
            <div className="w-14 h-14 bg-rausch/10 rounded-full flex items-center justify-center text-rausch mb-4">
              <FaShieldAlt className="text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-airbnb-black mb-3">Segurança e Bem-estar</h3>
            <ul className="space-y-2 text-airbnb-grey-600">
              <li>• Ambientes seguros</li>
              <li>• Protocolos de higiene</li>
              <li>• Respeito à privacidade</li>
              <li>• Comunicação transparente</li>
            </ul>
          </div>
        </div>

        {/* Commitment */}
        <div className="bg-rausch/5 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-airbnb-black mb-4">Nosso Compromisso</h2>
          <p className="text-airbnb-grey-600 leading-relaxed mb-4">
            Trabalhamos continuamente para promover práticas de hospedagem responsável em toda a nossa plataforma. Fornecemos recursos, orientações e incentivos para que anfitriões adotem práticas mais sustentáveis.
          </p>
          <p className="text-airbnb-grey-600 leading-relaxed">
            Juntos, podemos criar um impacto positivo duradouro em nossas comunidades e no planeta.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ResponsibleHosting;
