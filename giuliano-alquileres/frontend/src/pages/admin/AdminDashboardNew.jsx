// AdminDashboardNew.jsx - VERSÃO ULTRA PROFISSIONAL
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import AdminLayout from "../../components/admin/AdminLayout";
import api from "../../services/api";
import Loading from "../../components/common/Loading";
import { useAuth } from "../../contexts/AuthContext";
import {
  FaHome,
  FaStar,
  FaChartLine,
  FaCalendarAlt,
  FaUsers,
  FaEye,
  FaHeart,
  FaDollarSign,
  FaPlus,
  FaArrowUp,
  FaArrowDown,
  FaMapMarkerAlt,
  FaCrown,
  FaFire,
  FaCheckCircle
} from "react-icons/fa";

const AdminDashboardNew = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProperties: 0,
    featuredProperties: 0,
    availableProperties: 0,
    totalRevenue: 0,
    monthlyBookings: 0,
    totalViews: 0,
    recentProperties: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const params = {};

        if (user && user.role === "admin") {
          params.user_id = user.id;
        }

        const response = await api.get("/api/properties", { params });
        const properties = response.data.properties || [];

        setStats({
          totalProperties: properties.length,
          featuredProperties: properties.filter((p) => p.is_featured).length,
          availableProperties: properties.filter((p) => p.status === "available").length,
          totalRevenue: properties.reduce((sum, p) => sum + parseFloat(p.price_per_night || 0), 0),
          monthlyBookings: Math.floor(properties.length * 2.5), // Simulado
          totalViews: properties.length * 145, // Simulado
          recentProperties: properties.slice(0, 5),
        });
      } catch (error) {
        console.error("Erro ao carregar estatísticas:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchStats();
    }
  }, [user]);

  if (loading) {
    return (
      <AdminLayout>
        <Loading text="Carregando dashboard..." />
      </AdminLayout>
    );
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 }
  };

  return (
    <AdminLayout>
      {/* Header com Boas-vindas */}
      <motion.div {...fadeInUp} className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-gray-900 mb-2">
              Olá, {user?.name || 'Admin'}! 👋
            </h1>
            <p className="text-gray-600 text-lg">
              {user?.role === "admin_master"
                ? "Visão geral de toda a plataforma"
                : "Aqui está um resumo dos seus imóveis"}
            </p>
          </div>
          <Link
            to="/admin/properties/new"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <FaPlus />
            <span>Novo Imóvel</span>
          </Link>
        </div>
      </motion.div>

      {/* Cards de Estatísticas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total de Imóveis */}
        <motion.div
          {...fadeInUp}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
              <FaHome className="text-3xl" />
            </div>
            <div className="flex items-center gap-1 text-sm bg-white/20 backdrop-blur px-3 py-1 rounded-full">
              <FaArrowUp className="text-xs" />
              <span>12%</span>
            </div>
          </div>
          <h3 className="text-white/80 text-sm font-medium mb-1">Total de Imóveis</h3>
          <p className="text-4xl font-black">{stats.totalProperties}</p>
        </motion.div>

        {/* Imóveis Disponíveis */}
        <motion.div
          {...fadeInUp}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
              <FaCheckCircle className="text-3xl" />
            </div>
            <div className="flex items-center gap-1 text-sm bg-white/20 backdrop-blur px-3 py-1 rounded-full">
              <FaArrowUp className="text-xs" />
              <span>8%</span>
            </div>
          </div>
          <h3 className="text-white/80 text-sm font-medium mb-1">Disponíveis</h3>
          <p className="text-4xl font-black">{stats.availableProperties}</p>
        </motion.div>

        {/* Visualizações */}
        <motion.div
          {...fadeInUp}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
              <FaEye className="text-3xl" />
            </div>
            <div className="flex items-center gap-1 text-sm bg-white/20 backdrop-blur px-3 py-1 rounded-full">
              <FaArrowUp className="text-xs" />
              <span>24%</span>
            </div>
          </div>
          <h3 className="text-white/80 text-sm font-medium mb-1">Visualizações</h3>
          <p className="text-4xl font-black">{stats.totalViews.toLocaleString()}</p>
        </motion.div>

        {/* Destaques */}
        <motion.div
          {...fadeInUp}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
              <FaStar className="text-3xl" />
            </div>
            <div className="flex items-center gap-1 text-sm bg-white/20 backdrop-blur px-3 py-1 rounded-full">
              <FaFire className="text-xs" />
              <span>HOT</span>
            </div>
          </div>
          <h3 className="text-white/80 text-sm font-medium mb-1">Em Destaque</h3>
          <p className="text-4xl font-black">{stats.featuredProperties}</p>
        </motion.div>
      </div>

      {/* Ações Rápidas */}
      <motion.div
        {...fadeInUp}
        transition={{ delay: 0.5 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-black text-gray-900 mb-6">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/admin/properties/new"
            className="group bg-white rounded-2xl p-6 border-2 border-dashed border-gray-300 hover:border-red-500 hover:bg-red-50 transition-all duration-300"
          >
            <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FaPlus className="text-2xl text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Adicionar Imóvel</h3>
            <p className="text-gray-600 text-sm">Cadastre um novo imóvel na plataforma</p>
          </Link>

          <Link
            to="/admin/properties"
            className="group bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 shadow-sm hover:shadow-lg"
          >
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FaHome className="text-2xl text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Gerenciar Imóveis</h3>
            <p className="text-gray-600 text-sm">Visualize e edite seus imóveis</p>
          </Link>

          <Link
            to="/admin/city-guides"
            className="group bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-all duration-300 shadow-sm hover:shadow-lg"
          >
            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FaMapMarkerAlt className="text-2xl text-purple-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Guias de Turismo</h3>
            <p className="text-gray-600 text-sm">Gerencie informações turísticas</p>
          </Link>
        </div>
      </motion.div>

      {/* Imóveis Recentes */}
      {stats.recentProperties.length > 0 && (
        <motion.div
          {...fadeInUp}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-gray-900">Imóveis Recentes</h2>
            <Link
              to="/admin/properties"
              className="text-red-600 hover:text-red-700 font-bold flex items-center gap-2 group"
            >
              <span>Ver todos</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Imóvel
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Tipo
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
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {stats.recentProperties.map((property, index) => (
                    <tr
                      key={property.uuid || property.id || `property-${index}`}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0">
                            {property.photos && property.photos[0] ? (
                              <img
                                src={property.photos[0]}
                                alt={property.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <FaHome className="text-2xl text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-gray-900 truncate">{property.title}</p>
                            <p className="text-sm text-gray-500 truncate">{property.address}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700 capitalize">
                          {property.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-gray-600">
                          <FaMapMarkerAlt className="text-sm text-gray-400" />
                          <span className="text-sm">{property.City?.name || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-900">
                          R$ {parseFloat(property.price_per_night).toFixed(2)}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        {property.is_featured ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold bg-yellow-100 text-yellow-700">
                            <FaStar className="text-xs" />
                            Destaque
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                            Ativo
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          to={`/admin/properties/${property.uuid}/edit`}
                          className="text-red-600 hover:text-red-700 font-bold text-sm"
                        >
                          Editar →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {stats.totalProperties === 0 && (
        <motion.div
          {...fadeInUp}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-16 text-center border-2 border-dashed border-gray-300"
        >
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaHome className="text-5xl text-gray-400" />
          </div>
          <h3 className="text-2xl font-black text-gray-900 mb-3">
            Nenhum imóvel cadastrado ainda
          </h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Comece adicionando seu primeiro imóvel e veja seus negócios crescerem!
          </p>
          <Link
            to="/admin/properties/new"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-bold hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <FaPlus />
            <span>Adicionar Primeiro Imóvel</span>
          </Link>
        </motion.div>
      )}
    </AdminLayout>
  );
};

export default AdminDashboardNew;
