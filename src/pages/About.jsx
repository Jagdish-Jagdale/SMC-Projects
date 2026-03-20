import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  HiOutlineLightBulb,
  HiOutlineRocketLaunch,
  HiOutlineShieldCheck,
  HiOutlineTrophy,
  HiOutlineUserGroup,
  HiOutlineClock,
  HiOutlineGlobeAlt,
  HiOutlineCog6Tooth,
  HiOutlinePresentationChartLine,
  HiOutlineCheckBadge,
  HiOutlineSquare3Stack3D,
  HiOutlineUserCircle,
  HiOutlineArrowRight
} from 'react-icons/hi2';
import PageHero from '../components/PageHero';
import SectionHeading from '../components/SectionHeading';
import { useSettings } from '../hooks/useSettings';
import { useAbout } from '../hooks/useAbout';

gsap.registerPlugin(ScrollTrigger);

const strategicPillars = [
  { 
    icon: HiOutlineSquare3Stack3D, 
    title: 'End-to-End Capability', 
    description: 'Comprehensive management from architectural conceptualization to structural delivery.',
    accent: 'bg-blue-500'
  },
  { 
    icon: HiOutlineCheckBadge, 
    title: 'Precision & Reliability', 
    description: 'Rigorous quality control frameworks and ISO-compliant safety standards on every site.',
    accent: 'bg-emerald-500'
  },
  { 
    icon: HiOutlineGlobeAlt, 
    title: 'National Footprint', 
    description: 'Headquartered in Pune with a verified logistical network for Pan-India project execution.',
    accent: 'bg-purple-500'
  },
  { 
    icon: HiOutlinePresentationChartLine, 
    title: 'Strategic Leadership', 
    description: 'Guided by data-driven project management and veteran industry consultants.',
    accent: 'bg-amber-500'
  },
];

const methodology = [
  { step: '01', title: 'Strategic Planning', desc: 'Feasibility studies, budget mapping, and architectural alignment.' },
  { step: '02', title: 'Agile Execution', desc: 'Resource-optimized building phases with daily reporting and oversight.' },
  { step: '03', title: 'Quality Audits', desc: 'Multi-stage inspections to ensure structural and aesthetic perfection.' },
  { step: '04', title: 'Seamless Handover', desc: 'Final documentation, compliance checks, and post-delivery support.' },
];

