/**
 * Rota temporária para popular dados iniciais
 * ⚠️ REMOVER APÓS USO!
 */

const express = require('express');
const router = express.Router();
const { Amenity } = require('../models');

const AMENITIES = [
  { name: "Wi-Fi", icon: "wifi", category: "basic" },
  { name: "Ar Condicionado", icon: "snowflake", category: "comfort" },
  { name: "Piscina", icon: "waves", category: "comfort" },
  { name: "Estacionamento", icon: "car", category: "basic" },
  { name: "Cozinha", icon: "chef-hat", category: "basic" },
  { name: "TV", icon: "tv", category: "entertainment" },
  { name: "Máquina de Lavar", icon: "washing-machine", category: "basic" },
  { name: "Varanda", icon: "home", category: "comfort" },
  { name: "Vista para o Mar", icon: "eye", category: "comfort" },
  { name: "Elevador", icon: "move-vertical", category: "basic" },
  { name: "Portaria 24h", icon: "shield", category: "security" },
  { name: "Churrasqueira", icon: "flame", category: "entertainment" }
];

// Endpoint para popular comodidades
router.post('/amenities', async (req, res) => {
  try {
    console.log('\n🔄 Iniciando seed de comodidades...');

    let created = 0;
    let existing = 0;
    const errors = [];

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
        errors.push({ amenity: amenityData.name, error: error.message });
      }
    }

    console.log('\n✅ Seed de comodidades concluído!');

    res.json({
      success: true,
      message: 'Comodidades populadas com sucesso!',
      results: {
        created,
        existing,
        total: created + existing,
        errors: errors.length > 0 ? errors : undefined
      }
    });

  } catch (error) {
    console.error('\n❌ Erro ao executar seed:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Endpoint para verificar comodidades existentes
router.get('/amenities/status', async (req, res) => {
  try {
    const amenities = await Amenity.findAll({
      order: [['name', 'ASC']]
    });

    res.json({
      count: amenities.length,
      amenities: amenities.map(a => ({
        id: a.id,
        name: a.name,
        icon: a.icon,
        category: a.category
      }))
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

module.exports = router;
