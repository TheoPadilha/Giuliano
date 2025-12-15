import Footer from "../components/layout/Footer";

const Diversity = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-rausch to-rausch-dark text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Diversidade e Pertencimento</h1>
          <p className="text-xl opacity-90">Todos são bem-vindos aqui</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="prose prose-lg max-w-none">
          <p className="text-lg text-airbnb-grey-600 leading-relaxed mb-8">
            Acreditamos que todos merecem sentir que pertencem. Por isso, nos comprometemos a construir uma comunidade onde a diversidade é celebrada e o respeito é fundamental.
          </p>

          <h2 className="text-2xl font-bold text-airbnb-black mb-4 mt-12">Nosso Compromisso</h2>
          <p className="text-airbnb-grey-600 mb-6">
            Trabalhamos para criar um ambiente inclusivo onde pessoas de todas as origens, identidades e experiências se sintam acolhidas e respeitadas.
          </p>

          <h2 className="text-2xl font-bold text-airbnb-black mb-4 mt-12">Políticas Antidiscriminação</h2>
          <p className="text-airbnb-grey-600 mb-6">
            Não toleramos discriminação de qualquer tipo. Todos os anfitriões e hóspedes devem respeitar nossa política de não discriminação baseada em raça, etnia, nacionalidade, religião, orientação sexual, identidade de gênero, deficiência ou idade.
          </p>

          <h2 className="text-2xl font-bold text-airbnb-black mb-4 mt-12">Acessibilidade</h2>
          <p className="text-airbnb-grey-600 mb-6">
            Incentivamos anfitriões a tornar suas propriedades acessíveis a pessoas com deficiência e fornecemos recursos para ajudá-los nesse processo.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Diversity;
