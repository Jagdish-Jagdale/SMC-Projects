/**
 * Services Page
 * Services grid with icons, descriptions, and hover animations
 */
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  HiOutlineBuildingOffice2,
  HiOutlineHome,
  HiOutlinePaintBrush,
  HiOutlineMap,
  HiOutlineCog6Tooth,
  HiOutlineBuildingStorefront,
  HiOutlineChartBar,
  HiOutlineArrowRight
} from 'react-icons/hi2';
import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import SectionHeading from '../components/SectionHeading';

gsap.registerPlugin(ScrollTrigger);

const allServices = [
  {
    icon: HiOutlineBuildingOffice2,
    title: 'Contracting & EPC Projects',
    description: 'End-to-end Engineering, Procurement & Construction services for large-scale industrial and infrastructure projects. We manage the entire lifecycle from design to commissioning.',
    features: ['Project Planning', 'Engineering Design', 'Procurement', 'Construction Management', 'Commissioning']
  },
  {
    icon: HiOutlineCog6Tooth,
    title: 'Industrial Construction',
    description: 'Specialized industrial facility construction including factories, warehouses, and processing plants. Built with focus on operational efficiency, safety compliance, and scalability.',
    features: ['Factory Buildings', 'Warehouses', 'Processing Plants', 'Clean Rooms', 'Safety Systems']
  },
  {
    icon: HiOutlineBuildingStorefront,
    title: 'Commercial Construction',
    description: 'Premium commercial spaces designed for modern business needs. From office complexes to retail spaces, we create environments that drive productivity and growth.',
    features: ['Office Complexes', 'Retail Spaces', 'IT Parks', 'Business Centers', 'Shopping Malls']
  },
  {
    icon: HiOutlineHome,
    title: 'Residential Construction',
    description: 'Dream homes built with precision, quality, and attention to every detail. From luxury villas to high-rise apartments, we create spaces where memories are made.',
    features: ['Luxury Villas', 'Apartments', 'Townships', 'Row Houses', 'Penthouses']
  },
  {
    icon: HiOutlinePaintBrush,
    title: 'Interior Design',
    description: 'Bespoke interior solutions that transform spaces into extraordinary experiences. Our design team creates interiors that reflect your personality and enhance your lifestyle.',
    features: ['Residential Interiors', 'Commercial Interiors', 'Furniture Design', 'Lighting Design', 'Space Planning']
  },
  {
    icon: HiOutlineMap,
    title: 'Land Development',
    description: 'Strategic land development and township planning for sustainable growth. We transform raw land into thriving communities with proper infrastructure and amenities.',
    features: ['Township Planning', 'Land Surveying', 'Infrastructure Development', 'Landscaping', 'Utility Setup']
  },
  {
    icon: HiOutlineChartBar,
    title: 'Real Estate Development',
    description: 'Comprehensive real estate development from concept to completion. We identify opportunities, develop properties, and deliver premium real estate experiences.',
    features: ['Market Analysis', 'Property Development', 'Sales & Marketing', 'Property Management', 'Investment Advisory']
  }
];

const Services = () => {
  const gridRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.service-item', {
        opacity: 0,
        y: 50
      }, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 80%'
        }
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <>
      <PageHero
        title="Our Services"
        subtitle="Comprehensive construction and real estate solutions"
        bgImage="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920"
      />

      {/* Services Grid */}
      <section className="py-20 bg-white" ref={gridRef}>
        <div className="container-custom">
          <SectionHeading
            subtitle="What We Offer"
            title="Complete Construction Solutions"
            description="From industrial mega-projects to bespoke interiors, we deliver excellence across every domain."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allServices.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.title}
                  className="service-item opacity-0 card p-8 group hover:border-accent/20 border border-transparent cursor-pointer"
                >
                  {/* Icon */}
                  <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-5 group-hover:bg-accent transition-all duration-500 group-hover:scale-110">
                    <Icon className="w-8 h-8 text-accent group-hover:text-white transition-colors duration-300" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-primary mb-3 font-[Outfit] group-hover:text-accent transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-5">
                    {service.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-2">
                    {service.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2 text-sm text-gray-500">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-bg">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 font-[Outfit]">
              Have a Project in Mind?
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto mb-8">
              Let's discuss how we can bring your vision to life with our expertise and experience.
            </p>
            <Link
              to="/contact"
              className="btn-primary inline-flex items-center gap-2 text-base py-3.5 px-8"
            >
              Get a Free Consultation
              <HiOutlineArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Services;
