/**
 * ProjectCard - Reusable project card component
 */
import { motion } from 'framer-motion';
import { HiOutlineMapPin } from 'react-icons/hi2';
import { getStatusColor } from '../utils/helpers';

const ProjectCard = ({ project, index = 0 }) => {
  const { name, location, status, category, description, images } = project;
  const imageUrl = images?.[0] || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.8, 
        delay: index % 3 * 0.1, 
        ease: [0.22, 1, 0.36, 1] 
      }}
      className="card group cursor-pointer"
    >
      {/* Image */}
      <div className="relative overflow-hidden h-52">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        
        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <span className={`badge ${getStatusColor(status)}`}>
            {status}
          </span>
        </div>

        {/* Category Badge */}
        <div className="absolute bottom-4 left-4">
          <span className="bg-white/90 backdrop-blur-sm text-primary text-xs font-semibold px-3 py-1 rounded-full">
            {category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-semibold text-lg text-primary mb-2 font-[Outfit] group-hover:text-accent transition-colors">
          {name}
        </h3>
        <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
          <HiOutlineMapPin className="w-4 h-4 text-accent" />
          <span>{location}</span>
        </div>
        <p className="text-gray-500 text-sm line-clamp-2">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
