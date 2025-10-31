import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../contexts/AuthContext";
import AdminLayout from "../../components/admin/AdminLayout";

const UsersPage = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("pending"); // Começa mostrando os pendentes por padrão
  const { token } = useAuth();

  // Função para buscar todos os usuários da API
  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/users`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Falha ao buscar usuários.");
      }
      const data = await response.json();
      setAllUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // useEffect para chamar a função de busca quando o componente é montado
  useEffect(() => {
    fetchUsers();
  }, [token]);

  // Função para aprovar ou rejeitar um usuário
  const handleUserAction = async (userId, action) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/users/${userId}/${action}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Falha ao ${action} o usuário.`);
      }

      // Atualiza o estado local para refletir a mudança instantaneamente na UI
      setAllUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.id === userId
            ? {
                ...user,
                status: action === "approve" ? "approved" : "rejected",
              }
            : user
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  // Filtra a lista de usuários com base na aba ativa
  const filteredUsers = useMemo(() => {
    if (activeFilter === "all") return allUsers;
    return allUsers.filter((user) => user.status === activeFilter);
  }, [allUsers, activeFilter]);

  // Componente para o badge de status
  const StatusBadge = ({ status }) => {
    const badgeClasses = {
      pending: "badge-warning",
      approved: "badge-success",
      rejected: "badge-error",
    };
    return (
      <span
        className={`badge ${badgeClasses[status] || "badge"} uppercase`}
      >
        {status}
      </span>
    );
  };

  // Componente para os botões de aba
  const TabButton = ({ filter, label }) => {
    const isActive = activeFilter === filter;
    const count = allUsers.filter(
      (u) => filter === "all" || u.status === filter
    ).length;
    return (
      <button
        onClick={() => setActiveFilter(filter)}
        className={`px-4 py-2 font-semibold text-sm rounded-xl transition-all duration-200 ${
          isActive
            ? "bg-rausch text-white shadow-md"
            : "text-airbnb-grey-700 hover:bg-airbnb-grey-100"
        }`}
      >
        {label}{" "}
        <span
          className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
            isActive ? "bg-white text-rausch" : "bg-airbnb-grey-200 text-airbnb-grey-700"
          }`}
        >
          {count}
        </span>
      </button>
    );
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="heading-2 text-airbnb-black mb-8">
          Gerenciamento de Usuários
        </h1>

        {/* Abas de Filtragem */}
        <div className="flex flex-wrap items-center gap-2 mb-6 pb-4 border-b border-airbnb-grey-200">
          <TabButton filter="pending" label="Pendentes" />
          <TabButton filter="approved" label="Aprovados" />
          <TabButton filter="rejected" label="Rejeitados" />
          <TabButton filter="all" label="Todos" />
        </div>

        {loading && (
          <div className="card text-center py-10">
            <div className="spinner-lg mx-auto mb-4"></div>
            <p className="body-base text-airbnb-grey-600">Carregando usuários...</p>
          </div>
        )}
        {error && (
          <div className="alert-error mb-6">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-airbnb-grey-200">
                <thead className="bg-airbnb-grey-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-airbnb-grey-700 uppercase tracking-wider">
                      Usuário
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-airbnb-grey-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-airbnb-grey-700 uppercase tracking-wider">
                      Papel
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-airbnb-grey-700 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-airbnb-grey-200">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user, index) => (
                      <tr
                        key={user.uuid || user.id || `user-${index}`}
                        className="hover:bg-airbnb-grey-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-airbnb-black">
                            {user.name}
                          </div>
                          <div className="text-sm text-airbnb-grey-600">
                            {user.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={user.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="badge badge-rausch capitalize font-medium">
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {user.status === "pending" && (
                            <div className="flex justify-end space-x-3">
                              <button
                                onClick={() =>
                                  handleUserAction(user.id, "approve")
                                }
                                className="btn-success py-2 px-4 text-sm"
                              >
                                Aprovar
                              </button>
                              <button
                                onClick={() =>
                                  handleUserAction(user.id, "reject")
                                }
                                className="btn-danger py-2 px-4 text-sm"
                              >
                                Rejeitar
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="text-center py-10 text-airbnb-grey-600"
                      >
                        Nenhum usuário encontrado para este filtro.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default UsersPage;
