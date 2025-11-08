import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Loading from "../../components/common/Loading";
import AdminLayout from "../../components/admin/AdminLayout";
import { useAuth } from "../../contexts/AuthContext";
import { FaPlus, FaHome, FaStar, FaBed, FaShower, FaUsers, FaMapMarkerAlt, FaEdit, FaTrash } from "react-icons/fa";

const AdminProperties = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};

      // Se for admin normal, SEMPRE filtrar pelos próprios imóveis
      if (user && user.role === "admin") {
        params.user_id = user.id;
      }

      // Admin_master pode ver todos, então NÃO adiciona user_id

      // Adicionar filtro de busca
      if (searchTerm) {
        params.search = searchTerm;
      }

      console.log("📦 Buscando propriedades com params:", params);

      const response = await api.get("/api/properties", { params });
      console.log("✅ Propriedades recebidas:", response.data.properties);
      setProperties(response.data.properties || []);
    } catch (error) {
      console.error("Erro ao carregar imóveis:", error);
    } finally {
      setLoading(false);
    }
  }, [user, searchTerm]);

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
      await api.delete(`/api/properties/${uuid}`);
      setProperties(properties.filter((p) => p.uuid !== uuid));
    } catch (error) {
      console.error("Erro ao excluir imóvel:", error);
      alert("Erro ao excluir imóvel");
    }
  };

  const handleToggleFeatured = async (uuid, currentStatus) => {
    try {
      await api.put(`/api/properties/${uuid}/toggle-featured`);
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
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

    // Prioridade para cloudinary_url
    if (firstPhoto.cloudinary_url) {
      return firstPhoto.cloudinary_url;
    }

    if (typeof firstPhoto === "string") {
      if (firstPhoto.startsWith("http")) {
        return firstPhoto;
      }
      return `${API_URL}/uploads/properties/${firstPhoto}`;
    }

    if (firstPhoto.filename) {
      if (firstPhoto.filename.startsWith("http")) {
        return firstPhoto.filename;
      }
      return `${API_URL}/uploads/properties/${firstPhoto.filename}`;
    }

    return null;
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
        <div className="mb-8 pb-4 border-b border-airbnb-grey-200 flex justify-between items-center">
          <div>
            <h1 className="heading-2 text-airbnb-black">
              {user?.role === "admin_master"
                ? "Gerenciar Todos os Imóveis"
                : "Meus Imóveis"}
            </h1>
            <p className="body-base text-airbnb-grey-600 mt-1">
              {properties.length}{" "}
              {properties.length === 1
                ? "imóvel encontrado"
                : "imóveis encontrados"}
            </p>
          </div>
          <Link
            to="/admin/properties/new"
            className="btn-primary flex items-center gap-2"
          >
            <FaPlus /> Novo Imóvel
          </Link>
        </div>

        {/* Search Bar */}
        <div className="card mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="flex-1 w-full">
              <input
                type="text"
                placeholder="Buscar por título ou endereço..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input"
              />
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        {properties.length === 0 ? (
          <div className="card text-center p-12 border-2 border-dashed">
            <div className="text-airbnb-grey-400 mb-4">
              <FaHome className="w-16 h-16 mx-auto text-airbnb-grey-300" />
            </div>
            <h3 className="heading-4 text-airbnb-black mb-2">
              Nenhum imóvel encontrado
            </h3>
            <p className="body-base text-airbnb-grey-600 mb-6">
              {searchTerm
                ? "Tente ajustar os filtros ou fazer uma nova busca."
                : "Adicione seu primeiro imóvel para começar."}
            </p>
            <Link
              to="/admin/properties/new"
              className="btn-primary inline-flex items-center gap-2"
            >
              <FaPlus />
              Adicionar Imóvel
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => {
              const photoUrl = getPhotoUrl(property);

              return (
                <div
                  key={property.uuid}
                  className="card card-hover overflow-hidden"
                >
                  {/* Image */}
                  <div className="relative h-48 bg-airbnb-grey-100 flex items-center justify-center text-airbnb-grey-400 text-sm">
                    {photoUrl ? (
                      <img
                        src={photoUrl}
                        alt={property.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error(
                            "Erro ao carregar imagem:",
                            photoUrl
                          );
                          e.target.onerror = null;
                          e.target.src =
                            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRjNGNEY2Ii8+PHBhdGggZD0iTTEyIDhDMTAuODk1NCA4IDEwIDguODk1NDMgMTAgMTBDMTAgMTEuMTA0NiAxMC44OTU0IDEyIDEyIDEyQzEzLjEwNDYgMTIgMTQgMTEuMTA0NiAxNCAxMEMxNCA4Ljg5NTQzIDEzLjEwNDYgOCAxMiA4WiIgZmlsbD0iIjlDQTNBQiIvPjxwYXRoIGQ9Ik0yMSAzSDNDMi40NDc3MSAzIDIgMy40NDc3MSAyIDRWMjBDMiAyMC41NTIzIDIuNDQ3NzEgMjEgMyAyMUgyMUMyMS41NTIzIDIxIDIyIDIwLjU1MjMgMjIgMjBWNEMyMiAzLjQ0NzcxIDIxLjU1MjMgMyAyMSAzWk0yMCAxOUg0VjVIMjBWMTlaIiBmaWxsPSIjOUNBM0FGIi8+PC9zdmc+";
                        }}
                        onLoad={() =>
                          console.log("Imagem carregada:", photoUrl)
                        }
                      />
                    ) : (
                      <div className="w-full h-full bg-airbnb-grey-100 flex items-center justify-center">
                        <div className="text-center">
                          <FaHome className="text-4xl mb-2 mx-auto text-airbnb-grey-400" />
                          <span className="text-airbnb-grey-400 text-sm">
                            Sem imagem
                          </span>
                        </div>
                      </div>
                    )}
                    {/* Badge de Destaque */}
                    {property.is_featured && (
                      <div className="absolute top-3 right-3">
                        <span className="badge-premium flex items-center gap-1">
                          <FaStar /> Destaque
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-airbnb-black mb-2 line-clamp-1">
                      {property.title}
                    </h3>
                    <p className="body-small text-airbnb-grey-600 mb-4 line-clamp-1 flex items-center gap-1">
                      <FaMapMarkerAlt /> {property.address}
                    </p>

                    <div className="flex items-center justify-between mb-4 text-sm text-airbnb-grey-600 border-t border-b border-airbnb-grey-200 py-2">
                      <span className="flex items-center gap-1">
                        <FaBed /> {property.bedrooms}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaShower /> {property.bathrooms}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaUsers /> {property.max_guests || "-"}
                      </span>
                    </div>

                    <div className="pt-4">
                      <p className="body-small text-airbnb-grey-600 mb-1">Preço/noite</p>
                      <p className="text-2xl font-bold text-rausch mb-4">
                        R$ {parseFloat(property.price_per_night).toFixed(2)}
                      </p>

                      <div className="flex gap-3">
                        <Link
                          to={`/admin/properties/${property.uuid}/edit`}
                          className="btn-primary flex-1 flex items-center justify-center gap-1 py-2 px-4 text-sm"
                        >
                          <FaEdit /> Editar
                        </Link>
                        <button
                          onClick={() => handleDelete(property.uuid)}
                          className="btn-danger flex-1 flex items-center justify-center gap-1 py-2 px-4 text-sm"
                        >
                          <FaTrash /> Excluir
                        </button>
                      </div>

                      {/* Botão de Destaque (apenas admin_master) */}
                      {user?.role === "admin_master" && (
                        <button
                          onClick={() =>
                            handleToggleFeatured(
                              property.uuid,
                              property.is_featured
                            )
                          }
                          className={`w-full mt-3 px-4 py-2 rounded-xl font-semibold transition-all text-sm flex items-center justify-center gap-1 ${
                            property.is_featured
                              ? "bg-amber-500 hover:bg-amber-600 text-white"
                              : "btn-secondary"
                          }`}
                        >
                          <FaStar />
                          {property.is_featured
                            ? "Remover Destaque"
                            : "Marcar como Destaque"}
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
