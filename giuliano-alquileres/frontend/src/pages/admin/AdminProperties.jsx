import { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import api from "../../services/api";
import Loading from "../../components/common/Loading";

const AdminProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");

  // Carregar imóveis
  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await api.get("/properties");
      console.log("Imóveis carregados:", response.data.properties); // Debug
      setProperties(response.data.properties || []);
    } catch (err) {
      setError("Erro ao carregar imóveis");
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
        property.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      filterStatus === "all" || property.status === filterStatus;
    const matchesType = filterType === "all" || property.type === filterType;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Ações
  const handleEdit = (property) => {
    // Usar UUID se disponível, senão usar ID
    const propertyId = property.uuid || property.id;
    console.log("Editando imóvel:", propertyId, property);
    window.location.href = `/admin/properties/${propertyId}/edit`;
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este imóvel?")) {
      try {
        await api.delete(`/properties/${id}`);
        setProperties(properties.filter((p) => p.id !== id));
      } catch (err) {
        setError("Erro ao excluir imóvel");
      }
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const newStatus =
        currentStatus === "available" ? "inactive" : "available";
      await api.patch(`/properties/${id}`, { status: newStatus });
      setProperties(
        properties.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
      );
    } catch (err) {
      setError("Erro ao atualizar status");
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
      available: "bg-green-100 text-green-800",
      occupied: "bg-blue-100 text-blue-800",
      maintenance: "bg-yellow-100 text-yellow-800",
      inactive: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  if (loading)
    return (
      <AdminLayout>
        <Loading text="Carregando imóveis..." />
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Gerenciar Imóveis
            </h1>
            <p className="text-gray-600">
              {filteredProperties.length} de {properties.length} imóveis
            </p>
          </div>
          <button
            onClick={() => (window.location.href = "/admin/properties/new")}
            className="btn-primary"
          >
            + Novo Imóvel
          </button>
        </div>

        {/* Filtros */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Buscar */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar
              </label>
              <input
                type="text"
                placeholder="Digite o nome ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filtro por Status - CORRIGIDO COM TODOS OS STATUS */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todos</option>
                <option value="available">Disponível</option>
                <option value="occupied">Ocupado</option>
                <option value="maintenance">Manutenção</option>
                <option value="inactive">Inativo</option>
              </select>
            </div>

            {/* Filtro por Tipo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todos</option>
                <option value="apartment">Apartamento</option>
                <option value="house">Casa</option>
                <option value="studio">Studio</option>
                <option value="penthouse">Cobertura</option>
              </select>
            </div>
          </div>
        </div>

        {/* Erro */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {/* Lista de Imóveis */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {filteredProperties.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🏠</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum imóvel encontrado
              </h3>
              <p className="text-gray-600">
                {searchTerm || filterStatus !== "all" || filterType !== "all"
                  ? "Tente ajustar os filtros de busca"
                  : "Comece adicionando seu primeiro imóvel"}
              </p>
              {!searchTerm &&
                filterStatus === "all" &&
                filterType === "all" && (
                  <button
                    onClick={() =>
                      (window.location.href = "/admin/properties/new")
                    }
                    className="mt-4 btn-primary"
                  >
                    Adicionar Primeiro Imóvel
                  </button>
                )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Imóvel
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Localização
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Preço/Noite
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProperties.map((property) => (
                    <tr key={property.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            {property.photos && property.photos.length > 0 ? (
                              <img
                                className="h-12 w-12 rounded-lg object-cover"
                                src={`http://localhost:3001/uploads/properties/${property.photos[0].filename}`}
                                alt={property.title}
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-400 text-xl">
                                  🏠
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {property.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {property.max_guests} hóspedes •{" "}
                              {property.bedrooms} quartos
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {getTypeLabel(property.type)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {property.city?.name || "Cidade não informada"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {property.address}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          R${" "}
                          {property.price_per_night
                            ? Number(property.price_per_night).toFixed(2)
                            : "0.00"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            property.status
                          )}`}
                        >
                          {getStatusLabel(property.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          {/* Botão Editar */}
                          <button
                            onClick={() => handleEdit(property)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Editar"
                          >
                            Editar
                          </button>

                          {/* Botão Toggle Status */}
                          <button
                            onClick={() =>
                              handleToggleStatus(property.id, property.status)
                            }
                            className={`${
                              property.status === "available"
                                ? "text-red-600 hover:text-red-900"
                                : "text-green-600 hover:text-green-900"
                            }`}
                            title={
                              property.status === "available"
                                ? "Desativar"
                                : "Ativar"
                            }
                          >
                            {property.status === "available"
                              ? "Desativar"
                              : "Ativar"}
                          </button>

                          {/* Botão Excluir */}
                          <button
                            onClick={() => handleDelete(property.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Excluir"
                          >
                            Excluir
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

        {/* Estatísticas rápidas - CORRIGIDAS COM TODOS OS STATUS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-gray-900">
              {properties.length}
            </div>
            <div className="text-sm text-gray-600">Total de Imóveis</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-green-600">
              {properties.filter((p) => p.status === "available").length}
            </div>
            <div className="text-sm text-gray-600">Disponíveis</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-yellow-600">
              {properties.filter((p) => p.status === "maintenance").length}
            </div>
            <div className="text-sm text-gray-600">Manutenção</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-2xl font-bold text-blue-600">
              {properties.filter((p) => p.status === "occupied").length}
            </div>
            <div className="text-sm text-gray-600">Ocupados</div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProperties;
