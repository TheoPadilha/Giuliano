// src/pages/admin/AdminDashboard.jsx - Minimalista e Elegante

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import api from "../../services/api";
import Loading from "../../components/common/Loading";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProperties: 0,
    featuredProperties: 0,
    recentProperties: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await api.get("/properties");
        const properties = response.data.properties || [];

        setStats({
          totalProperties: properties.length,
          featuredProperties: properties.filter((p) => p.is_featured).length,
          recentProperties: properties.slice(0, 5),
        });
      } catch (error) {
        console.error("Erro ao carregar estatísticas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <Loading text="Carregando dashboard..." />
      </AdminLayout>
    );
  }

  const quickActions = [
    {
      title: "Novo Imóvel",
      description: "Adicionar propriedade",
      link: "/admin/properties/new",
    },
    {
      title: "Gerenciar Imóveis",
      description: "Ver todas as propriedades",
      link: "/admin/properties",
    },
    {
      title: "Ver Site",
      description: "Visualizar site público",
      link: "/",
    },
  ];

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-light text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Visão geral da sua plataforma</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Total de Imóveis */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg"></div>
            <span className="text-4xl font-light text-gray-900">
              {stats.totalProperties}
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">
            Total de Imóveis
          </h3>
          <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden mt-4">
            <div className="h-full bg-gradient-to-r from-primary-600 to-primary-700 rounded-full w-full"></div>
          </div>
        </div>

        {/* Imóveis em Destaque */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg"></div>
            <span className="text-4xl font-light text-gray-900">
              {stats.featuredProperties}
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">
            Em Destaque
          </h3>
          <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden mt-4">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full"
              style={{
                width: `${
                  stats.totalProperties > 0
                    ? (stats.featuredProperties / stats.totalProperties) * 100
                    : 0
                }%`,
              }}
            ></div>
          </div>
        </div>

        {/* Taxa de Ocupação */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-lg"></div>
            <span className="text-4xl font-light text-gray-900">
              {stats.totalProperties > 0 ? "87%" : "0%"}
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">
            Taxa de Ocupação
          </h3>
          <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden mt-4">
            <div className="h-full bg-gradient-to-r from-green-600 to-green-700 rounded-full w-[87%]"></div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-12">
        <h2 className="text-xl font-light text-gray-900 mb-6">Ações Rápidas</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.link}
              className="group bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-primary-200 transition-all"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-2 group-hover:text-primary-700 transition-colors">
                {action.title}
              </h3>
              <p className="text-sm text-gray-600 mb-4">{action.description}</p>
              <div className="flex items-center text-primary-700 text-sm font-medium">
                <span>Acessar</span>
                <svg
                  className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Properties */}
      {stats.recentProperties.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-light text-gray-900">
              Imóveis Recentes
            </h2>
            <Link
              to="/admin/properties"
              className="text-sm text-primary-700 hover:text-primary-800 font-medium"
            >
              Ver todos →
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Imóvel
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Preço/Noite
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {stats.recentProperties.map((property) => (
                    <tr
                      key={property.uuid}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg mr-3 flex items-center justify-center overflow-hidden flex-shrink-0">
                            {property.photos && property.photos[0] ? (
                              <img
                                src={property.photos[0]}
                                alt={property.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300"></div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 truncate">
                              {property.title}
                            </p>
                            <p className="text-sm text-gray-600 truncate">
                              {property.address}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                          {property.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">
                          R$ {parseFloat(property.price_per_night).toFixed(2)}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        {property.is_featured ? (
                          <span className="inline-block bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-medium">
                            Destaque
                          </span>
                        ) : (
                          <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                            Ativo
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          to={`/admin/properties/${property.uuid}/edit`}
                          className="text-primary-700 hover:text-primary-800 font-medium text-sm"
                        >
                          Editar
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;
