import Footer from "../components/layout/Footer";
import { FaWheelchair, FaEye, FaVolumeUp } from "react-icons/fa";

const Accessibility = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-rausch to-rausch-dark text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Acessibilidade</h1>
          <p className="text-xl opacity-90">Comprometidos com a inclusão</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <p className="text-lg text-airbnb-grey-600 leading-relaxed mb-12">
          Estamos comprometidos em tornar nossa plataforma acessível a todos. Trabalhamos continuamente para melhorar a experiência de todos os usuários.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-rausch/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaWheelchair className="text-2xl text-rausch" />
            </div>
            <h3 className="font-bold text-airbnb-black mb-2">Mobilidade</h3>
            <p className="text-sm text-airbnb-grey-600">Imóveis com recursos de acessibilidade física</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-rausch/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaEye className="text-2xl text-rausch" />
            </div>
            <h3 className="font-bold text-airbnb-black mb-2">Visual</h3>
            <p className="text-sm text-airbnb-grey-600">Interface compatível com leitores de tela</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-rausch/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaVolumeUp className="text-2xl text-rausch" />
            </div>
            <h3 className="font-bold text-airbnb-black mb-2">Auditiva</h3>
            <p className="text-sm text-airbnb-grey-600">Recursos visuais e alertas</p>
          </div>
        </div>

        <div className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold text-airbnb-black mb-4">Recursos de Acessibilidade</h2>
          <ul className="space-y-2 text-airbnb-grey-600">
            <li>Filtros específicos para recursos de acessibilidade</li>
            <li>Descrições detalhadas de acessibilidade dos imóveis</li>
            <li>Suporte prioritário para usuários com necessidades especiais</li>
            <li>Navegação por teclado completa</li>
          </ul>

          <div className="mt-12 p-6 bg-airbnb-grey-50 rounded-xl">
            <p className="text-sm text-airbnb-grey-600 mb-0">
              Tem sugestões para melhorar nossa acessibilidade? Entre em contato conosco em acessibilidade@ziguealuga.com
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Accessibility;
