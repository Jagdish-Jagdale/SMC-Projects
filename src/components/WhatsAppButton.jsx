import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '../hooks/useSettings';
import { useState, useEffect } from 'react';

const WhatsAppButton = () => {
  const { settings } = useSettings();
  const [showLabel, setShowLabel] = useState(false);

  const phoneNumber = settings.whatsappNumber || settings.phone || '919876543210';
  const whatsappLink = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=Hello, I have an inquiry regarding your properties.`;

  useEffect(() => {
    // Show label every 10 seconds to grab attention
    const interval = setInterval(() => {
      setShowLabel(true);
      setTimeout(() => setShowLabel(false), 4000);
    }, 10000);

    // Initial show after 3 seconds
    const initial = setTimeout(() => {
      setShowLabel(true);
      setTimeout(() => setShowLabel(false), 5000);
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(initial);
    };
  }, []);

  return (
    <div className="fixed bottom-16 right-8 lg:bottom-16 lg:right-10 z-[999] group flex items-center justify-center w-12 h-12 lg:w-14 lg:h-14">
      {/* Ring Animation */}
      <span
        className="absolute inset-0 rounded-full border-2 border-[#25D366] animate-ping opacity-75 pointer-events-none"
        style={{ animationDuration: '2s' }}
      />

      {/* Main Button */}
      <motion.a
        href={whatsappLink}
        target="_blank"
        rel="noreferrer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "backOut" }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative z-10 w-full h-full bg-[#25D366] text-white rounded-full border-[3px] border-white flex items-center justify-center shadow-[0_8px_20px_rgba(37,211,102,0.3)] hover:shadow-[0_12px_25px_rgba(37,211,102,0.5)] transition-shadow duration-300"
        aria-label="Contact on WhatsApp"
        onMouseEnter={() => setShowLabel(true)}
        onMouseLeave={() => setShowLabel(false)}
      >
        <svg className="w-5 h-5 lg:w-7 lg:h-7 fill-current filter drop-shadow-md" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
        </svg>

        {/* Message Bubble Popout */}
        <AnimatePresence>
          {showLabel && (
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.8 }}
              className="absolute right-full mr-5 top-1/2 -translate-y-1/2"
            >
              <div className="relative bg-white text-gray-800 py-3 px-5 rounded-2xl shadow-2xl border border-gray-100 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
                <span className="text-sm font-bold font-[Outfit] whitespace-nowrap">
                  How can we help?
                </span>
                {/* Carrot */}
                <div className="absolute left-full top-1/2 -translate-y-1/2 w-4 h-4 bg-white rotate-45 -ml-2 border-r border-t border-gray-100" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.a>
    </div>
  );
};

export default WhatsAppButton;
