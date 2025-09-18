import { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import api from "../../services/api";
import Loading from "../../components/common/Loading";

const AdminProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [updatingPropertyId, setUpdatingPropertyId] = useState(null);

  // Carregar imóveis
  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await api.get("/properties");
      console.log("Imóveis carregados:", response.data.properties);
      setProperties(response.data.properties || []);
      setError("");
    } catch (err) {
      setError("Erro ao carregar imóveis. Tente recarregar a página.");
      console.error("Erro:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar imóveis
  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (property.description &&
        property.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (property.address &&
        property.address.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      filterStatus === "all" || property.status === filterStatus;
    const matchesType = filterType === "all" || property.type === filterType;

    return matchesSearch && matchesStatus && matchesType;
  });

  // 🛠️ FUNÇÃO CORRIGIDA: Mudança de Status
  const handleStatusChange = async (propertyId, newStatus) => {
    if (!newStatus) return;

    const currentProperty = properties.find((p) => p.id === propertyId);
    if (!currentProperty || currentProperty.status === newStatus) return;

    try {
      setUpdatingPropertyId(propertyId);
      setError("");
      setSuccess("");

      console.log(
        `Alterando status do imóvel ${propertyId} de "${currentProperty.status}" para "${newStatus}"`
      );

      await api.patch(`/properties/${propertyId}`, { status: newStatus });

      // ✅ Atualizar estado local corretamente
      setProperties(
        properties.map((p) =>
          p.id === propertyId ? { ...p, status: newStatus } : p
        )
      );

      setSuccess(
        `Status do imóvel "${
          currentProperty.title
        }" alterado para: ${getStatusLabel(newStatus)}`
      );

      // Limpar mensagem após 3 segundos
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
      setError(
        `Erro ao alterar status: ${err.response?.data?.error || err.message}`
      );

      // Limpar mensagem de erro após 5 segundos
      setTimeout(() => setError(""), 5000);
    } finally {
      setUpdatingPropertyId(null);
    }
  };

  const handleEdit = (property) => {
    const propertyId = property.uuid || property.id;
    console.log("Editando imóvel:", propertyId, property);
    window.location.href = `/admin/properties/${propertyId}/edit`;
  };

  const handleDelete = async (id, title) => {
    const confirmed = window.confirm(
      `⚠️ Tem certeza que deseja excluir o imóvel "${title}"?\n\nEsta ação não pode ser desfeita.`
    );

    if (confirmed) {
      try {
        setUpdatingPropertyId(id);
        await api.delete(`/properties/${id}`);
        setProperties(properties.filter((p) => p.id !== id));
        setSuccess(`Imóvel "${title}" excluído com sucesso.`);
        setTimeout(() => setSuccess(""), 3000);
      } catch (err) {
        setError("Erro ao excluir imóvel");
        setTimeout(() => setError(""), 5000);
      } finally {
        setUpdatingPropertyId(null);
      }
    }
  };

  const getTypeLabel = (type) => {
    const types = {
      apartment: "Apartamento",
      house: "Casa",
      studio: "Studio",
      penthouse: "Cobertura",
    };
    return types[type] || type;
  };

  const getStatusLabel = (status) => {
    const statuses = {
      available: "Disponível",
      occupied: "Ocupado",
      maintenance: "Manutenção",
      inactive: "Inativo",
    };
    return statuses[status] || status;
  };

  const getStatusColor = (status) => {
    const colors = {
      available: "bg-green-100 text-green-800 border-green-200",
      occupied: "bg-blue-100 text-blue-800 border-blue-200",
      maintenance: "bg-yellow-100 text-yellow-800 border-yellow-200",
      inactive: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  // Limpar mensagens quando filtros mudarem
  useEffect(() => {
    setError("");
    setSuccess("");
  }, [searchTerm, filterStatus, filterType]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Loading text="Carregando imóveis..." />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header Melhorado */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-white shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">🏠 Gerenciar Imóveis</h1>
              <p className="text-blue-100 text-lg">
                {filteredProperties.length} de {properties.length} imóveis
                {(searchTerm ||
                  filterStatus !== "all" ||
                  filterType !== "all") &&
                  " (filtrado)"}
              </p>
            </div>
            <button
              onClick={() => (window.location.href = "/admin/properties/new")}
              className="bg-white text-blue-700 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              ➕ Novo Imóvel
            </button>
          </div>
        </div>

        {/* Mensagens de Feedback */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg shadow-sm animate-fade-in">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-red-400 text-xl">⚠️</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Erro</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg shadow-sm animate-fade-in">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-green-400 text-xl">✅</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Sucesso</h3>
                <p className="text-sm text-green-700 mt-1">{success}</p>
              </div>
            </div>
          </div>
        )}

        {/* Filtros Melhorados */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
            🔍 <span className="ml-2">Filtros de Pesquisa</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Buscar */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Buscar Imóvel
              </label>
              <input
                type="text"
                placeholder="Digite nome, descrição ou endereço..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Filtrar por Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
              >
                <option value="all">Todos os Status</option>
                <option value="available">✅ Disponível</option>
                <option value="occupied">👥 Ocupado</option>
                <option value="maintenance">🔧 Manutenção</option>
                <option value="inactive">❌ Inativo</option>
              </select>
            </div>

            {/* Tipo */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Filtrar por Tipo
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
              >
                <option value="all">Todos os Tipos</option>
                <option value="apartment">🏢 Apartamento</option>
                <option value="house">🏠 Casa</option>
                <option value="studio">🏡 Studio</option>
                <option value="penthouse">🏰 Cobertura</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lista de Imóveis Melhorada */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          {filteredProperties.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-gray-400 text-8xl mb-6">🏠</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {searchTerm || filterStatus !== "all" || filterType !== "all"
                  ? "Nenhum imóvel encontrado"
                  : "Nenhum imóvel cadastrado"}
              </h3>
              <p className="text-gray-600 text-lg mb-8">
                {searchTerm || filterStatus !== "all" || filterType !== "all"
                  ? "Tente ajustar os filtros de busca acima"
                  : "Comece adicionando seu primeiro imóvel ao sistema"}
              </p>

              {!searchTerm &&
                filterStatus === "all" &&
                filterType === "all" && (
                  <button
                    onClick={() =>
                      (window.location.href = "/admin/properties/new")
                    }
                    className="bg-blue-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    ➕ Adicionar Primeiro Imóvel
                  </button>
                )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Imóvel
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Tipo & Capacidade
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Localização
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Preço/Noite
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProperties.map((property) => (
                    <tr
                      key={property.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-16 w-16">
                            {property.photos && property.photos.length > 0 ? (
                              <img
                                className="h-16 w-16 rounded-xl object-cover border-2 border-gray-200 shadow-sm"
                                src={`http://localhost:3001/uploads/properties/${property.photos[0].filename}`}
                                alt={property.title}
                              />
                            ) : (
                              <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border-2 border-gray-300">
                                <span className="text-gray-400 text-2xl">
                                  🏠
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-bold text-gray-900 max-w-xs">
                              {property.title}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              ID: {property.uuid || property.id}
                            </div>
                            {property.is_featured && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mt-2">
                                ⭐ Destaque
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-gray-900">
                          {getTypeLabel(property.type)}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          <div>👥 {property.max_guests} hóspedes</div>
                          <div>
                            🛏️ {property.bedrooms} quartos • 🚿{" "}
                            {property.bathrooms} banheiros
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-gray-900">
                          📍 {property.city?.name || "Cidade não informada"}
                        </div>
                        <div
                          className="text-sm text-gray-500 max-w-xs"
                          title={property.address}
                        >
                          {property.address}
                        </div>
                        {property.neighborhood && (
                          <div className="text-xs text-gray-400 mt-1">
                            📌 {property.neighborhood}
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-lg font-bold text-gray-900">
                          R${" "}
                          {property.price_per_night
                            ? Number(property.price_per_night).toFixed(2)
                            : "0.00"}
                        </div>
                        {property.weekend_price && (
                          <div className="text-xs text-gray-500">
                            FDS: R$ {Number(property.weekend_price).toFixed(2)}
                          </div>
                        )}
                        {property.high_season_price && (
                          <div className="text-xs text-gray-500">
                            Alta: R${" "}
                            {Number(property.high_season_price).toFixed(2)}
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        {/* 🛠️ DROPDOWN DE STATUS CORRIGIDO */}
                        <select
                          value={property.status}
                          onChange={(e) =>
                            handleStatusChange(property.id, e.target.value)
                          }
                          disabled={updatingPropertyId === property.id}
                          className={`text-sm font-bold rounded-lg border px-3 py-2 transition-all duration-200 ${getStatusColor(
                            property.status
                          )} ${
                            updatingPropertyId === property.id
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:opacity-80 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                          }`}
                        >
                          <option value="available">✅ Disponível</option>
                          <option value="occupied">👥 Ocupado</option>
                          <option value="maintenance">🔧 Manutenção</option>
                          <option value="inactive">❌ Inativo</option>
                        </select>

                        {updatingPropertyId === property.id && (
                          <div className="text-xs text-gray-500 mt-2 flex items-center">
                            <div className="w-3 h-3 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mr-1"></div>
                            Atualizando...
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex flex-col space-y-2">
                          {/* Botão Editar */}
                          <button
                            onClick={() => handleEdit(property)}
                            className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-200 transition-all duration-200 transform hover:scale-105"
                            title="Editar imóvel"
                          >
                            ✏️ Editar
                          </button>

                          {/* Botão Excluir */}
                          <button
                            onClick={() =>
                              handleDelete(property.id, property.title)
                            }
                            disabled={updatingPropertyId === property.id}
                            className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                            title="Excluir imóvel"
                          >
                            🗑️ Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Estatísticas Melhoradas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg text-white">
            <div className="flex items-center">
              <div className="text-4xl mr-4">🏠</div>
              <div>
                <div className="text-3xl font-bold">{properties.length}</div>
                <div className="text-blue-100 font-medium">
                  Total de Imóveis
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl shadow-lg text-white">
            <div className="flex items-center">
              <div className="text-4xl mr-4">✅</div>
              <div>
                <div className="text-3xl font-bold">
                  {properties.filter((p) => p.status === "available").length}
                </div>
                <div className="text-green-100 font-medium">Disponíveis</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-6 rounded-xl shadow-lg text-white">
            <div className="flex items-center">
              <div className="text-4xl mr-4">🔧</div>
              <div>
                <div className="text-3xl font-bold">
                  {properties.filter((p) => p.status === "maintenance").length}
                </div>
                <div className="text-yellow-100 font-medium">Em Manutenção</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-400 to-blue-500 p-6 rounded-xl shadow-lg text-white">
            <div className="flex items-center">
              <div className="text-4xl mr-4">👥</div>
              <div>
                <div className="text-3xl font-bold">
                  {properties.filter((p) => p.status === "occupied").length}
                </div>
                <div className="text-blue-100 font-medium">Ocupados</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProperties;
