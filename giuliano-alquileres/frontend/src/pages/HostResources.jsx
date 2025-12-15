import Footer from "../components/layout/Footer";
import { FaBook, FaChartLine, FaUsers, FaLightbulb } from "react-icons/fa";

const HostResources = () => {
  const resources = [
    {
      icon: <FaBook className="text-2xl" />,
      title: "Guias e Tutoriais",
      description: "Aprenda as melhores práticas para hospedar com sucesso"
    },
    {
      icon: <FaChartLine className="text-2xl" />,
      title: "Otimização de Preços",
      description: "Ferramentas para maximizar sua receita"
    },
    {
      icon: <FaUsers className="text-2xl" />,
      title: "Comunidade",
      description: "Conecte-se com outros anfitriões"
    },
    {
      icon: <FaLightbulb className="text-2xl" />,
      title: "Dicas de Especialistas",
      description: "Conselhos de anfitriões experientes"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-rausch to-rausch-dark text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Recursos para Anfitriões</h1>
          <p className="text-xl opacity-90">Tudo que você precisa para ter sucesso</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {resources.map((resource, index) => (
            <div key={index} className="bg-white border border-airbnb-grey-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-rausch/10 rounded-full flex items-center justify-center text-rausch mb-4">
                {resource.icon}
              </div>
              <h3 className="text-xl font-bold text-airbnb-black mb-2">{resource.title}</h3>
              <p className="text-airbnb-grey-600">{resource.description}</p>
            </div>
          ))}
        </div>

        {/* Articles */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-airbnb-black mb-8">Artigos Populares</h2>

          <div className="space-y-4">
            <div className="p-6 bg-airbnb-grey-50 rounded-xl hover:bg-airbnb-grey-100 transition-colors cursor-pointer">
              <h3 className="font-bold text-airbnb-black mb-2">Como criar um anúncio atraente</h3>
              <p className="text-sm text-airbnb-grey-600">Dicas para fotos, descrições e títulos que convertem</p>
            </div>

            <div className="p-6 bg-airbnb-grey-50 rounded-xl hover:bg-airbnb-grey-100 transition-colors cursor-pointer">
              <h3 className="font-bold text-airbnb-black mb-2">Estratégias de precificação</h3>
              <p className="text-sm text-airbnb-grey-600">Como definir preços competitivos e lucrativos</p>
            </div>

            <div className="p-6 bg-airbnb-grey-50 rounded-xl hover:bg-airbnb-grey-100 transition-colors cursor-pointer">
              <h3 className="font-bold text-airbnb-black mb-2">Comunicação com hóspedes</h3>
              <p className="text-sm text-airbnb-grey-600">Melhores práticas para um atendimento excelente</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HostResources;
