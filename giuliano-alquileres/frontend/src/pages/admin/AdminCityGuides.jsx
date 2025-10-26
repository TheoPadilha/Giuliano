// AdminCityGuides.jsx - CRUD COMPLETO DE GUIAS DE TURISMO
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AdminLayout from "../../components/admin/AdminLayout";
import api from "../../services/api";
import Loading from "../../components/common/Loading";
import {
  FaMapMarkerAlt,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaImage,
  FaInfoCircle,
  FaUtensils,
  FaLandmark,
  FaSearch
} from "react-icons/fa";

const AdminCityGuides = () => {
  const [guides, setGuides] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingGuide, setEditingGuide] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    city: "",
    description: "",
    touristic_spots: [],
    restaurants: [],
    useful_info: [],
    image_url: ""
  });

  useEffect(() => {
    fetchGuides();
    fetchCities();
  }, []);

  const fetchGuides = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/city-guides");
      setGuides(response.data || []);
    } catch (error) {
      console.error("Erro ao carregar guias:", error);
      setError("Erro ao carregar guias de turismo");
    } finally {
      setLoading(false);
    }
  };

  const fetchCities = async () => {
    try {
      const response = await api.get("/api/utilities/cities");
      setCities(response.data.cities || []);
    } catch (error) {
      console.error("Erro ao carregar cidades:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");

      if (editingGuide) {
        await api.put(`/api/city-guides/${editingGuide.id}`, formData);
        setSuccess("Guia atualizado com sucesso!");
      } else {
        await api.post("/api/city-guides", formData);
        setSuccess("Guia criado com sucesso!");
      }

      await fetchGuides();
      closeModal();
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Erro ao salvar guia:", error);
      setError(error.response?.data?.message || "Erro ao salvar guia");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Tem certeza que deseja excluir este guia?")) return;

    try {
      await api.delete(`/api/city-guides/${id}`);
      setSuccess("Guia excluído com sucesso!");
      await fetchGuides();
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Erro ao excluir guia:", error);
      setError("Erro ao excluir guia");
    }
  };

  const openModal = (guide = null) => {
    if (guide) {
      setEditingGuide(guide);
      setFormData({
        city: guide.city,
        description: guide.description || "",
        touristic_spots: guide.touristic_spots || [],
        restaurants: guide.restaurants || [],
        useful_info: guide.useful_info || [],
        image_url: guide.image_url || ""
      });
    } else {
      setEditingGuide(null);
      setFormData({
        city: "",
        description: "",
        touristic_spots: [],
        restaurants: [],
        useful_info: [],
        image_url: ""
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingGuide(null);
    setError("");
  };

  if (loading && guides.length === 0) {
    return (
      <AdminLayout>
        <Loading text="Carregando guias de turismo..." />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-black text-gray-900 mb-2">Guias de Turismo</h1>
          <p className="text-gray-600">Gerencie informações turísticas das cidades</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-bold hover:from-purple-700 hover:to-purple-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <FaPlus />
          <span>Novo Guia</span>
        </button>
      </div>

      {/* Alerts */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl flex items-center gap-3"
          >
            <FaInfoCircle />
            <p className="font-medium">{error}</p>
          </motion.div>
        )}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-xl flex items-center gap-3"
          >
            <FaInfoCircle />
            <p className="font-medium">{success}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lista de Guias */}
      {guides.length === 0 ? (
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-16 text-center border-2 border-dashed border-purple-300">
          <div className="w-24 h-24 bg-purple-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaMapMarkerAlt className="text-5xl text-purple-600" />
          </div>
          <h3 className="text-2xl font-black text-gray-900 mb-3">
            Nenhum guia de turismo cadastrado
          </h3>
          <p className="text-gray-600 mb-8">
            Comece adicionando informações turísticas das cidades!
          </p>
          <button
            onClick={() => openModal()}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-bold hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg"
          >
            <FaPlus />
            <span>Criar Primeiro Guia</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guides.map((guide) => (
            <motion.div
              key={guide.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-2xl transition-all duration-300"
            >
              {/* Imagem */}
              <div className="h-48 bg-gradient-to-br from-purple-100 to-purple-200 relative">
                {guide.image_url ? (
                  <img
                    src={guide.image_url}
                    alt={guide.city}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FaMapMarkerAlt className="text-6xl text-purple-400" />
                  </div>
                )}
              </div>

              {/* Conteúdo */}
              <div className="p-6">
                <h3 className="text-2xl font-black text-gray-900 mb-2">{guide.city}</h3>
                <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                  {guide.description || "Sem descrição"}
                </p>

                {/* Info Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {guide.touristic_spots && guide.touristic_spots.length > 0 && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                      <FaLandmark />
                      {guide.touristic_spots.length} pontos turísticos
                    </span>
                  )}
                  {guide.restaurants && guide.restaurants.length > 0 && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                      <FaUtensils />
                      {guide.restaurants.length} restaurantes
                    </span>
                  )}
                </div>

                {/* Ações */}
                <div className="flex gap-2">
                  <button
                    onClick={() => openModal(guide)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all"
                  >
                    <FaEdit />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(guide.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-all"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal de Criação/Edição */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header do Modal */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between z-10">
                <div>
                  <h2 className="text-3xl font-black text-gray-900">
                    {editingGuide ? "Editar Guia" : "Novo Guia de Turismo"}
                  </h2>
                  <p className="text-gray-600">Adicione informações sobre a cidade</p>
                </div>
                <button
                  onClick={closeModal}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all"
                >
                  <FaTimes />
                </button>
              </div>

              {/* Formulário */}
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                {/* Cidade */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Cidade *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Ex: Balneário Camboriú"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Descrição */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Descrição *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Descreva a cidade..."
                    rows={4}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* URL da Imagem */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    URL da Imagem
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <FaImage className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="url"
                        name="image_url"
                        value={formData.image_url}
                        onChange={handleInputChange}
                        placeholder="https://exemplo.com/imagem.jpg"
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Botões */}
                <div className="flex gap-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-bold hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Salvando...</span>
                      </>
                    ) : (
                      <>
                        <FaSave />
                        <span>{editingGuide ? "Atualizar" : "Criar"} Guia</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default AdminCityGuides;
