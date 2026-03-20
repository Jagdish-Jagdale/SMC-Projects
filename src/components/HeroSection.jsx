import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getBanners } from '../firebase/settings';
import {
  HiOutlineArrowRight,
  HiOutlineWrenchScrewdriver,
  HiOutlineHomeModern,
  HiOutlineBuildingOffice2,
  HiOutlineSparkles,
  HiOutlineArrowDown,
} from 'react-icons/hi2';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: '15+', label: 'Years of\nExperience' },
  { value: '200+', label: 'Projects\nCompleted' },
  { value: '12+', label: 'Cities\nServed' },
];

const services = [
  { icon: HiOutlineWrenchScrewdriver, label: 'Contracting' },
  { icon: HiOutlineBuildingOffice2, label: 'Construction' },
  { icon: HiOutlineSparkles, label: 'Interiors' },
  { icon: HiOutlineHomeModern, label: 'Real Estate' },
];

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
        3500
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
      className="relative w-full h-[500px] lg:h-[calc(100vh-80px)] mt-20 flex items-center overflow-hidden bg-black"
    >
      {/* ── Background Slider ── */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence>
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${banners[currentSlide]?.imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          />
        </AnimatePresence>

        {/* Multi-layer overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />
      </div>

      {/* ── Slide Dots ── */}
      {banners.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
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
      <div className="relative z-10 w-full px-4 sm:px-12 lg:px-20 xl:px-28 py-10 lg:py-0">
        <div className="max-w-3xl">

          {/* Eyebrow line */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="w-10 h-[2px] bg-accent" />
            <span className="text-accent text-[11px] font-semibold tracking-[0.3em] uppercase font-[Inter,sans-serif]">
              Trusted Construction &amp; EPC Partner
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.15 }}
            className="font-[Outfit,sans-serif] text-white leading-[1.1] tracking-tight"
            style={{ fontSize: 'clamp(1.5rem, 9vw, 3.75rem)', fontWeight: 800 }}
          >
            Pune &amp; Pan India's
            <span className="block text-accent mt-1">
              Premier EPC Partner
            </span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="mt-4 text-[12px] sm:text-base text-white/65 max-w-xl leading-[1.7] font-[Inter,sans-serif] font-light tracking-wide"
          >
            Delivering end-to-end construction, infrastructure, and real estate solutions with
            precision, integrity, and unmatched expertise since 2009.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.5 }}
            className="mt-9 flex flex-wrap gap-4"
          >
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2.5 bg-accent hover:bg-accent-dark text-white font-semibold text-[13px] tracking-wide px-7 py-3 rounded transition-all duration-300 hover:shadow-xl hover:shadow-accent/30 hover:gap-4"
            >
              Partner with Us
              <HiOutlineArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 border border-white/30 hover:border-white/70 text-white/85 hover:text-white font-medium text-[13px] tracking-wide px-7 py-3 rounded bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
            >
              Request a Quote
            </Link>
          </motion.div>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.65 }}
            className="mt-10 mb-8 h-px bg-white/10 max-w-lg origin-left"
          />

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.72 }}
            className="flex flex-wrap gap-8"
          >
            {stats.map((stat, i) => (
              <div key={i} className="flex items-center gap-3">
                {i > 0 && <div className="w-px h-8 bg-white/15" />}
                <div>
                  <div
                    className="font-[Outfit,sans-serif] text-accent font-extrabold"
                    style={{ fontSize: 'clamp(1.1rem, 7vw, 2rem)' }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-[9px] text-white/45 uppercase tracking-[0.15em] font-[Inter,sans-serif] whitespace-pre-line leading-tight mt-0.5">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Mini Services */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.85 }}
            className="mt-8 flex flex-wrap gap-2.5"
          >
            {services.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="inline-flex items-center gap-2 text-white/70 text-[11px] font-medium tracking-wide border border-white/10 bg-white/5 backdrop-blur-sm px-4 py-2 rounded hover:bg-white/10 hover:border-accent/30 hover:text-white transition-all duration-300"
              >
                <Icon className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                {label}
              </div>
            ))}
          </motion.div>

          {/* CTA Repetition — Scroll indicator style */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="mt-8 pt-6 border-t border-white/10"
          >
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors duration-300"
            >
              <span className="text-[11px] font-medium tracking-[0.2em] uppercase font-[Outfit,sans-serif]">
                Start Your Project
              </span>
              <HiOutlineArrowDown className="w-4 h-4 animate-bounce" />
            </Link>
          </motion.div>

        </div>
      </div>

    </section>
  );
};

export default HeroSection;
