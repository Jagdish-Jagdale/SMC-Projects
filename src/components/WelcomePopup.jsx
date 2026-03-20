import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineXMark } from 'react-icons/hi2';
import { getBanners } from '../firebase/settings';

const WelcomePopup = () => {
  const [banners, setBanners] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(null);

  useEffect(() => {
    const fetchBanners = async () => {
      const data = await getBanners();
      const activeBanners = (data || []).filter(b => b.active !== false);
      
      if (activeBanners.length > 0) {
        // Show the highest order or most recent active banner
        setCurrentBanner(activeBanners[0]);
        // Set a small delay before showing for better UX
        setTimeout(() => setIsOpen(true), 1500);
      }
    };

    fetchBanners();
  }, []);

  const closePopup = () => {
    setIsOpen(false);
  };

  if (!currentBanner) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePopup}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            className="relative w-full max-w-lg bg-white rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={closePopup}
              className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center bg-black/10 hover:bg-black/20 text-white rounded-full transition-all"
            >
              <HiOutlineXMark className="w-5 h-5" />
            </button>

            {/* Content Area */}
            <div className="flex flex-col">
              {/* Top Image */}
              <div className="w-full overflow-hidden">
                <img
                  src={currentBanner.imageUrl}
                  alt={currentBanner.title || 'Promotional Ad'}
                  className="w-full h-auto block"
                />
              </div>

              {/* Action Footer */}
              <div className="p-6 flex flex-col items-center text-center">
                <a
                  href={currentBanner.buttonLink || '/properties'}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closePopup}
                  className="w-full max-w-[280px] py-4 px-8 bg-[#E31E24] hover:bg-red-700 text-white font-bold uppercase tracking-widest text-xs rounded-lg transition-all shadow-lg text-center"
                >
                  {currentBanner.buttonText || 'Visit Website'}
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default WelcomePopup;
