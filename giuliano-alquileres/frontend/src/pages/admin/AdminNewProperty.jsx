import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import api from "../../services/api";
import Loading from "../../components/common/Loading";

const AdminNewProperty = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form data
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "apartment",
    max_guests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    city_id: "",
    address: "",
    price_per_night: "",
    price_per_month: "",
    cleaning_fee: "",
    size_m2: "",
    floor: "",
    amenities: "",
    house_rules: "",
    check_in_time: "14:00",
    check_out_time: "11:00",
    minimum_stay_nights: 1,
    status: "available",
    featured: false,
    // Comodidades
    has_wifi: true,
    has_air_conditioning: true,
    has_heating: false,
    has_kitchen: true,
    has_tv: true,
    has_washer: false,
    has_elevator: false,
    has_pool: false,
    has_gym: false,
    has_parking: false,
    has_iron: false,
    // Regras
    pets_allowed: false,
    smoking_allowed: false,
    events_allowed: false,
  });

  // Carregar cidades
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await api.get("/utilities/cities");
        setCities(response.data.cities || []);
      } catch (err) {
        console.error("Erro ao carregar cidades:", err);
      }
    };
    fetchCities();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Validações mais específicas
      if (!formData.title || formData.title.length < 5) {
        throw new Error("O título deve ter pelo menos 5 caracteres");
      }

      if (!formData.type) {
        throw new Error("Selecione o tipo de imóvel");
      }

      if (!formData.city_id) {
        throw new Error("Selecione uma cidade");
      }

      if (!formData.address || formData.address.length < 5) {
        throw new Error("O endereço deve ter pelo menos 5 caracteres");
      }

      if (
        !formData.price_per_night ||
        parseFloat(formData.price_per_night) <= 0
      ) {
        throw new Error("O preço por noite deve ser maior que zero");
      }

      // Preparar dados para envio
      const propertyData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        type: formData.type,
        address: formData.address.trim(),
        city_id: parseInt(formData.city_id),
        price_per_night: parseFloat(formData.price_per_night),
        price_per_month: formData.price_per_month
          ? parseFloat(formData.price_per_month)
          : null,
        cleaning_fee: formData.cleaning_fee
          ? parseFloat(formData.cleaning_fee)
          : null,
        max_guests: parseInt(formData.max_guests) || 1,
        bedrooms: parseInt(formData.bedrooms) || 1,
        beds: parseInt(formData.beds) || 1,
        bathrooms: parseInt(formData.bathrooms) || 1,
        size_m2: formData.size_m2 ? parseInt(formData.size_m2) : null,
        floor: formData.floor ? parseInt(formData.floor) : null,
        amenities: formData.amenities.trim(),
        house_rules: formData.house_rules.trim(),
        check_in_time: formData.check_in_time,
        check_out_time: formData.check_out_time,
        minimum_stay_nights: parseInt(formData.minimum_stay_nights) || 1,
        status: formData.status,
        featured: formData.featured,
        // Comodidades
        has_wifi: formData.has_wifi,
        has_air_conditioning: formData.has_air_conditioning,
        has_heating: formData.has_heating,
        has_kitchen: formData.has_kitchen,
        has_tv: formData.has_tv,
        has_washer: formData.has_washer,
        has_elevator: formData.has_elevator,
        has_pool: formData.has_pool,
        has_gym: formData.has_gym,
        has_parking: formData.has_parking,
        has_iron: formData.has_iron,
        // Regras
        pets_allowed: formData.pets_allowed,
        smoking_allowed: formData.smoking_allowed,
        events_allowed: formData.events_allowed,
      };

      console.log("Dados sendo enviados:", propertyData);

      const response = await api.post("/properties", propertyData);

      setSuccess("Imóvel criado com sucesso!");

      // Redirecionar após 2 segundos
      setTimeout(() => {
        navigate("/admin/properties");
      }, 2000);
    } catch (err) {
      console.error("Erro ao criar imóvel:", err);
      console.error("Response data:", err.response?.data);

      let errorMessage = err.message;

      // Tratar erros específicos do backend
      if (err.response?.data?.details) {
        const details = err.response.data.details;
        if (details.includes("title")) {
          errorMessage = "Título deve ter pelo menos 5 caracteres";
        } else if (details.includes("address")) {
          errorMessage = "Endereço deve ter pelo menos 5 caracteres";
        } else if (details.includes("price")) {
          errorMessage = "Preço deve ser um valor válido maior que zero";
        } else {
          errorMessage = details;
        }
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/properties");
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Novo Imóvel</h1>
              <p className="text-gray-600">
                Adicione um novo imóvel ao sistema
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
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
            {success}
          </div>
        )}

        {/* Formulário */}
        <div className="bg-white shadow rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-6 p-6">
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
                    <option value="unavailable">Indisponível</option>
                    <option value="pending">Pendente</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Capacidade */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Capacidade e Características
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
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

                {/* Camas */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Camas *
                  </label>
                  <input
                    type="number"
                    name="beds"
                    value={formData.beds}
                    onChange={handleInputChange}
                    min="1"
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

                {/* Área */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Área (m²)
                  </label>
                  <input
                    type="number"
                    name="size_m2"
                    value={formData.size_m2}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="85"
                  />
                </div>
              </div>

              {/* Segunda linha com andar */}
              <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Andar
                  </label>
                  <input
                    type="number"
                    name="floor"
                    value={formData.floor}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="5"
                  />
                </div>
              </div>

              {/* Checkbox para imóvel em destaque */}
              <div className="mt-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        featured: e.target.checked,
                      }))
                    }
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

                {/* Endereço */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Endereço Completo *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Rua das Flores, 123 - Centro"
                    required
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
                    Preço por Mês (R$)
                  </label>
                  <input
                    type="number"
                    name="price_per_month"
                    value={formData.price_per_month}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="5000.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Taxa de Limpeza (R$)
                  </label>
                  <input
                    type="number"
                    name="cleaning_fee"
                    value={formData.cleaning_fee}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="150.00"
                  />
                </div>
              </div>
            </div>

            {/* Descrição */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Descrição
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição Detalhada
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

            {/* Comodidades */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Comodidades
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="has_wifi"
                    checked={formData.has_wifi || false}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        has_wifi: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Wi-Fi</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="has_air_conditioning"
                    checked={formData.has_air_conditioning || false}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        has_air_conditioning: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Ar Condicionado
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="has_heating"
                    checked={formData.has_heating || false}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        has_heating: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Aquecimento
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="has_kitchen"
                    checked={formData.has_kitchen || false}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        has_kitchen: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Cozinha</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="has_tv"
                    checked={formData.has_tv || false}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        has_tv: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">TV</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="has_washer"
                    checked={formData.has_washer || false}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        has_washer: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Máquina de Lavar
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="has_elevator"
                    checked={formData.has_elevator || false}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        has_elevator: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Elevador</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="has_pool"
                    checked={formData.has_pool || false}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        has_pool: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Piscina</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="has_gym"
                    checked={formData.has_gym || false}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        has_gym: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Academia</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="has_parking"
                    checked={formData.has_parking || false}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        has_parking: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Estacionamento
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="has_iron"
                    checked={formData.has_iron || false}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        has_iron: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Ferro de Passar
                  </span>
                </label>
              </div>
            </div>

            {/* Regras e Políticas */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Regras e Políticas
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="pets_allowed"
                    checked={formData.pets_allowed || false}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        pets_allowed: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Aceita Pets
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="smoking_allowed"
                    checked={formData.smoking_allowed || false}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        smoking_allowed: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Permitido Fumar
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="events_allowed"
                    checked={formData.events_allowed || false}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        events_allowed: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Permite Eventos
                  </span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Check-in */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Horário Check-in
                  </label>
                  <input
                    type="time"
                    name="check_in_time"
                    value={formData.check_in_time}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Check-out */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Horário Check-out
                  </label>
                  <input
                    type="time"
                    name="check_out_time"
                    value={formData.check_out_time}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Estadia mínima */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estadia Mínima (noites)
                  </label>
                  <input
                    type="number"
                    name="minimum_stay_nights"
                    value={formData.minimum_stay_nights || 1}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Campos de texto livres para regras adicionais */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Regras Adicionais
                  </label>
                  <textarea
                    name="house_rules"
                    value={formData.house_rules}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Outras regras específicas da casa..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comodidades Extras
                  </label>
                  <textarea
                    name="amenities"
                    value={formData.amenities}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Comodidades adicionais não listadas acima..."
                  />
                </div>
              </div>
            </div>

            {/* Botões */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={handleCancel}
                className="btn-secondary"
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
                  "Criar Imóvel"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminNewProperty;
