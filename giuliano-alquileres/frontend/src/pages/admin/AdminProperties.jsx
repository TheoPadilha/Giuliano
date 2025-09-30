// giuliano-alquileres/frontend/src/pages/admin/AdminProperties.jsx

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Loading from "../../components/common/Loading";
import AdminLayout from "../../components/admin/AdminLayout";

const AdminProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await api.get("/properties");
      console.log("📦 Propriedades recebidas:", response.data.properties);
      setProperties(response.data.properties || []);
    } catch (error) {
      console.error("Erro ao carregar imóveis:", error);
    } finally {
      setLoading(false);
    }
  };

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

  // 🔧 CORREÇÃO: Função para obter URL da foto
  const getPhotoUrl = (property) => {
    // Verificar se tem fotos
    if (!property.photos || property.photos.length === 0) {
      return null;
    }

    const firstPhoto = property.photos[0];

    // Se é string (nome do arquivo ou URL)
    if (typeof firstPhoto === "string") {
      // Se já é URL completa
      if (firstPhoto.startsWith("http")) {
        return firstPhoto;
      }
      // Se é só o filename
      return `http://localhost:3001/uploads/properties/${firstPhoto}`;
    }

    // Se é objeto com filename
    if (firstPhoto.filename) {
      if (firstPhoto.filename.startsWith("http")) {
        return firstPhoto.filename;
      }
      return `http://localhost:3001/uploads/properties/${firstPhoto.filename}`;
    }

    return null;
  };

  const filteredProperties = properties.filter((property) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "featured" && property.is_featured) ||
      (filter === "regular" && !property.is_featured);

    const matchesSearch =
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

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
              Gerenciar Imóveis
            </h1>
            <p className="text-gray-600 mt-1">
              {filteredProperties.length} imóveis encontrados
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
              <button
                onClick={() => setFilter("featured")}
                className={`flex-1 md:flex-none px-5 py-3 rounded-lg font-medium transition-all duration-200 ${
                  filter === "featured"
                    ? "bg-amber-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Destaque
              </button>
              <button
                onClick={() => setFilter("regular")}
                className={`flex-1 md:flex-none px-5 py-3 rounded-lg font-medium transition-all duration-200 ${
                  filter === "regular"
                    ? "bg-green-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Regular
              </button>
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        {filteredProperties.length === 0 ? (
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
              Tente ajustar os filtros ou adicione um novo imóvel.
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
            {filteredProperties.map((property) => {
              const photoUrl = getPhotoUrl(property);

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
                            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9IiNGM0Y0RjYiLz48cGF0aCBkPSJNMTIgOEMxMC44OTU0IDggMTAgOC44OTU0MyAxMCAxMEMxMCAxMS4xMDQ2IDEwLjg5NTQgMTIgMTIgMTJDMTMuMTA0NiAxMiAxNCAxMS4xMDQ2IDE0IDEwQzE0IDguODk1NDMgMTMuMTA0NiA4IDEyIDhaIiBmaWxsPSIjOUNBM0FGIi8+PHBhdGggZD0iTTIxIDNIM0MyLjQ0NzcxIDMgMiAzLjQ0NzcxIDIgNFYyMEMyIDIwLjU1MjMgMi40NDc3MSAyMSAzIDIxSDIxQzIxLjU1MjMgMjEgMjIgMjAuNTUyMyAyMiAyMFY0QzIyIDMuNDQ3NzEgMjEuNTUyMyAzIDIxIDNaTTIwIDE5SDRWNUgyMFYxOVoiIGZpbGw9IiM5Q0EzQUYiLz48L3N2Zz4=";
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
