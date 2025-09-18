import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import api from "../../services/api";
import Loading from "../../components/common/Loading";

const EditProperty = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // ID do imóvel a ser editado
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Dados auxiliares
  const [cities, setCities] = useState([]);
  const [propertyData, setPropertyData] = useState(null);

  // Estado do formulário - igual ao NewProperty
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "apartment",
    max_guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    city_id: "",
    address: "",
    price_per_night: "",
    status: "available",
    featured: false,
  });

  // Carregar dados do imóvel e cidades
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true);

        // Primeiro, vamos verificar se o ID é um UUID ou número
        console.log("Tentando carregar imóvel com ID:", id);

        let propertyRes;
        let citiesRes;

        try {
          // Se parece com UUID (tem hífens), usar endpoint UUID
          if (id.includes("-")) {
            console.log(
              "ID parece ser UUID, usando endpoint /properties/uuid/${id}"
            );
            propertyRes = await api.get(`/properties/uuid/${id}`);
          } else {
            // Se é número, usar endpoint normal
            console.log(
              "ID parece ser numérico, usando endpoint /properties/${id}"
            );
            propertyRes = await api.get(`/properties/${id}`);
          }

          console.log("Sucesso ao carregar imóvel");
        } catch (error) {
          console.log("Erro na primeira tentativa:", error.response?.status);

          // Se falhar, tentar buscar na lista
          try {
            console.log("Tentando buscar na lista de todos os imóveis...");
            const allPropertiesRes = await api.get("/properties");
            const property = allPropertiesRes.data.properties?.find(
              (p) => p.id == id || p.uuid == id
            );

            if (property) {
              propertyRes = { data: { property } };
              console.log("Encontrado na lista de propriedades");
            } else {
              throw new Error("Imóvel não encontrado na lista");
            }
          } catch (listError) {
            console.error("Erro ao buscar na lista:", listError);
            throw new Error("Imóvel não encontrado");
          }
        }

        // Buscar cidades
        citiesRes = await api.get("/utilities/cities");

        const property = propertyRes.data.property || propertyRes.data;
        console.log("Estrutura completa da resposta:", propertyRes.data);
        console.log("Dados do imóvel processado:", property);

        if (!property) {
          throw new Error("Dados do imóvel não encontrados na resposta da API");
        }

        // Preencher formulário com dados existentes
        setFormData({
          title: property.title || "",
          description: property.description || "",
          type: property.type || "apartment",
          max_guests: property.max_guests || 2,
          bedrooms: property.bedrooms || 1,
          bathrooms: property.bathrooms || 1,
          city_id: property.city_id || "",
          address: property.address || "",
          price_per_night: property.price_per_night || "",
          status: property.status || "available",
          featured: property.is_featured || false, // Atenção: is_featured no backend
        });

        setPropertyData(property);
        setCities(citiesRes.data.cities || []);
      } catch (err) {
        console.error("Erro completo ao carregar dados:", err);
        console.error("Status:", err.response?.status);
        console.error("Data:", err.response?.data);
        console.error("URL tentada:", err.config?.url);

        let errorMessage = "Erro ao carregar dados do imóvel.";

        if (err.response?.status === 404) {
          errorMessage = `Imóvel com ID ${id} não encontrado. Verifique se o ID está correto.`;
        } else if (err.response?.status === 500) {
          errorMessage =
            "Erro interno do servidor. Verifique se o backend está funcionando.";
        } else if (err.message) {
          errorMessage = err.message;
        }

        setError(errorMessage);
      } finally {
        setLoadingData(false);
      }
    };

    if (id) {
      fetchData();
    } else {
      setError("ID do imóvel não fornecido");
      setLoadingData(false);
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    let processedValue = value;

    // Converter valores numéricos
    if (type === "number") {
      processedValue = value === "" ? "" : Number(value);
    }

    // Converter checkbox
    if (type === "checkbox") {
      processedValue = checked;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
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
      // Validar formulário
      const validationErrors = validateForm();
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(", "));
      }

      // Preparar dados para envio - igual ao NewProperty
      const propertyDataToUpdate = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        type: formData.type,
        max_guests: parseInt(formData.max_guests),
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        city_id: parseInt(formData.city_id),
        address: formData.address.trim(),
        price_per_night: parseFloat(formData.price_per_night),
        status: formData.status || "available",
        is_featured: Boolean(formData.featured),
        amenities: [], // Array vazio por enquanto
      };

      console.log(
        "Dados sendo enviados para atualização:",
        propertyDataToUpdate
      );

      // Usar o UUID do imóvel se disponível, senão usar o ID
      const propertyId = propertyData?.uuid || id;
      const response = await api.put(
        `/properties/${propertyId}`,
        propertyDataToUpdate
      );

      console.log("Resposta da atualização:", response.data);

      setSuccess("Imóvel atualizado com sucesso!");

      // Redirecionar após 2 segundos
      setTimeout(() => {
        navigate("/admin/properties");
      }, 2000);
    } catch (err) {
      console.error("Erro completo:", err);
      console.error("Response data:", err.response?.data);

      let errorMessage = "Erro ao atualizar imóvel";

      if (err.message && !err.response) {
        errorMessage = err.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.data?.details) {
        errorMessage = err.response.data.details;
      } else if (err.response?.status === 404) {
        errorMessage = "Imóvel não encontrado";
      } else if (err.response?.status === 400) {
        errorMessage = "Dados inválidos. Verifique os campos obrigatórios.";
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/properties");
  };

  // Loading inicial
  if (loadingData) {
    return (
      <AdminLayout>
        <Loading text="Carregando dados do imóvel..." />
      </AdminLayout>
    );
  }

  // Erro ao carregar
  if (error && !propertyData) {
    return (
      <AdminLayout>
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            <h3 className="font-medium">Erro ao carregar imóvel</h3>
            <p>{error}</p>
            <button onClick={handleCancel} className="mt-2 btn-secondary">
              ← Voltar para lista
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
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

        {/* Formulário - Idêntico ao NewProperty */}
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

              {/* Checkbox para imóvel em destaque */}
              <div className="mt-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
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

            {/* Preço */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Preço</h3>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
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
              </div>
            </div>

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
