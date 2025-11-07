require("dotenv").config();
const {
  sendBookingConfirmation,
  sendCheckInReminder,
  sendCancellationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
} = require("./services/emailService");

const testEmail = process.argv[2] || "theohenriquecp@gmail.com";

console.log("🧪 Testando TODOS os Tipos de Email do Sistema\n");
console.log(`📧 Enviando para: ${testEmail}\n`);
console.log("════════════════════════════════════════════════════════\n");

// Dados de exemplo
const mockUser = {
  name: "Theo Henrique",
  email: testEmail,
};

const mockBooking = {
  uuid: "TESTE-12345",
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
  guest_email: testEmail,
  guest_phone: "(47) 98910-5580",
  special_requests: "Gostaria de chegar mais cedo, se possível.",
  payment_method: "credit_card",
};

const mockProperty = {
  title: "Casa de Praia Luxuosa em Balneário Camboriú",
  address: "Av. Atlântica, 1234",
  city: {
    name: "Balneário Camboriú",
    state: "SC"
  },
  uuid: "prop-test-123"
};

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testAllEmails() {
  let successCount = 0;
  let errorCount = 0;

  // 1. Email de Boas-vindas
  console.log("1️⃣  Testando Email de Boas-vindas...");
  try {
    const result = await sendWelcomeEmail(mockUser);
    if (result.success) {
      console.log("   ✅ Email de boas-vindas enviado!");
      successCount++;
    } else {
      console.log("   ❌ Erro:", result.error);
      errorCount++;
    }
  } catch (error) {
    console.log("   ❌ Erro:", error.message);
    errorCount++;
  }
  await delay(2000); // Aguardar 2 segundos entre emails

  // 2. Email de Confirmação de Reserva
  console.log("\n2️⃣  Testando Email de Confirmação de Reserva...");
  try {
    const result = await sendBookingConfirmation(mockBooking, mockProperty, mockUser);
    if (result.success) {
      console.log("   ✅ Email de confirmação de reserva enviado!");
      successCount++;
    } else {
      console.log("   ❌ Erro:", result.error);
      errorCount++;
    }
  } catch (error) {
    console.log("   ❌ Erro:", error.message);
    errorCount++;
  }
  await delay(2000);

  // 3. Email de Lembrete de Check-in
  console.log("\n3️⃣  Testando Email de Lembrete de Check-in...");
  try {
    const result = await sendCheckInReminder(mockBooking, mockProperty);
    if (result.success) {
      console.log("   ✅ Email de lembrete de check-in enviado!");
      successCount++;
    } else {
      console.log("   ❌ Erro:", result.error);
      errorCount++;
    }
  } catch (error) {
    console.log("   ❌ Erro:", error.message);
    errorCount++;
  }
  await delay(2000);

  // 4. Email de Cancelamento
  console.log("\n4️⃣  Testando Email de Cancelamento...");
  try {
    const refundAmount = 1937.50; // Reembolso total
    const result = await sendCancellationEmail(mockBooking, mockProperty, refundAmount);
    if (result.success) {
      console.log("   ✅ Email de cancelamento enviado!");
      successCount++;
    } else {
      console.log("   ❌ Erro:", result.error);
      errorCount++;
    }
  } catch (error) {
    console.log("   ❌ Erro:", error.message);
    errorCount++;
  }
  await delay(2000);

  // 5. Email de Recuperação de Senha
  console.log("\n5️⃣  Testando Email de Recuperação de Senha...");
  try {
    const resetToken = "test-token-123456789";
    const result = await sendPasswordResetEmail(mockUser, resetToken);
    if (result.success) {
      console.log("   ✅ Email de recuperação de senha enviado!");
      successCount++;
    } else {
      console.log("   ❌ Erro:", result.error);
      errorCount++;
    }
  } catch (error) {
    console.log("   ❌ Erro:", error.message);
    errorCount++;
  }

  // Resumo
  console.log("\n════════════════════════════════════════════════════════");
  console.log("\n📊 RESUMO DOS TESTES:\n");
  console.log(`   ✅ Sucessos: ${successCount}/5`);
  console.log(`   ❌ Erros: ${errorCount}/5`);
  console.log("");

  if (successCount === 5) {
    console.log("🎉 PERFEITO! Todos os emails foram enviados com sucesso!");
    console.log(`📬 Verifique sua caixa de entrada em: ${testEmail}`);
    console.log("   (Verifique também a pasta de SPAM)");
  } else if (successCount > 0) {
    console.log("⚠️  Alguns emails foram enviados, mas houve erros.");
    console.log("   Verifique a configuração do SMTP no .env");
  } else {
    console.log("❌ Nenhum email foi enviado. Verifique:");
    console.log("   1. API Key do SendGrid no .env");
    console.log("   2. Backend foi reiniciado");
    console.log("   3. Conexão com internet");
  }
  console.log("");
}

testAllEmails();
