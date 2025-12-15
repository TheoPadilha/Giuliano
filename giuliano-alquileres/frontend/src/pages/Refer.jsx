import Footer from "../components/layout/Footer";
import { FaGift, FaUserPlus, FaDollarSign } from "react-icons/fa";

const Refer = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-rausch to-rausch-dark text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Indicar Anfitriões</h1>
          <p className="text-xl opacity-90">Ganhe recompensas indicando novos anfitriões</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <p className="text-lg text-airbnb-grey-600 text-center leading-relaxed mb-12">
          Conhece alguém com um imóvel para alugar? Indique e ganhe quando eles completarem a primeira reserva!
        </p>

        {/* Benefits */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-rausch/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaUserPlus className="text-2xl text-rausch" />
            </div>
            <h3 className="font-bold text-airbnb-black mb-2">Indique Amigos</h3>
            <p className="text-sm text-airbnb-grey-600">Compartilhe seu link único</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-rausch/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaGift className="text-2xl text-rausch" />
            </div>
            <h3 className="font-bold text-airbnb-black mb-2">Eles Ganham</h3>
            <p className="text-sm text-airbnb-grey-600">Bônus no primeiro anúncio</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-rausch/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaDollarSign className="text-2xl text-rausch" />
            </div>
            <h3 className="font-bold text-airbnb-black mb-2">Você Ganha</h3>
            <p className="text-sm text-airbnb-grey-600">Recompensa em créditos</p>
          </div>
        </div>

        {/* How it works */}
        <div className="bg-airbnb-grey-50 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-airbnb-black mb-6 text-center">Como Funciona</h2>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-rausch text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                1
              </div>
              <div>
                <h3 className="font-bold text-airbnb-black mb-1">Compartilhe seu Link</h3>
                <p className="text-airbnb-grey-600">Envie seu link de indicação para amigos e familiares</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 bg-rausch text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                2
              </div>
              <div>
                <h3 className="font-bold text-airbnb-black mb-1">Eles se Cadastram</h3>
                <p className="text-airbnb-grey-600">Seu amigo cria uma conta e cadastra um imóvel</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 bg-rausch text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                3
              </div>
              <div>
                <h3 className="font-bold text-airbnb-black mb-1">Receba sua Recompensa</h3>
                <p className="text-airbnb-grey-600">Quando eles completarem a primeira reserva, você ganha créditos!</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <button className="px-8 py-4 bg-rausch hover:bg-rausch-dark text-white font-semibold rounded-lg transition-colors text-lg">
            Obter Meu Link de Indicação
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Refer;
