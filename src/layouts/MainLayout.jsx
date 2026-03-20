/**
 * MainLayout - Wrapper for public website pages
 * Includes Navbar and Footer
 */
import { Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useSettings } from '../hooks/useSettings';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';
import ComparisonDrawer from '../components/ComparisonDrawer';
import WhatsAppButton from '../components/WhatsAppButton';

const MainLayout = () => {
  const { settings } = useSettings();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>SMC Projects Pvt. Ltd.</title>
        <meta name="description" content={settings.seo?.metaDescription || `Trusted Construction & EPC Partner across ${settings.address.split(',')[0]}`} />
        <meta name="keywords" content={settings.seo?.keywords || 'real estate, construction, pune, india'} />
        {settings.logoUrl && <link rel="icon" type="image/png" href={settings.logoUrl} />}
      </Helmet>
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />

      {/* Comparison Drawer */}
      <ComparisonDrawer />

      {/* Floating WhatsApp Button */}
      <WhatsAppButton />
    </div>
  );
};

export default MainLayout;
