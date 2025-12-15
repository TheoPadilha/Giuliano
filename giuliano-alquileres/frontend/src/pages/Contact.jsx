import Footer from "../components/layout/Footer";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

const Contact = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-rausch to-rausch-dark text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Entre em Contato</h1>
          <p className="text-xl opacity-90">Estamos aqui para ajudar você</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-bold text-airbnb-black mb-8">Informações de Contato</h2>

            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 bg-rausch/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <FaEnvelope className="text-rausch" />
                </div>
                <div>
                  <h3 className="font-semibold text-airbnb-black mb-1">Email</h3>
                  <p className="text-airbnb-grey-600">contato@ziguealuga.com</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 bg-rausch/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <FaPhone className="text-rausch" />
                </div>
                <div>
                  <h3 className="font-semibold text-airbnb-black mb-1">Telefone</h3>
                  <p className="text-airbnb-grey-600">+55 (11) 1234-5678</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 bg-rausch/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <FaMapMarkerAlt className="text-rausch" />
                </div>
                <div>
                  <h3 className="font-semibold text-airbnb-black mb-1">Endereço</h3>
                  <p className="text-airbnb-grey-600">São Paulo, SP - Brasil</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold text-airbnb-black mb-8">Envie uma Mensagem</h2>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-airbnb-black mb-2">Nome</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-airbnb-grey-300 rounded-lg focus:ring-2 focus:ring-rausch focus:border-transparent"
                  placeholder="Seu nome"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-airbnb-black mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-airbnb-grey-300 rounded-lg focus:ring-2 focus:ring-rausch focus:border-transparent"
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-airbnb-black mb-2">Mensagem</label>
                <textarea
                  rows="5"
                  className="w-full px-4 py-3 border border-airbnb-grey-300 rounded-lg focus:ring-2 focus:ring-rausch focus:border-transparent"
                  placeholder="Como podemos ajudar?"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-rausch hover:bg-rausch-dark text-white font-semibold rounded-lg transition-colors"
              >
                Enviar Mensagem
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
