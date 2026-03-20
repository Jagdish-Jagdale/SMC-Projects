/**
 * Home Page
 * Main landing page with hero, featured properties, services preview,
 * testimonials, stats, and CTA sections
 */
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { sampleProperties, sampleTestimonials, services } from '../utils/sampleData';
import {
  HiOutlineBuildingOffice2,
  HiOutlineHome,
  HiOutlineBuildingStorefront,
  HiOutlineMap,
  HiOutlineCog6Tooth,
  HiOutlinePaintBrush,
  HiOutlineArrowRight,
  HiOutlineClock,
  HiOutlineCpuChip,
  HiOutlineGlobeAlt,
  HiOutlineKey,
  HiOutlineDocumentArrowDown,
  HiOutlinePhone,
  HiOutlineEnvelope,
  HiOutlineMapPin,
  HiOutlineChatBubbleLeftRight,
  HiOutlineShieldCheck,
  HiOutlineGlobeAmericas,
  HiOutlineBanknotes
} from 'react-icons/hi2';
import HeroSection from '../components/HeroSection';
import StatsExpertise from '../components/StatsExpertise';
import SectionHeading from '../components/SectionHeading';
import PropertyCard from '../components/PropertyCard';
import TestimonialCard from '../components/TestimonialCard';
import { getProperties } from '../firebase/properties';
import { getTestimonials } from '../firebase/testimonials';
import { getProjects } from '../firebase/projects';

gsap.registerPlugin(ScrollTrigger);

const iconMap = {
  'HiOutlineBuildingOffice2': HiOutlineBuildingOffice2,
  'HiOutlineCog6Tooth': HiOutlineCog6Tooth,
  'HiOutlineBuildingStorefront': HiOutlineBuildingStorefront,
  'HiOutlineHome': HiOutlineHome,
  'HiOutlinePaintBrush': HiOutlinePaintBrush,
  'HiOutlineMap': HiOutlineMap,
  'HiOutlineChartBar': HiOutlineBuildingOffice2
};

