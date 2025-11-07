import { Link } from "react-router-dom";
import { FaArrowLeft, FaShieldAlt } from "react-icons/fa";
import AirbnbHeader from "../components/layout/AirbnbHeader";
import Footer from "../components/layout/Footer";

const PrivacyPolicy = () => {
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
              <div className="p-3 bg-green-500/10 rounded-full">
                <FaShieldAlt className="text-green-500 text-2xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-airbnb-black dark:text-white">
                  Política de Privacidade
                </h1>
                <p className="text-sm text-airbnb-grey-600 dark:text-airbnb-grey-400 mt-1">
                  Última atualização: {new Date().toLocaleDateString("pt-BR")}
                </p>
              </div>
            </div>
            <p className="text-airbnb-grey-700 dark:text-airbnb-grey-300">
              A Zigué Aluga está comprometida em proteger sua privacidade e seus dados pessoais.
            </p>
          </div>

          {/* Content */}
          <div className="bg-white dark:bg-airbnb-grey-800 rounded-2xl shadow-lg p-8 space-y-8">
            {/* Section 1 */}
            <section>
              <h2 className="text-2xl font-bold text-airbnb-black dark:text-white mb-4">
                1. Informações que Coletamos
              </h2>
              <div className="space-y-4 text-airbnb-grey-700 dark:text-airbnb-grey-300">
                <div>
                  <h3 className="font-semibold mb-2">1.1 Informações Fornecidas por Você:</h3>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Nome completo</li>
                    <li>Endereço de email</li>
                    <li>Número de telefone</li>
                    <li>Informações de pagamento</li>
                    <li>Documento de identificação (quando necessário)</li>
                    <li>Informações de perfil e preferências</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">1.2 Informações Coletadas Automaticamente:</h3>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Endereço IP</li>
                    <li>Tipo de navegador e dispositivo</li>
                    <li>Páginas visitadas e tempo de permanência</li>
                    <li>Cookies e tecnologias similares</li>
                    <li>Localização geográfica (com sua permissão)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">1.3 Informações de Terceiros:</h3>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Dados de verificação de identidade</li>
                    <li>Informações de pagamento de processadores</li>
                    <li>Dados de análise e marketing</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-2xl font-bold text-airbnb-black dark:text-white mb-4">
                2. Como Usamos Suas Informações
              </h2>
              <div className="space-y-3 text-airbnb-grey-700 dark:text-airbnb-grey-300">
                <p>Utilizamos suas informações para:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Processar e gerenciar reservas</li>
                  <li>Facilitar comunicação entre proprietários e hóspedes</li>
                  <li>Processar pagamentos e prevenir fraudes</li>
                  <li>Enviar confirmações e atualizações sobre reservas</li>
                  <li>Fornecer suporte ao cliente</li>
                  <li>Personalizar sua experiência na plataforma</li>
                  <li>Melhorar nossos serviços e desenvolver novos recursos</li>
                  <li>Enviar comunicações de marketing (com seu consentimento)</li>
                  <li>Cumprir obrigações legais e regulatórias</li>
                  <li>Proteger a segurança da plataforma e dos usuários</li>
                </ul>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-2xl font-bold text-airbnb-black dark:text-white mb-4">
                3. Compartilhamento de Informações
              </h2>
              <div className="space-y-4 text-airbnb-grey-700 dark:text-airbnb-grey-300">
                <p>Podemos compartilhar suas informações com:</p>

                <div>
                  <h3 className="font-semibold mb-2">3.1 Outros Usuários:</h3>
                  <p className="ml-4">
                    Quando você faz uma reserva, compartilhamos informações necessárias com o proprietário
                    (nome, foto de perfil, informações de contato).
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">3.2 Prestadores de Serviços:</h3>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Processadores de pagamento (Mercado Pago, etc.)</li>
                    <li>Serviços de hospedagem e infraestrutura</li>
                    <li>Ferramentas de análise e marketing</li>
                    <li>Serviços de comunicação e email</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">3.3 Autoridades Legais:</h3>
                  <p className="ml-4">
                    Quando exigido por lei, ordem judicial ou processo legal, ou para proteger direitos
                    e segurança.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">3.4 Parceiros de Negócios:</h3>
                  <p className="ml-4">
                    Em caso de fusão, aquisição ou venda de ativos, suas informações podem ser transferidas.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-2xl font-bold text-airbnb-black dark:text-white mb-4">
                4. Cookies e Tecnologias de Rastreamento
              </h2>
              <div className="space-y-3 text-airbnb-grey-700 dark:text-airbnb-grey-300">
                <p>Utilizamos cookies e tecnologias similares para:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><strong>Cookies Essenciais:</strong> Necessários para o funcionamento básico da plataforma</li>
                  <li><strong>Cookies de Preferência:</strong> Lembram suas configurações e preferências</li>
                  <li><strong>Cookies de Análise:</strong> Coletam dados sobre como você usa a plataforma</li>
                  <li><strong>Cookies de Marketing:</strong> Personalizam anúncios e conteúdo</li>
                </ul>
                <p className="mt-3">
                  Você pode gerenciar suas preferências de cookies através das configurações do seu navegador.
                </p>
              </div>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-2xl font-bold text-airbnb-black dark:text-white mb-4">
                5. Segurança dos Dados
              </h2>
              <div className="space-y-3 text-airbnb-grey-700 dark:text-airbnb-grey-300">
                <p>Implementamos medidas de segurança para proteger suas informações:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Criptografia SSL/TLS para transmissão de dados</li>
                  <li>Armazenamento seguro de senhas (hash bcrypt)</li>
                  <li>Controles de acesso e autenticação</li>
                  <li>Monitoramento contínuo de segurança</li>
                  <li>Backups regulares de dados</li>
                  <li>Revisões periódicas de segurança</li>
                </ul>
                <p className="mt-3">
                  <strong>Importante:</strong> Nenhum método de transmissão pela internet é 100% seguro.
                  Embora nos esforcemos para proteger seus dados, não podemos garantir segurança absoluta.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-2xl font-bold text-airbnb-black dark:text-white mb-4">
                6. Seus Direitos
              </h2>
              <div className="space-y-3 text-airbnb-grey-700 dark:text-airbnb-grey-300">
                <p>De acordo com a LGPD (Lei Geral de Proteção de Dados), você tem direito a:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><strong>Acesso:</strong> Solicitar cópias de suas informações pessoais</li>
                  <li><strong>Correção:</strong> Corrigir informações imprecisas ou incompletas</li>
                  <li><strong>Exclusão:</strong> Solicitar a exclusão de seus dados pessoais</li>
                  <li><strong>Portabilidade:</strong> Receber seus dados em formato estruturado</li>
                  <li><strong>Oposição:</strong> Opor-se ao processamento de seus dados</li>
                  <li><strong>Revogação:</strong> Retirar consentimento a qualquer momento</li>
                  <li><strong>Revisão:</strong> Revisar decisões automatizadas</li>
                </ul>
                <p className="mt-3">
                  Para exercer seus direitos, entre em contato através de: <strong>privacidade@ziguealuga.com</strong>
                </p>
              </div>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-2xl font-bold text-airbnb-black dark:text-white mb-4">
                7. Retenção de Dados
              </h2>
              <p className="text-airbnb-grey-700 dark:text-airbnb-grey-300 leading-relaxed">
                Mantemos suas informações pessoais pelo tempo necessário para cumprir os propósitos descritos nesta
                política, a menos que um período de retenção mais longo seja exigido ou permitido por lei. Após esse
                período, seus dados serão deletados ou anonimizados de forma segura.
              </p>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-2xl font-bold text-airbnb-black dark:text-white mb-4">
                8. Dados de Menores
              </h2>
              <p className="text-airbnb-grey-700 dark:text-airbnb-grey-300 leading-relaxed">
                Nossa plataforma não é direcionada a menores de 18 anos. Não coletamos intencionalmente informações
                de menores. Se tomarmos conhecimento de que coletamos dados de um menor, tomaremos medidas para
                deletar essas informações imediatamente.
              </p>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="text-2xl font-bold text-airbnb-black dark:text-white mb-4">
                9. Transferência Internacional de Dados
              </h2>
              <p className="text-airbnb-grey-700 dark:text-airbnb-grey-300 leading-relaxed">
                Seus dados podem ser transferidos e armazenados em servidores localizados fora do Brasil.
                Garantimos que tais transferências sejam realizadas em conformidade com as leis aplicáveis e
                com medidas de segurança adequadas.
              </p>
            </section>

            {/* Section 10 */}
            <section>
              <h2 className="text-2xl font-bold text-airbnb-black dark:text-white mb-4">
                10. Alterações nesta Política
              </h2>
              <p className="text-airbnb-grey-700 dark:text-airbnb-grey-300 leading-relaxed">
                Podemos atualizar esta política periodicamente. Notificaremos você sobre alterações significativas
                por email ou através de um aviso em nossa plataforma. Recomendamos que revise esta política
                regularmente para se manter informado.
              </p>
            </section>

            {/* Section 11 */}
            <section>
              <h2 className="text-2xl font-bold text-airbnb-black dark:text-white mb-4">
                11. Marketing e Comunicações
              </h2>
              <div className="space-y-3 text-airbnb-grey-700 dark:text-airbnb-grey-300">
                <p>Com seu consentimento, podemos enviar:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Newsletters com ofertas e novidades</li>
                  <li>Recomendações personalizadas de imóveis</li>
                  <li>Pesquisas de satisfação</li>
                  <li>Atualizações sobre a plataforma</li>
                </ul>
                <p className="mt-3">
                  Você pode cancelar a assinatura de comunicações de marketing a qualquer momento através do link
                  presente nos emails ou acessando suas configurações de conta.
                </p>
              </div>
            </section>

            {/* Section 12 */}
            <section>
              <h2 className="text-2xl font-bold text-airbnb-black dark:text-white mb-4">
                12. Contato e Encarregado de Dados
              </h2>
              <div className="bg-airbnb-grey-50 dark:bg-airbnb-grey-700 rounded-lg p-6">
                <p className="text-airbnb-grey-700 dark:text-airbnb-grey-300 mb-4">
                  Para questões sobre privacidade ou exercer seus direitos:
                </p>
                <ul className="space-y-2 text-airbnb-grey-700 dark:text-airbnb-grey-300">
                  <li><strong>Encarregado de Dados (DPO):</strong> dpo@ziguealuga.com</li>
                  <li><strong>Email Geral:</strong> contato@ziguealuga.com</li>
                  <li><strong>Email Privacidade:</strong> privacidade@ziguealuga.com</li>
                  <li><strong>WhatsApp:</strong> (47) 98910-5580</li>
                  <li><strong>Site:</strong> www.ziguealuga.com</li>
                </ul>
                <p className="mt-4 text-airbnb-grey-700 dark:text-airbnb-grey-300">
                  Responderemos às solicitações dentro de 15 dias úteis conforme exigido pela LGPD.
                </p>
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

export default PrivacyPolicy;
