import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiPhone, FiMapPin, FiLock, FiSave, FiEdit2, FiX } from 'react-icons/fi';
import api from '../services/api';
import Loading from '../components/common/Loading';

const Profile = () => {
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

      // Atualizar contexto do usuário
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
      client: { text: 'Cliente', color: 'bg-green-100 text-green-800' },
      admin: { text: 'Proprietário', color: 'bg-blue-100 text-blue-800' },
      admin_master: { text: 'Administrador Master', color: 'bg-purple-100 text-purple-800' },
    };
    return badges[role] || badges.client;
  };

  const badge = getRoleBadge(user.role);

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="card overflow-hidden mb-6">
          <div className="bg-airbnb-grey-50 px-8 py-12 border-b border-airbnb-grey-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-rausch rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                  <FiUser className="w-12 h-12 text-white" />
                </div>
                <div>
                  <h1 className="heading-2 mb-2 text-airbnb-black">{user.name}</h1>
                  <p className="text-airbnb-grey-700 flex items-center gap-2">
                    <FiMail className="w-4 h-4" />
                    {user.email}
                  </p>
                  <div className="mt-3">
                    <span className={`inline-block px-4 py-1 rounded-full text-sm font-semibold ${badge.color}`}>
                      {badge.text}
                    </span>
                  </div>
                </div>
              </div>
              {!editMode && (
                <button
                  onClick={() => setEditMode(true)}
                  className="btn-secondary flex items-center gap-2"
                >
                  <FiEdit2 />
                  Editar Perfil
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Messages */}
        {message.text && (
          <div className={`mb-6 ${
            message.type === 'success' ? 'alert-success' : 'alert-error'
          }`}>
            <p className="font-medium">{message.text}</p>
          </div>
        )}

        {/* Profile Form */}
        <div className="card p-8">
          <h2 className="heading-2 mb-6">Informações Pessoais</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nome */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <FiUser className="text-rausch" />
                Nome Completo
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!editMode}
                className="input disabled:bg-airbnb-grey-100 disabled:cursor-not-allowed"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <FiMail className="text-rausch" />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!editMode}
                className="input disabled:bg-airbnb-grey-100 disabled:cursor-not-allowed"
                required
              />
            </div>

            {/* Telefone */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <FiPhone className="text-rausch" />
                Telefone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!editMode}
                className="input disabled:bg-airbnb-grey-100 disabled:cursor-not-allowed"
                placeholder="(00) 00000-0000"
              />
            </div>

            {/* País */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <FiMapPin className="text-rausch" />
                País
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                disabled={!editMode}
                className="input disabled:bg-airbnb-grey-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* Buttons */}
            {editMode && (
              <div className="flex items-center gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <FiSave />
                  {loading ? 'Salvando...' : 'Salvar Alterações'}
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  disabled={loading}
                  className="btn-secondary flex items-center gap-2"
                >
                  <FiX />
                  Cancelar
                </button>
              </div>
            )}
          </form>

          {/* Change Password Button */}
          {!editMode && (
            <div className="mt-8 pt-8 divider">
              <button
                onClick={() => setShowPasswordModal(true)}
                className="btn-secondary w-full flex items-center justify-center gap-2"
              >
                <FiLock />
                Alterar Senha
              </button>
            </div>
          )}
        </div>

        {/* Password Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="card max-w-md w-full p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="heading-3">Alterar Senha</h3>
                <button
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    setMessage({ type: '', text: '' });
                  }}
                  className="text-airbnb-grey-400 hover:text-airbnb-grey-600 transition-colors p-2 hover:bg-airbnb-grey-100 rounded-full"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Senha Atual
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nova Senha
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="input"
                    required
                    minLength={6}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirmar Nova Senha
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="input"
                    required
                    minLength={6}
                  />
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Alterando...' : 'Alterar Senha'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordModal(false);
                      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                      setMessage({ type: '', text: '' });
                    }}
                    disabled={loading}
                    className="btn-secondary"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
