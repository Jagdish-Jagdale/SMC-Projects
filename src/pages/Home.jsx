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
  HiOutlinePaintBrush,
  HiOutlineMap,
  HiOutlineCog6Tooth,
  HiOutlineBuildingStorefront,
  HiOutlineArrowRight
} from 'react-icons/hi2';
import HeroSection from '../components/HeroSection';
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
      className="perspective-2000 h-[460px] cursor-pointer"
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
          className="absolute inset-0 w-full h-full bg-white rounded-[2.5rem] p-8 flex flex-col items-center text-center shadow-xl border-[3px] border-gray-100 group transition-all duration-500 hover:border-accent/40 overflow-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* Subtle Background Glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-accent/10 transition-colors" />

          <div className="w-20 h-20 rounded-[2rem] bg-bg flex items-center justify-center mb-8 border-2 border-gray-100 shadow-lg group-hover:bg-accent group-hover:shadow-accent/40 group-hover:-translate-y-2 transition-all duration-500">
            <Icon className="w-9 h-9 text-accent group-hover:text-white transition-all duration-500" />
          </div>

          <h3 className="font-bold text-primary text-2xl mb-4 font-[Outfit]">
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
          className="absolute inset-0 w-full h-full rounded-[2.5rem] overflow-hidden shadow-2xl bg-primary"
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col items-center justify-end p-10 text-center">
            <h3 className="text-white font-bold text-2xl mb-4 font-[Outfit]">
              {service.title}
            </h3>
            <p className="text-white/80 text-sm font-medium mb-8">
              Expert solutions tailored for your business and personal construction needs.
            </p>
            <button className="bg-white text-primary font-bold px-8 py-3 rounded-xl hover:bg-accent hover:text-white transition-all duration-300 shadow-lg">
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
  const { scrollYProgress } = useScroll();

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

      {/* Services Preview Section */}
      <section className="py-24 bg-white" ref={servicesRef}>
        <div className="container-custom">
          <SectionHeading
            subtitle="Our Services"
            title="Comprehensive Construction Solutions"
            description="From concept to completion, we deliver end-to-end construction and real estate services."
          />
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
          <div className="text-center mt-16">
            <Link
              to="/services"
              className="btn-primary inline-flex items-center gap-2 px-10"
            >
              Explore All Services
              <HiOutlineArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-24 bg-bg">
        <div className="container-custom">
          <SectionHeading
            subtitle="Featured Properties"
            title="Handpicked Premium Properties"
            description="Explore our curated selection of the finest residential and commercial properties across Pune."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {featuredProperties.map((property, index) => (
              <PropertyCard key={property.id} property={property} index={index} />
            ))}
          </div>
          <div className="text-center mt-16">
            <Link
              to="/properties"
              className="btn-secondary inline-flex items-center gap-2 group"
            >
              View All Properties
              <HiOutlineArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      {featuredProjects.length > 0 && (
        <section className="py-24 bg-bg">
          <div className="container-custom">
            <SectionHeading
              subtitle="Major Projects"
              title="State-of-the-Art Developments"
              description="Discover our landmark projects that redefine modern living and commercial spaces."
            />
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



      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <SectionHeading
            subtitle="Testimonials"
            title="What Our Clients Say"
            description="Hear from our satisfied clients about their experience working with us."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={testimonial.id || index} testimonial={testimonial} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Client Brands Logo Marquee */}
      <section className="py-24 bg-bg overflow-hidden relative group/marquee">
        {/* Gradient Edge Masks */}
        <div className="absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-bg via-bg/40 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-48 bg-gradient-to-l from-bg via-bg/40 to-transparent z-10 pointer-events-none" />

        <div className="container-custom relative">
          <div className="flex justify-center mb-16">
            <span className="bg-accent/5 text-accent px-8 py-3 rounded-full text-xs font-bold tracking-[0.25em] uppercase border border-accent/10 shadow-sm">
              Strategic Partners & Trusted By
            </span>
          </div>

          <div className="flex w-full">
            <style>
              {`
                @keyframes slide {
                  from { transform: translateX(0); }
                  to { transform: translateX(-50%); }
                }
                .logo-track {
                  display: flex;
                  gap: 80px;
                  width: max-content;
                  animation: slide 30s linear infinite;
                }
                .group\\/marquee:hover .logo-track {
                  animation-play-state: paused;
                }
              `}
            </style>

            <div className="logo-track">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex items-center gap-20">
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
                      className="flex items-center gap-6 text-2xl font-bold text-primary/70 font-[Outfit] hover:text-accent transition-all duration-500 cursor-pointer select-none group/logo"
                    >
                      <brand.icon className="w-8 h-8 opacity-60 group-hover/logo:opacity-100 group-hover/logo:text-accent transition-all" />
                      <span>{brand.name}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Animated & Interactive */}
      <section className="py-24" ref={ctaRef}>
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.8 }}
            className="rounded-[3rem] p-16 md:p-24 text-center relative overflow-hidden bg-primary shadow-[0_50px_100px_-20px_rgba(15,23,42,0.5)]"
          >
            {/* Morphing Background Orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <motion.div
                animate={{
                  x: [0, 100, 0],
                  y: [0, 50, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute -top-24 -right-24 w-96 h-96 bg-accent/20 rounded-full blur-[120px]"
              />
              <motion.div
                animate={{
                  x: [0, -80, 0],
                  y: [0, -40, 0],
                  scale: [1, 1.3, 1],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary/20 rounded-full blur-[120px]"
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/40 backdrop-blur-[2px]" />
            </div>

            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 font-[Outfit] tracking-tight leading-tight">
                  Ready to Start Your <br /> <span className="text-accent underline decoration-white/10">Project Vision?</span>
                </h2>
                <p className="text-gray-300 text-xl max-w-2xl mx-auto mb-12 font-medium opacity-90">
                  Transform your ideas into physical excellence. From elite real estate to massive industrial plants, we build it better.
                </p>
                <div className="flex flex-wrap justify-center gap-6">
                  <Link
                    to="/contact"
                    className="btn-primary text-lg py-5 px-12 rounded-2xl inline-flex items-center gap-3 group/btn relative overflow-hidden active:scale-95 transition-all"
                  >
                    <span className="relative z-10">Start Your Consultation</span>
                    <HiOutlineArrowRight className="w-6 h-6 group-hover/btn:translate-x-2 transition-transform relative z-10" />
                    <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover/btn:translate-y-0 transition-transform duration-300" />
                  </Link>
                  <a
                    href="tel:+919876543210"
                    className="btn-secondary border-2 border-white/20 text-white hover:bg-white hover:text-primary text-lg py-5 px-12 rounded-2xl transition-all duration-300 hover:shadow-2xl active:scale-95"
                  >
                    Speak with an Expert
                  </a>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Home;
