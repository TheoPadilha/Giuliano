import Footer from "../components/layout/Footer";

const Cancellation = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-rausch to-rausch-dark text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Política de Cancelamento</h1>
          <p className="text-xl opacity-90">Entenda nossas políticas de cancelamento</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold text-airbnb-black mb-4">Cancelamento Flexível</h2>
          <p className="text-airbnb-grey-600 mb-6">
            Cancelamento gratuito até 24 horas antes do check-in. Após esse período, será cobrado o valor de uma diária.
          </p>

          <h2 className="text-2xl font-bold text-airbnb-black mb-4 mt-8">Cancelamento Moderado</h2>
          <p className="text-airbnb-grey-600 mb-6">
            Cancelamento gratuito até 5 dias antes do check-in. Entre 5 dias e 24 horas antes, será cobrado 50% do valor total. Menos de 24 horas, será cobrado 100%.
          </p>

          <h2 className="text-2xl font-bold text-airbnb-black mb-4 mt-8">Cancelamento Rigoroso</h2>
          <p className="text-airbnb-grey-600 mb-6">
            Cancelamento gratuito até 30 dias antes do check-in. Entre 30 e 14 dias, será cobrado 50% do valor total. Menos de 14 dias, será cobrado 100%.
          </p>

          <h2 className="text-2xl font-bold text-airbnb-black mb-4 mt-8">Como Cancelar</h2>
          <ol className="list-decimal list-inside space-y-3 text-airbnb-grey-600">
            <li>Acesse sua conta e vá para "Minhas Reservas"</li>
            <li>Selecione a reserva que deseja cancelar</li>
            <li>Clique em "Cancelar Reserva"</li>
            <li>Confirme o cancelamento</li>
          </ol>

          <div className="mt-12 p-6 bg-airbnb-grey-50 rounded-xl">
            <p className="text-sm text-airbnb-grey-600">
              <strong>Observação:</strong> A política de cancelamento específica de cada imóvel está disponível na página de detalhes do imóvel e no momento da reserva.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Cancellation;