const ServiceCard = ({ service, index }) => {
  const Icon = iconMap[service.icon] || HiOutlineBuildingOffice2;
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      className="perspective-2000 h-[400px] cursor-pointer"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.8, type: "spring", damping: 20, stiffness: 100 }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative w-full h-full"
      >
        {/* FRONT FACE */}
        <div
          className="absolute inset-0 w-full h-full bg-white rounded-[1rem] p-8 flex flex-col items-center text-center shadow-xl border-[3px] border-gray-100 group transition-all duration-500 hover:border-accent/40 overflow-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* Subtle Background Glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-[1rem] -mr-16 -mt-16 blur-3xl group-hover:bg-accent/10 transition-colors" />

          <div className="w-20 h-20 rounded-[2rem] bg-bg flex items-center justify-center mb-6 border-2 border-gray-100 shadow-lg group-hover:bg-accent group-hover:shadow-accent/40 group-hover:-translate-y-2 transition-all duration-500">
            <Icon className="w-9 h-9 text-accent group-hover:text-white transition-all duration-500" />
          </div>

          <h3 className="font-bold text-primary text-2xl mb-3 font-[Outfit]">
            {service.title}
          </h3>

          <p className="text-gray-500 text-base leading-relaxed font-medium line-clamp-3">
            {service.description}
          </p>

          <div className="mt-auto pt-4 flex items-center gap-2 text-accent font-bold text-sm uppercase tracking-wider">
            <span>Hover to Reveal</span>
            <HiOutlineArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* BACK FACE */}
        <div
          className="absolute inset-0 w-full h-full rounded-[1rem] overflow-hidden shadow-2xl bg-primary"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)"
          }}
        >
          {service.dummyImage && (
            <img
              src={service.dummyImage}
              alt={service.title}
              className="w-full h-full object-cover opacity-60"
              onError={(e) => e.target.style.display = 'none'}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col items-center justify-end p-8 text-center">
            <h3 className="text-white font-bold text-2xl mb-3 font-[Outfit]">
              {service.title}
            </h3>
            <p className="text-white/80 text-sm font-medium mb-6">
              Expert solutions tailored for your business and personal construction needs.
            </p>
            <button className="bg-white text-primary font-bold px-8 py-3 rounded-lg hover:bg-accent hover:text-white transition-all duration-300 shadow-lg">
              Learn More
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Home = () => {
  const servicesRef = useRef(null);
  const ctaRef = useRef(null);
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [activeUSP, setActiveUSP] = useState(0);
  const { scrollYProgress } = useScroll();

  // Detection for Why Choose Us focal point
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-cycle Why Choose Us USPs - Synced with physical rotation
  useEffect(() => {
    const interval = setInterval(() => {
      // 7 nodes, 70s total rotation (10s per node)
      // Moving forwards/backwards synced with physical spin
      setActiveUSP((prev) => (prev - 1 + 7) % 7);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchLiveContent = async () => {
      try {
        const [props, reviews, projects] = await Promise.all([
          getProperties({ featured: true, limit: 3 }),
          getTestimonials(),
          getProjects()
        ]);
        if (props?.length > 0) setFeaturedProperties(props);
        else setFeaturedProperties(sampleProperties.filter(p => p.featured).slice(0, 3));

        if (reviews?.length > 0) setTestimonials(reviews.slice(0, 3));
        else setTestimonials(sampleTestimonials);

        const activeFeaturedProjects = (projects || []).filter(proj => proj.featured).slice(0, 3);
        setFeaturedProjects(activeFeaturedProjects);
      } catch (error) {
        setFeaturedProperties(sampleProperties.filter(p => p.featured).slice(0, 3));
        setTestimonials(sampleTestimonials);
      }
    };
    fetchLiveContent();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // CTA section animation
      gsap.fromTo(ctaRef.current, {
        opacity: 0,
        y: 60,
        scale: 0.95
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: ctaRef.current,
          start: 'top 90%'
        }
      });
    });

    return () => ctx.revert();
  }, []);

  const serviceContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const serviceItemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  return (
    <>
      {/* Hero Section */}
      <HeroSection />

      {/* Stats and Expertise Section */}
      <div className="bg-bg">
        <StatsExpertise />
      </div>



      {/* Services Preview Section */}
      <section className="py-16 bg-white" ref={servicesRef}>
        <div className="container-custom">
          {/* Custom Header with Centered Subtitle and Action Row */}
          <div className="mb-12">
            <div className="text-center mb-10">
              <span className="inline-block text-accent font-semibold text-xs uppercase tracking-[0.2em] mb-0 bg-accent/5 px-4 py-1.5 rounded-full">
                Our Services
              </span>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4">
              <h2 className="text-3xl md:text-5xl font-bold font-[Outfit] leading-tight text-primary">
                Comprehensive Construction Solutions
              </h2>
              <div className="shrink-0">
                <Link
                  to="/services"
                  className="btn-primary !py-3 !px-7 !text-sm inline-flex items-center gap-2 group whitespace-nowrap shadow-lg shadow-accent/20"
                >
                  Explore All Services
                  <HiOutlineArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
            <p className="text-lg leading-relaxed text-gray-500 max-w-2xl">
              From concept to completion, we deliver end-to-end construction and real estate services.
            </p>
            <hr className="mt-5 border-gray-100" />
          </div>

          <motion.div
            variants={serviceContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {services.slice(0, 4).map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-16 bg-bg">
        <div className="container-custom">
          {/* Custom Header with Centered Subtitle and Action Row */}
          <div className="mb-12">
            <div className="text-center mb-10">
              <span className="inline-block text-accent font-semibold text-xs uppercase tracking-[0.2em] mb-0 bg-accent/5 px-4 py-1.5 rounded-full">
                Featured Properties
              </span>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4">
              <h2 className="text-3xl md:text-5xl font-bold font-[Outfit] leading-tight text-primary">
                Handpicked Premium Properties
              </h2>
              <div className="shrink-0">
                <Link
                  to="/properties"
                  className="btn-primary !py-3 !px-7 !text-sm inline-flex items-center gap-2 group whitespace-nowrap shadow-lg shadow-accent/20"
                >
                  View All Properties
                  <HiOutlineArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
            <p className="text-lg leading-relaxed text-gray-500 max-w-2xl">
              Explore our curated selection of the finest residential and commercial properties across Pune.
            </p>
            <hr className="mt-5 border-gray-100" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProperties.map((property, index) => (
              <PropertyCard key={property.id} property={property} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      {featuredProjects.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container-custom">
            {/* Custom Header with Centered Subtitle and Left-aligned Title */}
            <div className="mb-12">
              <div className="text-center mb-10">
                <span className="inline-block text-accent font-semibold text-xs uppercase tracking-[0.2em] mb-0 bg-accent/5 px-4 py-1.5 rounded-full">
                  Major Projects
                </span>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4">
                <h2 className="text-3xl md:text-5xl font-bold font-[Outfit] leading-tight text-primary">
                  State-of-the-Art Developments
                </h2>
              </div>
              <p className="text-lg leading-relaxed text-gray-500 max-w-2xl">
                Discover our landmark projects that redefine modern living and commercial spaces.
              </p>
              <hr className="mt-10 border-gray-100" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {featuredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.9, y: 40 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{
                    duration: 1,
                    delay: index * 0.15,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  whileHover={{ y: -10 }}
                  viewport={{ once: true }}
                  className="card group overflow-hidden border-transparent hover:border-accent/20 hover:shadow-2xl transition-all duration-500"
                >
                  <div className="h-72 relative overflow-hidden">
                    {project.images?.[0] ? (
                      <img src={project.images[0]} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                    ) : (
                      <div className="w-full h-full bg-primary/5 flex items-center justify-center text-primary/20"><HiOutlineBuildingOffice2 className="w-20 h-20" /></div>
                    )}
                    <div className="absolute top-6 left-6 bg-accent text-white text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-2 rounded-xl shadow-lg">
                      {project.status}
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-primary mb-3 font-[Outfit] group-hover:text-accent transition-colors">{project.title}</h3>
                    <p className="text-gray-500 text-sm line-clamp-2 mb-6 leading-relaxed">{project.description}</p>
                    <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                      <span className="text-xs font-bold text-accent uppercase tracking-widest bg-accent/5 px-3 py-1 rounded-lg">{project.type}</span>
                      <Link to={`/projects`} className="text-primary font-bold text-sm flex items-center gap-2 group/btn">
                        Explore Project <HiOutlineArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}



      {/* Client Brands Logo Marquee - Moved before Testimonials */}
      <section className="pt-12 pb-24 overflow-hidden relative group/marquee">
        {/* Parallax Background - Stable Colorful Background */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div
            className="w-full h-full bg-cover bg-center bg-no-repeat brightness-[0.45] contrast-[1.1]"
            style={{
              backgroundImage: 'url("/partners-bg.png")',
              backgroundAttachment: 'fixed'
            }}
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Gradient Edge Masks (Adjusted for Dark Background) */}
        <div className="absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-black/60 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-48 bg-gradient-to-l from-black/60 to-transparent z-10 pointer-events-none" />

        <div className="relative z-10 w-full px-0">
          <div className="flex justify-center mb-20 text-center">
            <span className="bg-white/5 px-4 py-1.5 rounded-full border border-white/10 shadow-2xl backdrop-blur-md">
              <span className="bg-gradient-to-r from-accent via-white to-accent bg-clip-text text-transparent text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase">
                Strategic Partners & Trusted By
              </span>
            </span>
          </div>

          <div className="flex w-full overflow-hidden">
            <style>
              {`
                @keyframes slide-h {
                  from { transform: translateX(0); }
                  to { transform: translateX(-50%); }
                }
                .logo-track-h {
                  display: flex;
                  gap: 120px;
                  width: max-content;
                  animation: slide-h 40s linear infinite;
                }
                .group\\/marquee:hover .logo-track-h {
                  animation-play-state: paused;
                }
              `}
            </style>

            <div className="logo-track-h">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex items-center gap-32">
                  {[
                    { name: 'Tata Projects', icon: HiOutlineBuildingOffice2 },
                    { name: 'Godrej Properties', icon: HiOutlineHome },
                    { name: 'L&T Realty', icon: HiOutlineBuildingStorefront },
                    { name: 'Mahindra Life', icon: HiOutlineMap },
                    { name: 'Shapoorji', icon: HiOutlineCog6Tooth },
                    { name: 'Kalpataru Group', icon: HiOutlinePaintBrush },
                    { name: 'Puravankara', icon: HiOutlineBuildingOffice2 }
                  ].map((brand, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-6 text-2xl font-bold text-white/90 font-[Outfit] hover:text-accent transition-all duration-500 cursor-pointer select-none group/logo"
                    >
                      <brand.icon className="w-8 h-8 opacity-70 group-hover/logo:opacity-100 group-hover/logo:text-accent transition-all" />
                      <span>{brand.name}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 relative overflow-hidden bg-[#fafafa]">
        {/* Decorative Background Pattern */}
        <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
          <img
            src="/testimonials-bg.png"
            alt="Testimonials Pattern"
            className="w-full h-full object-cover object-center"
          />
        </div>

        <div className="container-custom relative z-10">
          {/* Custom Header with Centered Subtitle and Left-aligned Title */}
          <div className="mb-12">
            <div className="text-center mb-10">
              <span className="inline-block text-accent font-semibold text-xs uppercase tracking-[0.2em] mb-0 bg-accent/5 px-4 py-1.5 rounded-full">
                Testimonials
              </span>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4">
              <h2 className="text-3xl md:text-5xl font-bold font-[Outfit] leading-tight text-primary">
                What Our Clients Say
              </h2>
            </div>
            <p className="text-lg leading-relaxed text-gray-500 max-w-2xl">
              Hear from our satisfied clients about their experience working with us.
            </p>
            <hr className="mt-5 border-gray-100" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={testimonial.id || index} testimonial={testimonial} index={index} />
            ))}
          </div>
        </div>
      </section>


      {/* Dynamic Orbital Why Choose Us Section */}
      <section className="pt-20 pb-0 lg:py-28 bg-[#fafafa] overflow-hidden">
        <div className="container-custom">
          {/* Section Badge */}
          <div className="flex justify-center mb-10 lg:mb-20 text-center">
            <div className="px-4 py-1.5 rounded-full bg-accent/[0.03] border border-accent/10 backdrop-blur-sm">
              <span className="text-accent font-black text-[10px] md:text-xs uppercase tracking-[0.2em]">
                Why Choose Us
              </span>
            </div>
          </div>

          {/* Flex Column-Reverse for Mobile (Information Top, Orbital Bottom) */}
          <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-4 lg:gap-40">

            {/* Orbital Cluster Section - Bottom Focused on Mobile */}
            <div className="lg:w-1/2 relative h-[350px] md:h-[500px] lg:h-[600px] w-full flex items-center justify-center scale-[1] md:scale-90 lg:scale-100 translate-y-24 md:translate-y-10 lg:translate-y-0">
              {/* Decorative Orbital Rings */}
              <div className="absolute w-[280px] h-[280px] md:w-[320px] md:h-[320px] border border-accent/10 rounded-full border-dashed" />
              <div className="absolute w-[400px] h-[400px] md:w-[460px] md:h-[460px] border border-gray-100 rounded-full border-dotted" />

              {/* Central Identity Core */}
              <div className="relative z-20 w-24 h-24 md:w-32 md:h-32 rounded-full bg-white shadow-xl flex items-center justify-center p-4 md:p-6 text-center border-4 border-accent/20">
                <span className="text-primary font-black font-[Outfit] text-xs md:text-sm uppercase tracking-widest leading-tight">
                  Why <br /> Choose Us
                </span>
              </div>

              {/* Orbital Container - Clockwise rotation */}
              <motion.div
                className="absolute inset-0 z-10"
                animate={{ rotate: 360 }}
                transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
              >
                {[
                  { id: 0, title: "Turnkey Solutions", icon: HiOutlineKey },
                  { id: 1, title: "On-Time Delivery", icon: HiOutlineClock },
                  { id: 2, title: "Technical Expertise", icon: HiOutlineCpuChip },
                  { id: 3, title: "National Coverage", icon: HiOutlineGlobeAlt },
                  { id: 4, title: "Safety First", icon: HiOutlineShieldCheck },
                  { id: 5, title: "Sustainability", icon: HiOutlineGlobeAmericas },
                  { id: 6, title: "Cost Optimization", icon: HiOutlineBanknotes }
                ].map((node) => {
                  // Responsive Focal Point: 12 o'clock (0) for Mobile, 3 o'clock (90) for Desktop
                  const focalOffset = isMobile ? 0 : 90;
                  const radius = 40;
                  const angle = (node.id * (360 / 7) + focalOffset) * (Math.PI / 180);
                  const x = 50 + radius * Math.sin(angle);
                  const y = 50 - radius * Math.cos(angle);

                  return (
                    <div
                      key={node.id}
                      className="absolute -translate-x-1/2 -translate-y-1/2"
                      style={{ top: `${y}%`, left: `${x}%` }}
                    >
                      <motion.div
                        className="cursor-pointer"
                        onClick={() => setActiveUSP(node.id)}
                        onMouseEnter={() => setActiveUSP(node.id)}
                        animate={{ rotate: -360, scale: activeUSP === node.id ? 1.1 : 0.85 }}
                        transition={{
                          rotate: { duration: 70, repeat: Infinity, ease: "linear" },
                          scale: { duration: 0.3 }
                        }}
                      >
                        <div className={`w-32 h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-full bg-white shadow-2xl flex flex-col items-center justify-center p-4 border-2 transition-all duration-700 ${activeUSP === node.id ? 'border-accent ring-8 ring-accent/5 z-20' : 'border-transparent opacity-60'}`}>
                          <node.icon className={`w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 mb-3 transition-colors duration-500 ${activeUSP === node.id ? 'text-accent' : 'text-primary/40'}`} />
                          <span className={`text-[8px] md:text-[9px] lg:text-[10px] font-extrabold text-center uppercase tracking-tighter leading-tight transition-colors duration-500 ${activeUSP === node.id ? 'text-primary' : 'text-gray-400'}`}>
                            {node.title}
                          </span>
                        </div>
                      </motion.div>
                    </div>
                  );
                })}
              </motion.div>
            </div>

            {/* Information Side - Top focused on Mobile */}
            <div className="lg:w-1/2 px-6 lg:px-0 text-center lg:text-left">
              <div className="max-w-xl mx-auto lg:mx-0">
                <motion.div
                  key={activeUSP}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-center justify-center lg:justify-start gap-4 mb-6">
                    <div className="w-12 h-[2px] bg-accent" />
                    <span className="text-accent font-bold text-[10px] md:text-xs uppercase tracking-[0.3em]">
                      Precision & Partnership
                    </span>
                  </div>

                  <h2 className="text-3xl md:text-5xl lg:text-6xl font-black font-[Outfit] text-primary mb-6 lg:mb-8 leading-tight">
                    {[
                      "Turnkey Solutions",
                      "On-Time Delivery",
                      "Technical Expertise",
                      "National Coverage",
                      "Safety First",
                      "Sustainability",
                      "Cost Optimization"
                    ][activeUSP]}
                  </h2>

                  <p className="text-gray-500 text-sm md:text-lg lg:text-xl leading-relaxed mb-4 lg:mb-12 font-medium px-4 lg:px-0">
                    {[
                      "End-to-end management from concept to completion, ensuring architectural and technical precision across your entire project landscape.",
                      "Respecting project timelines as strictly as structural integrity, delivering elite architectural results with zero-delay precision.",
                      "Engineered with elite talent and BIM technologies, solving vertical and industrial structural challenges with modern safety standards.",
                      "Strategic operational reach across India's key corridors, ensuring international-standard quality in every hub and project site.",
                      "Uncompromising safety protocols at every site, ensuring a secure environment for our workforce and project stakeholders with zero-harm goals.",
                      "Integrating eco-friendly materials and energy-efficient building practices to create modern infrastructure that respects the environment.",
                      "Strategic procurement and efficient resource management to deliver premium architectural excellence within optimal budget parameters."
                    ][activeUSP]}
                  </p>

                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-4 py-3 md:py-4 px-8 md:px-10 bg-primary text-white rounded-full font-bold text-[10px] md:text-sm tracking-widest uppercase hover:bg-accent transition-all duration-500 group shadow-2xl shadow-primary/20"
                  >
                    View Capability
                    <HiOutlineArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </Link>
                </motion.div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Contact & Partnership Form Section */}
      <section className="py-24 bg-white">
        <div className="container-custom">
          {/* Section Badge */}
          <div className="flex justify-center mb-16 lg:mb-20 text-center">
            <div className="px-4 py-1.5 rounded-full bg-accent/[0.03] border border-accent/10 backdrop-blur-sm">
              <span className="text-accent font-black text-[10px] md:text-xs uppercase tracking-[0.2em]">
                Contact Us
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Form Side */}
            <div className="bg-gray-50 p-8 md:p-12 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl" />

              <div className="relative z-10">
                <h2 className="text-3xl font-bold font-[Outfit] text-primary mb-2">Project Inquiry</h2>
                <p className="text-gray-500 mb-8">Discuss your vision with our expert engineering team.</p>

                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                      <input type="text" placeholder="John Doe" className="w-full bg-white border border-gray-200 rounded-xl px-5 py-3.5 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Company</label>
                      <input type="text" placeholder="Your Business Ltd." className="w-full bg-white border border-gray-200 rounded-xl px-5 py-3.5 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Project Type</label>
                      <select className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all">
                        <option>Industrial Construction</option>
                        <option>Real Estate Development</option>
                        <option>Consultancy Services</option>
                        <option>Turnkey Projects</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Location</label>
                      <input type="text" placeholder="City / Region" className="w-full bg-white border border-gray-200 rounded-xl px-5 py-3.5 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Contact Reference (Email/Phone)</label>
                    <input type="text" placeholder="email@example.com / +91..." className="w-full bg-white border border-gray-200 rounded-xl px-5 py-3.5 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all" />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button type="submit" className="flex-1 btn-primary py-4 px-8 rounded-xl flex items-center justify-center gap-2 group shadow-lg shadow-primary/10 transition-all hover:shadow-primary/20">
                      <span>Submit Inquiry</span>
                      <HiOutlineArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button type="button" className="flex-1 btn-secondary py-4 px-8 rounded-xl flex items-center justify-center gap-2 border-2 border-primary/5 hover:bg-primary/5 transition-all">
                      <HiOutlineDocumentArrowDown className="w-5 h-5" />
                      <span>Download Company Profile</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Map & Context Side */}
            <div className="lg:sticky lg:top-24">
              <div className="mb-10">
                <span className="text-accent font-bold text-xs uppercase tracking-[0.2em] block mb-2">Pune Office</span>
                <h2 className="text-4xl font-bold font-[Outfit] text-primary mb-6">Strategic Presence in the Innovation Hub</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 rounded-2xl border border-gray-50 hover:bg-gray-50 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                      <HiOutlineMapPin className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        SMC Projects Headquarters, <br />
                        Kharadi Corporate Park, Pune, MH 411014
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-2xl border border-gray-50 hover:bg-gray-50 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                      <HiOutlinePhone className="w-5 h-5 text-accent" />
                    </div>
                    <p className="text-gray-600 text-sm font-semibold">+91 20 1234 5678</p>
                  </div>
                </div>
              </div>

              {/* Map Iframe */}
              <div className="rounded-[2rem] overflow-hidden grayscale contrast-[1.2] brightness-90 border-4 border-white shadow-2xl h-[350px] relative group">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d121059.0344739699!2d73.7805654!3d18.5248902!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bf2e67414521%3A0x682850cc5da3ee88!2sPune%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1711000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
                {/* Map Overlay on Hover */}
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex items-center justify-center">
                  <span className="bg-white px-6 py-2 rounded-full text-xs font-bold text-primary shadow-xl uppercase tracking-widest">Open in Google Maps</span>
                </div>
              </div>

              {/* Quick Connect */}
              <div className="mt-8 flex items-center gap-4">
                <span className="text-sm text-gray-400 font-medium">Quick connect:</span>
                <div className="flex gap-3">
                  <a href="https://wa.me/919876543210" className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center hover:bg-green-500 hover:text-white transition-all text-gray-400">
                    <HiOutlineChatBubbleLeftRight className="w-5 h-5" />
                  </a>
                  <a href="mailto:contact@smcprojects.in" className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center hover:bg-primary hover:text-white transition-all text-gray-400">
                    <HiOutlineEnvelope className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
