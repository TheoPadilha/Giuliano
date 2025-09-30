// src/components/admin/AdminLayout.jsx - TEMA VERMELHO

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
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-2xl">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                onClick={() => setSidebarOpen(false)}
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                <span className="text-white text-2xl">✕</span>
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
        {/* Top bar com Gradiente Vermelho */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-primary-600 via-primary-700 to-accent-600 shadow-red-strong">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              {/* Mobile menu button */}
              <div className="flex items-center md:hidden">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-white/10 transition-colors"
                >
                  <span className="text-2xl">☰</span>
                </button>
              </div>

              {/* Page title */}
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-white drop-shadow-lg">
                  🏠 Painel Administrativo
                </h1>
              </div>

              {/* User menu */}
              <div className="flex items-center space-x-4">
                <span className="text-sm text-white font-medium">
                  Olá, {user?.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-white hover:text-primary-100 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg font-medium transition-all duration-200"
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

// Componente do conteúdo da sidebar com Tema Vermelho
const SidebarContent = ({ navigation }) => (
  <div className="flex-1 flex flex-col min-h-0 bg-white border-r-4 border-primary-200 shadow-xl">
    {/* Logo com Gradiente */}
    <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
      <div className="flex items-center flex-shrink-0 px-4 pb-5 border-b-2 border-primary-100">
        <div className="text-center w-full">
          <div className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
            🏠 Giuliano Admin
          </div>
          <div className="text-xs text-gray-500 mt-1 font-medium">
            Painel de Controle
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-5 flex-1 px-2 space-y-2">
        {navigation.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className={`${
              item.current
                ? "bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-red-glow"
                : "text-gray-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-accent-50 hover:text-primary-700"
            } group flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 transform hover:scale-105`}
          >
            <span className="text-xl mr-3">{item.icon}</span>
            {item.name}
            {item.current && (
              <span className="ml-auto">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </span>
            )}
          </a>
        ))}
      </nav>
    </div>

    {/* Bottom section com destaque vermelho */}
    <div className="flex-shrink-0 p-4 border-t-2 border-primary-100 bg-gradient-to-br from-primary-50 to-accent-50">
      <a
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        className="group -m-2 p-3 flex items-center text-sm font-semibold text-primary-700 hover:text-primary-900 bg-white hover:bg-primary-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
      >
        <span className="text-lg mr-3">🌐</span>
        Ver Site Público
        <span className="ml-auto text-xs opacity-0 group-hover:opacity-100 transition-opacity">
          →
        </span>
      </a>
    </div>
  </div>
);

export default AdminLayout;
