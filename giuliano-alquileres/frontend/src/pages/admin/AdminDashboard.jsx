import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../services/api';
import Loading from '../../components/common/Loading';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProperties: 0,
    availableProperties: 0,
    totalUsers: 0,
    totalCities: 0
  });
  const [recentProperties, setRecentProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Buscar estatísticas
        const [propertiesRes, usersRes, citiesRes] = await Promise.all([
          api.get('/properties'),
          api.get('/test-db'), // Usar rota que retorna contadores
          api.get('/utilities/cities')
        ]);

        const properties = propertiesRes.data.properties || [];
        const availableProperties = properties.filter(p => p.status === 'available');

        setStats({
          totalProperties: properties.length,
          availableProperties: availableProperties.length,
          totalUsers: usersRes.data.counts?.users || 0,
          totalCities: citiesRes.data.cities?.length || 0
        });

        // Imóveis recentes (últimos 5)
        setRecentProperties(properties.slice(0, 5));

      } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <Loading text="Carregando dashboard..." />
      </AdminLayout>
    );
  }

  const statCards = [
    {
      title: 'Total de Imóveis',
      value: stats.totalProperties,
      icon: '🏠',
      color: 'bg-blue-500'
    },
    {
      title: 'Imóveis Disponíveis',
      value: stats.availableProperties,
      icon: '✅',
      color: 'bg-green-500'
    },
    {
      title: 'Usuários',
      value: stats.totalUsers,
      icon: '👥',
      color: 'bg-purple-500'
    },
    {
      title: 'Cidades',
      value: stats.totalCities,
      icon: '🏙️',
      color: 'bg-orange-500'
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">
            Visão geral do sistema Giuliano Alquileres
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`w-8 h-8 ${stat.color} rounded-md flex items-center justify-center`}>
                      <span className="text-white text-lg">{stat.icon}</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.title}
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stat.value}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Properties */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Imóveis Recentes
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Últimos imóveis adicionados ao sistema
            </p>
          </div>
          
          <div className="px-4 py-5 sm:p-6">
            {recentProperties.length > 0 ? (
              <div className="space-y-4">
                {recentProperties.map((property) => (
                  <div key={property.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        property.status === 'available' ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        <span className="text-lg">
                          {property.type === 'apartment' ? '🏢' : 
                           property.type === 'house' ? '🏠' : 
                           property.type === 'studio' ? '🏡' : '🏰'}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          {property.title}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {property.city?.name} • R$ {property.price_per_night}/noite
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        property.status === 'available' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {property.status === 'available' ? 'Disponível' : 'Indisponível'}
                      </span>
                      
                      <a
                        href={`/admin/properties/${property.uuid}`}
                        className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                      >
                        Editar
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500">Nenhum imóvel encontrado</p>
                <a
                  href="/admin/properties/new"
                  className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Adicionar Primeiro Imóvel
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Ações Rápidas
            </h3>
          </div>
          
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <a
                href="/admin/properties/new"
                className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div>
                  <span className="rounded-lg inline-flex p-3 bg-blue-50 text-blue-600 group-hover:bg-blue-100">
                    <span className="text-xl">➕</span>
                  </span>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Novo Imóvel
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Adicionar um novo imóvel ao sistema
                  </p>
                </div>
              </a>

              <a
                href="/admin/properties"
                className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div>
                  <span className="rounded-lg inline-flex p-3 bg-green-50 text-green-600 group-hover:bg-green-100">
                    <span className="text-xl">📋</span>
                  </span>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Gerenciar Imóveis
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Editar, visualizar e organizar imóveis
                  </p>
                </div>
              </a>

              <a
                href="/"
                target="_blank"
                className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div>
                  <span className="rounded-lg inline-flex p-3 bg-purple-50 text-purple-600 group-hover:bg-purple-100">
                    <span className="text-xl">🌐</span>
                  </span>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Ver Site
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Visualizar como os clientes veem o site
                  </p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;