import { Link } from "react-router-dom";
import Footer from "../components/layout/Footer";
import { FaHome, FaDollarSign, FaCalendar, FaShieldAlt } from "react-icons/fa";

const Host = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-rausch to-rausch-dark text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Anuncie seu Espaço</h1>
          <p className="text-xl opacity-90">Transforme seu imóvel em uma fonte de renda</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Benefits */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-rausch/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaHome className="text-2xl text-rausch" />
            </div>
            <h3 className="font-bold text-airbnb-black mb-2">Fácil de Anunciar</h3>
            <p className="text-sm text-airbnb-grey-600">Cadastre seu imóvel em minutos</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-rausch/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaDollarSign className="text-2xl text-rausch" />
            </div>
            <h3 className="font-bold text-airbnb-black mb-2">Defina seus Preços</h3>
            <p className="text-sm text-airbnb-grey-600">Você decide quanto cobrar</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-rausch/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCalendar className="text-2xl text-rausch" />
            </div>
            <h3 className="font-bold text-airbnb-black mb-2">Controle Total</h3>
            <p className="text-sm text-airbnb-grey-600">Gerencie sua disponibilidade</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-rausch/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaShieldAlt className="text-2xl text-rausch" />
            </div>
            <h3 className="font-bold text-airbnb-black mb-2">Proteção Total</h3>
            <p className="text-sm text-airbnb-grey-600">Seguro contra danos</p>
          </div>
        </div>

        {/* Steps */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-airbnb-black mb-8 text-center">Como Começar</h2>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-rausch text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                1
              </div>
              <div>
                <h3 className="font-bold text-airbnb-black mb-1">Cadastre seu Imóvel</h3>
                <p className="text-airbnb-grey-600">Adicione fotos, descrição e comodidades do seu espaço</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 bg-rausch text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                2
              </div>
              <div>
                <h3 className="font-bold text-airbnb-black mb-1">Defina seus Preços</h3>
                <p className="text-airbnb-grey-600">Escolha seus valores e regras de cancelamento</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 bg-rausch text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                3
              </div>
              <div>
                <h3 className="font-bold text-airbnb-black mb-1">Comece a Receber</h3>
                <p className="text-airbnb-grey-600">Aceite reservas e comece a ganhar dinheiro</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            to="/admin"
            className="inline-block px-8 py-4 bg-rausch hover:bg-rausch-dark text-white font-semibold rounded-lg transition-colors text-lg"
          >
            Começar Agora
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Host;
