// Home.jsx - Design Minimalista e Clean (estilo ZAP Imóveis)
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { propertiesAPI } from "../services/api";
import PropertyCard from "../components/property/PropertyCard";
import Loading from "../components/common/Loading";
import AirbnbHeader from "../components/layout/AirbnbHeader";
import Footer from "../components/layout/Footer";
import {
  FaBuilding,
  FaHome,
  FaCrown,
  FaGem,
  FaSearch,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUsers,
  FaShieldAlt,
  FaHeadset,
  FaCreditCard,
  FaStar,
} from "react-icons/fa";
import { trackPageView } from "../utils/googleAnalytics";

const Home = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Rastrear visualização da página inicial
    trackPageView("/", "Página Inicial");

    const fetchProperties = async () => {
      try {
        setLoading(true);

        // Buscar apenas propriedades em destaque (is_featured = true)
        const featuredResponse = await propertiesAPI.getFeatured();
        const featured = featuredResponse.data.properties || featuredResponse.data || [];

        setFeaturedProperties(featured);
      } catch (error) {
        console.error("Erro ao carregar propriedades:", error);
        setFeaturedProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (loading) {
    return <Loading text="Carregando acomodações..." />;
  }

  const categories = [
    {
      icon: FaBuilding,
      title: "Apartamentos",
      description: "Conforto e localização",
      type: "apartment",
      count: "200+",
    },
    {
      icon: FaHome,
      title: "Casas",
      description: "Espaço e privacidade",
      type: "house",
      count: "150+",
    },
    {
      icon: FaCrown,
      title: "Coberturas",
      description: "Luxo e exclusividade",
      type: "penthouse",
      count: "80+",
    },
    {
      icon: FaGem,
      title: "Studios",
      description: "Praticidade e economia",
      type: "studio",
      count: "120+",
    },
  ];

  const benefits = [
    {
      icon: FaShieldAlt,
      title: "Reserva Segura",
      description: "Pagamento 100% protegido",
    },
    {
      icon: FaHeadset,
      title: "Suporte 24/7",
      description: "Estamos aqui para ajudar",
    },
    {
      icon: FaCreditCard,
      title: "Melhor Preço",
      description: "Sem taxas escondidas",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header Original com Barra de Pesquisa */}
      <AirbnbHeader />

      {/* Hero Section - Com Imagem de Fundo (estilo ZAP) */}
      <section className="relative bg-gray-900 py-32 md:py-40">
        {/* Imagem de Fundo */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2070&auto=format&fit=crop"
            alt="Balneário Camboriú"
            className="w-full h-full object-cover"
          />
          {/* Overlay escuro */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/60 to-black/50"></div>
        </div>

        {/* Conteúdo - Apenas Texto */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Encontre a acomodação perfeita para suas férias
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              Mais de 500 opções de aluguel por temporada em Balneário Camboriú
            </p>
            <Link
              to="/properties"
              className="inline-block bg-rausch hover:bg-rausch-dark text-white font-semibold py-4 px-8 rounded-lg transition-colors duration-200 text-lg"
            >
              Explorar acomodações
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section - Grid Clean */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Explore por categoria
            </h2>
            <p className="text-gray-600">
              Encontre o tipo de acomodação ideal para você
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <Link
                  key={index}
                  to={`/properties?type=${category.type}`}
                  className="group bg-white border border-gray-200 rounded-xl p-6 hover:border-rausch hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex flex-col items-start">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-rausch/10 transition-colors">
                      <Icon className="text-2xl text-gray-700 group-hover:text-rausch transition-colors" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {category.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {category.description}
                    </p>
                    <span className="text-xs font-medium text-rausch">
                      {category.count} disponíveis
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      {featuredProperties.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <FaStar className="text-3xl text-yellow-500" />
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-1">
                    Acomodações Premium
                  </h2>
                  <p className="text-gray-600">
                    Nossos imóveis mais bem avaliados e exclusivos
                  </p>
                </div>
              </div>
              <Link
                to="/properties?featured=true"
                className="hidden md:block text-rausch font-semibold hover:text-rausch-dark transition-colors"
              >
                Ver todas →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProperties.map((property, index) => (
                <PropertyCard
                  key={property.uuid || index}
                  property={property}
                  showPremiumBadge={true}
                />
              ))}
            </div>

            <div className="mt-8 text-center md:hidden">
              <Link
                to="/properties"
                className="inline-block bg-white border-2 border-gray-300 text-gray-700 font-semibold py-3 px-8 rounded-lg hover:border-rausch hover:text-rausch transition-all"
              >
                Ver todas as acomodações
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Benefits Section - Clean */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Por que escolher a Ziguealuga?
            </h2>
            <p className="text-gray-600">
              Sua tranquilidade é nossa prioridade
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={index}
                  className="text-center p-8 bg-gray-50 rounded-xl"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-rausch/10 rounded-full mb-4">
                    <Icon className="text-3xl text-rausch" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-br from-rausch to-rausch-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-white/80">Acomodações</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">2000+</div>
              <div className="text-white/80">Hóspedes Felizes</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">4.9</div>
              <div className="text-white/80 flex items-center justify-center gap-1">
                <FaStar className="text-yellow-300" />
                Avaliação Média
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-white/80">Suporte</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Minimalista */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Pronto para suas próximas férias?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Reserve agora e garanta o melhor preço
          </p>
          <Link
            to="/properties"
            className="inline-block bg-rausch hover:bg-rausch-dark text-white font-semibold py-4 px-10 rounded-lg transition-colors duration-200 text-lg"
          >
            Explorar acomodações
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
