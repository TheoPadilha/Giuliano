import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navigation = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: "📊",
      current: location.pathname === "/admin",
    },
    {
      name: "Imóveis",
      href: "/admin/properties",
      icon: "🏠",
      current: location.pathname === "/admin/properties",
    },
    {
      name: "Novo Imóvel",
      href: "/admin/properties/new",
      icon: "➕",
      current: location.pathname === "/admin/properties/new",
    },
    {
      name: "Usuários",
      href: "/admin/users",
      icon: "👥",
      current: location.pathname === "/admin/users",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar Mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 flex z-40 md:hidden">
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={() => setSidebarOpen(false)}
          ></div>
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                onClick={() => setSidebarOpen(false)}
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                <span className="text-white">✕</span>
              </button>
            </div>
            <SidebarContent navigation={navigation} />
          </div>
        </div>
      )}

      {/* Sidebar Desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <SidebarContent navigation={navigation} />
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              {/* Mobile menu button */}
              <div className="flex items-center md:hidden">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                >
                  <span className="text-xl">☰</span>
                </button>
              </div>

              {/* Page title */}
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-gray-900">
                  Painel Administrativo
                </h1>
              </div>

              {/* User menu */}
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">Olá, {user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Sair
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

// Componente do conteúdo da sidebar
const SidebarContent = ({ navigation }) => (
  <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
    {/* Logo */}
    <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
      <div className="flex items-center flex-shrink-0 px-4">
        <div className="text-xl font-bold text-gray-900">Giuliano Admin</div>
      </div>

      {/* Navigation */}
      <nav className="mt-5 flex-1 px-2 space-y-1">
        {navigation.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className={`${
              item.current
                ? "bg-blue-50 border-blue-500 text-blue-700"
                : "border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            } group flex items-center px-2 py-2 text-sm font-medium border-l-4 transition-colors duration-200`}
          >
            <span className="mr-3 text-lg">{item.icon}</span>
            {item.name}
          </a>
        ))}
      </nav>
    </div>

    {/* Bottom section */}
    <div className="flex-shrink-0 p-4 border-t border-gray-200">
      <a
        href="/"
        className="group -m-2 p-2 flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
      >
        <span className="mr-3">🌐</span>
        Ver Site
      </a>
    </div>
  </div>
);

export default AdminLayout;
