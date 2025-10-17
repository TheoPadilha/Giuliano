import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../contexts/AuthContext";

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
    const styles = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };
    return (
      <span
        className={`px-3 py-1 text-xs font-bold uppercase rounded-full ${
          styles[status] || "bg-gray-100 text-gray-800"
        }`}
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
        className={`px-4 py-2 font-bold text-sm rounded-lg transition-colors duration-200 ${
          isActive
            ? "bg-primary-600 text-white shadow-md"
            : "text-gray-600 hover:bg-gray-200"
        }`}
      >
        {label}{" "}
        <span
          className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
            isActive ? "bg-white text-primary-700" : "bg-gray-200 text-gray-700"
          }`}
        >
          {count}
        </span>
      </button>
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Gerenciamento de Usuários
        </h1>

        {/* Abas de Filtragem */}
        <div className="flex flex-wrap items-center gap-2 mb-6 border-b border-gray-200 pb-4">
          <TabButton filter="pending" label="Pendentes" />
          <TabButton filter="approved" label="Aprovados" />
          <TabButton filter="rejected" label="Rejeitados" />
          <TabButton filter="all" label="Todos" />
        </div>

        {loading && (
          <div className="text-center py-10">Carregando usuários...</div>
        )}
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Usuário
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Papel
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user, index) => (
                      <tr
                        key={user.uuid || user.id || `user-${index}`}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={user.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                          {user.role}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {user.status === "pending" && (
                            <div className="flex justify-end space-x-4">
                              <button
                                onClick={() =>
                                  handleUserAction(user.id, "approve")
                                }
                                className="text-green-600 hover:text-green-800 font-bold transition-colors"
                              >
                                Aprovar
                              </button>
                              <button
                                onClick={() =>
                                  handleUserAction(user.id, "reject")
                                }
                                className="text-red-600 hover:text-red-800 font-bold transition-colors"
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
                        className="text-center py-10 text-gray-500"
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
    </div>
  );
};

export default UsersPage;
