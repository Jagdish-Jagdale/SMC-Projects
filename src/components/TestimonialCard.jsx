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
    <div className="h-full py-2">
      <div className="relative bg-white p-6 rounded-lg border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-md h-full flex flex-col overflow-hidden">
        {/* Elegant Circular Quote - Top Right */}
        <div className="absolute top-4 right-5 w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center text-accent/80 transition-colors duration-300 group-hover:bg-accent/20">
          <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="20" width="20" xmlns="http://www.w3.org/2000/svg">
            <path d="M464 256h-80v-64c0-35.3 28.7-64 64-64h16V64h-16c-70.7 0-128 57.3-128 128v192h144V256zM272 256h-80v-64c0-35.3 28.7-64 64-64h16V64h-16c-70.7 0-128 57.3-128 128v192h144V256z"></path>
          </svg>
        </div>

        {/* Header - Avatar and Name */}
        <div className="flex items-center gap-3 mb-3 relative z-10">
          {image ? (
            <img
              src={image}
              alt={name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-bold text-sm">
              {getInitials(name)}
            </div>
          )}
          <div className="flex flex-col">
            <span className="font-semibold text-[#3c4043] text-[15px]">{name}</span>
          </div>
        </div>

        {/* Stars - Google Style */}
        <div className="flex gap-0.5 mb-2.5 relative z-10">
          {[...Array(5)].map((_, i) => (
            <HiStar
              key={i}
              className={`w-4 h-4 ${i < rating ? 'text-[#f8b80e]' : 'text-gray-200'}`}
            />
          ))}
        </div>

        {/* Review Content - Clean Sans-serif */}
        <div className="flex-grow relative z-10">
          <p className="text-[#3c4043] text-[14px] leading-relaxed font-normal font-[Roboto,sans-serif] px-1">
            {content}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
