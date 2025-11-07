import { useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaQuestionCircle, FaChevronDown, FaChevronUp } from "react-icons/fa";
import AirbnbHeader from "../components/layout/AirbnbHeader";
import Footer from "../components/layout/Footer";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      category: "Reservas",
      questions: [
        {
          question: "Como faço uma reserva?",
          answer: "Para fazer uma reserva, navegue pelos imóveis disponíveis, escolha o que mais gosta, selecione as datas de check-in e check-out, informe o número de hóspedes e clique em 'Reservar Agora'. Você será direcionado para a página de checkout onde poderá finalizar sua reserva."
        },
        {
          question: "Posso cancelar minha reserva?",
          answer: "Sim, você pode cancelar sua reserva seguindo nossa política de cancelamento. Se cancelar com 7 ou mais dias de antecedência, receberá reembolso total. Entre 3-6 dias, reembolso de 50%. Menos de 3 dias, sem reembolso. Consulte os Termos de Uso para mais detalhes."
        },
        {
          question: "Como sei se minha reserva foi confirmada?",
          answer: "Assim que seu pagamento for aprovado, você receberá um email de confirmação com todos os detalhes da reserva. Você também pode visualizar o status da sua reserva na seção 'Minhas Reservas' do seu perfil."
        },
        {
          question: "Posso modificar as datas da minha reserva?",
          answer: "Para modificar datas, você precisará cancelar a reserva existente (sujeito à política de cancelamento) e fazer uma nova reserva com as datas desejadas. Entre em contato com o suporte se precisar de ajuda."
        }
      ]
    },
    {
      category: "Pagamentos",
      questions: [
        {
          question: "Quais formas de pagamento são aceitas?",
          answer: "Aceitamos cartão de crédito, cartão de débito, PIX e transferência bancária. Todos os pagamentos são processados de forma segura através do Mercado Pago."
        },
        {
          question: "Quando serei cobrado?",
          answer: "Você será cobrado imediatamente ao confirmar sua reserva. O pagamento deve ser aprovado para que a reserva seja confirmada."
        },
        {
          question: "Quais taxas estão incluídas no preço?",
          answer: "O preço final inclui: valor das diárias, taxa de limpeza e taxa de serviço da plataforma. Todas as taxas são exibidas de forma transparente antes de finalizar a reserva."
        },
        {
          question: "Como funciona o reembolso?",
          answer: "Reembolsos são processados de acordo com nossa política de cancelamento. O valor é devolvido para o mesmo método de pagamento usado na reserva, em até 7 dias úteis após o cancelamento."
        }
      ]
    },
    {
      category: "Check-in e Check-out",
      questions: [
        {
          question: "Qual o horário de check-in e check-out?",
          answer: "O check-in padrão é a partir das 14h e o check-out até as 12h. Horários diferentes podem ser combinados diretamente com o proprietário do imóvel."
        },
        {
          question: "O que devo levar no check-in?",
          answer: "Você deve levar um documento de identificação com foto (RG, CNH ou passaporte). O proprietário pode solicitar esses documentos para verificação."
        },
        {
          question: "Como recebo as chaves do imóvel?",
          answer: "As instruções de check-in e recebimento das chaves serão enviadas por email 1 dia antes da sua chegada. O proprietário entrará em contato para combinar os detalhes."
        },
        {
          question: "E se eu chegar mais cedo ou sair mais tarde?",
          answer: "Early check-in e late check-out dependem da disponibilidade e devem ser combinados diretamente com o proprietário. Pode haver cobrança adicional."
        }
      ]
    },
    {
      category: "Durante a Estadia",
      questions: [
        {
          question: "O que fazer se encontrar algum problema no imóvel?",
          answer: "Entre em contato imediatamente com o proprietário através dos dados de contato fornecidos. Se não conseguir resolver, entre em contato com nosso suporte através do WhatsApp (47) 98910-5580."
        },
        {
          question: "Posso receber visitas no imóvel?",
          answer: "Isso depende das regras específicas de cada imóvel. Verifique as regras da casa na descrição do imóvel antes de reservar. Visitas prolongadas ou pernoite geralmente não são permitidas."
        },
        {
          question: "O imóvel tem Wi-Fi?",
          answer: "A maioria dos imóveis oferece Wi-Fi gratuito. Verifique as comodidades listadas na página do imóvel. A senha será fornecida pelo proprietário no check-in."
        },
        {
          question: "Posso levar animais de estimação?",
          answer: "Alguns imóveis aceitam animais de estimação. Você pode filtrar sua busca por 'Pet Friendly' ou verificar nas regras do imóvel se pets são permitidos."
        }
      ]
    },
    {
      category: "Conta e Segurança",
      questions: [
        {
          question: "Como crio uma conta?",
          answer: "Clique em 'Cadastrar' no menu superior, escolha o tipo de conta (Hóspede ou Proprietário) e preencha seus dados. Clientes são aprovados automaticamente, enquanto contas de proprietário passam por análise."
        },
        {
          question: "Esqueci minha senha. Como recupero?",
          answer: "Na página de login, clique em 'Esqueceu a senha?' e siga as instruções. Você receberá um email com um link para redefinir sua senha."
        },
        {
          question: "Meus dados estão seguros?",
          answer: "Sim! Utilizamos criptografia SSL/TLS e seguimos as melhores práticas de segurança. Seus dados são protegidos conforme a LGPD. Leia nossa Política de Privacidade para mais detalhes."
        },
        {
          question: "Como edito minhas informações pessoais?",
          answer: "Acesse seu perfil através do menu de usuário e clique em 'Editar Perfil'. Você pode atualizar nome, email, telefone e outras informações."
        }
      ]
    },
    {
      category: "Proprietários",
      questions: [
        {
          question: "Como anuncio meu imóvel?",
          answer: "Crie uma conta de proprietário, aguarde aprovação e acesse o painel administrativo. Clique em 'Adicionar Imóvel' e preencha todos os dados: descrição, fotos, preços e disponibilidade."
        },
        {
          question: "Quanto custa anunciar?",
          answer: "O cadastro e o anúncio são gratuitos. Cobramos apenas uma taxa de serviço sobre as reservas confirmadas. Entre em contato para mais detalhes sobre comissões."
        },
        {
          question: "Como recebo o pagamento?",
          answer: "Os pagamentos são processados pela plataforma e repassados para você de acordo com os termos do contrato de proprietário. Entre em contato com nosso suporte comercial para mais informações."
        },
        {
          question: "Posso rejeitar uma reserva?",
          answer: "Reservas são confirmadas automaticamente mediante pagamento aprovado. É importante manter seu calendário atualizado para evitar conflitos."
        }
      ]
    },
    {
      category: "Suporte",
      questions: [
        {
          question: "Como entro em contato com o suporte?",
          answer: "Você pode entrar em contato através do email contato@ziguealuga.com ou pelo WhatsApp (47) 98910-5580. Nosso horário de atendimento é de segunda a sexta, das 9h às 18h."
        },
        {
          question: "Quanto tempo leva para ter uma resposta?",
          answer: "Respondemos a maioria das solicitações em até 24 horas úteis. Para questões urgentes durante uma estadia, use o WhatsApp para resposta mais rápida."
        },
        {
          question: "Posso fazer uma reclamação?",
          answer: "Sim, se você teve algum problema, entre em contato com nosso suporte detalhando a situação. Levamos todas as reclamações a sério e trabalhamos para resolver da melhor forma possível."
        }
      ]
    }
  ];

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
          <div className="bg-white dark:bg-airbnb-grey-800 rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-500/10 rounded-full">
                <FaQuestionCircle className="text-blue-500 text-2xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-airbnb-black dark:text-white">
                  Perguntas Frequentes
                </h1>
                <p className="text-sm text-airbnb-grey-600 dark:text-airbnb-grey-400 mt-1">
                  Encontre respostas para as dúvidas mais comuns
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Categories */}
          <div className="space-y-6">
            {faqs.map((category, categoryIndex) => (
              <div key={categoryIndex} className="bg-white dark:bg-airbnb-grey-800 rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-rausch/10 to-kazan/10 dark:from-rausch/20 dark:to-kazan/20 px-6 py-4 border-b border-airbnb-grey-200 dark:border-airbnb-grey-700">
                  <h2 className="text-xl font-bold text-airbnb-black dark:text-white">
                    {category.category}
                  </h2>
                </div>

                <div className="divide-y divide-airbnb-grey-200 dark:divide-airbnb-grey-700">
                  {category.questions.map((faq, faqIndex) => {
                    const globalIndex = `${categoryIndex}-${faqIndex}`;
                    const isOpen = openIndex === globalIndex;

                    return (
                      <div key={globalIndex} className="transition-all duration-200">
                        <button
                          onClick={() => toggleFAQ(globalIndex)}
                          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-airbnb-grey-50 dark:hover:bg-airbnb-grey-700 transition-colors"
                        >
                          <span className="font-semibold text-airbnb-black dark:text-white pr-4">
                            {faq.question}
                          </span>
                          {isOpen ? (
                            <FaChevronUp className="flex-shrink-0 text-rausch" />
                          ) : (
                            <FaChevronDown className="flex-shrink-0 text-airbnb-grey-400" />
                          )}
                        </button>

                        {isOpen && (
                          <div className="px-6 pb-4 text-airbnb-grey-700 dark:text-airbnb-grey-300 leading-relaxed bg-airbnb-grey-50 dark:bg-airbnb-grey-700">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Contact Section */}
          <div className="mt-8 bg-gradient-to-r from-rausch to-kazan rounded-2xl shadow-lg p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Ainda tem dúvidas?</h2>
            <p className="mb-6 opacity-90">
              Nossa equipe de suporte está pronta para ajudar!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:contato@ziguealuga.com"
                className="inline-block px-6 py-3 bg-white text-rausch font-semibold rounded-lg hover:bg-airbnb-grey-100 transition-colors"
              >
                Enviar Email
              </a>
              <a
                href="https://wa.me/5547989105580"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 bg-white text-rausch font-semibold rounded-lg hover:bg-airbnb-grey-100 transition-colors"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default FAQ;
