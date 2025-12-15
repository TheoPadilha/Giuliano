import { Link } from "react-router-dom";
import Footer from "../components/layout/Footer";
import { FaMapMarkerAlt, FaCompass, FaHeart } from "react-icons/fa";

const Visit = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-rausch to-rausch-dark text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Explore Destinos</h1>
          <p className="text-xl opacity-90">Descubra lugares incríveis para visitar</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <p className="text-lg text-airbnb-grey-600 text-center leading-relaxed mb-12">
          Explore nossos destinos mais populares e encontre o lugar perfeito para sua próxima aventura.
        </p>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-rausch/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaMapMarkerAlt className="text-2xl text-rausch" />
            </div>
            <h3 className="font-bold text-airbnb-black mb-2">Destinos Populares</h3>
            <p className="text-sm text-airbnb-grey-600">Cidades mais buscadas</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-rausch/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCompass className="text-2xl text-rausch" />
            </div>
            <h3 className="font-bold text-airbnb-black mb-2">Experiências Únicas</h3>
            <p className="text-sm text-airbnb-grey-600">Viagens memoráveis</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-rausch/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaHeart className="text-2xl text-rausch" />
            </div>
            <h3 className="font-bold text-airbnb-black mb-2">Recomendações</h3>
            <p className="text-sm text-airbnb-grey-600">Selecionados para você</p>
          </div>
        </div>

        {/* Popular Destinations */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-airbnb-black mb-6">Destinos Populares</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-airbnb-grey-50 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <h3 className="font-bold text-airbnb-black mb-2">São Paulo</h3>
              <p className="text-sm text-airbnb-grey-600 mb-4">A maior cidade do Brasil</p>
              <Link to="/properties?city=sao-paulo" className="text-rausch font-medium text-sm">
                Ver imóveis →
              </Link>
            </div>

            <div className="bg-airbnb-grey-50 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <h3 className="font-bold text-airbnb-black mb-2">Rio de Janeiro</h3>
              <p className="text-sm text-airbnb-grey-600 mb-4">Cidade maravilhosa</p>
              <Link to="/properties?city=rio-de-janeiro" className="text-rausch font-medium text-sm">
                Ver imóveis →
              </Link>
            </div>

            <div className="bg-airbnb-grey-50 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <h3 className="font-bold text-airbnb-black mb-2">Florianópolis</h3>
              <p className="text-sm text-airbnb-grey-600 mb-4">Ilha da magia</p>
              <Link to="/properties?city=florianopolis" className="text-rausch font-medium text-sm">
                Ver imóveis →
              </Link>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            to="/properties"
            className="inline-block px-8 py-4 bg-rausch hover:bg-rausch-dark text-white font-semibold rounded-lg transition-colors text-lg"
          >
            Explorar Todos os Destinos
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Visit;
