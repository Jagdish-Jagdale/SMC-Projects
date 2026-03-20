import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { MdLocationOn, MdEmail, MdPhone } from "react-icons/md";
import { Link } from "react-router-dom";
import { useSettings } from "../hooks/useSettings";

export default function Footer() {
  const { settings } = useSettings();

  const socialLinks = [
    { icon: FaFacebookF, url: settings.socialLinks?.facebook || '#', label: 'Facebook' },
    { icon: FaTwitter, url: settings.socialLinks?.twitter || '#', label: 'Twitter' },
    { icon: FaInstagram, url: settings.socialLinks?.instagram || '#', label: 'Instagram' },
    { icon: FaLinkedinIn, url: settings.socialLinks?.linkedin || '#', label: 'LinkedIn' },
    { icon: FaYoutube, url: settings.socialLinks?.youtube || '#', label: 'YouTube' },
  ];

  const quickLinks = settings.footer?.quickLinks?.length > 0 ? settings.footer.quickLinks : [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Projects", path: "/projects" },
    { name: "Properties", path: "/properties" },
    { name: "Contact", path: "/contact" },
    { name: "Admin Login", path: "/admin/login" }
  ];

  const footerServices = settings.footer?.services?.length > 0 ? settings.footer.services : [
    "Contracting & EPC",
    "Industrial Construction",
    "Commercial Construction",
    "Residential Construction",
    "Interior Design",
    "Land Development"
  ];

  return (
    <footer className="bg-primary text-gray-300 pt-16 pb-8 relative overflow-hidden">

      {/* Glow Effect */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-accent/10 via-transparent to-accent/5 blur-3xl"></div>

      <div className="container-custom relative z-10">

        <div className="grid md:grid-cols-4 gap-10">

          {/* Logo & About */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              {settings.logoUrl && (
                <div className="h-10 flex items-center">
                  <img src={settings.logoUrl} alt="Logo" className="h-full w-auto object-contain" />
                </div>
              )}
              <h2 className="text-white text-2xl font-bold font-[Outfit]">
                {settings.companyName?.split(' ')[0] || 'SMC'} <span className="text-accent">{settings.companyName?.split(' ').slice(1).join(' ') || 'Projects'}</span>
              </h2>
            </div>

            <p className="text-sm text-gray-400 mb-5 leading-relaxed">
              {settings.seo?.metaDescription || "Trusted construction & EPC partner delivering quality projects across Pune and pan India."}
            </p>

            {/* Social Icons */}
            <div className="flex gap-3">
              {socialLinks.map((social, i) => (
                <a
                  key={i}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 hover:bg-accent transition duration-300 cursor-pointer"
                >
                  <social.icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold font-[Cinzel] mb-4">Quick Links</h3>

            <ul className="space-y-2 text-sm">
              {quickLinks.map((item, i) => (
                <li key={i}>
                  <Link
                    to={item.path}
                    className="hover:text-accent transition duration-300"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold font-[Cinzel] mb-4">Our Services</h3>

            <ul className="space-y-2 text-sm">
              {footerServices.map((service, i) => (
                <li key={i} className="hover:text-accent transition duration-300 cursor-pointer">
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold font-[Cinzel] mb-4">Contact Us</h3>

            <div className="space-y-4 text-sm">

              <div className="flex items-start gap-3">
                <MdLocationOn className="text-accent shrink-0" size={20} />
                <span>{settings.address}</span>
              </div>

              <div className="flex items-center gap-3">
                <MdPhone className="text-accent shrink-0" size={20} />
                <a href={`tel:${settings.phone}`} className="hover:text-accent transition-colors">
                  {settings.phone}
                </a>
              </div>

              <div className="flex items-center gap-3">
                <MdEmail className="text-accent shrink-0" size={20} />
                <a href={`mailto:${settings.email}`} className="hover:text-accent transition-colors">
                  {settings.email}
                </a>
              </div>

            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-white/10 my-8"></div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">

          <p>© {new Date().getFullYear()} {settings.companyName}. All rights reserved.</p>

          <div className="flex gap-6 mt-4 md:mt-0">
            <Link to="/privacy-policy" className="hover:text-accent cursor-pointer">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-accent cursor-pointer">Terms of Service</Link>
            <Link to="/sitemap" className="hover:text-accent cursor-pointer">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}