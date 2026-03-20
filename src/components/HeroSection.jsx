import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getBanners } from '../firebase/settings';
import { Helmet } from 'react-helmet-async';
import {
  HiOutlineArrowRight,
  HiOutlineWrenchScrewdriver,
  HiOutlineHomeModern,
  HiOutlineBuildingOffice2,
  HiOutlineSparkles,
  HiOutlineArrowDown,
} from 'react-icons/hi2';

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const heroRef = useRef(null);
  const [banners, setBanners] = useState([
    { imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000' }
  ]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { scrollY } = useScroll();

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const data = await getBanners();
        const activeBanners = (data || [])
          .filter(b => b.active !== false)
          .sort((a, b) => a.order - b.order);

        if (activeBanners.length > 0) {
          setBanners(activeBanners);
        }
      } catch (error) {
        console.error("Error fetching banners:", error);
      }
    };
    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(
        () => setCurrentSlide(prev => (prev + 1) % banners.length),
        2000
      );
      return () => clearInterval(interval);
    }
  }, [banners.length]);

  useEffect(() => {
    const ctx = gsap.context(() => { }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative w-full min-h-[100vh] lg:min-h-0 lg:h-[calc(100vh-80px)] mt-20 flex items-center overflow-hidden bg-black"
    >
      <Helmet>
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://firebasestorage.googleapis.com" />
        {banners[0]?.imageUrl && (
          <link rel="preload" as="image" href={banners[0].imageUrl} fetchPriority="high" />
        )}
      </Helmet>

      {/* Hidden eager-loaded image to force high-priority fetch of current slide */}
      <div className="sr-only">
        {banners.map((banner, index) => (
          <img
            key={`preload-${index}`}
            src={banner.imageUrl}
            loading={index === 0 ? "eager" : "lazy"}
            fetchPriority={index === 0 ? "high" : "low"}
            aria-hidden="true"
            alt=""
          />
        ))}
      </div>

      {/* ── Background Slider ── */}
      <div className="absolute inset-0 z-0">
        {banners.map((banner, index) => (
          <motion.div
            key={index}
            initial={false}
            animate={{
              opacity: index === currentSlide ? 1 : 0,
              zIndex: index === currentSlide ? 10 : 0
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${banner.imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          />
        ))}

        {/* Subtle Overlay — improves readability without hiding imagery */}
        <div className="absolute inset-0 bg-black/60 z-0" />
      </div>

      {/* ── Slide Dots ── */}
      {banners.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`transition-all duration-300 rounded-full ${i === currentSlide ? 'w-8 h-1.5 bg-accent' : 'w-2 h-1.5 bg-white/30'
                }`}
            />
          ))}
        </div>
      )}

      {/* ── Content ── */}
      <div className="relative z-10 w-full px-6 sm:px-12 lg:px-20 xl:px-28 h-full flex flex-col items-center justify-center text-center py-24">
        <div className="max-w-4xl flex flex-col items-center">


          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2 sm:gap-3 mt-4 mb-6"
          >
            <div className="hidden sm:block w-6 md:w-10 h-[2px] bg-accent" />
            <span className="text-accent text-[9px] sm:text-[11px] font-semibold tracking-[0.2em] sm:tracking-[0.3em] uppercase font-[Inter,sans-serif]">
              SMC Projects Pvt. Ltd.
            </span>
            <div className="hidden sm:block w-6 md:w-10 h-[2px] bg-accent" />
          </motion.div>
          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.15 }}
            className="font-[Outfit,sans-serif] text-white leading-[1.1] tracking-tight text-center px-3"
            style={{ fontWeight: 800, textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}
          >
            <span className="block text-[1.2rem] sm:text-[2.00rem] lg:text-[2.75rem] font-bold opacity-90 mb-1 mt-4">
              Trusted Construction & EPC Partner
            </span>
            <span className="block text-accent text-[1.5rem] sm:text-[2.25rem] lg:text-[2.25rem] font-extrabold tracking-tight">
              – Pune & Pan India
            </span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="mt-6 text-[13px] sm:text-base text-white max-w-xl leading-[1.7] font-[Inter,sans-serif] font-semibold tracking-wide text-center px-4 mt-3"
            style={{ textShadow: '0 1px 6px rgba(0,0,0,0.4)' }}
          >
            Delivering end-to-end construction, infrastructure, and real estate solutions with
            precision, integrity, and unmatched expertise since 2009.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.5 }}
            className="mt-10 flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto px-6 sm:px-0"
          >
            <Link
              to="/contact"
              className="group flex items-center justify-center gap-2.5 bg-accent hover:bg-accent-dark text-white font-semibold text-[14px] tracking-wide px-8 py-4 rounded transition-all duration-300 hover:shadow-xl hover:shadow-accent/30 hover:gap-4"
            >
              Partner with Us
              <HiOutlineArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              to="/contact"
              className="flex items-center justify-center gap-2 border border-white/30 hover:border-white/70 text-white/85 hover:text-white font-medium text-[14px] tracking-wide px-8 py-4 rounded bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
            >
              Request a Quote
            </Link>
          </motion.div>

        </div>
      </div>

      {/* ── Scroll Indicator (Absolute bottom) ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center"
      >
        <Link
          to="/contact"
          className="group flex flex-col items-center gap-3 text-white/40 hover:text-white transition-colors duration-300"
        >
          <div className="w-5 h-8 border-2 border-white/30 rounded-full relative">
            <motion.div
              animate={{ y: [4, 14, 4], opacity: [1, 0, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 h-1.5 bg-accent rounded-full absolute top-1.5 left-1/2 -translate-x-1/2"
            />
          </div>
          <span className="text-[9px] font-bold tracking-[0.35em] uppercase font-[Outfit,sans-serif]">
            Start Your Project
          </span>
        </Link>
      </motion.div>



    </section>
  );
};

export default HeroSection;
