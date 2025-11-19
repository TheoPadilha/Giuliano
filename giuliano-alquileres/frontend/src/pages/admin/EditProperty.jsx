// src/pages/admin/EditProperty.jsx - VERSÃO CORRIGIDA

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaShieldAlt } from "react-icons/fa";
import AdminLayout from "../../components/admin/AdminLayout";
import PhotoUpload from "../../components/admin/PhotoUpload";
import PropertyAmenities from "../../components/property/PropertyAmenities";
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
    security_deposit: 0,
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
          security_deposit: property.security_deposit
            ? String(property.security_deposit)
            : "0",
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
      const trimmedValue = typeof value === 'string' ? value.trim() : value;
      processedValue = trimmedValue === "" ? "" : trimmedValue;
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
        latitude: formData.latitude ? parseFloat(String(formData.latitude).trim()) : undefined,
        longitude: formData.longitude
          ? parseFloat(String(formData.longitude).trim())
          : undefined,
        price_per_night: parseFloat(String(formData.price_per_night).trim()),
        weekend_price: formData.weekend_price
          ? parseFloat(String(formData.weekend_price).trim())
          : undefined,
        high_season_price: formData.high_season_price
          ? parseFloat(String(formData.high_season_price).trim())
          : undefined,
        security_deposit: parseFloat(String(formData.security_deposit || 0).trim()) || 0,
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
      window.scrollTo({ top: 0, behavior: "smooth" });

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
      window.scrollTo({ top: 0, behavior: "smooth" });
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
        {/* Header com Status Visual */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <h1 className="heading-2 text-airbnb-black mb-2">
                Editar Imóvel
              </h1>
              <p className="body-base text-airbnb-grey-600">
                <strong>{propertyData?.title}</strong>
              </p>
              <p className="body-small text-airbnb-grey-500 mt-1">
                ID: {propertyData?.uuid || propertyData?.id || id}
              </p>
            </div>
            <button onClick={handleCancel} className="btn-secondary">
              Voltar
            </button>
          </div>

          {/* Status Badge Visual */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-600">Status atual:</span>
            {propertyData?.status === 'available' && (
              <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Disponível
              </span>
            )}
            {propertyData?.status === 'occupied' && (
              <span className="px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                Ocupado
              </span>
            )}
            {propertyData?.status === 'maintenance' && (
              <span className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                Em Manutenção
              </span>
            )}
            {propertyData?.status === 'inactive' && (
              <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                Inativo
              </span>
            )}
          </div>
        </div>

        {/* Tabs de Navegação */}
        <div className="mb-6">
          <div className="border-b border-airbnb-grey-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("info")}
                className={`py-3 px-1 border-b-2 font-semibold text-sm transition-all duration-200 ${
                  activeTab === "info"
                    ? "border-rausch text-rausch"
                    : "border-transparent text-airbnb-grey-600 hover:text-airbnb-black hover:border-airbnb-grey-300"
                }`}
              >
                Informações Básicas
              </button>
              <button
                onClick={() => setActiveTab("photos")}
                className={`py-3 px-1 border-b-2 font-semibold text-sm transition-all duration-200 ${
                  activeTab === "photos"
                    ? "border-rausch text-rausch"
                    : "border-transparent text-airbnb-grey-600 hover:text-airbnb-black hover:border-airbnb-grey-300"
                }`}
              >
                Gerenciar Fotos
              </button>
            </nav>
          </div>
        </div>

        {/* Mensagens */}
        {error && (
          <div className="alert-error mb-6">
            <div className="flex">
              <div>
                <h3 className="text-sm font-semibold mb-1">
                  Erro ao atualizar imóvel
                </h3>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="alert-success mb-6">
            <div className="flex">
              <p className="text-sm font-semibold">{success}</p>
            </div>
          </div>
        )}

        {/* Conteúdo das Tabs */}
        {activeTab === "info" ? (
          // TAB: Informações Básicas
          <div className="card">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Informações Básicas */}
              <div>
                <h3 className="heading-4 text-airbnb-black mb-4">
                  Informações Básicas
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Título */}
                  <div className="md:col-span-2">
                    <label className="label">
                      Título do Imóvel *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="input"
                      required
                    />
                  </div>

                  {/* Tipo */}
                  <div>
                    <label className="label">
                      Tipo de Imóvel *
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="input"
                      required
                    >
                      <option value="apartment">Apartamento</option>
                      <option value="house">Casa</option>
                      <option value="studio">Studio</option>
                      <option value="penthouse">Cobertura</option>
                    </select>
                  </div>

                  {/* Status - Versão Melhorada com Cards */}
                  <div className="md:col-span-2">
                    <label className="label mb-3">
                      Status do Imóvel *
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {/* Disponível */}
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, status: 'available'})}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          formData.status === 'available'
                            ? 'border-green-500 bg-green-50 ring-2 ring-green-200'
                            : 'border-gray-200 hover:border-green-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div className={`w-3 h-3 rounded-full ${
                            formData.status === 'available' ? 'bg-green-500' : 'bg-gray-300'
                          }`}></div>
                          <span className={`font-semibold text-sm ${
                            formData.status === 'available' ? 'text-green-700' : 'text-gray-700'
                          }`}>Disponível</span>
                        </div>
                        <p className="text-xs text-gray-500">Aceita reservas</p>
                      </button>

                      {/* Ocupado */}
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, status: 'occupied'})}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          formData.status === 'occupied'
                            ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-200'
                            : 'border-gray-200 hover:border-orange-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div className={`w-3 h-3 rounded-full ${
                            formData.status === 'occupied' ? 'bg-orange-500' : 'bg-gray-300'
                          }`}></div>
                          <span className={`font-semibold text-sm ${
                            formData.status === 'occupied' ? 'text-orange-700' : 'text-gray-700'
                          }`}>Ocupado</span>
                        </div>
                        <p className="text-xs text-gray-500">Em uso no momento</p>
                      </button>

                      {/* Manutenção */}
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, status: 'maintenance'})}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          formData.status === 'maintenance'
                            ? 'border-yellow-500 bg-yellow-50 ring-2 ring-yellow-200'
                            : 'border-gray-200 hover:border-yellow-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div className={`w-3 h-3 rounded-full ${
                            formData.status === 'maintenance' ? 'bg-yellow-500' : 'bg-gray-300'
                          }`}></div>
                          <span className={`font-semibold text-sm ${
                            formData.status === 'maintenance' ? 'text-yellow-700' : 'text-gray-700'
                          }`}>Manutenção</span>
                        </div>
                        <p className="text-xs text-gray-500">Temporariamente indisponível</p>
                      </button>

                      {/* Inativo */}
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, status: 'inactive'})}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          formData.status === 'inactive'
                            ? 'border-gray-500 bg-gray-50 ring-2 ring-gray-200'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div className={`w-3 h-3 rounded-full ${
                            formData.status === 'inactive' ? 'bg-gray-500' : 'bg-gray-300'
                          }`}></div>
                          <span className={`font-semibold text-sm ${
                            formData.status === 'inactive' ? 'text-gray-700' : 'text-gray-700'
                          }`}>Inativo</span>
                        </div>
                        <p className="text-xs text-gray-500">Não aparece no site</p>
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      ℹ️ O status controla a visibilidade e disponibilidade do imóvel no sistema
                    </p>
                  </div>
                </div>
              </div>

              {/* Capacidade */}
              <div>
                <h3 className="heading-4 text-airbnb-black mb-4">
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
                <h3 className="heading-4 text-airbnb-black mb-4">
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
                <h3 className="heading-4 text-airbnb-black mb-4">
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <FaShieldAlt className="text-teal-600" /> Caução / Depósito de Segurança (R$)
                    </label>
                    <input
                      type="number"
                      name="security_deposit"
                      value={formData.security_deposit}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      placeholder="0,00"
                      className="w-full px-3 py-2 border border-teal-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Valor cobrado como garantia (digite 0 se não houver caução)
                    </p>
                  </div>
                </div>
              </div>

              {/* Comodidades - Seleção */}
              {amenities.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="heading-4 text-airbnb-black">
                        Selecionar Comodidades
                      </h3>
                      <p className="text-sm text-airbnb-grey-600 mt-2">
                        Selecione as comodidades disponíveis neste imóvel. As selecionadas aparecerão destacadas para os hóspedes.
                      </p>
                    </div>
                    {formData.amenities.length > 0 && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-rausch/10 rounded-full border border-rausch/20">
                        <svg className="w-5 h-5 text-rausch" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-semibold text-rausch">
                          {formData.amenities.length} selecionada{formData.amenities.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    )}
                  </div>
                  {Object.keys(amenitiesByCategory).sort().map((category) => (
                    <div key={category} className="mb-8 last:mb-0">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="h-px flex-grow bg-airbnb-grey-200"></div>
                        <h4 className="text-sm font-semibold text-airbnb-grey-700 uppercase tracking-wide px-3">
                          {getCategoryLabel(category)}
                        </h4>
                        <div className="h-px flex-grow bg-airbnb-grey-200"></div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                        {amenitiesByCategory[category].map((amenity) => {
                          const isSelected = formData.amenities.includes(amenity.id);
                          return (
                            <label
                              key={amenity.id}
                              className={`
                                group relative flex items-center gap-3 p-4
                                border-2 rounded-xl cursor-pointer
                                transition-all duration-200 ease-in-out
                                ${isSelected
                                  ? "border-rausch bg-rausch/5 shadow-sm ring-2 ring-rausch/20"
                                  : "border-airbnb-grey-200 hover:border-airbnb-grey-400 hover:shadow-sm"
                                }
                              `}
                            >
                              <div className="relative flex items-center">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => handleAmenityToggle(amenity.id)}
                                  className="
                                    h-5 w-5 rounded border-2
                                    text-rausch focus:ring-2 focus:ring-rausch focus:ring-offset-2
                                    cursor-pointer transition-all
                                    checked:bg-rausch checked:border-rausch
                                  "
                                />
                              </div>
                              <span className={`
                                text-sm font-medium flex-1
                                ${isSelected ? "text-rausch" : "text-airbnb-grey-700 group-hover:text-airbnb-black"}
                              `}>
                                {amenity.name}
                              </span>
                              {isSelected && (
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-rausch rounded-full flex items-center justify-center">
                                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              )}
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  {/* Preview das Comodidades Selecionadas */}
                  {formData.amenities.length > 0 && (
                    <div className="mt-10 pt-8 border-t-2 border-airbnb-grey-200">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-rausch/10 rounded-lg">
                          <svg className="w-6 h-6 text-rausch" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-airbnb-black">
                            Preview - Visualização do Hóspede
                          </h4>
                          <p className="text-sm text-airbnb-grey-600">
                            Veja como as comodidades aparecerão na página do imóvel
                          </p>
                        </div>
                      </div>
                      <div className="bg-white rounded-xl border-2 border-airbnb-grey-200 p-6 shadow-sm">
                        <PropertyAmenities
                          amenities={amenities
                            .filter((a) => formData.amenities.includes(a.id))
                            .map((a) => ({
                              id: a.id,
                              name: a.name,
                              icon: a.icon,
                              available: true,
                            }))}
                          showAll={true}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Descrição */}
              <div>
                <h3 className="heading-4 text-airbnb-black mb-4">
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
              <div className="flex justify-end space-x-4 pt-6 border-t border-airbnb-grey-200">
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
                    <span className="flex items-center gap-2">
                      <div className="spinner-sm"></div>
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
          <div className="card">
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