const About = () => {
  const { settings } = useSettings();
  const { data: aboutData, loading } = useAbout();
  const timelineRef = useRef(null);

  useEffect(() => {
    if (loading) return;
    const ctx = gsap.context(() => {
      // Fade-up on scroll
      gsap.fromTo('.gsap-fade-up', {
        opacity: 0,
        y: 40
      }, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.gsap-trigger',
          start: 'top 80%'
        }
      });
      
      // Image Parallax
      gsap.fromTo('.gsap-parallax', {
        scale: 1.1,
        y: 20
      }, {
        scale: 1,
        y: -20,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.gsap-parallax-trigger',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    });
    return () => ctx.revert();
  }, [loading]);

  if (loading || !aboutData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="spinner border-accent/30 border-t-accent"></div>
      </div>
    );
  }

  return (
    <>
      <PageHero
        title={aboutData.title || "About Us"}
        subtitle={aboutData.subtitle || `Building trust, delivering excellence`}
        bgImage={aboutData.images?.[0] || "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920"}
      />

      {/* Corporate Profile Section */}
      <section className="py-24 bg-white">
        <div className="container-custom gsap-trigger">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="gsap-fade-up">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 mb-6 text-primary font-bold text-xs uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                Corporate Profile
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-primary mb-8 font-[Outfit] leading-[1.1]">
                Excellence in Engineering & <span className="text-gray-400">Strategic Infrastructure.</span>
              </h2>
              <div className="space-y-6 text-gray-500 text-lg leading-relaxed mb-10">
                <p className="font-medium">
                  {aboutData.description.split('\n')[0]}
                </p>
                <div className="pl-6 border-l-4 border-accent italic text-gray-400 py-2">
                  "Our core mission is to redefine urban landscapes through precision construction and ethical business practices."
                </div>
                <p>
                  {aboutData.description.split('\n').slice(1).join('\n')}
                </p>
              </div>
              <div className="flex flex-wrap gap-4 pt-4">
                <div className="px-6 py-4 bg-bg-dark rounded-2xl border border-gray-100 min-w-[150px]">
                  <div className="text-2xl font-bold text-primary font-[Outfit]">{aboutData.experienceYears}+</div>
                  <div className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Years Experience</div>
                </div>
                <div className="px-6 py-4 bg-bg-dark rounded-2xl border border-gray-100 min-w-[150px]">
                  <div className="text-2xl font-bold text-primary font-[Outfit]">{aboutData.projectsCompleted}</div>
                  <div className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Projects Done</div>
                </div>
              </div>
            </div>

            <div className="relative group gsap-fade-up gsap-parallax-trigger mt-12 lg:mt-0">
              <div className="rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(15,23,42,0.2)] relative">
                <img
                  src={aboutData.images?.[1] || "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1000"}
                  alt="Corporate Profile"
                  className="w-full h-[600px] object-cover gsap-parallax scale-110 group-hover:scale-100 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent"></div>
              </div>
              {/* Floating Stat Card */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="absolute -bottom-10 -left-10 bg-white p-8 rounded-[2.5rem] shadow-2xl hidden md:block border border-gray-50 z-20"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-accent text-white flex items-center justify-center">
                    <HiOutlineCheckBadge className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-primary font-[Outfit]">ISO Certified</div>
                    <div className="text-[9px] text-gray-400 uppercase font-bold tracking-widest">Safety Compliance</div>
                  </div>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: '100%' }} transition={{ duration: 1.5 }} className="h-full bg-accent"></motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Vision & Mission - Glassmorphism */}
      <section className="py-24 bg-primary relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              whileHover={{ y: -10, scale: 1.02, backgroundColor: 'rgba(255,255,255,0.12)' }}
              viewport={{ once: true }}
              className="backdrop-blur-xl bg-white/10 border border-white/20 p-10 rounded-3xl text-white group transition-all duration-500 shadow-xl hover:shadow-accent/20"
            >
              <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center mb-8 text-accent group-hover:scale-110 transition-transform duration-500">
                <HiOutlineLightBulb className="w-9 h-9" />
              </div>
              <h3 className="text-2xl font-bold mb-4 font-[Outfit]">The Vision</h3>
              <p className="text-white/70 text-lg leading-relaxed">
                {aboutData.vision}
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              whileHover={{ y: -10, scale: 1.02, backgroundColor: 'rgba(255,255,255,0.12)' }}
              viewport={{ once: true }}
              className="backdrop-blur-xl bg-white/10 border border-white/20 p-10 rounded-3xl text-white group transition-all duration-500 shadow-xl hover:shadow-accent/20"
            >
              <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center mb-8 text-accent group-hover:scale-110 transition-transform duration-500">
                <HiOutlineRocketLaunch className="w-9 h-9" />
              </div>
              <h3 className="text-2xl font-bold mb-4 font-[Outfit]">The Mission</h3>
              <p className="text-white/70 text-lg leading-relaxed">
                {aboutData.mission}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Strategic Pillars of Excellence */}
      <section className="py-32 bg-white relative">
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#0f172a 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        
        <div className="max-w-6xl mx-auto px-4 relative">
          <div className="text-center mb-16">
            <span className="text-accent font-bold text-xs uppercase tracking-[0.25em] mb-3 block">Operation Standards</span>
            <h2 className="text-3xl md:text-4xl font-bold text-primary font-[Outfit]">Strategic Pillars of Excellence</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {strategicPillars.map((pillar, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -8, scale: 1.02 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-2xl border border-gray-100 bg-white shadow-sm hover:border-accent/30 hover:shadow-2xl transition-all duration-500 group relative overflow-hidden"
              >
                <div className="relative z-10">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-white shadow-lg ${pillar.accent}`}>
                    <pillar.icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-primary mb-3 font-[Outfit]">{pillar.title}</h4>
                  <p className="text-gray-500 text-xs leading-relaxed">{pillar.description}</p>
                </div>
                {/* Subtle Back Icon */}
                <div className="absolute -bottom-6 -right-6 text-primary opacity-[0.02] group-hover:opacity-[0.05] group-hover:rotate-12 transition-all duration-700">
                  <pillar.icon className="w-24 h-24" />
                </div>
                <div className="absolute top-0 right-0 w-1.5 h-0 bg-accent group-hover:h-full transition-all duration-500"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Execution Methodology Section */}
      <section className="py-24 bg-bg-dark border-y border-gray-100">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-4">
              <span className="text-accent font-bold text-xs uppercase tracking-widest mb-4 block">Efficiency Model</span>
              <h2 className="text-4xl font-bold text-primary font-[Outfit] mb-6">Our Methodology</h2>
              <p className="text-gray-500 leading-relaxed mb-8">
                We believe in a structured, multi-phase approach that guarantees transparency, safety, and operational excellence from start to finish.
              </p>
              <button className="btn-primary group">
                Download PDF Profile <HiOutlineArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-16">
              {methodology.map((m, i) => (
                <div key={i} className="flex gap-6 items-start group">
                  <div className="text-4xl font-bold text-primary/10 font-[Outfit] group-hover:text-accent/20 transition-colors leading-none">{m.step}</div>
                  <div>
                    <h4 className="text-lg font-bold text-primary mb-3 font-[Outfit]">{m.title}</h4>
                    <p className="text-gray-500 text-sm leading-relaxed">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team section */}
      {aboutData.teamMembers && aboutData.teamMembers.length > 0 && (
        <section className="py-32 bg-white">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
              <div className="text-left">
                <span className="text-accent font-bold text-xs uppercase tracking-[0.25em] mb-4 block">Our Foundation</span>
                <h2 className="text-3xl md:text-5xl font-bold text-primary font-[Outfit]">Executive Leadership</h2>
              </div>
              <div className="text-gray-400 text-sm max-w-xs font-medium">
                SMC Projects is steered by elite professionals with decades of cumulative industry experience.
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
              {aboutData.teamMembers.map((member, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -10 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group cursor-default"
                >
                  <div className="relative mb-6">
                    <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-bg-dark border border-gray-100 shadow-lg relative group/img">
                      {member.image ? (
                        <img src={member.image} alt={member.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary">
                          <span className="text-3xl text-white font-bold font-[Outfit]">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      )}
                      {/* Social Overlay */}
                      <div className="absolute inset-0 bg-primary/40 backdrop-blur-[2px] opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                        <motion.div whileHover={{ scale: 1.15, rotate: 5 }} className="w-12 h-12 rounded-full bg-white text-primary flex items-center justify-center shadow-lg cursor-pointer">
                          <HiOutlineUserCircle className="w-7 h-7" />
                        </motion.div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center group-hover:translate-y-[-2px] transition-transform duration-300">
                    <h4 className="text-lg font-bold text-primary font-[Outfit] mb-1">{member.name}</h4>
                    <p className="text-accent text-[9px] font-bold uppercase tracking-[0.2em]">{member.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default About;
