import { motion, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import {
  HiOutlineWrenchScrewdriver,
  HiOutlineHomeModern,
  HiOutlineBuildingOffice2,
  HiOutlineSparkles,
} from 'react-icons/hi2';

const stats = [
  { value: '15+', label: 'Years of\nExperience' },
  { value: '200+', label: 'Projects\nCompleted' },
  { value: '12+', label: 'Cities\nServed' },
];

const miniServices = [
  { icon: HiOutlineWrenchScrewdriver, label: 'Contracting' },
  { icon: HiOutlineBuildingOffice2, label: 'Construction' },
  { icon: HiOutlineSparkles, label: 'Interiors' },
  { icon: HiOutlineHomeModern, label: 'Real Estate' },
];

const Counter = ({ value, duration = 2.5 }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  
  const targetNumber = parseInt(value) || 0;
  const suffix = value.replace(/[0-9]/g, '');

  useEffect(() => {
    if (inView) {
      let startTime;
      let animationFrame;

      const animateCounter = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
        
        // Use easeOutQuad for smooth landing
        const easeProgress = 1 - (1 - progress) * (1 - progress);
        const currentCount = Math.floor(easeProgress * targetNumber);
        
        setDisplayValue(currentCount);

        if (progress < 1) {
          animationFrame = requestAnimationFrame(animateCounter);
        }
      };

      animationFrame = requestAnimationFrame(animateCounter);
      return () => cancelAnimationFrame(animationFrame);
    }
  }, [inView, targetNumber, duration]);

  return (
    <span ref={ref}>
      {displayValue}
      {suffix}
    </span>
  );
};

const StatsExpertise = () => {
  return (
    <section className="py-8 relative overflow-hidden">
      <div className="container-custom relative z-10 flex flex-col items-center text-center">
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 md:gap-16 mb-12 w-full max-w-5xl">
          {stats.map((stat, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              className="flex items-center justify-center gap-3 relative"
            >
              {/* Vertical divider only visible on tablets and desktop */}
              {i > 0 && <div className="hidden sm:block absolute -left-5 md:-left-8 w-px h-12 bg-gray-200" />}
              
              <div className="flex flex-col items-center">
                <div
                  className="font-[Outfit,sans-serif] text-accent font-extrabold"
                  style={{ fontSize: 'clamp(2.5rem, 8vw, 3.5rem)' }}
                >
                  <Counter value={stat.value} />
                </div>
                <div className="text-[11px] md:text-[13px] text-gray-400 font-bold uppercase tracking-[0.15em] font-[Inter,sans-serif] whitespace-pre-line leading-tight mt-1">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-10 h-px bg-gray-100 w-full max-w-3xl"
        />

        {/* Mini Services / Expertise */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 w-full max-w-6xl"
        >
          {miniServices.map(({ icon: Icon, label }) => (
            <motion.div
              key={label}
              whileHover={{ y: -5, scale: 1.02 }}
              className="flex items-center justify-center gap-3 text-primary text-[12px] md:text-[15px] font-bold tracking-wide border border-gray-100 bg-white shadow-sm px-4 md:px-6 py-4 rounded-2xl hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300"
            >
              <Icon className="w-5 h-5 text-accent flex-shrink-0" />
              <span className="truncate">{label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Background Decorative Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
    </section>
  );
};

export default StatsExpertise;
