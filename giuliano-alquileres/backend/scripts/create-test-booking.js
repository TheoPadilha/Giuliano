/**
 * Script para criar uma reserva de teste já concluída (completed)
 * Permite testar o sistema de avaliações
 */

require("dotenv").config();
const { Booking, Property, User } = require("../models");

async function createTestBooking() {
  try {
    console.log("🔍 Buscando dados para criar reserva de teste...\n");

    // 1. Buscar primeira propriedade disponível
    const property = await Property.findOne({
      where: { status: "available" },
      attributes: ["id", "title", "price_per_night"],
    });

    if (!property) {
      console.error("❌ Nenhuma propriedade disponível encontrada!");
      console.log("💡 Crie uma propriedade primeiro no painel admin");
      process.exit(1);
    }

    console.log(`✅ Propriedade encontrada: ${property.title} (ID: ${property.id})`);

    // 2. Buscar primeiro usuário cliente/admin
    const user = await User.findOne({
      where: { role: ["client", "admin", "admin_master"] },
      attributes: ["id", "name", "email"],
    });

    if (!user) {
      console.error("❌ Nenhum usuário encontrado!");
      process.exit(1);
    }

    console.log(`✅ Usuário encontrado: ${user.name} (${user.email}) - ID: ${user.id}\n`);

    // 3. Criar reserva com check_out no passado (já passou)
    const checkIn = new Date("2025-12-01");
    const checkOut = new Date("2025-12-05"); // JÁ PASSOU!
    const nights = 4;
    const pricePerNight = parseFloat(property.price_per_night);
    const totalPrice = pricePerNight * nights;
    const serviceFee = totalPrice * 0.1;
    const cleaningFee = 50;
    const finalPrice = totalPrice + serviceFee + cleaningFee;

    console.log("📝 Criando reserva de teste...");
    console.log(`   Check-in: ${checkIn.toISOString().split("T")[0]}`);
    console.log(`   Check-out: ${checkOut.toISOString().split("T")[0]} (JÁ PASSOU)`);
    console.log(`   Noites: ${nights}`);
    console.log(`   Valor total: R$ ${finalPrice.toFixed(2)}\n`);

    // Usar build + save com validate: false para contornar validações de data
    const booking = Booking.build({
      property_id: property.id,
      user_id: user.id,
      check_in: checkIn.toISOString().split("T")[0],
      check_out: checkOut.toISOString().split("T")[0],
      guests: 2,
      nights: nights,
      price_per_night: pricePerNight,
      total_price: totalPrice,
      cleaning_fee: cleaningFee,
      service_fee: serviceFee,
      final_price: finalPrice,
      status: "completed", // JÁ CRIANDO COMO COMPLETED!
      guest_name: user.name,
      guest_email: user.email,
      guest_phone: "+5548999999999",
      guest_document: "12345678900",
      payment_status: "paid",
      confirmed_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 dias atrás
      completed_at: new Date(), // AGORA!
    });

    // Salvar sem validação de datas
    await booking.save({ validate: false });

    console.log("✅ Reserva de teste criada com sucesso!\n");
    console.log("📋 Detalhes da reserva:");
    console.log(`   UUID: ${booking.uuid}`);
    console.log(`   ID: ${booking.id}`);
    console.log(`   Status: ${booking.status}`);
    console.log(`   Propriedade: ${property.title}`);
    console.log(`   Usuário: ${user.name} (${user.email})`);
    console.log(`   Completed em: ${booking.completed_at}\n`);

    console.log("🎯 Próximos passos:");
    console.log(`   1. Faça login como: ${user.email}`);
    console.log(`   2. Acesse o imóvel: ${property.title}`);
    console.log(`   3. Você verá a opção de avaliar este imóvel!`);
    console.log(`   4. Crie sua avaliação com estrelas e comentário\n`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Erro ao criar reserva de teste:", error);
    console.error(error.stack);
    process.exit(1);
  }
}

createTestBooking();
