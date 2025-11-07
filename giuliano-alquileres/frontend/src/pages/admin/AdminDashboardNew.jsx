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
          totalViews: properties.reduce((sum, p) => sum + (p.view_count || 0), 0), // Real view count
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
            <h1 className="heading-2 text-airbnb-black mb-2">
              Olá, {user?.name || 'Admin'}!
            </h1>
            <p className="body-large text-airbnb-grey-700">
              {user?.role === "admin_master"
                ? "Visão geral de toda a plataforma"
                : "Aqui está um resumo dos seus imóveis"}
            </p>
          </div>
          <Link
            to="/admin/properties/new"
            className="btn-primary flex items-center gap-2"
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
          className="card card-hover"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-rausch/10 rounded-xl flex items-center justify-center">
              <FaHome className="text-2xl text-rausch" />
            </div>
            <span className="badge-success flex items-center gap-1">
              <FaArrowUp className="text-xs" />
              <span>12%</span>
            </span>
          </div>
          <h3 className="text-sm font-semibold text-airbnb-grey-600 mb-1">Total de Imóveis</h3>
          <p className="text-3xl font-bold text-airbnb-black">{stats.totalProperties}</p>
        </motion.div>

        {/* Imóveis Disponíveis */}
        <motion.div
          {...fadeInUp}
          transition={{ delay: 0.2 }}
          className="card card-hover"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <FaCheckCircle className="text-2xl text-green-600" />
            </div>
            <span className="badge-success flex items-center gap-1">
              <FaArrowUp className="text-xs" />
              <span>8%</span>
            </span>
          </div>
          <h3 className="text-sm font-semibold text-airbnb-grey-600 mb-1">Disponíveis</h3>
          <p className="text-3xl font-bold text-airbnb-black">{stats.availableProperties}</p>
        </motion.div>

        {/* Visualizações */}
        <motion.div
          {...fadeInUp}
          transition={{ delay: 0.3 }}
          className="card card-hover"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <FaEye className="text-2xl text-blue-600" />
            </div>
            <span className="badge-info flex items-center gap-1">
              <FaArrowUp className="text-xs" />
              <span>24%</span>
            </span>
          </div>
          <h3 className="text-sm font-semibold text-airbnb-grey-600 mb-1">Visualizações</h3>
          <p className="text-3xl font-bold text-airbnb-black">{stats.totalViews.toLocaleString()}</p>
        </motion.div>

        {/* Destaques */}
        <motion.div
          {...fadeInUp}
          transition={{ delay: 0.4 }}
          className="card card-hover"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <FaStar className="text-2xl text-yellow-600" />
            </div>
            <span className="badge-premium flex items-center gap-1">
              <FaFire className="text-xs" />
              <span>HOT</span>
            </span>
          </div>
          <h3 className="text-sm font-semibold text-airbnb-grey-600 mb-1">Em Destaque</h3>
          <p className="text-3xl font-bold text-airbnb-black">{stats.featuredProperties}</p>
        </motion.div>
      </div>

      {/* Ações Rápidas */}
      <motion.div
        {...fadeInUp}
        transition={{ delay: 0.5 }}
        className="mb-8"
      >
        <h2 className="heading-3 text-airbnb-black mb-6">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/admin/properties/new"
            className="group card card-hover border-2 border-dashed hover:border-rausch"
          >
            <div className="w-12 h-12 bg-rausch/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FaPlus className="text-2xl text-rausch" />
            </div>
            <h3 className="text-lg font-semibold text-airbnb-black mb-2">Adicionar Imóvel</h3>
            <p className="body-small text-airbnb-grey-600">Cadastre um novo imóvel na plataforma</p>
          </Link>

          <Link
            to="/admin/properties"
            className="group card card-hover"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FaHome className="text-2xl text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-airbnb-black mb-2">Gerenciar Imóveis</h3>
            <p className="body-small text-airbnb-grey-600">Visualize e edite seus imóveis</p>
          </Link>

          <Link
            to="/admin/city-guides"
            className="group card card-hover"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FaMapMarkerAlt className="text-2xl text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-airbnb-black mb-2">Guias de Turismo</h3>
            <p className="body-small text-airbnb-grey-600">Gerencie informações turísticas</p>
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
            <h2 className="heading-3 text-airbnb-black">Imóveis Recentes</h2>
            <Link
              to="/admin/properties"
              className="link font-semibold flex items-center gap-2 group"
            >
              <span>Ver todos</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-airbnb-grey-50 border-b border-airbnb-grey-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-airbnb-grey-700 uppercase tracking-wider">
                      Imóvel
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-airbnb-grey-700 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-airbnb-grey-700 uppercase tracking-wider">
                      Localização
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-airbnb-grey-700 uppercase tracking-wider">
                      Preço/Noite
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-airbnb-grey-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-airbnb-grey-700 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-airbnb-grey-200">
                  {stats.recentProperties.map((property, index) => (
                    <tr
                      key={property.uuid || property.id || `property-${index}`}
                      className="hover:bg-airbnb-grey-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-airbnb-grey-100 flex-shrink-0">
                            {property.photos && property.photos[0] ? (
                              <img
                                src={property.photos[0]}
                                alt={property.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <FaHome className="text-2xl text-airbnb-grey-400" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-airbnb-black truncate">{property.title}</p>
                            <p className="text-sm text-airbnb-grey-600 truncate">{property.address}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="badge badge-info capitalize">
                          {property.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-airbnb-grey-600">
                          <FaMapMarkerAlt className="text-sm text-airbnb-grey-500" />
                          <span className="text-sm">{property.City?.name || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-airbnb-black">
                          R$ {parseFloat(property.price_per_night).toFixed(2)}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        {property.is_featured ? (
                          <span className="badge-premium flex items-center gap-1 w-fit">
                            <FaStar className="text-xs" />
                            Destaque
                          </span>
                        ) : (
                          <span className="badge-success">
                            Ativo
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          to={`/admin/properties/${property.uuid}/edit`}
                          className="link font-semibold text-sm"
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
          className="card text-center p-16 border-2 border-dashed"
        >
          <div className="w-24 h-24 bg-airbnb-grey-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaHome className="text-5xl text-airbnb-grey-400" />
          </div>
          <h3 className="heading-3 text-airbnb-black mb-3">
            Nenhum imóvel cadastrado ainda
          </h3>
          <p className="body-base text-airbnb-grey-600 mb-8 max-w-md mx-auto">
            Comece adicionando seu primeiro imóvel e veja seus negócios crescerem!
          </p>
          <Link
            to="/admin/properties/new"
            className="btn-primary inline-flex items-center gap-2"
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
