import { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { HiStar, HiMiniChatBubbleBottomCenterText } from 'react-icons/hi2';
import { getInitials } from '../utils/helpers';

const TestimonialCard = ({ testimonial, index = 0 }) => {
  const { name, review, message, rating, photo, photoUrl } = testimonial;
  const content = review || message;
  const image = photo || photoUrl;
  
  // 3D Tilt Values
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const mouseXSpring = useSpring(x, { damping: 40, stiffness: 400 });
  const mouseYSpring = useSpring(y, { damping: 40, stiffness: 400 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const xPct = (e.clientX - rect.left) / width - 0.5;
    const yPct = (e.clientY - rect.top) / height - 0.5;
    x.set(xPct);
    y.set(yPct);

    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 30 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ 
        duration: 1.2, 
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1]
      }}
      className="perspective-1000 h-full py-6" // Added padding for the floating bobbing
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{ 
          rotateX, 
          rotateY, 
          transformStyle: "preserve-3d" 
        }}
        animate={{
          y: [0, -10, 0], // Gentle bobbing
        }}
        transition={{
          y: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.5
          }
        }}
        className="relative bg-white/80 backdrop-blur-2xl p-10 rounded-[2.5rem] border-[3px] border-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_100px_-20px_rgba(37,99,235,0.2)] transition-all duration-500 h-full flex flex-col group overflow-hidden hover:border-accent/40"
      >
        {/* Shimmer Effect - More intense on hover */}
        <motion.div
          style={{
            background: useTransform(
              [mouseX, mouseY],
              ([latestX, latestY]) => 
                `radial-gradient(circle at ${latestX}px ${latestY}px, rgba(37,99,235,0.2) 0%, transparent 70%)`
            ),
          }}
          className="absolute inset-0 z-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />

        {/* Dynamic Background Glow */}
        <div className="absolute top-0 left-0 w-full h-full bg-accent/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Floating Quote Icon */}
        <div 
          style={{ transform: "translateZ(60px)" }}
          className="absolute top-8 right-8 text-accent/10 group-hover:text-accent/20 transition-colors duration-500"
        >
          <HiMiniChatBubbleBottomCenterText className="w-16 h-16" />
        </div>

        {/* Stars */}
        <div className="flex gap-1.5 mb-8 relative z-10" style={{ transform: "translateZ(40px)" }}>
          {[...Array(5)].map((_, i) => (
            <HiStar
              key={i}
              className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-200'} transition-transform duration-500 group-hover:scale-110`}
              style={{ transitionDelay: `${i * 50}ms` }}
            />
          ))}
        </div>

        {/* Review Content */}
        <div style={{ transform: "translateZ(30px)" }} className="relative z-10 flex-grow">
          <p className="text-gray-700 text-xl leading-relaxed italic font-medium font-[Outfit]">
            "{content}"
          </p>
        </div>

        {/* Author Section */}
        <div 
          style={{ transform: "translateZ(50px)" }} 
          className="flex items-center gap-5 pt-8 mt-10 border-t border-gray-100 relative z-10"
        >
          {image ? (
            <img
              src={image}
              alt={name}
              className="w-16 h-16 rounded-2xl object-cover ring-4 ring-white shadow-xl group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center text-white font-bold text-xl shadow-xl group-hover:scale-110 transition-transform duration-500">
              {getInitials(name)}
            </div>
          )}
          <div>
            <h4 className="font-bold text-primary text-lg font-[Outfit] group-hover:text-accent transition-colors duration-300">{name}</h4>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest pt-0.5">Verified Client</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TestimonialCard;
