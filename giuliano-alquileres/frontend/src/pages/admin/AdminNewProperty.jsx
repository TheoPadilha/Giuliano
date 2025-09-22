// src/pages/admin/AdminNewProperty.jsx - VERSÃO ATUALIZADA COM FOTOS

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import PhotoUpload from "../../components/admin/PhotoUpload";
import api from "../../services/api";
import Loading from "../../components/common/Loading";

const AdminNewProperty = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [createdPropertyUuid, setCreatedPropertyUuid] = useState(null);
  const [showPhotos, setShowPhotos] = useState(false);

  // Form data completo
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "apartment",
    max_guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    city_id: "",
    address: "",
    neighborhood: "",
    latitude: "",
    longitude: "",
    price_per_night: "",
    weekend_price: "",
    high_season_price: "",
    status: "available",
    is_featured: false,
    amenities: [],
  });

  // Carregar dados auxiliares
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [citiesRes, amenitiesRes] = await Promise.all([
          api.get("/utilities/cities"),
          api.get("/utilities/amenities"),
        ]);

        setCities(citiesRes.data.cities || []);
        setAmenities(amenitiesRes.data.amenities || []);
      } catch (err) {
        console.error("Erro ao carregar dados auxiliares:", err);
        setError(
          "Erro ao carregar cidades e comodidades. Tente recarregar a página."
        );
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let processedValue = value;

    if (type === "number") {
      processedValue = value === "" ? "" : Number(value);
    }
    if (type === "checkbox") {
      processedValue = checked;
    }

    setFormData((prev) => ({ ...prev, [name]: processedValue }));
  };

  const handleAmenityToggle = (amenityId) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter((id) => id !== amenityId)
        : [...prev.amenities, amenityId],
    }));
  };

  const validateForm = () => {
    const errors = [];
    if (!formData.title || formData.title.trim().length < 5) {
      errors.push("O título deve ter pelo menos 5 caracteres");
    }
    if (!formData.type) errors.push("Selecione o tipo de imóvel");
    if (!formData.city_id) errors.push("Selecione uma cidade");
    if (!formData.address || formData.address.trim().length < 5) {
      errors.push("O endereço deve ter pelo menos 5 caracteres");
    }
    if (
      !formData.price_per_night ||
      parseFloat(formData.price_per_night) <= 0
    ) {
      errors.push("O preço por noite deve ser maior que zero");
    }
    if (formData.max_guests < 1 || formData.max_guests > 20) {
      errors.push("Deve acomodar entre 1 e 20 hóspedes");
    }
    if (formData.bedrooms < 0 || formData.bedrooms > 10) {
      errors.push("Número de quartos deve ser entre 0 e 10");
    }
    if (formData.bathrooms < 1 || formData.bathrooms > 10) {
      errors.push("Deve ter entre 1 e 10 banheiros");
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const validationErrors = validateForm();
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(", "));
      }

      const propertyData = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        type: formData.type,
        max_guests: parseInt(formData.max_guests),
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        city_id: parseInt(formData.city_id),
        address: formData.address.trim(),
        neighborhood: formData.neighborhood.trim() || undefined,
        latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
        longitude: formData.longitude
          ? parseFloat(formData.longitude)
          : undefined,
        price_per_night: parseFloat(formData.price_per_night),
        weekend_price: formData.weekend_price
          ? parseFloat(formData.weekend_price)
          : undefined,
        high_season_price: formData.high_season_price
          ? parseFloat(formData.high_season_price)
          : undefined,
        status: formData.status || "available",
        is_featured: Boolean(formData.is_featured),
        amenities: formData.amenities,
      };

      console.log("Criando imóvel:", propertyData);

      const response = await api.post("/properties", propertyData);
      const createdProperty = response.data.property;

      console.log("Imóvel criado:", createdProperty);

      setCreatedPropertyUuid(createdProperty.uuid || createdProperty.id);
      setSuccess("Imóvel criado com sucesso! Agora você pode adicionar fotos.");
      setShowPhotos(true);

      // Scroll para a seção de fotos
      setTimeout(() => {
        const photosSection = document.getElementById("photos-section");
        if (photosSection) {
          photosSection.scrollIntoView({ behavior: "smooth" });
        }
      }, 500);
    } catch (err) {
      console.error("Erro completo:", err);
      let errorMessage = "Erro ao criar imóvel";

      if (err.message && !err.response) {
        errorMessage = err.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.data?.details) {
        errorMessage = err.response.data.details;
      } else if (err.response?.status === 400) {
        errorMessage = "Dados inválidos. Verifique os campos obrigatórios.";
      } else if (err.response?.status === 401) {
        errorMessage = "Não autorizado. Faça login novamente.";
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/properties");
  };

  const handleFinish = () => {
    navigate("/admin/properties");
  };

  // Agrupar amenities por categoria
  const amenitiesByCategory = amenities.reduce((acc, amenity) => {
    const category = amenity.category || "other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(amenity);
    return acc;
  }, {});

  const getCategoryLabel = (category) => {
    const labels = {
      basic: "Básicas",
      comfort: "Conforto",
      entertainment: "Entretenimento",
      safety: "Segurança",
      other: "Outras",
    };
    return labels[category] || "Outras";
  };

  const getAmenityIcon = (iconName) => {
    const icons = {
      wifi: "📶",
      snowflake: "❄️",
      waves: "🏊",
      "chef-hat": "👨‍🍳",
      tv: "📺",
      "washing-machine": "🧺",
      home: "🏠",
      flame: "🔥",
      car: "🚗",
      shield: "🛡️",
    };
    return icons[iconName] || "⭐";
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {showPhotos
                  ? "📸 Novo Imóvel - Adicionar Fotos"
                  : "➕ Novo Imóvel"}
              </h1>
              <p className="text-gray-600">
                {showPhotos
                  ? "Adicione fotos para completar o cadastro do imóvel"
                  : "Adicione um novo imóvel ao sistema"}
              </p>
            </div>
            <button onClick={handleCancel} className="btn-secondary">
              ← Voltar
            </button>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center">
            <div
              className={`flex items-center ${
                showPhotos ? "text-green-600" : "text-blue-600"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                  showPhotos ? "bg-green-500" : "bg-blue-500"
                }`}
              >
                {showPhotos ? "✓" : "1"}
              </div>
              <span className="ml-2 font-medium">Informações Básicas</span>
            </div>

            <div
              className={`ml-4 w-16 h-1 ${
                showPhotos ? "bg-green-500" : "bg-gray-300"
              }`}
            ></div>

            <div
              className={`ml-4 flex items-center ${
                showPhotos ? "text-blue-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                  showPhotos ? "bg-blue-500" : "bg-gray-300"
                }`}
              >
                2
              </div>
              <span className="ml-2 font-medium">Fotos do Imóvel</span>
            </div>
          </div>
        </div>

        {/* Mensagens */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            <div className="flex">
              <span className="text-red-500 mr-2">⚠️</span>
              <div>
                <h3 className="text-sm font-medium text-red-800">
                  Erro ao criar imóvel
                </h3>
                <p className="mt-1 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
            <div className="flex">
              <span className="text-green-500 mr-2">✅</span>
              <p className="text-sm font-medium">{success}</p>
            </div>
          </div>
        )}

        {/* Formulário ou Upload de Fotos */}
        {!showPhotos ? (
          // STEP 1: Formulário de Informações Básicas
          <div className="bg-white shadow rounded-lg">
            <form onSubmit={handleSubmit} className="space-y-8 p-6">
              {/* Informações Básicas */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Informações Básicas
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Título */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título do Imóvel *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: Apartamento vista mar em Balneário Camboriú"
                      required
                    />
                  </div>

                  {/* Tipo */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Imóvel *
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Selecione o tipo</option>
                      <option value="apartment">Apartamento</option>
                      <option value="house">Casa</option>
                      <option value="studio">Studio</option>
                      <option value="penthouse">Cobertura</option>
                    </select>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="available">Disponível</option>
                      <option value="occupied">Ocupado</option>
                      <option value="maintenance">Manutenção</option>
                      <option value="inactive">Inativo</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Capacidade */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Capacidade e Características
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Máximo de Hóspedes *
                    </label>
                    <input
                      type="number"
                      name="max_guests"
                      value={formData.max_guests}
                      onChange={handleInputChange}
                      min="1"
                      max="20"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quartos *
                    </label>
                    <input
                      type="number"
                      name="bedrooms"
                      value={formData.bedrooms}
                      onChange={handleInputChange}
                      min="0"
                      max="10"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Banheiros *
                    </label>
                    <input
                      type="number"
                      name="bathrooms"
                      value={formData.bathrooms}
                      onChange={handleInputChange}
                      min="1"
                      max="10"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="is_featured"
                      checked={formData.is_featured}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Imóvel em destaque na página inicial
                    </span>
                  </label>
                </div>
              </div>

              {/* Localização */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Localização
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cidade *
                    </label>
                    <select
                      name="city_id"
                      value={formData.city_id}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Selecione a cidade</option>
                      {cities.map((city) => (
                        <option key={city.id} value={city.id}>
                          {city.name}, {city.state}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bairro
                    </label>
                    <input
                      type="text"
                      name="neighborhood"
                      value={formData.neighborhood}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: Centro, Praia Central"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Endereço Completo *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Rua das Flores, 123"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Latitude (Opcional)
                    </label>
                    <input
                      type="number"
                      name="latitude"
                      value={formData.latitude}
                      onChange={handleInputChange}
                      step="any"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="-26.997043"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Longitude (Opcional)
                    </label>
                    <input
                      type="number"
                      name="longitude"
                      value={formData.longitude}
                      onChange={handleInputChange}
                      step="any"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="-48.613837"
                    />
                  </div>
                </div>
              </div>

              {/* Preços */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Preços
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preço por Noite (R$) *
                    </label>
                    <input
                      type="number"
                      name="price_per_night"
                      value={formData.price_per_night}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="250.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preço Fim de Semana (R$)
                    </label>
                    <input
                      type="number"
                      name="weekend_price"
                      value={formData.weekend_price}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="300.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preço Alta Temporada (R$)
                    </label>
                    <input
                      type="number"
                      name="high_season_price"
                      value={formData.high_season_price}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="400.00"
                    />
                  </div>
                </div>
              </div>

              {/* Comodidades */}
              {amenities.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Comodidades
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Selecione as comodidades disponíveis neste imóvel:
                  </p>

                  {Object.keys(amenitiesByCategory).map((category) => (
                    <div key={category} className="mb-6">
                      <h4 className="text-md font-medium text-gray-800 mb-3">
                        {getCategoryLabel(category)}
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {amenitiesByCategory[category].map((amenity) => (
                          <label
                            key={amenity.id}
                            className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={formData.amenities.includes(amenity.id)}
                              onChange={() => handleAmenityToggle(amenity.id)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="ml-3 text-lg">
                              {getAmenityIcon(amenity.icon)}
                            </span>
                            <span className="ml-2 text-sm text-gray-700">
                              {amenity.name}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Descrição */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Descrição
                </h3>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Descreva o imóvel, suas características, localização e diferenciais..."
                />
              </div>

              {/* Botões */}
              <div className="flex justify-end space-x-4 pt-6 border-t">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn-secondary"
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Salvando...
                    </span>
                  ) : (
                    "Criar Imóvel"
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          // STEP 2: Upload de Fotos
          <div id="photos-section">
            <div className="bg-white shadow rounded-lg p-6">
              <PhotoUpload
                propertyUuid={createdPropertyUuid}
                onUploadComplete={() => {
                  setSuccess("Fotos adicionadas com sucesso!");
                  setTimeout(() => setSuccess(""), 3000);
                }}
              />

              {/* Botões de finalização */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t">
                <div className="text-sm text-gray-600">
                  💡 <strong>Dica:</strong> Adicione pelo menos 3-5 fotos para
                  melhor apresentação do imóvel
                </div>

                <div className="flex space-x-4">
                  <button onClick={handleFinish} className="btn-primary">
                    ✅ Finalizar Cadastro
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminNewProperty;
