/**
 * Comparison Drawer
 * Shows currently compared properties and link to comparison page
 */
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineXMark, HiOutlineChevronRight, HiOutlineTrash } from 'react-icons/hi2';
import { useComparison } from '../context/ComparisonContext';
import { useNavigate } from 'react-router-dom';

const ComparisonDrawer = () => {
  const { comparedProperties, removeFromCompare, clearComparison } = useComparison();
  const navigate = useNavigate();

  if (comparedProperties.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] pb-6 px-4">
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-4xl mx-auto bg-primary rounded-3xl shadow-2xl p-4 md:p-6 border border-white/10 backdrop-blur-xl"
      >
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-white font-bold font-[Outfit]">Compare Properties ({comparedProperties.length}/4)</h4>
              <button 
                onClick={clearComparison}
                className="text-white/50 hover:text-white transition-colors text-xs flex items-center gap-1"
              >
                Clear all
              </button>
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              <AnimatePresence>
                {comparedProperties.map((property) => (
                  <motion.div 
                    key={property.id}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="relative group flex-shrink-0"
                  >
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden border-2 border-white/20 group-hover:border-accent transition-colors">
                      <img 
                        src={property.images?.[0]} 
                        alt={property.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button 
                      onClick={() => removeFromCompare(property.id)}
                      className="absolute -top-1 -right-1 bg-red-500 text-white p-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <HiOutlineXMark className="w-3 h-3" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {/* Empty slots */}
              {Array.from({ length: 4 - comparedProperties.length }).map((_, i) => (
                <div 
                  key={`empty-${i}`}
                  className="w-16 h-16 md:w-20 md:h-20 rounded-2xl border-2 border-dashed border-white/10 flex items-center justify-center text-white/5"
                >
                  <span className="text-xl font-bold">+</span>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
            <button 
              onClick={() => navigate('/compare')}
              className="btn-primary w-full sm:w-auto px-8 flex items-center justify-center gap-2 whitespace-nowrap"
            >
              Compare Now
              <HiOutlineChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ComparisonDrawer;
