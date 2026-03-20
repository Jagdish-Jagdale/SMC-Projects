/**
 * Admin Layout
 * Sidebar and top navigation wrapper for admin dashboard
 */
import { useState } from 'react';
import { NavLink, Outlet, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  HiOutlineSquares2X2, 
  HiOutlineHome, 
  HiOutlineBuildingOffice2, 
  HiOutlineUserGroup, 
  HiOutlinePhoto, 
  HiOutlineCog8Tooth,
  HiOutlineChartBar,
  HiOutlineArrowRightOnRectangle,
  HiOutlineBars3,
  HiOutlineXMark,
  HiOutlineGlobeAlt,
  HiOutlineUsers,
  HiOutlineBriefcase,
  HiOutlineStar,
  HiOutlineMegaphone,
  HiOutlineInformationCircle
} from 'react-icons/hi2';
import { useAuth } from '../hooks/useAuth';
import { useSettings } from '../hooks/useSettings';

const AdminLayout = () => {
  const { user, logout, loading } = useAuth();
  const { settings } = useSettings();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="spinner border-accent/20 border-t-accent"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = async () => {
    await logout();
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: HiOutlineSquares2X2 },
    { label: 'Properties', path: '/admin/properties', icon: HiOutlineHome },
    { label: 'Projects', path: '/admin/projects', icon: HiOutlineBuildingOffice2 },
    { label: 'Leads', path: '/admin/leads', icon: HiOutlineUserGroup },
    { label: 'Clients', path: '/admin/clients', icon: HiOutlineUsers },
    { label: 'Agents', path: '/admin/agents', icon: HiOutlineBriefcase },
    { label: 'Reports', path: '/admin/reports', icon: HiOutlineChartBar },
    { label: 'Gallery', path: '/admin/gallery', icon: HiOutlinePhoto },
    { label: 'Banners', path: '/admin/banners', icon: HiOutlineMegaphone },
    { label: 'Sitemap', path: '/admin/sitemap', icon: HiOutlineGlobeAlt },
    { label: 'Testimonials', path: '/admin/testimonials', icon: HiOutlineStar },
    { label: 'About Content', path: '/admin/about', icon: HiOutlineInformationCircle },
    { label: 'Settings', path: '/admin/settings', icon: HiOutlineCog8Tooth },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Overlay - Mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 lg:static w-72 shrink-0 admin-sidebar text-white flex flex-col shadow-2xl transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="h-20 flex items-center justify-between px-6 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="h-10 flex items-center">
              <img src={settings.logoUrl || "/SMCLogo.png"} alt="Logo" className="h-full w-auto object-contain max-w-[120px]" />
            </div>
            <span className="text-xl font-bold font-[Outfit] truncate max-w-[140px]">{settings.companyName || 'SMC Projects'}</span>
          </div>
          <button className="lg:hidden text-gray-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <HiOutlineXMark className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4 px-2">Menu</div>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${isActive 
                  ? 'bg-accent text-white shadow-lg shadow-accent/20 font-medium' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }
              `}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="p-4 border-t border-white/10">
          <div className="bg-white/5 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-accent to-purple-600 flex items-center justify-center text-white font-bold">
                A
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate text-ellipsis">Admin User</p>
                <p className="text-xs text-gray-400 truncate text-ellipsis">{user.email}</p>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <HiOutlineArrowRightOnRectangle className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-10 shadow-sm relative">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <HiOutlineBars3 className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold text-primary font-[Outfit] hidden sm:block">Dashboard Overview</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <a 
              href="/" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-accent bg-gray-50 hover:bg-accent/10 py-2 px-4 rounded-lg transition-colors"
            >
              <HiOutlineGlobeAlt className="w-5 h-5" />
              <span className="hidden sm:inline">View Website</span>
            </a>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <div className="flex-1 overflow-x-hidden overflow-y-auto bg-[#f8fafc] p-4 md:p-6 lg:p-8 custom-scrollbar relative">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
