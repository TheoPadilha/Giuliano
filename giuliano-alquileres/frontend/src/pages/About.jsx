import { Link } from "react-router-dom";
import Footer from "../components/layout/Footer";
import { FaHome, FaSearch, FaCheckCircle } from "react-icons/fa";

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-rausch to-rausch-dark text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Como Funciona</h1>
          <p className="text-xl opacity-90">Descubra como é fácil encontrar o imóvel perfeito</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="space-y-12">
          {/* Step 1 */}
          <div className="flex gap-6 items-start">
            <div className="w-16 h-16 bg-rausch/10 rounded-full flex items-center justify-center flex-shrink-0">
              <FaSearch className="text-2xl text-rausch" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-airbnb-black mb-3">1. Busque o Imóvel Ideal</h2>
              <p className="text-airbnb-grey-600 leading-relaxed">
                Use nossos filtros avançados para encontrar exatamente o que você procura. Filtre por localização, número de quartos, comodidades e muito mais.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-6 items-start">
            <div className="w-16 h-16 bg-rausch/10 rounded-full flex items-center justify-center flex-shrink-0">
              <FaHome className="text-2xl text-rausch" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-airbnb-black mb-3">2. Escolha suas Datas</h2>
              <p className="text-airbnb-grey-600 leading-relaxed">
                Selecione as datas de check-in e check-out que melhor se adequam aos seus planos. Veja a disponibilidade em tempo real.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-6 items-start">
            <div className="w-16 h-16 bg-rausch/10 rounded-full flex items-center justify-center flex-shrink-0">
              <FaCheckCircle className="text-2xl text-rausch" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-airbnb-black mb-3">3. Reserve com Segurança</h2>
              <p className="text-airbnb-grey-600 leading-relaxed">
                Finalize sua reserva com total segurança. Oferecemos diversos métodos de pagamento e suporte completo durante toda a sua estadia.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Link
            to="/properties"
            className="inline-block px-8 py-4 bg-rausch hover:bg-rausch-dark text-white font-semibold rounded-lg transition-colors"
          >
            Começar a Buscar
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;
