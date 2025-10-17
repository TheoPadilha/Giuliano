const { User, Property, PropertyPhoto, City } = require("../models");

// Adicionar aos favoritos
const addToFavorites = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const userId = req.user.id;

    // Verificar se propriedade existe
    const property = await Property.findByPk(propertyId);
    if (!property) {
      return res.status(404).json({ error: "Propriedade não encontrada" });
    }

    // Verificar se já está nos favoritos
    const user = await User.findByPk(userId, {
      include: [{
        model: Property,
        as: 'favorites',
        where: { id: propertyId },
        required: false
      }]
    });

    if (user.favorites.length > 0) {
      return res.status(400).json({ error: "Propriedade já está nos favoritos" });
    }

    // Adicionar aos favoritos
    await user.addFavorite(property);

    res.json({ message: "Propriedade adicionada aos favoritos" });
  } catch (error) {
    console.error("Erro ao adicionar favorito:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// Remover dos favoritos
const removeFromFavorites = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const userId = req.user.id;

    const user = await User.findByPk(userId);
    const property = await Property.findByPk(propertyId);

    if (!property) {
      return res.status(404).json({ error: "Propriedade não encontrada" });
    }

    await user.removeFavorite(property);

    res.json({ message: "Propriedade removida dos favoritos" });
  } catch (error) {
    console.error("Erro ao remover favorito:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// Listar meus favoritos
const getMyFavorites = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId, {
      include: [{
        model: Property,
        as: 'favorites',
        include: [
          { model: PropertyPhoto, as: 'photos', limit: 1 },
          { model: City, as: 'city' }
        ]
      }]
    });

    res.json({ favorites: user.favorites });
  } catch (error) {
    console.error("Erro ao buscar favoritos:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// Verificar se é favorito
const checkIsFavorite = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const userId = req.user.id;

    const user = await User.findByPk(userId, {
      include: [{
        model: Property,
        as: 'favorites',
        where: { id: propertyId },
        required: false
      }]
    });

    const isFavorite = user.favorites.length > 0;

    res.json({ isFavorite });
  } catch (error) {
    console.error("Erro ao verificar favorito:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

module.exports = {
  addToFavorites,
  removeFromFavorites,
  getMyFavorites,
  checkIsFavorite,
};