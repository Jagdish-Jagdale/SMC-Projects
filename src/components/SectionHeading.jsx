/**
 * SectionHeading - Reusable section title component
 */
import { motion } from 'framer-motion';

const SectionHeading = ({ subtitle, title, description, center = true, light = false }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className={`mb-16 ${center ? 'text-center' : ''}`}
    >
      {subtitle && (
        <motion.span 
          variants={itemVariants}
          className="inline-block text-accent font-semibold text-xs uppercase tracking-[0.2em] mb-4 bg-accent/5 px-4 py-1.5 rounded-full"
        >
          {subtitle}
        </motion.span>
      )}
      <motion.h2 
        variants={itemVariants}
        className={`text-3xl md:text-5xl font-bold font-[Outfit] mb-6 leading-tight ${light ? 'text-white' : 'text-primary'}`}
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p 
          variants={itemVariants}
          className={`max-w-2xl text-lg leading-relaxed ${center ? 'mx-auto' : ''} ${light ? 'text-gray-300/90' : 'text-gray-500'}`}
        >
          {description}
        </motion.p>
      )}
    </motion.div>
  );
};

export default SectionHeading;
