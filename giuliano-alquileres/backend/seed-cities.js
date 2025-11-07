/**
 * Script para popular o banco de dados com cidades de Santa Catarina
 * Execução: node seed-cities.js
 */

const { City, sequelize } = require("./models");

// Lista completa de cidades de SC
const CITIES_SC = [
  // Região Metropolitana de Balneário Camboriú (prioridade)
  { name: "Balneário Camboriú", state: "SC", region: "Litoral" },
  { name: "Camboriú", state: "SC", region: "Litoral" },
  { name: "Itajaí", state: "SC", region: "Litoral" },
  { name: "Itapema", state: "SC", region: "Litoral" },
  { name: "Porto Belo", state: "SC", region: "Litoral" },
  { name: "Bombinhas", state: "SC", region: "Litoral" },
  { name: "Navegantes", state: "SC", region: "Litoral" },
  { name: "Penha", state: "SC", region: "Litoral" },
  { name: "Balneário Piçarras", state: "SC", region: "Litoral" },
  { name: "Piçarras", state: "SC", region: "Litoral" },
  { name: "Tijucas", state: "SC", region: "Litoral" },
  { name: "Barra Velha", state: "SC", region: "Litoral" },
  { name: "Ilhota", state: "SC", region: "Vale do Itajaí" },
  { name: "Luiz Alves", state: "SC", region: "Vale do Itajaí" },

  // Grande Florianópolis (região turística)
  { name: "Florianópolis", state: "SC", region: "Litoral" },
  { name: "São José", state: "SC", region: "Grande Florianópolis" },
  { name: "Palhoça", state: "SC", region: "Grande Florianópolis" },
  { name: "Biguaçu", state: "SC", region: "Grande Florianópolis" },
  { name: "Governador Celso Ramos", state: "SC", region: "Litoral" },
  { name: "Santo Amaro da Imperatriz", state: "SC", region: "Grande Florianópolis" },
  { name: "Águas Mornas", state: "SC", region: "Grande Florianópolis" },
  { name: "Antônio Carlos", state: "SC", region: "Grande Florianópolis" },
  { name: "São Pedro de Alcântara", state: "SC", region: "Grande Florianópolis" },

  // Sul do estado (litoral)
  { name: "Garopaba", state: "SC", region: "Sul" },
  { name: "Imbituba", state: "SC", region: "Sul" },
  { name: "Laguna", state: "SC", region: "Sul" },
  { name: "Paulo Lopes", state: "SC", region: "Sul" },
  { name: "Imaruí", state: "SC", region: "Sul" },
  { name: "Jaguaruna", state: "SC", region: "Sul" },
  { name: "Tubarão", state: "SC", region: "Sul" },
  { name: "Capivari de Baixo", state: "SC", region: "Sul" },

  // Vale do Itajaí
  { name: "Blumenau", state: "SC", region: "Vale do Itajaí" },
  { name: "Brusque", state: "SC", region: "Vale do Itajaí" },
  { name: "Gaspar", state: "SC", region: "Vale do Itajaí" },
  { name: "Indaial", state: "SC", region: "Vale do Itajaí" },
  { name: "Pomerode", state: "SC", region: "Vale do Itajaí" },
  { name: "Timbó", state: "SC", region: "Vale do Itajaí" },
  { name: "Rio dos Cedros", state: "SC", region: "Vale do Itajaí" },
  { name: "Ascurra", state: "SC", region: "Vale do Itajaí" },
  { name: "Apiúna", state: "SC", region: "Vale do Itajaí" },

  // Norte do estado
  { name: "Joinville", state: "SC", region: "Norte" },
  { name: "São Francisco do Sul", state: "SC", region: "Norte" },
  { name: "Araquari", state: "SC", region: "Norte" },
  { name: "Guaramirim", state: "SC", region: "Norte" },
  { name: "Jaraguá do Sul", state: "SC", region: "Norte" },
  { name: "Schroeder", state: "SC", region: "Norte" },
  { name: "Corupá", state: "SC", region: "Norte" },
  { name: "Massaranduba", state: "SC", region: "Norte" },

  // Oeste (outras regiões importantes)
  { name: "Chapecó", state: "SC", region: "Oeste" },
  { name: "Lages", state: "SC", region: "Serra" },
  { name: "Criciúma", state: "SC", region: "Sul" },
  { name: "Joaçaba", state: "SC", region: "Oeste" },
  { name: "Caçador", state: "SC", region: "Meio Oeste" },
  { name: "Concórdia", state: "SC", region: "Oeste" },
  { name: "Rio do Sul", state: "SC", region: "Alto Vale" },
  { name: "Videira", state: "SC", region: "Meio Oeste" },
  { name: "São Bento do Sul", state: "SC", region: "Planalto Norte" },
  { name: "Mafra", state: "SC", region: "Planalto Norte" },

  // Litoral adicional
  { name: "Balneário Arroio do Silva", state: "SC", region: "Sul" },
  { name: "Balneário Gaivota", state: "SC", region: "Sul" },
  { name: "Balneário Rincão", state: "SC", region: "Sul" },
  { name: "Içara", state: "SC", region: "Sul" },
  { name: "Araranguá", state: "SC", region: "Sul" },
];

async function seedCities() {
  try {
    console.log("🌱 Iniciando seed de cidades...\n");

    // Conectar ao banco
    await sequelize.authenticate();
    console.log("✅ Conectado ao banco de dados\n");

    let created = 0;
    let existing = 0;

    for (const cityData of CITIES_SC) {
      try {
        // Verificar se a cidade já existe
        const [city, isNew] = await City.findOrCreate({
          where: {
            name: cityData.name,
            state: cityData.state
          },
          defaults: cityData
        });

        if (isNew) {
          console.log(`✅ Criada: ${cityData.name} - ${cityData.state} (${cityData.region})`);
          created++;
        } else {
          console.log(`⏭️  Já existe: ${cityData.name} - ${cityData.state}`);
          existing++;
        }
      } catch (error) {
        console.error(`❌ Erro ao criar ${cityData.name}:`, error.message);
      }
    }

    console.log("\n📊 Resumo:");
    console.log(`✅ Cidades criadas: ${created}`);
    console.log(`⏭️  Cidades já existentes: ${existing}`);
    console.log(`📍 Total de cidades: ${created + existing}`);

    // Listar todas as cidades no banco
    const allCities = await City.findAll({
      order: [['name', 'ASC']]
    });

    console.log(`\n🗺️  Total de cidades no banco: ${allCities.length}`);

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Erro ao fazer seed:", error);
    process.exit(1);
  }
}

// Executar
seedCities();
