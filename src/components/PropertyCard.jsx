/**
 * PropertyCard - Reusable property listing card
 * Features image, price badge, details, and hover animation
 */
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { IoBedOutline, IoWaterOutline, IoResizeOutline } from 'react-icons/io5';
import { HiOutlineMapPin, HiOutlineHeart, HiOutlineCheck, HiOutlineArrowsRightLeft, HiOutlineArrowRight } from 'react-icons/hi2';
import { formatPrice, formatArea } from '../utils/helpers';
import { useComparison } from '../context/ComparisonContext';
import toast from 'react-hot-toast';

const PropertyCard = ({ property, index = 0 }) => {
  const {
    id,
    title,
    price,
    city,
    area,
    type,
    bedrooms,
    bathrooms,
    areaSize,
    images,
    featured
  } = property;

  const { comparedProperties, addToCompare, removeFromCompare } = useComparison();
  const isCompared = comparedProperties.some(p => p.id === id);
  const imageUrl = images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600';



  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 1.2,
        delay: (index % 4) * 0.1,
        ease: [0.16, 1, 0.3, 1]
      }}
      className="h-full"
    >
      <Link
        to={`/properties/${id}`}
        className="block h-full group"
      >
        <motion.div
          whileHover={{
            y: -25,
            transition: { duration: 0.4, ease: "easeOut" }
          }}
          className="card h-full overflow-hidden transition-all duration-500 hover:shadow-[0_45px_100px_-20px_rgba(0,0,0,0.12)] hover:border-accent/40 relative bg-white rounded-2xl border border-gray-100"
        >
          {/* Image Container */}
          <div className="relative overflow-hidden h-56">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-1000"
              loading="lazy"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent transition-opacity duration-500 group-hover:opacity-85" />

            {/* Top Left: Featured Badge */}
            <div className="absolute top-2 left-2 z-10">
              {featured && (
                <span className="bg-orange-500 text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-md shadow-lg">
                  Featured
                </span>
              )}
            </div>

            {/* Top Right: Actions (Like & Compare) */}
            <div className="absolute top-4 right-4 z-10 flex flex-col items-center gap-4">
              {/* Like Button */}
              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toast.success('Saved to favorites!');
                }}
                className="text-white hover:text-red-500 drop-shadow-lg transition-colors duration-300"
              >
                <HiOutlineHeart className="w-6 h-6" />
              </motion.button>

              {/* Compare Button */}
              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  isCompared ? removeFromCompare(id) : addToCompare(property);
                }}
                className={`transition-colors duration-300 drop-shadow-lg ${isCompared ? 'text-accent' : 'text-white hover:text-accent'
                  }`}
                title={isCompared ? 'Remove from compare' : 'Add to compare'}
              >
                <motion.div
                  animate={isCompared ? { rotate: 360 } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <HiOutlineArrowsRightLeft className="w-5 h-5" />
                </motion.div>
              </motion.button>
            </div>
          </div>
          <div className="p-5">
            <span className="text-accent font-extrabold text-[1.15rem] font-[Outfit] block mb-2">
              {formatPrice(price)}
            </span>

            <h3 className="font-bold text-[16px] text-primary mb-1.5 line-clamp-1 font-[Outfit] tracking-tight">
              {title}
            </h3>
            <div className="flex items-center gap-1 text-gray-400 text-[11px] mb-4">
              <HiOutlineMapPin className="w-3.5 h-3.5 text-accent/50" />
              <span className="font-medium truncate">{area}, {city}</span>
            </div>

            {/* Stats Row */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-50/50">
              <div className="flex items-center gap-4">
                {bedrooms > 0 && (
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                    <IoBedOutline className="w-4 h-4 text-accent/70" />
                    <span>{bedrooms}</span>
                  </div>
                )}
                {bathrooms > 0 && (
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                    <IoWaterOutline className="w-4 h-4 text-accent/70" />
                    <span>{bathrooms}</span>
                  </div>
                )}
              </div>
              {areaSize > 0 && (
                <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                  <IoResizeOutline className="w-4 h-4 text-accent/70" />
                  <span>{formatArea(areaSize)}</span>
                </div>
              )}
            </div>

            {/* Footer with Divider and View Details - Hover only text */}
            <div className="mt-5 pt-4 border-t border-gray-50/80">
              <div className="flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 h-4 overflow-hidden">
                <span className="text-accent text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                  View Details <HiOutlineArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default PropertyCard;
