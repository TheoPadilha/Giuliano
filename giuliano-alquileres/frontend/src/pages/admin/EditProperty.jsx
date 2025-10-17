// src/pages/admin/EditProperty.jsx - VERSÃO CORRIGIDA

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import PhotoUpload from "../../components/admin/PhotoUpload";
import api from "../../services/api";
import Loading from "../../components/common/Loading";
import { useAuth } from "../../contexts/AuthContext"; // 🎯 ADICIONAR ESTA LINHA

const EditProperty = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth(); // 🎯 ADICIONAR ESTA LINHA
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("info");

  // Dados auxiliares
  const [cities, setCities] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [propertyData, setPropertyData] = useState(null);

  // Estado do formulário
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

  // Buscar imóvel com tentativas múltiplas
  const fetchProperty = async (propertyId) => {
    const attempts = [
      { url: `/api/properties/${propertyId}`, description: "Endpoint direto" },
      { url: "/api/properties", description: "Lista completa", findInList: true },
    ];

    for (const attempt of attempts) {
      try {
        console.log(`Tentando: ${attempt.description}`);
        const response = await api.get(attempt.url);

        if (attempt.findInList) {
          const properties = response.data.properties || [];
          const property = properties.find(
            (p) =>
              String(p.id) === String(propertyId) ||
              String(p.uuid) === String(propertyId)
          );
          if (property) return { property };
        } else {
          const property = response.data.property || response.data;
          if (property && (property.id || property.uuid)) {
            return { property };
          }
        }
      } catch (error) {
        console.log(`Falha: ${attempt.description}`, error.response?.status);
        continue;
      }
    }

    throw new Error(`Imóvel "${propertyId}" não encontrado`);
  };

  // Carregar dados
  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setError("ID do imóvel não fornecido");
        setLoadingData(false);
        return;
      }

      try {
        setLoadingData(true);
        setError("");

        const [propertyResult, citiesResponse, amenitiesResponse] =
          await Promise.all([
            fetchProperty(id),
            api.get("/api/utilities/cities"),
            api
              .get("/api/utilities/amenities")
              .catch(() => ({ data: { amenities: [] } })),
          ]);

        const property = propertyResult.property;

        if (!property) {
          throw new Error("Dados do imóvel não encontrados");
        }

        const propertyAmenityIds = property.amenities
          ? property.amenities.map((a) => a.id)
          : [];

        setFormData({
          title: property.title || "",
          description: property.description || "",
          type: property.type || "apartment",
          max_guests: Number(property.max_guests) || 2,
          bedrooms: Number(property.bedrooms) || 1,
          bathrooms: Number(property.bathrooms) || 1,
          city_id: property.city_id ? String(property.city_id) : "",
          address: property.address || "",
          neighborhood: property.neighborhood || "",
          latitude: property.latitude ? String(property.latitude) : "",
          longitude: property.longitude ? String(property.longitude) : "",
          price_per_night: property.price_per_night
            ? String(property.price_per_night)
            : "",
          weekend_price: property.weekend_price
            ? String(property.weekend_price)
            : "",
          high_season_price: property.high_season_price
            ? String(property.high_season_price)
            : "",
          status: property.status || "available",
          is_featured: Boolean(property.is_featured),
          amenities: propertyAmenityIds,
        });

        setPropertyData(property);
        setCities(citiesResponse.data.cities || []);
        setAmenities(amenitiesResponse.data.amenities || []);

        console.log("✅ Dados carregados com sucesso");
      } catch (err) {
        console.error("Erro ao carregar:", err);
        setError(err.message || "Erro ao carregar dados do imóvel");
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [id]);

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

      const updateData = {
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

      const propertyId = propertyData?.uuid || propertyData?.id || id;

      let response;
      try {
        response = await api.put(`/api/properties/${propertyId}`, updateData);
      } catch (putError) {
        if (
          putError.response?.status === 404 ||
          putError.response?.status === 405
        ) {
          console.log("PUT falhou, tentando PATCH...");
          response = await api.patch(`/api/properties/${propertyId}`, updateData);
        } else {
          throw putError;
        }
      }

      console.log("✅ Atualização bem-sucedida:", response.data);
      setSuccess("Imóvel atualizado com sucesso!");

      setTimeout(() => navigate("/admin/properties"), 2000);
    } catch (err) {
      console.error("💥 Erro na atualização:", err);

      let errorMessage = "Erro ao atualizar imóvel";
      if (err.message && !err.response) {
        errorMessage = err.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.status === 404) {
        errorMessage = "Imóvel não encontrado";
      } else if (err.response?.status === 400) {
        errorMessage = "Dados inválidos";
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => navigate("/admin/properties");

  // Agrupar amenities
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

  // Loading inicial
  if (loadingData) {
    return (
      <AdminLayout>
        <div className="max-w-6xl mx-auto">
          <Loading text={`Carregando dados do imóvel (ID: ${id})...`} />
        </div>
      </AdminLayout>
    );
  }

  // Erro ao carregar
  if (error && !propertyData) {
    return (
      <AdminLayout>
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            <h3 className="font-medium text-red-800">
              Erro ao carregar imóvel
            </h3>
            <p className="mt-2">{error}</p>
            <div className="mt-4 flex space-x-3">
              <button onClick={handleCancel} className="btn-secondary">
                ← Voltar
              </button>
              <button
                onClick={() => window.location.reload()}
                className="btn-primary"
              >
                🔄 Tentar novamente
              </button>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Editar Imóvel
              </h1>
              <p className="text-gray-600">
                Atualize: <strong>{propertyData?.title}</strong>
              </p>
              <p className="text-sm text-gray-500 mt-1">
                ID: {propertyData?.uuid || propertyData?.id || id}
              </p>
            </div>
            <button onClick={handleCancel} className="btn-secondary">
              ← Voltar
            </button>
          </div>
        </div>

        {/* Tabs de Navegação */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("info")}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === "info"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                📝 Informações Básicas
              </button>
              <button
                onClick={() => setActiveTab("photos")}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === "photos"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                📸 Gerenciar Fotos
              </button>
            </nav>
          </div>
        </div>

        {/* Mensagens */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            <div className="flex">
              <span className="text-red-500 mr-2">⚠️</span>
              <div>
                <h3 className="text-sm font-medium text-red-800">
                  Erro ao atualizar imóvel
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

        {/* Conteúdo das Tabs */}
        {activeTab === "info" ? (
          // TAB: Informações Básicas
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
                  Capacidade
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
                  {/* 🔥 APENAS ADMIN_MASTER VÊ ESTA OPÇÃO */}
                  {user?.role === "admin_master" && (
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="is_featured"
                        checked={formData.is_featured}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        ⭐ Marcar imóvel como destaque na página inicial
                      </span>
                    </label>
                  )}
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
                  placeholder="Descreva o imóvel..."
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
                    "Atualizar Imóvel"
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          // TAB: Gerenciar Fotos
          <div className="bg-white shadow rounded-lg p-6">
            <PhotoUpload
              propertyUuid={propertyData?.uuid || propertyData?.id}
              onUploadComplete={() => {
                setSuccess("Fotos atualizadas com sucesso!");
                setTimeout(() => setSuccess(""), 3000);
              }}
            />
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default EditProperty;
