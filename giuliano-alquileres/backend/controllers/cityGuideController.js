const CityGuide = require("../models/CityGuide");
const { Op } = require("sequelize");

// Controller para rotas públicas
exports.getCityGuideByCity = async (req, res) => {
  try {
    const { city } = req.params;
    const guide = await CityGuide.findOne({
      where: { city: { [Op.like]: city } },
    });

    if (!guide) {
      return res
        .status(404)
        .json({ message: "Guia de cidade não encontrado." });
    }

    res.status(200).json(guide);
  } catch (error) {
    console.error("Erro ao buscar guia de cidade:", error);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
};

exports.getAllCitiesWithGuides = async (req, res) => {
  try {
    const guides = await CityGuide.findAll({
      attributes: ["id", "city", "image_url", "description"],
    });

    res.status(200).json(guides);
  } catch (error) {
    console.error("Erro ao buscar todas as cidades com guias:", error);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
};

// Controller para rotas de Admin (CRUD)
exports.createCityGuide = async (req, res) => {
  try {
    const newGuide = await CityGuide.create(req.body);
    res.status(201).json(newGuide);
  } catch (error) {
    console.error("Erro ao criar guia de cidade:", error);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
};

exports.updateCityGuide = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await CityGuide.update(req.body, {
      where: { id },
    });

    if (updated) {
      const updatedGuide = await CityGuide.findByPk(id);
      return res.status(200).json(updatedGuide);
    }

    throw new Error("Guia de cidade não encontrado.");
  } catch (error) {
    console.error("Erro ao atualizar guia de cidade:", error);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
};

exports.deleteCityGuide = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await CityGuide.destroy({
      where: { id },
    });

    if (!deleted) {
      return res
        .status(404)
        .json({ message: "Guia de cidade não encontrado." });
    }

    res.status(204).send();
  } catch (error) {
    console.error("Erro ao deletar guia de cidade:", error);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
};
