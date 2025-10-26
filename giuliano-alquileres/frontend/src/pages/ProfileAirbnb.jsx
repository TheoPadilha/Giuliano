// ProfileAirbnb.jsx - Perfil estilo Airbnb Ultra Profissional
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiLock,
  FiSave,
  FiEdit2,
  FiX,
  FiCheck,
  FiShield,
  FiCalendar,
  FiGlobe,
  FiHome,
  FiStar
} from 'react-icons/fi';
import api from '../services/api';
import Loading from '../components/common/Loading';
import AirbnbHeader from '../components/layout/AirbnbHeader';

const ProfileAirbnb = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    country: user?.country || 'Brasil',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await api.put('/api/users/profile', formData);
      updateUser(response.data.user);
      setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
      setEditMode(false);
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.error || 'Erro ao atualizar perfil'
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'As senhas não coincidem!' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'A nova senha deve ter no mínimo 6 caracteres!' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await api.put('/api/users/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      setMessage({ type: 'success', text: 'Senha alterada com sucesso!' });
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.error || 'Erro ao alterar senha'
      });
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      country: user?.country || 'Brasil',
    });
    setEditMode(false);
    setMessage({ type: '', text: '' });
  };

  if (!user) return <Loading />;

  const getRoleBadge = (role) => {
    const badges = {
      client: {
        text: 'Hóspede',
        color: 'bg-green-50 text-green-700 border-green-200',
        icon: FiUser
      },
      admin: {
        text: 'Anfitrião',
        color: 'bg-rausch/10 text-rausch border-rausch/20',
        icon: FiHome
      },
      admin_master: {
        text: 'Super Anfitrião',
        color: 'bg-purple-50 text-purple-700 border-purple-200',
        icon: FiStar
      },
    };
    return badges[role] || badges.client;
  };

  const badge = getRoleBadge(user.role);
  const BadgeIcon = badge.icon;

  // Calcular quanto tempo é usuário
  const getMemberSince = () => {
    if (!user.created_at) return 'Membro recente';
    const createdDate = new Date(user.created_at);
    const year = createdDate.getFullYear();
    return `Membro desde ${year}`;
  };

  return (
    <>
      <AirbnbHeader />

      <div className="min-h-screen bg-airbnb-grey-50">
        {/* Container Principal */}
        <div className="max-w-7xl mx-auto px-5 sm:px-10 lg:px-20 py-12">
          {/* Breadcrumb */}
          <div className="mb-8">
            <nav className="flex items-center gap-2 text-sm text-airbnb-grey-600">
              <a href="/" className="hover:text-airbnb-black transition-colors">Início</a>
              <span>/</span>
              <span className="text-airbnb-black font-medium">Perfil</span>
            </nav>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar - Informações do Usuário */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-sm border border-airbnb-grey-200 p-8 sticky top-24"
              >
                {/* Avatar */}
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="w-32 h-32 bg-gradient-to-br from-rausch to-rausch-dark rounded-full flex items-center justify-center border-4 border-white shadow-xl mb-4">
                    <span className="text-5xl font-bold text-white">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <h2 className="text-2xl font-semibold text-airbnb-black mb-1">
                    {user.name}
                  </h2>
                  <p className="text-sm text-airbnb-grey-600 mb-3">{user.email}</p>

                  {/* Badge */}
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${badge.color}`}>
                    <BadgeIcon className="w-4 h-4" />
                    {badge.text}
                  </div>
                </div>

                {/* Verificações */}
                <div className="border-t border-airbnb-grey-200 pt-6 space-y-4">
                  <h3 className="text-sm font-semibold text-airbnb-black mb-3">
                    Verificações confirmadas
                  </h3>

                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <FiCheck className="w-4 h-4 text-green-700" />
                    </div>
                    <span className="text-airbnb-grey-700">Identidade verificada</span>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <FiCheck className="w-4 h-4 text-green-700" />
                    </div>
                    <span className="text-airbnb-grey-700">Email confirmado</span>
                  </div>

                  {user.phone && (
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <FiCheck className="w-4 h-4 text-green-700" />
                      </div>
                      <span className="text-airbnb-grey-700">Telefone confirmado</span>
                    </div>
                  )}
                </div>

                {/* Info Adicional */}
                <div className="border-t border-airbnb-grey-200 pt-6 mt-6 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-airbnb-grey-700">
                    <FiCalendar className="w-4 h-4" />
                    <span>{getMemberSince()}</span>
                  </div>

                  {user.country && (
                    <div className="flex items-center gap-3 text-sm text-airbnb-grey-700">
                      <FiGlobe className="w-4 h-4" />
                      <span>{user.country}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Main Content - Formulário */}
            <div className="lg:col-span-2">
              {/* Messages */}
              <AnimatePresence>
                {message.text && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`mb-6 p-4 rounded-xl border-2 ${
                      message.type === 'success'
                        ? 'bg-green-50 border-green-200 text-green-800'
                        : 'bg-red-50 border-red-200 text-red-800'
                    }`}
                  >
                    <p className="font-medium flex items-center gap-2">
                      {message.type === 'success' ? (
                        <FiCheck className="w-5 h-5" />
                      ) : (
                        <FiX className="w-5 h-5" />
                      )}
                      {message.text}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Profile Form Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl shadow-sm border border-airbnb-grey-200"
              >
                {/* Header */}
                <div className="px-8 py-6 border-b border-airbnb-grey-200 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-airbnb-black mb-1">
                      Informações pessoais
                    </h2>
                    <p className="text-sm text-airbnb-grey-600">
                      Atualize suas informações de perfil e endereço de email
                    </p>
                  </div>
                  {!editMode && (
                    <button
                      onClick={() => setEditMode(true)}
                      className="px-5 py-2.5 border-2 border-airbnb-black rounded-lg text-sm font-semibold text-airbnb-black hover:bg-airbnb-grey-50 transition-colors flex items-center gap-2"
                    >
                      <FiEdit2 className="w-4 h-4" />
                      Editar
                    </button>
                  )}
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8">
                  <div className="space-y-6">
                    {/* Nome */}
                    <div>
                      <label className="block text-sm font-semibold text-airbnb-black mb-2">
                        Nome legal
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={!editMode}
                        placeholder="Seu nome completo"
                        className="w-full px-4 py-3 border border-airbnb-grey-300 rounded-lg text-airbnb-black placeholder-airbnb-grey-400 focus:outline-none focus:border-airbnb-black focus:ring-2 focus:ring-airbnb-black/5 transition-all disabled:bg-airbnb-grey-50 disabled:cursor-not-allowed"
                        required
                      />
                      <p className="mt-1.5 text-xs text-airbnb-grey-600">
                        Esse é o nome que aparece no seu perfil e nas avaliações
                      </p>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold text-airbnb-black mb-2">
                        Endereço de email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={!editMode}
                        placeholder="seu@email.com"
                        className="w-full px-4 py-3 border border-airbnb-grey-300 rounded-lg text-airbnb-black placeholder-airbnb-grey-400 focus:outline-none focus:border-airbnb-black focus:ring-2 focus:ring-airbnb-black/5 transition-all disabled:bg-airbnb-grey-50 disabled:cursor-not-allowed"
                        required
                      />
                      <p className="mt-1.5 text-xs text-airbnb-grey-600">
                        Use um endereço que você sempre tenha acesso
                      </p>
                    </div>

                    {/* Telefone */}
                    <div>
                      <label className="block text-sm font-semibold text-airbnb-black mb-2">
                        Número de telefone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={!editMode}
                        placeholder="(00) 00000-0000"
                        className="w-full px-4 py-3 border border-airbnb-grey-300 rounded-lg text-airbnb-black placeholder-airbnb-grey-400 focus:outline-none focus:border-airbnb-black focus:ring-2 focus:ring-airbnb-black/5 transition-all disabled:bg-airbnb-grey-50 disabled:cursor-not-allowed"
                      />
                      <p className="mt-1.5 text-xs text-airbnb-grey-600">
                        Podemos enviar confirmações de reserva e recibos para este número
                      </p>
                    </div>

                    {/* País */}
                    <div>
                      <label className="block text-sm font-semibold text-airbnb-black mb-2">
                        País/região
                      </label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        disabled={!editMode}
                        className="w-full px-4 py-3 border border-airbnb-grey-300 rounded-lg text-airbnb-black focus:outline-none focus:border-airbnb-black focus:ring-2 focus:ring-airbnb-black/5 transition-all disabled:bg-airbnb-grey-50 disabled:cursor-not-allowed"
                      >
                        <option value="Brasil">Brasil</option>
                        <option value="Argentina">Argentina</option>
                        <option value="Chile">Chile</option>
                        <option value="Uruguai">Uruguai</option>
                        <option value="Paraguai">Paraguai</option>
                        <option value="Estados Unidos">Estados Unidos</option>
                        <option value="Portugal">Portugal</option>
                        <option value="Espanha">Espanha</option>
                      </select>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {editMode && (
                    <div className="flex items-center gap-3 pt-8 border-t border-airbnb-grey-200 mt-8">
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 bg-gradient-to-r from-rausch to-rausch-dark text-white rounded-lg font-semibold hover:from-rausch-dark hover:to-rausch transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {loading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Salvando...</span>
                          </>
                        ) : (
                          <>
                            <FiSave className="w-4 h-4" />
                            <span>Salvar</span>
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        disabled={loading}
                        className="px-6 py-3 border-2 border-airbnb-grey-300 text-airbnb-black rounded-lg font-semibold hover:bg-airbnb-grey-50 transition-all duration-200"
                      >
                        Cancelar
                      </button>
                    </div>
                  )}
                </form>
              </motion.div>

              {/* Segurança Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-sm border border-airbnb-grey-200 mt-6"
              >
                <div className="px-8 py-6 border-b border-airbnb-grey-200">
                  <div className="flex items-center gap-3 mb-1">
                    <FiShield className="w-5 h-5 text-rausch" />
                    <h2 className="text-2xl font-semibold text-airbnb-black">
                      Login e segurança
                    </h2>
                  </div>
                  <p className="text-sm text-airbnb-grey-600">
                    Gerencie sua senha e configurações de conta
                  </p>
                </div>

                <div className="p-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-semibold text-airbnb-black mb-1">
                        Senha
                      </h3>
                      <p className="text-sm text-airbnb-grey-600">
                        Última alteração há mais de 90 dias
                      </p>
                    </div>
                    <button
                      onClick={() => setShowPasswordModal(true)}
                      className="px-5 py-2.5 border-2 border-airbnb-black rounded-lg text-sm font-semibold text-airbnb-black hover:bg-airbnb-grey-50 transition-colors flex items-center gap-2"
                    >
                      <FiLock className="w-4 h-4" />
                      Alterar
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Password Modal */}
        <AnimatePresence>
          {showPasswordModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => {
                setShowPasswordModal(false);
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                setMessage({ type: '', text: '' });
              }}
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden"
              >
                {/* Header */}
                <div className="px-6 py-5 border-b border-airbnb-grey-200 flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-airbnb-black">Alterar senha</h3>
                  <button
                    onClick={() => {
                      setShowPasswordModal(false);
                      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                      setMessage({ type: '', text: '' });
                    }}
                    className="w-8 h-8 rounded-full hover:bg-airbnb-grey-100 flex items-center justify-center transition-colors"
                  >
                    <FiX className="w-5 h-5 text-airbnb-grey-600" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handlePasswordSubmit} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-airbnb-black mb-2">
                      Senha atual
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder="Digite sua senha atual"
                      className="w-full px-4 py-3 border border-airbnb-grey-300 rounded-lg text-airbnb-black placeholder-airbnb-grey-400 focus:outline-none focus:border-airbnb-black focus:ring-2 focus:ring-airbnb-black/5 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-airbnb-black mb-2">
                      Nova senha
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Digite sua nova senha (mín. 6 caracteres)"
                      className="w-full px-4 py-3 border border-airbnb-grey-300 rounded-lg text-airbnb-black placeholder-airbnb-grey-400 focus:outline-none focus:border-airbnb-black focus:ring-2 focus:ring-airbnb-black/5 transition-all"
                      required
                      minLength={6}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-airbnb-black mb-2">
                      Confirmar nova senha
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Confirme sua nova senha"
                      className="w-full px-4 py-3 border border-airbnb-grey-300 rounded-lg text-airbnb-black placeholder-airbnb-grey-400 focus:outline-none focus:border-airbnb-black focus:ring-2 focus:ring-airbnb-black/5 transition-all"
                      required
                      minLength={6}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-rausch to-rausch-dark text-white rounded-lg font-semibold hover:from-rausch-dark hover:to-rausch transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Alterando...' : 'Alterar senha'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowPasswordModal(false);
                        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                        setMessage({ type: '', text: '' });
                      }}
                      disabled={loading}
                      className="px-6 py-3 border-2 border-airbnb-grey-300 text-airbnb-black rounded-lg font-semibold hover:bg-airbnb-grey-50 transition-all duration-200"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default ProfileAirbnb;
