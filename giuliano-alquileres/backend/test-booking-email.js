require("dotenv").config();
const { sendBookingConfirmation } = require("./services/emailService");

console.log("🧪 Testando Email de Confirmação de Reserva...\n");

// Dados de exemplo de uma reserva
const mockBooking = {
  uuid: "test-" + Math.random().toString(36).substring(7),
  check_in: "2025-12-25",
  check_out: "2025-12-30",
  nights: 5,
  guests: 2,
  price_per_night: 350.00,
  total_price: 1750.00,
  cleaning_fee: 100.00,
  service_fee: 87.50,
  final_price: 1937.50,
  guest_name: "Theo Henrique",
  guest_email: process.argv[2] || "theohenriquecp@gmail.com",
  guest_phone: "(47) 98910-5580",
  special_requests: "Por favor, deixar o ar-condicionado ligado antes da chegada.",
  payment_method: "credit_card",
};

const mockProperty = {
  title: "Casa de Praia Luxuosa em Balneário Camboriú",
  address: "Av. Atlântica, 1234",
  city: {
    name: "Balneário Camboriú",
    state: "SC"
  }
};

const mockUser = {
  name: "Theo Henrique",
  email: mockBooking.guest_email,
};

async function testBookingEmail() {
  console.log("📧 Enviando email de confirmação de reserva para:", mockBooking.guest_email);
  console.log("(Use: node test-booking-email.js seuemail@gmail.com para testar outro email)\n");

  console.log("📋 Detalhes da reserva de teste:");
  console.log("   Imóvel:", mockProperty.title);
  console.log("   Check-in:", mockBooking.check_in);
  console.log("   Check-out:", mockBooking.check_out);
  console.log("   Hóspedes:", mockBooking.guests);
  console.log("   Total:", `R$ ${mockBooking.final_price.toFixed(2)}`);
  console.log("");

  try {
    const result = await sendBookingConfirmation(mockBooking, mockProperty, mockUser);

    if (result.success) {
      console.log("✅ Email de confirmação de reserva enviado com sucesso!");
      console.log("📨 Message ID:", result.messageId);
      console.log("");
      console.log("🎉 SUCESSO! Verifique sua caixa de entrada em:", mockBooking.guest_email);
      console.log("");
      console.log("📧 O email contém:");
      console.log("   ✓ Detalhes do imóvel");
      console.log("   ✓ Datas de check-in e check-out");
      console.log("   ✓ Número de hóspedes e noites");
      console.log("   ✓ Resumo de valores");
      console.log("   ✓ Solicitações especiais");
      console.log("   ✓ Próximos passos");
    } else {
      console.error("❌ Erro ao enviar email:", result.error);
    }
  } catch (error) {
    console.error("❌ Erro ao enviar email de confirmação:");
    console.error("Mensagem:", error.message);
    console.error("");
    console.error("💡 Verifique:");
    console.error("1. Se a API Key do SendGrid está configurada corretamente no .env");
    console.error("2. Se o backend foi reiniciado após configurar o .env");
    console.error("3. Se há créditos disponíveis no SendGrid");
  }
}

testBookingEmail();
