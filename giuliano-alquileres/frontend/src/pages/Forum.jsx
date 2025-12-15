import Footer from "../components/layout/Footer";
import { FaComments, FaUsers, FaQuestionCircle } from "react-icons/fa";

const Forum = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-rausch to-rausch-dark text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Fórum da Comunidade</h1>
          <p className="text-xl opacity-90">Conecte-se com outros anfitriões e hóspedes</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <p className="text-lg text-airbnb-grey-600 text-center leading-relaxed mb-12">
          Junte-se à nossa comunidade! Compartilhe experiências, faça perguntas e aprenda com outros membros.
        </p>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-rausch/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaComments className="text-2xl text-rausch" />
            </div>
            <h3 className="font-bold text-airbnb-black mb-2">Discussões</h3>
            <p className="text-sm text-airbnb-grey-600">Participe de conversas</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-rausch/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaQuestionCircle className="text-2xl text-rausch" />
            </div>
            <h3 className="font-bold text-airbnb-black mb-2">Perguntas</h3>
            <p className="text-sm text-airbnb-grey-600">Tire suas dúvidas</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-rausch/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaUsers className="text-2xl text-rausch" />
            </div>
            <h3 className="font-bold text-airbnb-black mb-2">Networking</h3>
            <p className="text-sm text-airbnb-grey-600">Conecte-se com outros</p>
          </div>
        </div>

        {/* Popular Topics */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-airbnb-black mb-6">Tópicos Populares</h2>

          <div className="space-y-4">
            <div className="p-6 bg-airbnb-grey-50 rounded-xl hover:bg-airbnb-grey-100 transition-colors cursor-pointer">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-airbnb-black">Dicas para anfitriões iniciantes</h3>
                <span className="text-xs text-airbnb-grey-500">125 respostas</span>
              </div>
              <p className="text-sm text-airbnb-grey-600">Como começar a hospedar com o pé direito</p>
            </div>

            <div className="p-6 bg-airbnb-grey-50 rounded-xl hover:bg-airbnb-grey-100 transition-colors cursor-pointer">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-airbnb-black">Melhores práticas de limpeza</h3>
                <span className="text-xs text-airbnb-grey-500">89 respostas</span>
              </div>
              <p className="text-sm text-airbnb-grey-600">Compartilhe suas rotinas de limpeza</p>
            </div>

            <div className="p-6 bg-airbnb-grey-50 rounded-xl hover:bg-airbnb-grey-100 transition-colors cursor-pointer">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-airbnb-black">Experiências como hóspede</h3>
                <span className="text-xs text-airbnb-grey-500">203 respostas</span>
              </div>
              <p className="text-sm text-airbnb-grey-600">Compartilhe suas viagens incríveis</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <button className="px-8 py-4 bg-rausch hover:bg-rausch-dark text-white font-semibold rounded-lg transition-colors text-lg">
            Participar do Fórum
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Forum;
