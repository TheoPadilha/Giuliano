// src/pages/admin/PropertyForm.jsx - Formulário de Imóvel (Novo e Editar)

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import api from "../../services/api";
import Loading from "../../components/common/Loading";

const PropertyForm = () => {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const isEditing = !!uuid;

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEditing);
  const [cities, setCities] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    address: "",
    type: "apartment",
    price_per_night: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    max_guests: "",
    city_id: "",
    neighborhood: "",
    is_featured: false,
    amenities: [],
  });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchInitialData();
    if (isEditing) {
      fetchProperty();
    }
  }, [uuid]);

  const fetchInitialData = async () => {
    try {
      const [citiesRes, amenitiesRes] = await Promise.all([
        api.get("/api/utilities/cities").catch(() => ({ data: { cities: [] } })),
        api
          .get("/api/utilities/amenities")
          .catch(() => ({ data: { amenities: [] } })),
      ]);

      setCities(citiesRes.data.cities || []);
      setAmenities(amenitiesRes.data.amenities || []);
    } catch (error) {
      console.error("Erro ao carregar dados auxiliares:", error);
    }
  };

  const fetchProperty = async () => {
    try {
      setLoadingData(true);
      const response = await api.get(`/api/properties/${uuid}`);
      const property = response.data.property;

      const propertyAmenityIds = property.amenities
        ? property.amenities.map((a) => a.id)
        : [];

      setFormData({
        title: property.title || "",
        description: property.description || "",
        address: property.address || "",
        type: property.type || "apartment",
        price_per_night: property.price_per_night || "",
        bedrooms: property.bedrooms || "",
        bathrooms: property.bathrooms || "",
        area: property.area || "",
        max_guests: property.max_guests || "",
        city_id: property.city_id || "",
        neighborhood: property.neighborhood || "",
        is_featured: property.is_featured || false,
        amenities: propertyAmenityIds,
      });
    } catch (error) {
      console.error("Erro ao carregar imóvel:", error);
      setError("Erro ao carregar dados do imóvel");
    } finally {
      setLoadingData(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleAmenityToggle = (amenityId) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter((id) => id !== amenityId)
        : [...prev.amenities, amenityId],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = {
        ...formData,
        price_per_night: parseFloat(formData.price_per_night),
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        area: formData.area ? parseFloat(formData.area) : undefined,
        max_guests: formData.max_guests
          ? parseInt(formData.max_guests)
          : undefined,
        city_id: formData.city_id ? parseInt(formData.city_id) : undefined,
      };

      if (isEditing) {
        await api.put(`/api/properties/${uuid}`, data);
      } else {
        await api.post("/api/properties", data);
      }
      navigate("/admin/properties");
    } catch (error) {
      console.error("Erro ao salvar imóvel:", error);
      setError(
        error.response?.data?.message ||
          "Erro ao salvar imóvel. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  const amenitiesByCategory = amenities.reduce((acc, amenity) => {
    const category = amenity.category || "other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(amenity);
    return acc;
  }, {});

  const categoryLabels = {
    basic: "Básicas",
    comfort: "Conforto",
    entertainment: "Entretenimento",
    safety: "Segurança",
    other: "Outras",
  };

  if (loadingData) {
    return (
      <AdminLayout>
        <Loading text="Carregando dados..." />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate("/admin/properties")}
          className="text-sm text-gray-600 hover:text-gray-900 mb-3 flex items-center font-medium"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Voltar
        </button>
        <h1 className="text-3xl font-light text-gray-900 mb-2">
          {isEditing ? "Editar Imóvel" : "Novo Imóvel"}
        </h1>
        <p className="text-gray-600">
          {isEditing
            ? "Atualize as informações do imóvel"
            : "Preencha os dados do novo imóvel"}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informações Básicas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">
            Informações Básicas
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Ex: Apartamento luxuoso em Balneário Camboriú"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Descreva o imóvel..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Endereço
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="Rua, número, bairro"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                >
                  <option value="apartment">Apartamento</option>
                  <option value="house">Casa</option>
                  <option value="studio">Studio</option>
                  <option value="penthouse">Cobertura</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cidade
                </label>
                <select
                  name="city_id"
                  value={formData.city_id}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                >
                  <option value="">Selecione</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}, {city.state}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bairro
              </label>
              <input
                type="text"
                name="neighborhood"
                value={formData.neighborhood}
                onChange={handleChange}
                placeholder="Ex: Centro"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Detalhes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">
            Detalhes do Imóvel
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preço/Noite
              </label>
              <input
                type="number"
                name="price_per_night"
                value={formData.price_per_night}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                placeholder="250.00"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quartos
              </label>
              <input
                type="number"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Banheiros
              </label>
              <input
                type="number"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Área (m²)
              </label>
              <input
                type="number"
                name="area"
                value={formData.area}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hóspedes
              </label>
              <input
                type="number"
                name="max_guests"
                value={formData.max_guests}
                onChange={handleChange}
                min="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Comodidades */}
        {amenities.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">
              Comodidades
            </h2>

            {Object.entries(amenitiesByCategory).map(([category, items]) => (
              <div key={category} className="mb-6 last:mb-0">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  {categoryLabels[category]}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {items.map((amenity) => (
                    <label
                      key={amenity.id}
                      className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.amenities.includes(amenity.id)}
                        onChange={() => handleAmenityToggle(amenity.id)}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
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

        {/* Destaque */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="is_featured"
              checked={formData.is_featured}
              onChange={handleChange}
              className="w-5 h-5 text-amber-500 border-gray-300 rounded focus:ring-amber-500"
            />
            <div className="ml-3">
              <span className="text-sm font-medium text-gray-900">
                Marcar como destaque
              </span>
              <p className="text-sm text-gray-600">
                Imóveis em destaque aparecem com prioridade na página inicial
              </p>
            </div>
          </label>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate("/admin/properties")}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Salvando..." : isEditing ? "Atualizar" : "Criar Imóvel"}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};

export default PropertyForm;
