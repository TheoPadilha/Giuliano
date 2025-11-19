// src/components/admin/AdminLayout.jsx - AIRBNB DESIGN SYSTEM

import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { FaHome, FaPlus, FaUsers, FaChartBar, FaGlobe, FaBars, FaTimes, FaCalendarAlt } from "react-icons/fa";

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const allNavigation = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: FaChartBar,
      current: location.pathname === "/admin",
    },
    {
      name: "Imóveis",
      href: "/admin/properties",
      icon: FaHome,
      current: location.pathname === "/admin/properties",
    },
    {
      name: "Reservas",
      href: "/admin/bookings",
      icon: FaCalendarAlt,
      current: location.pathname === "/admin/bookings",
    },
    {
      name: "Novo Imóvel",
      href: "/admin/properties/new",
      icon: FaPlus,
      current: location.pathname === "/admin/properties/new",
    },
    {
      name: "Usuários",
      href: "/admin/users",
      icon: FaUsers,
      current: location.pathname === "/admin/users",
      adminMasterOnly: true, // Apenas admin_master pode ver
    },
  ];

  // Filtrar navegação baseado no role do usuário
  const navigation = allNavigation.filter(item => {
    if (item.adminMasterOnly) {
      return user?.role === "admin_master";
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-airbnb-grey-50">
      {/* Sidebar Mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 flex z-[60] md:hidden">
          <div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          ></div>
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-2xl">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                onClick={() => setSidebarOpen(false)}
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-white bg-white/20 hover:bg-white/30 transition-colors"
              >
                <FaTimes className="text-white text-xl" />
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
        {/* Top bar - Clean white design */}
        <div className="sticky top-0 z-50 bg-white border-b border-airbnb-grey-200 shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              {/* Mobile menu button */}
              <div className="flex items-center md:hidden">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="inline-flex items-center justify-center p-2 rounded-lg text-airbnb-grey-700 hover:bg-airbnb-grey-100 transition-colors"
                >
                  <FaBars className="text-xl" />
                </button>
              </div>

              {/* Page title */}
              <div className="flex items-center">
                <h1 className="text-lg font-semibold text-airbnb-black">
                  Painel Administrativo
                </h1>
              </div>

              {/* User menu */}
              <div className="flex items-center space-x-3">
                <span className="text-sm text-airbnb-grey-700 font-medium hidden sm:block">
                  {user?.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="btn-secondary text-sm py-2 px-4"
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

// Componente do conteúdo da sidebar com Airbnb Design System
const SidebarContent = ({ navigation }) => (
  <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-airbnb-grey-200">
    {/* Logo */}
    <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
      <div className="flex items-center flex-shrink-0 px-4 pb-5 border-b border-airbnb-grey-200">
        <div className="text-center w-full">
          <div className="text-2xl font-bold text-rausch flex items-center justify-center gap-2">
            <FaHome />
            <span>Ziguealuga</span>
          </div>
          <div className="text-xs text-airbnb-grey-600 mt-1 font-medium">
            Admin Painel
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-5 flex-1 px-3 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.name}
              href={item.href}
              className={`${
                item.current
                  ? "bg-rausch/10 text-rausch border-l-4 border-rausch"
                  : "text-airbnb-grey-700 hover:bg-airbnb-grey-100 hover:text-airbnb-black border-l-4 border-transparent"
              } group flex items-center px-3 py-3 text-sm font-semibold rounded-r-lg transition-all duration-200`}
            >
              <Icon className="text-lg mr-3 flex-shrink-0" />
              <span>{item.name}</span>
              {item.current && (
                <span className="ml-auto">
                  <div className="w-2 h-2 bg-rausch rounded-full animate-pulse"></div>
                </span>
              )}
            </a>
          );
        })}
      </nav>
    </div>

    {/* Bottom section */}
    <div className="flex-shrink-0 p-4 border-t border-airbnb-grey-200 bg-airbnb-grey-50">
      <Link
        to="/"
        className="group -m-2 p-3 flex items-center text-sm font-semibold text-airbnb-grey-700 hover:text-rausch bg-white hover:bg-airbnb-grey-100 rounded-xl border border-airbnb-grey-200 hover:border-rausch/20 shadow-sm hover:shadow-md transition-all duration-200"
      >
        <FaGlobe className="text-lg mr-3" />
        <span>Ver Site</span>
        <span className="ml-auto text-xs opacity-0 group-hover:opacity-100 transition-opacity">
          →
        </span>
      </Link>
    </div>
  </div>
);

export default AdminLayout;
