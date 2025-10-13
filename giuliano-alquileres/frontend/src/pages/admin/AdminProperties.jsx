import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Loading from "../../components/common/Loading";
import AdminLayout from "../../components/admin/AdminLayout";
import { useAuth } from "../../contexts/AuthContext";

const AdminProperties = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, pending, approved, rejected
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};

      // ========================================
      // 🔥 CORREÇÃO CRÍTICA: Filtrar por user_id
      // ========================================

      // Se for admin normal, SEMPRE filtrar pelos próprios imóveis
      if (user && user.role === "admin") {
        params.user_id = user.id;
      }

      // Admin_master pode ver todos, então NÃO adiciona user_id

      // Adicionar filtro de status de aprovação
      if (filter !== "all") {
        params.approval_status = filter;
      }

      // Adicionar filtro de busca
      if (searchTerm) {
        params.search = searchTerm;
      }

      console.log("📦 Buscando propriedades com params:", params);

      const response = await api.get("/properties", { params });
      console.log("✅ Propriedades recebidas:", response.data.properties);
      setProperties(response.data.properties || []);
    } catch (error) {
      console.error("Erro ao carregar imóveis:", error);
    } finally {
      setLoading(false);
    }
  }, [user, filter, searchTerm]);

  useEffect(() => {
    if (user) {
      fetchProperties();
    }
  }, [fetchProperties, user]);

  const handleDelete = async (uuid) => {
    if (!window.confirm("Tem certeza que deseja excluir este imóvel?")) {
      return;
    }

    try {
      await api.delete(`/properties/${uuid}`);
      setProperties(properties.filter((p) => p.uuid !== uuid));
    } catch (error) {
      console.error("Erro ao excluir imóvel:", error);
      alert("Erro ao excluir imóvel");
    }
  };

  const handleApproveReject = async (uuid, status) => {
    if (
      !window.confirm(
        `Tem certeza que deseja ${
          status === "approved" ? "aprovar" : "rejeitar"
        } este imóvel?`
      )
    ) {
      return;
    }
    try {
      await api.put(`/properties/${uuid}/${status}`);
      setProperties((prevProperties) =>
        prevProperties.map((p) =>
          p.uuid === uuid ? { ...p, approval_status: status } : p
        )
      );
    } catch (error) {
      console.error(
        `Erro ao ${status === "approved" ? "aprovar" : "rejeitar"} imóvel:`,
        error
      );
      alert(`Erro ao ${status === "approved" ? "aprovar" : "rejeitar"} imóvel`);
    }
  };

  const handleToggleFeatured = async (uuid, currentStatus) => {
    try {
      await api.put(`/properties/${uuid}/toggle-featured`);
      // Atualizar localmente
      setProperties((prevProperties) =>
        prevProperties.map((p) =>
          p.uuid === uuid ? { ...p, is_featured: !currentStatus } : p
        )
      );
    } catch (error) {
      console.error("Erro ao alterar destaque:", error);
      alert("Erro ao alterar destaque do imóvel");
    }
  };

  const getPhotoUrl = (property) => {
    if (!property.photos || property.photos.length === 0) {
      return null;
    }

    const firstPhoto = property.photos[0];

    if (typeof firstPhoto === "string") {
      if (firstPhoto.startsWith("http")) {
        return firstPhoto;
      }
      return `http://localhost:3001/uploads/properties/${firstPhoto}`;
    }

    if (firstPhoto.filename) {
      if (firstPhoto.filename.startsWith("http")) {
        return firstPhoto.filename;
      }
      return `http://localhost:3001/uploads/properties/${firstPhoto.filename}`;
    }

    return null;
  };

  const statusMap = {
    pending: { text: "Pendente", color: "bg-yellow-500" },
    approved: { text: "Aprovado", color: "bg-green-500" },
    rejected: { text: "Rejeitado", color: "bg-red-500" },
  };

  if (loading) {
    return (
      <AdminLayout>
        <Loading text="Carregando imóveis..." />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 border-b pb-4 border-gray-200 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {user?.role === "admin_master"
                ? "Gerenciar Todos os Imóveis"
                : "Meus Imóveis"}
            </h1>
            <p className="text-gray-600 mt-1">
              {properties.length}{" "}
              {properties.length === 1
                ? "imóvel encontrado"
                : "imóveis encontrados"}
            </p>
          </div>
          <Link
            to="/admin/properties/new"
            className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
          >
            ➕ Novo Imóvel
          </Link>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="flex-1 w-full">
              <input
                type="text"
                placeholder="Buscar por título ou endereço..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500 transition-colors"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2 w-full md:w-auto">
              <button
                onClick={() => setFilter("all")}
                className={`flex-1 md:flex-none px-5 py-3 rounded-lg font-medium transition-all duration-200 ${
                  filter === "all"
                    ? "bg-primary-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Todos
              </button>
              {user?.role === "admin_master" && (
                <>
                  <button
                    onClick={() => setFilter("pending")}
                    className={`flex-1 md:flex-none px-5 py-3 rounded-lg font-medium transition-all duration-200 ${
                      filter === "pending"
                        ? "bg-yellow-500 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Pendentes
                  </button>
                  <button
                    onClick={() => setFilter("approved")}
                    className={`flex-1 md:flex-none px-5 py-3 rounded-lg font-medium transition-all duration-200 ${
                      filter === "approved"
                        ? "bg-green-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Aprovados
                  </button>
                  <button
                    onClick={() => setFilter("rejected")}
                    className={`flex-1 md:flex-none px-5 py-3 rounded-lg font-medium transition-all duration-200 ${
                      filter === "rejected"
                        ? "bg-red-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Rejeitados
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        {properties.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg
                className="w-16 h-16 mx-auto text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Nenhum imóvel encontrado
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm
                ? "Tente ajustar os filtros ou fazer uma nova busca."
                : "Adicione seu primeiro imóvel para começar."}
            </p>
            <Link
              to="/admin/properties/new"
              className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
            >
              Adicionar Imóvel
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => {
              const photoUrl = getPhotoUrl(property);
              const approvalStatusInfo = statusMap[
                property.approval_status
              ] || { text: "Desconhecido", color: "bg-gray-400" };

              return (
                <div
                  key={property.uuid}
                  className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  {/* Image */}
                  <div className="relative h-48 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                    {photoUrl ? (
                      <img
                        src={photoUrl}
                        alt={property.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error(
                            "❌ Erro ao carregar imagem:",
                            photoUrl
                          );
                          e.target.onerror = null;
                          e.target.src =
                            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRjNGNEY2Ii8+PHBhdGggZD0iTTEyIDhDMTAuODk1NCA4IDEwIDguODk1NDMgMTAgMTBDMTAgMTEuMTA0NiAxMC44OTU0IDEyIDEyIDEyQzEzLjEwNDYgMTIgMTQgMTEuMTA0NiAxNCAxMEMxNCA4Ljg5NTQzIDEzLjEwNDYgOCAxMiA4WiIgZmlsbD0iIjlDQTNBQiIvPjxwYXRoIGQ9Ik0yMSAzSDNDMi40NDc3MSAzIDIgMy40NDc3MSAyIDRWMjBDMiAyMC41NTIzIDIuNDQ3NzEgMjEgMyAyMUgyMUMyMS41NTIzIDIxIDIyIDIwLjU1MjMgMjIgMjBWNEMyMiAzLjQ0NzcxIDIxLjU1MjMgMyAyMSAzWk0yMCAxOUg0VjVIMjBWMTlaIiBmaWxsPSIjOUNBM0FGIi8+PC9zdmc+";
                        }}
                        onLoad={() =>
                          console.log("✅ Imagem carregada:", photoUrl)
                        }
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <div className="text-center">
                          <span className="text-4xl mb-2 block">🏠</span>
                          <span className="text-gray-400 text-sm">
                            Sem imagem
                          </span>
                        </div>
                      </div>
                    )}
                    {property.is_featured && (
                      <div className="absolute top-3 right-3">
                        <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-md">
                          ⭐ Destaque
                        </span>
                      </div>
                    )}
                    <div
                      className={`absolute bottom-3 left-3 px-3 py-1 rounded-full text-xs font-medium shadow-md text-white ${approvalStatusInfo.color}`}
                    >
                      {approvalStatusInfo.text}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                      {property.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-1">
                      📍 {property.address}
                    </p>

                    <div className="flex items-center justify-between mb-4 text-sm text-gray-600 border-t border-b border-gray-100 py-2">
                      <span className="flex items-center gap-1">
                        🛏️ {property.bedrooms}
                      </span>
                      <span className="flex items-center gap-1">
                        🚿 {property.bathrooms}
                      </span>
                      <span className="flex items-center gap-1">
                        👥 {property.max_guests || "-"}
                      </span>
                    </div>

                    <div className="pt-4">
                      <p className="text-sm text-gray-500 mb-1">Preço/noite</p>
                      <p className="text-2xl font-bold text-primary-700 mb-4">
                        R$ {parseFloat(property.price_per_night).toFixed(2)}
                      </p>

                      <div className="flex gap-3">
                        <Link
                          to={`/admin/properties/${property.uuid}/edit`}
                          className="flex-1 bg-primary-600 hover:bg-primary-700 text-white text-center px-4 py-2 rounded-lg font-medium transition-colors text-sm shadow-md hover:shadow-lg"
                        >
                          ✏️ Editar
                        </Link>
                        <button
                          onClick={() => handleDelete(property.uuid)}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm shadow-md hover:shadow-lg"
                        >
                          🗑️ Excluir
                        </button>
                      </div>

                      {/* 🔥 NOVO: Botão de Destaque (apenas admin_master) */}
                      {user?.role === "admin_master" && (
                        <button
                          onClick={() =>
                            handleToggleFeatured(
                              property.uuid,
                              property.is_featured
                            )
                          }
                          className={`w-full mt-3 px-4 py-2 rounded-lg font-medium transition-colors text-sm shadow-md hover:shadow-lg ${
                            property.is_featured
                              ? "bg-amber-500 hover:bg-amber-600 text-white"
                              : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                          }`}
                        >
                          {property.is_featured
                            ? "⭐ Remover Destaque"
                            : "⭐ Marcar como Destaque"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminProperties;
