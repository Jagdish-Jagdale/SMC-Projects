/**
 * PropertyCard - Reusable property listing card
 * Features image, price badge, details, and hover animation
 */
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { IoBedOutline, IoWaterOutline, IoResizeOutline } from 'react-icons/io5';
import { HiOutlineMapPin, HiOutlineHeart, HiOutlineCheck } from 'react-icons/hi2';
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

  // 3D Tilt Values
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  
  // High-intensity 12-degree tilt for better visibility
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

  // Shimmer Effect Values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // For 3D Tilt
    const xPct = (e.clientX - rect.left) / width - 0.5;
    const yPct = (e.clientY - rect.top) / height - 0.5;
    x.set(xPct);
    y.set(yPct);

    // For Shimmer
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 1.2, 
        delay: (index % 3) * 0.15, 
        ease: [0.16, 1, 0.3, 1] 
      }}
      className="h-full"
    >
      <Link 
        to={`/properties/${id}`} 
        className="block h-full group perspective-1000"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div 
          style={{ 
            rotateX, 
            rotateY, 
            transformStyle: "preserve-3d" 
          }}
          className="card h-full overflow-hidden transition-all duration-500 group-hover:shadow-[0_40px_100px_-15px_rgba(37,99,235,0.25)] group-hover:border-accent/40 relative bg-white"
        >
          {/* Shimmer Effect */}
          <motion.div
            style={{
              background: useTransform(
                [mouseX, mouseY],
                ([latestX, latestY]) => 
                  `radial-gradient(circle at ${latestX}px ${latestY}px, rgba(255,255,255,0.4) 0%, transparent 80%)`
              ),
            }}
            className="absolute inset-0 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />

          {/* Image Container */}
          <div className="relative overflow-hidden h-64" style={{ transform: "translateZ(30px)" }}>
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              loading="lazy"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500 group-hover:opacity-90" />

            {/* Price Badge */}
            <div className="absolute bottom-6 left-6" style={{ transform: "translateZ(50px)" }}>
              <span className="bg-white/95 backdrop-blur-md text-primary font-extrabold text-xl px-5 py-2 rounded-xl shadow-xl block">
                {formatPrice(price)}
              </span>
            </div>

            {/* Top Left Badges */}
            <div className="absolute top-6 left-6 z-10 flex items-center gap-2" style={{ transform: "translateZ(40px)" }}>
              <div 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  isCompared ? removeFromCompare(id) : addToCompare(property);
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl backdrop-blur-md cursor-pointer transition-all duration-300 shadow-md ${
                  isCompared ? 'bg-accent text-white scale-105' : 'bg-white/80 text-primary hover:bg-white hover:scale-105'
                }`}
              >
                {isCompared ? <HiOutlineCheck className="w-4 h-4" /> : <div className="w-4 h-4 border-2 border-primary/20 rounded-md" />}
                <span className="text-[10px] font-bold uppercase tracking-[0.1em]">{isCompared ? 'Added' : 'Compare'}</span>
              </div>
              {featured && (
                <span className="bg-gold/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-[0.2em] px-3.5 py-2 rounded-xl shadow-lg">Featured</span>
              )}
            </div>

            {/* Favorite Button */}
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              style={{ transform: "translateZ(60px)" }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toast.success('Added to favorites!');
              }}
              className="absolute bottom-6 right-6 w-12 h-12 bg-white/90 backdrop-blur-md rounded-2xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all duration-300 text-gray-600 shadow-xl group/fav"
            >
              <HiOutlineHeart className="w-6 h-6 group-hover/fav:fill-white transition-all" />
            </motion.button>
          </div>

          {/* Content */}
          <div className="p-7" style={{ transform: "translateZ(20px)" }}>
            <h3 className="font-bold text-xl text-primary mb-3 line-clamp-1 group-hover:text-accent transition-colors duration-300 font-[Outfit]">
              {title}
            </h3>
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-6">
              <HiOutlineMapPin className="w-5 h-5 text-accent/70" />
              <span className="font-medium">{area}, {city}</span>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
              <div className="flex items-center gap-6">
                {bedrooms > 0 && (
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center gap-2 text-primary font-bold">
                      <IoBedOutline className="w-5 h-5 text-accent" />
                      <span>{bedrooms}</span>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Beds</span>
                  </div>
                )}
                {bathrooms > 0 && (
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center gap-2 text-primary font-bold">
                      <IoWaterOutline className="w-5 h-5 text-accent" />
                      <span>{bathrooms}</span>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Baths</span>
                  </div>
                )}
              </div>
              {areaSize > 0 && (
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-2 text-primary font-extrabold">
                    <IoResizeOutline className="w-5 h-5 text-accent" />
                    <span>{formatArea(areaSize)}</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Area</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default PropertyCard;
