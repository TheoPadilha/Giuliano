/**
 * Script para popular comodidades no banco de dados
 * Execute: node seed-amenities.js
 */

const { Amenity } = require('./models');

const AMENITIES = [
  {
    name: "Wi-Fi",
    icon: "wifi",
    category: "basic"
  },
  {
    name: "Ar Condicionado",
    icon: "snowflake",
    category: "comfort"
  },
  {
    name: "Piscina",
    icon: "waves",
    category: "comfort"
  },
  {
    name: "Estacionamento",
    icon: "car",
    category: "basic"
  },
  {
    name: "Cozinha",
    icon: "chef-hat",
    category: "basic"
  },
  {
    name: "TV",
    icon: "tv",
    category: "entertainment"
  },
  {
    name: "Máquina de Lavar",
    icon: "washing-machine",
    category: "basic"
  },
  {
    name: "Varanda",
    icon: "home",
    category: "comfort"
  },
  {
    name: "Vista para o Mar",
    icon: "eye",
    category: "comfort"
  },
  {
    name: "Elevador",
    icon: "move-vertical",
    category: "basic"
  },
  {
    name: "Portaria 24h",
    icon: "shield",
    category: "security"
  },
  {
    name: "Churrasqueira",
    icon: "flame",
    category: "entertainment"
  }
];

async function seedAmenities() {
  console.log('🔄 Iniciando seed de comodidades...\n');

  let created = 0;
  let existing = 0;

  for (const amenityData of AMENITIES) {
    try {
      const [amenity, isNew] = await Amenity.findOrCreate({
        where: { name: amenityData.name },
        defaults: amenityData
      });

      if (isNew) {
        console.log(`✅ Criada: ${amenityData.name}`);
        created++;
      } else {
        console.log(`⏭️  Já existe: ${amenityData.name}`);
        existing++;
      }
    } catch (error) {
      console.error(`❌ Erro ao criar ${amenityData.name}:`, error.message);
    }
  }

  console.log('\n📊 Resumo:');
  console.log(`  - Criadas: ${created}`);
  console.log(`  - Já existiam: ${existing}`);
  console.log(`  - Total: ${created + existing}`);
  console.log('\n✅ Seed de comodidades concluído!');
}

// Executar seed
seedAmenities()
  .then(() => {
    console.log('\n👋 Encerrando...');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Erro ao executar seed:', error);
    process.exit(1);
  });
