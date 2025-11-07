import { Link } from "react-router-dom";
import { FaArrowLeft, FaFileContract } from "react-icons/fa";
import AirbnbHeader from "../components/layout/AirbnbHeader";
import Footer from "../components/layout/Footer";

const TermsOfService = () => {
  return (
    <>
      <AirbnbHeader />
      <div className="min-h-screen bg-airbnb-grey-50 dark:bg-airbnb-grey-900 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link
              to="/"
              className="inline-flex items-center text-airbnb-grey-700 dark:text-airbnb-grey-300 hover:text-rausch dark:hover:text-rausch transition-colors"
            >
              <FaArrowLeft className="mr-2" size={14} />
              Voltar para Home
            </Link>
          </div>

          {/* Header */}
          <div className="bg-white dark:bg-airbnb-grey-800 rounded-2xl shadow-lg p-8 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-rausch/10 rounded-full">
                <FaFileContract className="text-rausch text-2xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-airbnb-black dark:text-white">
                  Termos de Uso
                </h1>
                <p className="text-sm text-airbnb-grey-600 dark:text-airbnb-grey-400 mt-1">
                  Última atualização: {new Date().toLocaleDateString("pt-BR")}
                </p>
              </div>
            </div>
            <p className="text-airbnb-grey-700 dark:text-airbnb-grey-300">
              Ao utilizar a plataforma Zigué Aluga, você concorda com os seguintes termos e condições.
            </p>
          </div>

          {/* Content */}
          <div className="bg-white dark:bg-airbnb-grey-800 rounded-2xl shadow-lg p-8 space-y-8">
            {/* Section 1 */}
            <section>
              <h2 className="text-2xl font-bold text-airbnb-black dark:text-white mb-4">
                1. Aceitação dos Termos
              </h2>
              <p className="text-airbnb-grey-700 dark:text-airbnb-grey-300 leading-relaxed">
                Ao acessar e usar a plataforma Zigué Aluga, você aceita e concorda em ficar vinculado aos termos e condições
                deste acordo. Se você não concordar com alguma parte destes termos, não deverá usar nossos serviços.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-2xl font-bold text-airbnb-black dark:text-white mb-4">
                2. Definições
              </h2>
              <ul className="list-disc list-inside space-y-2 text-airbnb-grey-700 dark:text-airbnb-grey-300">
                <li><strong>Plataforma:</strong> Refere-se ao site Zigué Aluga e todos os seus serviços</li>
                <li><strong>Usuário:</strong> Qualquer pessoa que acesse ou use a plataforma</li>
                <li><strong>Proprietário:</strong> Pessoa que anuncia imóveis para aluguel na plataforma</li>
                <li><strong>Hóspede:</strong> Pessoa que reserva e aluga um imóvel através da plataforma</li>
                <li><strong>Reserva:</strong> Solicitação de aluguel de um imóvel por período determinado</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-2xl font-bold text-airbnb-black dark:text-white mb-4">
                3. Cadastro e Conta de Usuário
              </h2>
              <div className="space-y-3 text-airbnb-grey-700 dark:text-airbnb-grey-300">
                <p>Para utilizar alguns serviços da plataforma, você deve criar uma conta fornecendo informações precisas e atualizadas.</p>
                <p><strong>Você é responsável por:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Manter a confidencialidade de sua senha</li>
                  <li>Todas as atividades realizadas em sua conta</li>
                  <li>Notificar-nos imediatamente sobre qualquer uso não autorizado</li>
                  <li>Fornecer informações verdadeiras e completas</li>
                </ul>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-2xl font-bold text-airbnb-black dark:text-white mb-4">
                4. Responsabilidades dos Proprietários
              </h2>
              <div className="space-y-3 text-airbnb-grey-700 dark:text-airbnb-grey-300">
                <p>Os proprietários que anunciam imóveis na plataforma concordam em:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Fornecer informações precisas sobre o imóvel</li>
                  <li>Disponibilizar fotos reais e atualizadas</li>
                  <li>Manter o calendário de disponibilidade atualizado</li>
                  <li>Responder prontamente às solicitações de reserva</li>
                  <li>Cumprir com todas as leis locais aplicáveis</li>
                  <li>Entregar o imóvel nas condições anunciadas</li>
                </ul>
              </div>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-2xl font-bold text-airbnb-black dark:text-white mb-4">
                5. Responsabilidades dos Hóspedes
              </h2>
              <div className="space-y-3 text-airbnb-grey-700 dark:text-airbnb-grey-300">
                <p>Os hóspedes que reservam imóveis concordam em:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Fornecer informações verdadeiras sobre a reserva</li>
                  <li>Respeitar as regras do imóvel e da propriedade</li>
                  <li>Tratar o imóvel com cuidado e respeito</li>
                  <li>Comunicar imediatamente quaisquer problemas ou danos</li>
                  <li>Deixar o imóvel nas mesmas condições em que foi recebido</li>
                  <li>Não exceder o número máximo de hóspedes acordado</li>
                </ul>
              </div>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-2xl font-bold text-airbnb-black dark:text-white mb-4">
                6. Reservas e Pagamentos
              </h2>
              <div className="space-y-3 text-airbnb-grey-700 dark:text-airbnb-grey-300">
                <p><strong>6.1 Processo de Reserva:</strong> As reservas são confirmadas mediante pagamento aprovado.</p>
                <p><strong>6.2 Preços:</strong> Todos os preços são exibidos em Reais (BRL) e incluem impostos aplicáveis.</p>
                <p><strong>6.3 Taxas:</strong> Podem ser aplicadas taxas de serviço, limpeza e outras taxas adicionais.</p>
                <p><strong>6.4 Métodos de Pagamento:</strong> Aceitamos cartão de crédito, PIX e transferência bancária.</p>
              </div>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-2xl font-bold text-airbnb-black dark:text-white mb-4">
                7. Política de Cancelamento
              </h2>
              <div className="space-y-3 text-airbnb-grey-700 dark:text-airbnb-grey-300">
                <p>A política de cancelamento segue as seguintes regras:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><strong>7+ dias antes do check-in:</strong> Reembolso total</li>
                  <li><strong>3-6 dias antes do check-in:</strong> Reembolso de 50%</li>
                  <li><strong>Menos de 3 dias:</strong> Sem reembolso</li>
                </ul>
                <p className="mt-3">
                  <strong>Nota:</strong> Cancelamentos feitos pelo proprietário podem ter políticas diferentes e estão
                  sujeitos a penalidades.
                </p>
              </div>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-2xl font-bold text-airbnb-black dark:text-white mb-4">
                8. Proibições e Uso Indevido
              </h2>
              <div className="space-y-3 text-airbnb-grey-700 dark:text-airbnb-grey-300">
                <p>É expressamente proibido:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Usar a plataforma para fins ilegais ou não autorizados</li>
                  <li>Publicar conteúdo falso, enganoso ou fraudulento</li>
                  <li>Violar direitos de propriedade intelectual</li>
                  <li>Assediar, ameaçar ou intimidar outros usuários</li>
                  <li>Tentar contornar as taxas da plataforma</li>
                  <li>Realizar transações fora da plataforma</li>
                </ul>
              </div>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="text-2xl font-bold text-airbnb-black dark:text-white mb-4">
                9. Propriedade Intelectual
              </h2>
              <p className="text-airbnb-grey-700 dark:text-airbnb-grey-300 leading-relaxed">
                Todo o conteúdo da plataforma, incluindo textos, gráficos, logos, ícones, imagens, clipes de áudio e software,
                é propriedade da Zigué Aluga ou de seus fornecedores de conteúdo e está protegido por leis de direitos autorais.
              </p>
            </section>

            {/* Section 10 */}
            <section>
              <h2 className="text-2xl font-bold text-airbnb-black dark:text-white mb-4">
                10. Limitação de Responsabilidade
              </h2>
              <div className="space-y-3 text-airbnb-grey-700 dark:text-airbnb-grey-300">
                <p>A Zigué Aluga atua como intermediária entre proprietários e hóspedes. Não nos responsabilizamos por:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Qualidade, segurança ou legalidade dos imóveis anunciados</li>
                  <li>Veracidade das informações fornecidas pelos usuários</li>
                  <li>Danos, perdas ou prejuízos decorrentes do uso da plataforma</li>
                  <li>Disputas entre proprietários e hóspedes</li>
                </ul>
              </div>
            </section>

            {/* Section 11 */}
            <section>
              <h2 className="text-2xl font-bold text-airbnb-black dark:text-white mb-4">
                11. Modificações dos Termos
              </h2>
              <p className="text-airbnb-grey-700 dark:text-airbnb-grey-300 leading-relaxed">
                Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações entrarão em vigor
                imediatamente após sua publicação na plataforma. O uso continuado da plataforma após as alterações
                constitui aceitação dos novos termos.
              </p>
            </section>

            {/* Section 12 */}
            <section>
              <h2 className="text-2xl font-bold text-airbnb-black dark:text-white mb-4">
                12. Lei Aplicável
              </h2>
              <p className="text-airbnb-grey-700 dark:text-airbnb-grey-300 leading-relaxed">
                Estes termos são regidos pelas leis da República Federativa do Brasil. Qualquer disputa será resolvida
                nos tribunais brasileiros.
              </p>
            </section>

            {/* Section 13 */}
            <section>
              <h2 className="text-2xl font-bold text-airbnb-black dark:text-white mb-4">
                13. Contato
              </h2>
              <div className="bg-airbnb-grey-50 dark:bg-airbnb-grey-700 rounded-lg p-6">
                <p className="text-airbnb-grey-700 dark:text-airbnb-grey-300 mb-4">
                  Para dúvidas sobre estes termos, entre em contato:
                </p>
                <ul className="space-y-2 text-airbnb-grey-700 dark:text-airbnb-grey-300">
                  <li><strong>Email:</strong> contato@ziguealuga.com</li>
                  <li><strong>WhatsApp:</strong> (47) 98910-5580</li>
                  <li><strong>Site:</strong> www.ziguealuga.com</li>
                </ul>
              </div>
            </section>
          </div>

          {/* Footer Actions */}
          <div className="mt-8 text-center">
            <Link to="/" className="btn-primary inline-block">
              Voltar para Home
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TermsOfService;
