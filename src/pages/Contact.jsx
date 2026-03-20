import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  HiOutlineMapPin, 
  HiOutlinePhone, 
  HiOutlineEnvelope,
  HiOutlineBuildingOffice2
} from 'react-icons/hi2';
import toast from 'react-hot-toast';
import PageHero from '../components/PageHero';
import SectionHeading from '../components/SectionHeading';
import { addLead } from '../firebase/leads';
import { useSettings } from '../hooks/useSettings';

const Contact = () => {
  const { settings } = useSettings();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    projectType: '',
    location: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const leadData = {
        ...formData,
        source: 'Contact Page Formulation',
      };
      
      const res = await addLead(leadData);
      
      if (res.success) {
        toast.success("Thank you! Your inquiry has been sent successfully.");
        setFormData({
          name: '',
          company: '',
          phone: '',
          email: '',
          projectType: '',
          location: '',
          message: ''
        });
      } else {
        toast.error("Failed to send your message. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <PageHero
        title="Contact Us"
        subtitle="Let's build something extraordinary together"
        bgImage="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920"
      />

      <section className="py-20 bg-bg min-h-screen">
        <div className="container-custom">
          
          {/* Quick Contact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 -mt-32 relative z-20 mb-20">
            <motion.div 
              initial={{ y: 50, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              transition={{ delay: 0.1 }}
              className="card p-8 text-center hover:shadow-xl transition-shadow border-t-4 border-accent bg-white group"
            >
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:-translate-y-1 transition-transform">
                <HiOutlinePhone className="w-8 h-8 text-accent" />
              </div>
              <h3 className="font-bold text-xl text-primary font-[Outfit] mb-2">Call Us</h3>
              <p className="text-gray-500 mb-4 line-clamp-2">Our team is available Mon-Sat, 9AM to 6PM</p>
              <a href={`tel:${settings.phone}`} className="text-accent font-semibold text-lg hover:underline">{settings.phone}</a>
            </motion.div>

            <motion.div 
              initial={{ y: 50, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              transition={{ delay: 0.2 }}
              className="card p-8 text-center hover:shadow-xl transition-shadow border-t-4 border-accent bg-white group"
            >
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:-translate-y-1 transition-transform">
                <HiOutlineEnvelope className="w-8 h-8 text-accent" />
              </div>
              <h3 className="font-bold text-xl text-primary font-[Outfit] mb-2">Email Us</h3>
              <p className="text-gray-500 mb-4 line-clamp-2">Drop us a line and we'll reply within 24 hours</p>
              <a href={`mailto:${settings.email}`} className="text-accent font-semibold text-lg hover:underline">{settings.email}</a>
            </motion.div>

            <motion.div 
              initial={{ y: 50, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              transition={{ delay: 0.3 }}
              className="card p-8 text-center hover:shadow-xl transition-shadow border-t-4 border-accent bg-white group"
            >
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:-translate-y-1 transition-transform">
                <HiOutlineMapPin className="w-8 h-8 text-accent" />
              </div>
              <h3 className="font-bold text-xl text-primary font-[Outfit] mb-2">Visit Us</h3>
              <p className="text-gray-500 mb-4 line-clamp-2">{settings.address}</p>
              <a href="#map" className="text-accent font-semibold text-lg hover:underline flex items-center justify-center gap-1">View on Map</a>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white card p-8 md:p-12 shadow-md border border-gray-100"
            >
              <SectionHeading
                title="Send an Inquiry"
                description="We'd love to hear from you. Fill out the form below to get started."
                center={false}
              />
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="input-field w-full"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="input-field w-full"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="input-field w-full"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="input-field w-full"
                      placeholder="Your Company Pvt Ltd"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Project Type</label>
                    <select
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleChange}
                      className="input-field w-full text-gray-700"
                    >
                      <option value="">Select Project Type</option>
                      <option value="Residential">Residential Construction</option>
                      <option value="Commercial">Commercial Construction</option>
                      <option value="Industrial">Industrial EPC</option>
                      <option value="Interior">Interior Design</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Project Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="input-field w-full"
                      placeholder="City, State"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                  <textarea
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="input-field w-full min-h-[150px] resize-y"
                    placeholder="Tell us about your project requirements..."
                  ></textarea>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="btn-primary flex-1 py-4 text-lg font-semibold flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
                  >
                    {loading ? (
                      <div className="spinner w-6 h-6 border-2 border-white border-t-transparent"></div>
                    ) : (
                      "Submit Inquiry"
                    )}
                  </button>
                  {settings.brochureUrl && (
                    <a
                      href={settings.brochureUrl}
                      target="_self"
                      download
                      className="btn-secondary flex-1 py-4 text-lg font-semibold flex items-center justify-center gap-2 border-primary text-primary"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download Company Profile
                    </a>
                  )}
                </div>
              </form>
            </motion.div>

            {/* Map and Details */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8 h-full flex flex-col"
            >
              <div className="card bg-gradient-to-br from-primary to-slate-800 p-10 text-white shadow-xl relative overflow-hidden">
                <div className="absolute -right-20 -bottom-20 opacity-10 pointer-events-none">
                  <HiOutlineBuildingOffice2 className="w-80 h-80" />
                </div>
                
                <h3 className="text-2xl font-bold font-[Outfit] mb-6 relative z-10">Corporate Office</h3>
                
                <div className="space-y-6 relative z-10">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                      <HiOutlineMapPin className="w-5 h-5 text-accent-light" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Address</h4>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {settings.address}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                      <HiOutlinePhone className="w-5 h-5 text-accent-light" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Phone</h4>
                      <p className="text-gray-300 text-sm mb-1">{settings.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                      <HiOutlineEnvelope className="w-5 h-5 text-accent-light" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Email</h4>
                      <p className="text-gray-300 text-sm mb-1">{settings.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Embed */}
              <div id="map" className="card flex-1 min-h-[300px] overflow-hidden rounded-2xl border-4 border-white shadow-md">
                <iframe
                  title="BuildEstate Corporate Office Location"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  marginHeight="0"
                  marginWidth="0"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(settings.address)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                  className="filter grayscale-[20%] contrast-[1.2] opacity-90"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;

