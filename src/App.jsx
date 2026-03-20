import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Projects from './pages/Projects';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import Contact from './pages/Contact';
import Gallery from './pages/Gallery';
import AgentProfile from './pages/AgentProfile';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import Compare from './pages/Compare';

// Admin Pages
import AdminLogin from './admin/AdminLogin';
import Dashboard from './admin/Dashboard';
import ManageProperties from './admin/ManageProperties';
import AddProperty from './admin/AddProperty';
import EditProperty from './admin/EditProperty';
import ManageProjects from './admin/ManageProjects';
import AddProject from './admin/AddProject';
import EditProject from './admin/EditProject';
import ManageLeads from './admin/ManageLeads';
import ManageClients from './admin/ManageClients';
import ManageAgents from './admin/ManageAgents';
import ManageGallery from './admin/ManageGallery';
import ManageTestimonials from './admin/ManageTestimonials';
import ManageReports from './admin/ManageReports';
import ManageBanners from './admin/ManageBanners';
import SitemapTool from './admin/SitemapTool';
import Settings from './admin/Settings';
import ManageAbout from './admin/ManageAbout';

function App() {
  return (
    <Routes>
      {/* Public Routes with MainLayout */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="services" element={<Services />} />
        <Route path="projects" element={<Projects />} />
        <Route path="properties" element={<Properties />} />
        <Route path="properties/:id" element={<PropertyDetails />} />
        <Route path="contact" element={<Contact />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="agents/:id" element={<AgentProfile />} />
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
        <Route path="terms" element={<Terms />} />
        <Route path="compare" element={<Compare />} />
      </Route>

      {/* Admin Login Route (No Layout) */}
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Protected Admin Routes with AdminLayout */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="properties" element={<ManageProperties />} />
        <Route path="properties/add" element={<AddProperty />} />
        <Route path="properties/edit/:id" element={<EditProperty />} />
        <Route path="projects" element={<ManageProjects />} />
        <Route path="projects/add" element={<AddProject />} />
        <Route path="projects/edit/:id" element={<EditProject />} />
        <Route path="leads" element={<ManageLeads />} />
        <Route path="clients" element={<ManageClients />} />
        <Route path="agents" element={<ManageAgents />} />
        <Route path="reports" element={<ManageReports />} />
        <Route path="gallery" element={<ManageGallery />} />
        <Route path="testimonials" element={<ManageTestimonials />} />
        <Route path="banners" element={<ManageBanners />} />
        <Route path="sitemap" element={<SitemapTool />} />
        <Route path="about" element={<ManageAbout />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
          <h1 className="text-8xl font-bold text-gray-200 font-[Outfit]">404</h1>
          <h2 className="text-2xl font-bold text-gray-700 mt-4 mb-2">Page Not Found</h2>
          <p className="text-gray-500 mb-8 max-w-md">The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
          <a href="/" className="btn-primary">Return to Home</a>
        </div>
      } />
    </Routes>
  );
}

export default App;
