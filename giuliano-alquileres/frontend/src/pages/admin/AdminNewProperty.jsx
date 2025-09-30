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
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 bg-white rounded-lg shadow-md">
        {/* Header */}
        <div className="mb-8 border-b pb-4 border-gray-200 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {showPhotos
                ? "📸 Novo Imóvel - Adicionar Fotos"
                : "➕ Novo Imóvel"}
            </h1>
            <p className="text-gray-600 mt-1">
              {showPhotos
                ? "Adicione fotos para completar o cadastro do imóvel"
                : "Adicione um novo imóvel ao sistema"}
            </p>
          </div>
          <button
            onClick={handleCancel}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
          >
            ← Voltar
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <div
              className={`flex items-center relative ${
                showPhotos ? "text-primary-600" : "text-gray-500"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-bold transition-all duration-300 ${
                  showPhotos ? "bg-primary-600" : "bg-gray-400"
                }`}
              >
                {showPhotos ? "✓" : "1"}
              </div>
              <span className="ml-3 font-medium text-lg">
                Informações Básicas
              </span>
            </div>

            <div
              className={`flex-1 h-1 mx-4 transition-all duration-300 ${
                showPhotos ? "bg-primary-600" : "bg-gray-300"
              }`}
            ></div>

            <div
              className={`flex items-center relative ${
                showPhotos ? "text-gray-500" : "text-primary-600"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-bold transition-all duration-300 ${
                  showPhotos ? "bg-gray-400" : "bg-primary-600"
                }`}
              >
                2
              </div>
              <span className="ml-3 font-medium text-lg">Fotos do Imóvel</span>
            </div>
          </div>
        </div>

        {/* Mensagens */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
            <span className="text-red-500 mr-3 text-xl">⚠️</span>
            <div>
              <h3 className="text-sm font-medium text-red-800">
                Erro ao processar
              </h3>
              <p className="mt-1 text-sm">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
            <span className="text-green-500 mr-3 text-xl">✅</span>
            <p className="text-sm font-medium">{success}</p>
          </div>
        )}

        {/* Formulário ou Upload de Fotos */}
        {!showPhotos ? (
          <div className="bg-white p-8 rounded-lg border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Informações Básicas */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-5 border-b pb-3 border-gray-100">
                  Detalhes Principais
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título do Imóvel <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                      placeholder="Ex: Apartamento vista mar em Balneário Camboriú"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Imóvel <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                      required
                    >
                      <option value="">Selecione o tipo</option>
                      <option value="apartment">Apartamento</option>
                      <option value="house">Casa</option>
                      <option value="studio">Studio</option>
                      <option value="penthouse">Cobertura</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
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
                <h3 className="text-xl font-semibold text-gray-900 mb-5 border-b pb-3 border-gray-100">
                  Características e Acomodações
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Máximo de Hóspedes <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="max_guests"
                      value={formData.max_guests}
                      onChange={handleInputChange}
                      min="1"
                      max="20"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quartos <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="bedrooms"
                      value={formData.bedrooms}
                      onChange={handleInputChange}
                      min="0"
                      max="10"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Banheiros <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="bathrooms"
                      value={formData.bathrooms}
                      onChange={handleInputChange}
                      min="1"
                      max="10"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_featured"
                      checked={formData.is_featured}
                      onChange={handleInputChange}
                      className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded-md"
                    />
                    <span className="ml-3 text-base text-gray-700">
                      Imóvel em destaque na página inicial
                    </span>
                  </label>
                </div>
              </div>

              {/* Localização */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-5 border-b pb-3 border-gray-100">
                  Localização
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cidade <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="city_id"
                      value={formData.city_id}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                      required
                    >
                      <option value="">Selecione uma cidade</option>
                      {cities.map((city) => (
                        <option key={city.id} value={city.id}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Endereço <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                      placeholder="Ex: Rua das Flores, 123"
                      required
                    />
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                      placeholder="Ex: Centro"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Latitude
                      </label>
                      <input
                        type="text"
                        name="latitude"
                        value={formData.latitude}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                        placeholder="Ex: -26.9177"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Longitude
                      </label>
                      <input
                        type="text"
                        name="longitude"
                        value={formData.longitude}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                        placeholder="Ex: -48.6015"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Preços */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-5 border-b pb-3 border-gray-100">
                  Precificação
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preço por Noite <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="price_per_night"
                      value={formData.price_per_night}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preço Fim de Semana
                    </label>
                    <input
                      type="number"
                      name="weekend_price"
                      value={formData.weekend_price}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                      placeholder="0.00 (opcional)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preço Alta Temporada
                    </label>
                    <input
                      type="number"
                      name="high_season_price"
                      value={formData.high_season_price}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                      placeholder="0.00 (opcional)"
                    />
                  </div>
                </div>
              </div>

              {/* Descrição */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-5 border-b pb-3 border-gray-100">
                  Descrição Detalhada
                </h3>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição do Imóvel
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                  placeholder="Descreva o imóvel em detalhes, seus diferenciais e o que o torna especial."
                ></textarea>
              </div>

              {/* Comodidades */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-5 border-b pb-3 border-gray-100">
                  Comodidades
                </h3>
                {Object.keys(amenitiesByCategory).map((category) => (
                  <div key={category} className="mb-6">
                    <h4 className="text-lg font-medium text-gray-800 mb-3">
                      {getCategoryLabel(category)}
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      {amenitiesByCategory[category].map((amenity) => (
                        <label
                          key={amenity.id}
                          className="flex items-center cursor-pointer p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={formData.amenities.includes(amenity.id)}
                            onChange={() => handleAmenityToggle(amenity.id)}
                            className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded-md"
                          />
                          <span className="ml-3 text-base text-gray-700 flex items-center">
                            <span className="mr-2 text-lg">
                              {getAmenityIcon(amenity.icon)}
                            </span>
                            {amenity.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Botão de Envio */}
              <div className="pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Salvando Imóvel...
                    </div>
                  ) : (
                    "Salvar e Adicionar Fotos"
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          // STEP 2: Upload de Fotos
          <div
            id="photos-section"
            className="bg-white p-8 rounded-lg border border-gray-100"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-5 border-b pb-3 border-gray-100">
              Upload de Fotos
            </h3>
            <PhotoUpload
              propertyUuid={createdPropertyUuid}
              onFinish={handleFinish}
            />
            <div className="mt-8 text-center">
              <button
                onClick={handleFinish}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
              >
                Finalizar Cadastro
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminNewProperty;
