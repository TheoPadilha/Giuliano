import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import api from "../../services/api";
import Loading from "../../components/common/Loading";

const EditProperty = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Dados auxiliares
  const [cities, setCities] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [propertyData, setPropertyData] = useState(null);

  // Estado do formulário completo
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
    amenities: [], // Array de IDs das amenities selecionadas
  });

  // Função para buscar o imóvel com múltiplas tentativas
  const fetchProperty = async (propertyId) => {
    const attempts = [
      {
        url: `/properties/uuid/${propertyId}`,
        method: "get",
        description: "UUID endpoint",
      },
      {
        url: `/properties/${propertyId}`,
        method: "get",
        description: "ID endpoint",
      },
      {
        url: "/properties",
        method: "get",
        description: "Lista completa",
        findInList: true,
      },
    ];

    for (const attempt of attempts) {
      try {
        console.log(
          `Tentando carregar imóvel via ${attempt.description}:`,
          attempt.url
        );

        const response = await api[attempt.method](attempt.url);

        if (attempt.findInList) {
          // Buscar na lista
          const properties = response.data.properties || [];
          const property = properties.find(
            (p) =>
              String(p.id) === String(propertyId) ||
              String(p.uuid) === String(propertyId)
          );

          if (property) {
            console.log("✅ Imóvel encontrado na lista");
            return { property };
          } else {
            console.log("❌ Imóvel não encontrado na lista");
            continue;
          }
        } else {
          // Resposta direta
          const property = response.data.property || response.data;
          if (property && (property.id || property.uuid)) {
            console.log(`✅ Imóvel encontrado via ${attempt.description}`);
            return { property };
          }
        }
      } catch (error) {
        console.log(
          `❌ Falha na tentativa ${attempt.description}:`,
          error.response?.status || error.message
        );
        continue;
      }
    }

    throw new Error(
      `Imóvel com ID "${propertyId}" não encontrado em nenhuma das tentativas`
    );
  };

  // Carregar dados do imóvel e dados auxiliares
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

        console.log("🔍 Iniciando busca por imóvel ID:", id);

        // Buscar dados em paralelo
        const [propertyResult, citiesResponse, amenitiesResponse] =
          await Promise.all([
            fetchProperty(id),
            api.get("/utilities/cities").catch((err) => {
              console.warn("Erro ao carregar cidades:", err);
              return { data: { cities: [] } };
            }),
            api.get("/utilities/amenities").catch((err) => {
              console.warn("Erro ao carregar amenities:", err);
              // Fallback para amenities padrão se o endpoint não existir
              return {
                data: {
                  amenities: [
                    { id: 1, name: "Wi-Fi", icon: "wifi", category: "basic" },
                    {
                      id: 2,
                      name: "Ar Condicionado",
                      icon: "snowflake",
                      category: "comfort",
                    },
                    {
                      id: 3,
                      name: "Piscina",
                      icon: "waves",
                      category: "comfort",
                    },
                    {
                      id: 5,
                      name: "Cozinha",
                      icon: "chef-hat",
                      category: "basic",
                    },
                    {
                      id: 6,
                      name: "TV",
                      icon: "tv",
                      category: "entertainment",
                    },
                    {
                      id: 7,
                      name: "Máquina de Lavar",
                      icon: "washing-machine",
                      category: "basic",
                    },
                    {
                      id: 8,
                      name: "Varanda",
                      icon: "home",
                      category: "comfort",
                    },
                    {
                      id: 12,
                      name: "Churrasqueira",
                      icon: "flame",
                      category: "entertainment",
                    },
                  ],
                },
              };
            }),
          ]);

        const property = propertyResult.property;
        const cities = citiesResponse.data.cities || [];
        const availableAmenities = amenitiesResponse.data.amenities || [];

        console.log("📋 Dados do imóvel carregados:", property);
        console.log("🏙️ Cidades carregadas:", cities.length);
        console.log("⭐ Amenities carregadas:", availableAmenities.length);

        // Validar dados essenciais
        if (!property) {
          throw new Error("Dados do imóvel não encontrados");
        }

        // Extrair IDs das amenities do imóvel
        const propertyAmenityIds = property.amenities
          ? property.amenities.map((a) => a.id)
          : [];

        // Preencher formulário com dados existentes
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
        setCities(cities);
        setAmenities(availableAmenities);

        console.log("✅ Dados carregados e formulário preenchido com sucesso");
      } catch (err) {
        console.error("💥 Erro ao carregar dados:", err);

        let errorMessage = "Erro ao carregar dados do imóvel.";

        if (err.message.includes("não encontrado")) {
          errorMessage = err.message;
        } else if (err.response?.status === 404) {
          errorMessage = `Imóvel com ID "${id}" não encontrado.`;
        } else if (err.response?.status === 401) {
          errorMessage = "Não autorizado. Faça login novamente.";
        } else if (err.response?.status >= 500) {
          errorMessage = "Erro interno do servidor. Tente novamente.";
        }

        setError(errorMessage);
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

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));
  };

  // Gerenciar seleção de amenities
  const handleAmenityToggle = (amenityId) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter((id) => id !== amenityId)
        : [...prev.amenities, amenityId],
    }));
  };

  // Validação
  const validateForm = () => {
    const errors = [];

    if (!formData.title || formData.title.trim().length < 5) {
      errors.push("O título deve ter pelo menos 5 caracteres");
    }

    if (!formData.type) {
      errors.push("Selecione o tipo de imóvel");
    }

    if (!formData.city_id) {
      errors.push("Selecione uma cidade");
    }

    if (!formData.address || formData.address.trim().length < 5) {
      errors.push("O endereço deve ter pelo menos 5 caracteres");
    }

    if (
      !formData.price_per_night ||
      parseFloat(formData.price_per_night) <= 0
    ) {
      errors.push("O preço por noite deve ser maior que zero");
    }

    if (formData.weekend_price && parseFloat(formData.weekend_price) <= 0) {
      errors.push("O preço de fim de semana deve ser maior que zero");
    }

    if (
      formData.high_season_price &&
      parseFloat(formData.high_season_price) <= 0
    ) {
      errors.push("O preço de alta temporada deve ser maior que zero");
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

    // Validação de coordenadas se fornecidas
    if (
      formData.latitude &&
      (isNaN(formData.latitude) || Math.abs(formData.latitude) > 90)
    ) {
      errors.push("Latitude deve ser um número entre -90 e 90");
    }

    if (
      formData.longitude &&
      (isNaN(formData.longitude) || Math.abs(formData.longitude) > 180)
    ) {
      errors.push("Longitude deve ser um número entre -180 e 180");
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Validar formulário
      const validationErrors = validateForm();
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(", "));
      }

      // Preparar dados para envio
      const propertyDataToUpdate = {
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
        amenities: formData.amenities, // Array de IDs das amenities
      };

      console.log("📤 Enviando dados para atualização:", propertyDataToUpdate);

      // Usar o ID principal do imóvel
      const propertyId = propertyData?.uuid || propertyData?.id || id;

      // Tentar múltiplos endpoints para atualização
      let updateResponse;

      try {
        updateResponse = await api.put(
          `/properties/${propertyId}`,
          propertyDataToUpdate
        );
      } catch (putError) {
        console.log("Erro com PUT, tentando PATCH:", putError.response?.status);
        updateResponse = await api.patch(
          `/properties/${propertyId}`,
          propertyDataToUpdate
        );
      }

      console.log("✅ Resposta da atualização:", updateResponse.data);

      setSuccess("Imóvel atualizado com sucesso!");

      // Redirecionar após 2 segundos
      setTimeout(() => {
        navigate("/admin/properties");
      }, 2000);
    } catch (err) {
      console.error("💥 Erro ao atualizar:", err);

      let errorMessage = "Erro ao atualizar imóvel";

      if (err.message && !err.response) {
        errorMessage = err.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.data?.details) {
        errorMessage = err.response.data.details;
      } else if (err.response?.status === 404) {
        errorMessage = "Imóvel não encontrado para atualização";
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

  // Agrupar amenities por categoria
  const amenitiesByCategory = amenities.reduce((acc, amenity) => {
    const category = amenity.category || "other";
    if (!acc[category]) {
      acc[category] = [];
    }
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

          {/* Debug info */}
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-md p-4">
            <h4 className="text-sm font-medium text-blue-900">
              Status do Carregamento
            </h4>
            <p className="text-sm text-blue-700 mt-1">
              Buscando imóvel com ID:{" "}
              <code className="bg-blue-100 px-1 rounded">{id}</code>
            </p>
          </div>
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
                ← Voltar para lista
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
                Atualize as informações de:{" "}
                <strong>{propertyData?.title}</strong>
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

        {/* Mensagens */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-red-500">⚠️</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Erro ao atualizar imóvel
                </h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-green-500">✅</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{success}</p>
              </div>
            </div>
          </div>
        )}

        {/* Formulário - IDÊNTICO AO NEW PROPERTY */}
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
                {/* Hóspedes */}
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

                {/* Quartos */}
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

                {/* Banheiros */}
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

              {/* Checkbox para destaque */}
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
                {/* Cidade */}
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

                {/* Bairro */}
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

                {/* Endereço */}
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

                {/* Coordenadas */}
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
              <h3 className="text-lg font-medium text-gray-900 mb-4">Preços</h3>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição Detalhada (Opcional)
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Descreva o imóvel, suas características, localização e diferenciais..."
                />
              </div>
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
              <button type="submit" disabled={loading} className="btn-primary">
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
      </div>
    </AdminLayout>
  );
};

export default EditProperty;
