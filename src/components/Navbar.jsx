/**
 * Navbar Component
 * Main navigation bar with responsive mobile menu and glass morphism effect
 */
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { HiOutlineBars3, HiOutlineXMark, HiOutlinePhone } from 'react-icons/hi2';
import { useSettings } from '../hooks/useSettings';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Services', path: '/services' },
  { name: 'Projects', path: '/projects' },
  { name: 'Properties', path: '/properties' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Contact', path: '/contact' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();
  const location = useLocation();
  const { settings, loading } = useSettings();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const isHomePage = location.pathname === '/';
  const isSolid = true; // Navbar is always solid white relative to the hero slider

  // Extracts the mobile number (last 10 digits) and formats with +91 prefix
  const formatPhone = (raw) => {
    if (!raw) return '';
    const digits = raw.replace(/\D/g, ''); // strip all non-digits
    // If 12 digits starting with 91 (e.g. 919876543210), remove country prefix
    const mobile = digits.length >= 12 && digits.startsWith('91') ? digits.slice(2) : digits;
    // Take last 10 digits to ensure correct length
    return mobile.slice(-10);
  };

  const navbarClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-white/90 backdrop-blur-xl shadow-lg border-b border-gray-100`;

  return (
    <motion.nav
      animate="visible"
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className={navbarClasses}
    >
      <div className="w-full px-4 md:px-6 lg:px-8">
        <div className="flex items-center h-20">
          {/* Logo (Left side) - fixed min-width to prevent collapse on image load */}
          <Link to="/" className="flex items-center gap-3 group flex-shrink-0 min-w-[200px] xl:min-w-[240px]">
            {/* Logo image — only rendered when Firebase URL is available */}
            <div className={`flex-shrink-0 flex items-center justify-center transition-all duration-300 overflow-hidden rounded ${isSolid ? 'h-12 w-12 lg:h-14 lg:w-14' : 'h-14 w-14 lg:h-16 lg:w-16'}`}>
              {settings.logoUrl ? (
                <img
                  src={settings.logoUrl}
                  alt=""
                  className="h-full w-full object-contain"
                  fetchPriority="high"
                  loading="eager"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div
                style={{ display: settings.logoUrl ? 'none' : 'flex' }}
                className="h-full w-full items-center justify-center bg-accent/10 rounded text-accent font-bold text-sm"
              >
                {(settings.companyName || 'SMC').charAt(0)}
              </div>
            </div>

            {/* Company name — stacked two-line layout */}
            <div className="flex flex-col leading-tight">
              <span
                className={`text-base lg:text-lg font-bold tracking-widest font-[sans-serif] transition-colors duration-300 ${isSolid ? 'text-primary' : 'text-white'}`}
              >
                SMC Projects
              </span>
              <span
                className={`text-[9px] lg:text-[10px] font-semibold tracking-[0.25em] uppercase font-[Cinzel,serif] transition-colors duration-300 ${isSolid ? 'text-accent' : 'text-accent-light'}`}
              >
                Pvt Ltd
              </span>
            </div>
          </Link>

          {/* Desktop Navigation & Right Section — flush to the right edge */}
          <div className="hidden lg:flex items-center ml-auto gap-8 xl:gap-10">
            {/* Nav Links */}
            <nav className="flex items-center gap-5 xl:gap-7">
              {navLinks.map((link) => (
                <div key={link.path} className="relative group">
                  <Link
                    to={link.path}
                    className={`text-sm xl:text-base font-semibold tracking-wide transition-colors duration-300 py-2 inline-block whitespace-nowrap ${location.pathname === link.path
                      ? isSolid
                        ? 'text-accent'
                        : 'text-white'
                      : isSolid
                        ? 'text-gray-600 group-hover:text-accent'
                        : 'text-white/80 group-hover:text-white'
                      }`}
                  >
                    {link.name}
                  </Link>
                  <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-accent transform scale-x-0 transition-transform duration-300 origin-left ${location.pathname === link.path ? 'scale-x-100' : 'group-hover:scale-x-100'
                    }`}></span>
                </div>
              ))}
            </nav>

            {/* CTA Section */}
            <div className="flex items-center gap-4 xl:gap-6 border-l border-gray-100 pl-8">
              <a
                href={`tel:${settings.phone}`}
                className={`hidden xl:flex items-center gap-2 text-sm font-semibold transition-colors whitespace-nowrap ${isSolid ? 'text-gray-600 hover:text-accent' : 'text-white/80 hover:text-white'
                  }`}
              >
                <HiOutlinePhone className="w-4 h-4 text-accent" />
                {loading
                  ? <span className="text-gray-300 tracking-widest">+91 ··· ···· ···· </span>
                  : <span>+91&nbsp;{formatPhone(settings.phone)}</span>
                }
              </a>
              <Link
                to="/contact"
                className="btn-primary whitespace-nowrap text-xs !py-3 !px-3 !rounded-md shadow-md hover:shadow-accent/20"
              >
                Get in Touch
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`lg:hidden ml-auto p-2 rounded-lg transition-colors ${isSolid ? 'text-primary' : 'text-white'
              }`}
          >
            {isOpen ? (
              <HiOutlineXMark className="w-6 h-6" />
            ) : (
              <HiOutlineBars3 className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-xl"
          >
            <div className="container-custom py-6 space-y-1">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={link.path}
                    className={`block py-3 px-4 rounded-xl text-sm font-medium transition-all ${location.pathname === link.path
                      ? 'bg-accent/10 text-accent'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-accent'
                      }`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              <div className="pt-4 border-t border-gray-100">
                <Link
                  to="/contact"
                  className="btn-primary block text-center text-sm py-3 rounded-md"
                >
                  Get in Touch
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;

