import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaCreditCard, FaStar, FaTimes } from 'react-icons/fa';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const MyBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings/my');
      setBookings(response.data.bookings);
    } catch (error) {
      console.error('Erro ao buscar reservas:', error);
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId) => {
    if (!confirm('Tem certeza que deseja cancelar esta reserva?')) return;

    try {
      await api.put(`/bookings/${bookingId}/cancel`);
      fetchBookings();
    } catch (error) {
      console.error('Erro ao cancelar reserva:', error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-purple-100 text-purple-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status) => {
    const texts = {
      pending: 'Pendente',
      confirmed: 'Confirmada',
      cancelled: 'Cancelada',
      completed: 'Finalizada',
      in_progress: 'Em andamento'
    };
    return texts[status] || status;
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando suas reservas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Minhas Reservas</h1>
          <p className="text-gray-600">Gerencie suas reservas e acompanhe o status</p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'Todas' },
              { key: 'pending', label: 'Pendentes' },
              { key: 'confirmed', label: 'Confirmadas' },
              { key: 'in_progress', label: 'Em andamento' },
              { key: 'completed', label: 'Finalizadas' },
              { key: 'cancelled', label: 'Canceladas' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de Reservas */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <FaCalendarAlt className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === 'all' ? 'Nenhuma reserva encontrada' : `Nenhuma reserva ${getStatusText(filter).toLowerCase()}`}
            </h3>
            <p className="text-gray-600">
              {filter === 'all' 
                ? 'Que tal fazer sua primeira reserva?' 
                : 'Tente alterar o filtro para ver outras reservas'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    {/* Informações da Propriedade */}
                    <div className="flex-1">
                      <div className="flex items-start space-x-4">
                        {booking.property.photos?.[0] && (
                          <img
                            src={`${import.meta.env.VITE_API_URL}${booking.property.photos[0].url}`}
                            alt={booking.property.title}
                            className="w-20 h-20 rounded-lg object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {booking.property.title}
                          </h3>
                          <div className="flex items-center text-gray-600 mb-2">
                            <FaMapMarkerAlt className="h-4 w-4 mr-1" />
                            <span className="text-sm">{booking.property.city?.name}</span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <FaCalendarAlt className="h-4 w-4 mr-1" />
                              <span>
                                {format(new Date(booking.check_in), 'dd MMM', { locale: ptBR })} - {' '}
                                {format(new Date(booking.check_out), 'dd MMM yyyy', { locale: ptBR })}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <FaUsers className="h-4 w-4 mr-1" />
                              <span>{booking.guests} hóspede{booking.guests > 1 ? 's' : ''}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Status e Ações */}
                    <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-col items-end space-y-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {getStatusText(booking.status)}
                      </span>
                      
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-900">
                          R$ {booking.total_amount?.toFixed(2)}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <FaCreditCard className="h-4 w-4 mr-1" />
                          <span className={booking.payment_status === 'paid' ? 'text-green-600' : 'text-yellow-600'}>
                            {booking.payment_status === 'paid' ? 'Pago' : 'Pendente'}
                          </span>
                        </div>
                      </div>

                      {/* Ações */}
                      <div className="flex space-x-2">
                        {booking.status === 'pending' && (
                          <button
                            onClick={() => cancelBooking(booking.uuid)}
                            className="flex items-center px-3 py-1 text-sm text-red-600 hover:text-red-800 transition-colors"
                          >
                            <FaTimes className="h-4 w-4 mr-1" />
                            Cancelar
                          </button>
                        )}
                        
                        {booking.status === 'completed' && !booking.review && (
                          <button className="flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-800 transition-colors">
                            <FaStar className="h-4 w-4 mr-1" />
                            Avaliar
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Informações Adicionais */}
                  {booking.special_requests && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <strong>Solicitações especiais:</strong> {booking.special_requests}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;