/**
 * PropertyDetails Page
 * Comprehensive view of a single property including gallery, details, amenities, mortgage calc, etc.
 */
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  HiOutlineMapPin,
  HiOutlineShare,
  HiOutlineHeart,
  HiOutlinePhone,
  HiOutlineEnvelope,
  HiCheckCircle,
  HiOutlineInformationCircle,
  HiOutlinePlay
} from 'react-icons/hi2';
import { IoBedOutline, IoWaterOutline, IoResizeOutline, IoCarOutline } from 'react-icons/io5';
import { getPropertyById, incrementViews } from '../firebase/properties';
import { addLead } from '../firebase/leads';
import { sampleProperties } from '../utils/sampleData';
import { formatPrice, formatArea, calculateEMI } from '../utils/helpers';
import { useSettings } from '../hooks/useSettings';
import toast from 'react-hot-toast';

const PropertyDetails = () => {
  const { id } = useParams();
  const { settings } = useSettings();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState('inquiry'); // 'inquiry' or 'visit'

  
  // Form state
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    phone: '',
    email: '',
    message: 'I am interested in this property. Please contact me with more information.',
    visitDate: '',
    visitTime: ''
  });
  
  // EMI Calculator State
  const [emiInterest, setEmiInterest] = useState(8.5);
  const [emiTenure, setEmiTenure] = useState(20);
  const [downPayment, setDownPayment] = useState(20);

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      try {
        const data = await getPropertyById(id);
        if (data) {
          setProperty(data);
          // Increment views asynchronously
          incrementViews(id);
        } else {
          // Fallback to sample data for demo
          const sample = sampleProperties.find(p => p.id === id);
          setProperty(sample || sampleProperties[0]);
        }
      } catch (error) {
        console.error("Failed to fetch property", error);
        setProperty(sampleProperties[0]);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    try {
      if (!inquiryForm.name || !inquiryForm.phone) {
        toast.error('Name and Phone are required');
        return;
      }
      
      const leadData = {
        ...inquiryForm,
        propertyId: property.id,
        propertyTitle: property.title,
        source: activeTab === 'visit' ? 'Schedule Visit' : 'Property Details Page',
        type: activeTab
      };

      const result = await addLead(leadData);
      if (result.success) {
        toast.success('Inquiry sent successfully! We will contact you soon.');
        setInquiryForm(prev => ({ ...prev, name: '', phone: '', email: '' }));
      } else {
        toast.error('Failed to send inquiry. Try again.');
      }
    } catch (error) {
      toast.error('Error sending inquiry.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex justify-center items-center bg-bg">
        <div className="flex flex-col items-center">
          <div className="spinner border-accent border-t-transparent mb-4"></div>
          <p className="text-gray-500">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex justify-center items-center bg-bg w-full">
        <div className="text-center card p-10 max-w-lg">
          <h2 className="text-2xl font-bold text-primary mb-4 font-[Outfit]">Property Not Found</h2>
          <p className="text-gray-500 mb-6">The property you're looking for doesn't exist or has been removed.</p>
          <Link to="/properties" className="btn-primary">Browse Properties</Link>
        </div>
      </div>
    );
  }

  // Calculate EMI based on state
  const propertyPrice = property?.price || 0;
  const principal = propertyPrice - (propertyPrice * (downPayment / 100));
  const emiAmount = calculateEMI(principal, emiInterest, emiTenure);

  return (
    <div className="min-h-screen pt-24 pb-20 bg-bg">
      <Helmet>
        <title>{property.seoTitle || `${property.title} | ${settings.companyName || 'BuildEstate'}`}</title>
        <meta name="description" content={property.seoDescription || property.description?.substring(0, 160)} />
      </Helmet>
      <div className="container-custom">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-accent transition-colors">Home</Link>
          <span>/</span>
          <Link to="/properties" className="hover:text-accent transition-colors">Properties</Link>
          <span>/</span>
          <span className="text-primary font-medium truncate">{property.title}</span>
        </div>

        {/* Gallery Section */}
        <div className="mb-10 rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100 flex flex-col md:flex-row h-auto md:h-[500px]">
          {/* Main Image */}
          <div className="w-full md:w-2/3 relative h-64 md:h-full bg-gray-100">
            {property.images && property.images.length > 0 ? (
              <img
                src={property.images[activeImage]}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No image available
              </div>
            )}
            
            <div className="absolute top-4 left-4 flex gap-2">
              <span className={`badge ${property.type === 'Commercial' ? 'badge-new' : 'badge-featured'}`}>
                For Sale | {property.type}
              </span>
              {property.virtualTour && (
                <a 
                  href={property.virtualTour} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-accent/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full flex items-center gap-1.5 hover:bg-accent transition-colors shadow-lg"
                >
                  <HiOutlinePlay className="w-3.5 h-3.5" />
                  Virtual Tour
                </a>
              )}
            </div>
            
            <div className="absolute top-4 right-4 flex gap-2">
              <button 
                onClick={() => toast.success('Link copied to clipboard')}
                className="w-10 h-10 rounded-full bg-white/90 backdrop-blur text-gray-600 flex justify-center items-center hover:bg-gray-100 transition shadow-sm"
              >
                <HiOutlineShare className="w-5 h-5" />
              </button>
              <button 
                onClick={() => toast.success('Added to favorites')}
                className="w-10 h-10 rounded-full bg-white/90 backdrop-blur text-gray-600 flex justify-center items-center hover:bg-red-50 hover:text-red-500 transition shadow-sm"
              >
                <HiOutlineHeart className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Thumbnails */}
          <div className="w-full md:w-1/3 p-4 bg-white overflow-y-auto hidden-scrollbar grid grid-cols-4 md:grid-cols-2 gap-3 pb-8">
            {property.images && property.images.map((img, idx) => (
              <div 
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`relative rounded-xl overflow-hidden cursor-pointer h-20 md:h-32 border-2 transition-all ${activeImage === idx ? 'border-accent' : 'border-transparent'}`}
              >
                <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover hover:opacity-80 transition" />
              </div>
            ))}
            {/* Show view all placeholder if needed */}
            {property.images && property.images.length > 0 && (
              <div 
                className="relative rounded-xl overflow-hidden cursor-pointer h-20 md:h-32 border-2 border-transparent bg-gray-100 flex items-center justify-center group"
                onClick={() => toast('Gallery opening feature coming soon', { icon: '🖼️'})}
              >
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition flex flex-col items-center justify-center text-white">
                  <span className="font-bold text-lg">+{Math.max(0, (property.images?.length || 0) - 1)}</span>
                  <span className="text-xs">More</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Content Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title & Overview Card */}
            <div className="card p-6 md:p-8 relative">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
                <div>
                  <h1 className="text-2xl md:text-4xl font-bold text-primary mb-2 font-[Outfit] leading-tight">
                    {property.title}
                  </h1>
                  <div className="flex items-center gap-2 text-gray-500 font-medium">
                    <HiOutlineMapPin className="text-accent w-5 h-5" />
                    {property.area}, {property.city}
                  </div>
                </div>
                <div className="md:text-right w-full md:w-auto p-4 md:p-0 bg-gray-50 md:bg-transparent rounded-xl border border-gray-100 md:border-none">
                  <div className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-1">Asking Price</div>
                  <div className="text-3xl font-bold text-accent font-[Outfit]">
                    {formatPrice(property.price)}
                  </div>
                  <div className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                    <HiOutlineInformationCircle className="w-4 h-4" />
                    Estimated EMI: {formatPrice(emiAmount)}/mo
                  </div>
                </div>
              </div>

              {/* Key Features Bar */}
              <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100 border-t border-b border-gray-100 py-6">
                <div className="flex flex-col items-center justify-center px-4">
                  <IoBedOutline className="w-8 h-8 text-accent/60 mb-2" />
                  <span className="font-bold text-primary font-[Outfit]">{property.bedrooms || 0}</span>
                  <span className="text-xs text-gray-500 uppercase tracking-widest text-center mt-1">Bedrooms</span>
                </div>
                <div className="flex flex-col items-center justify-center px-4">
                  <IoWaterOutline className="w-8 h-8 text-accent/60 mb-2" />
                  <span className="font-bold text-primary font-[Outfit]">{property.bathrooms || 0}</span>
                  <span className="text-xs text-gray-500 uppercase tracking-widest text-center mt-1">Bathrooms</span>
                </div>
                <div className="flex flex-col items-center justify-center px-4">
                  <IoResizeOutline className="w-8 h-8 text-accent/60 mb-2" />
                  <span className="font-bold text-primary font-[Outfit]">{formatArea(property.areaSize)}</span>
                  <span className="text-xs text-gray-500 uppercase tracking-widest text-center mt-1">Area Size</span>
                </div>
                <div className="flex flex-col items-center justify-center px-4">
                  <IoCarOutline className="w-8 h-8 text-accent/60 mb-2" />
                  <span className="font-bold text-primary font-[Outfit]">{property.parking || 0}</span>
                  <span className="text-xs text-gray-500 uppercase tracking-widest text-center mt-1">Parking</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="card p-6 md:p-8">
              <h3 className="text-xl font-bold text-primary mb-4 font-[Outfit]">Description</h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                {property.description || "No description provided for this property."}
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-8 pt-8 border-t border-gray-100">
                <div>
                  <span className="block text-gray-500 text-sm mb-1">Property Type</span>
                  <span className="font-semibold text-primary">{property.type || "N/A"}</span>
                </div>
                <div>
                  <span className="block text-gray-500 text-sm mb-1">Status</span>
                  <span className="font-semibold text-primary">Ready to Move</span>
                </div>
                <div>
                  <span className="block text-gray-500 text-sm mb-1">Furnishing</span>
                  <span className="font-semibold text-primary">{property.furnished || "Unfurnished"}</span>
                </div>
                <div>
                  <span className="block text-gray-500 text-sm mb-1">Floor Limit</span>
                  <span className="font-semibold text-primary">{property.floor || "N/A"}</span>
                </div>
                <div>
                  <span className="block text-gray-500 text-sm mb-1">Facing</span>
                  <span className="font-semibold text-primary">{property.facing || "N/A"}</span>
                </div>
                <div>
                  <span className="block text-gray-500 text-sm mb-1">Listed On</span>
                  <span className="font-semibold text-primary">Just now</span>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="card p-6 md:p-8">
              <h3 className="text-xl font-bold text-primary mb-6 font-[Outfit]">Amenities & Features</h3>
              {property.amenities && property.amenities.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-2">
                  {property.amenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <HiCheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-gray-600 text-sm">{amenity}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No amenities listed.</p>
              )}
            </div>

            {/* Neighborhood Connectivity Scorecard */}
            <div className="card p-6 md:p-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                  <h3 className="text-xl font-bold text-primary font-[Outfit]">Neighborhood Connectivity</h3>
                  <p className="text-sm text-gray-500">Distance from key transport and business hubs</p>
                </div>
                <div className="bg-green-50 px-4 py-2 rounded-xl flex items-center gap-2 border border-green-100">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-green-700 text-xs font-bold uppercase tracking-wider">Prime Location</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { label: 'International Airport', dist: '12.5 KM', icon: '✈️', time: '25 Mins' },
                  { label: 'Railway Station', dist: '4.2 KM', icon: '🚂', time: '10 Mins' },
                  { label: 'Metro Station', dist: '0.8 KM', icon: '🚇', time: '5 Mins Walk' },
                  { label: 'Corporate Tech Park', dist: '2.5 KM', icon: '🏢', time: '8 Mins' },
                  { label: 'City Hospital', dist: '1.5 KM', icon: '🏥', time: '5 Mins' },
                  { label: 'Premium Shopping Mall', dist: '3.0 KM', icon: '🛍️', time: '10 Mins' }
                ].map((item, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-gray-50/50 border border-gray-100 hover:border-accent/30 transition-all group">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl group-hover:scale-110 transition-transform">{item.icon}</span>
                      <span className="text-sm font-bold text-primary font-[Outfit]">{item.label}</span>
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="text-lg font-black text-accent">{item.dist}</div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-white px-2 py-1 rounded-md border border-gray-100">{item.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="card p-6 md:p-8">
              <h3 className="text-xl font-bold text-primary mb-4 font-[Outfit]">Location Map</h3>
              <div className="w-full h-80 bg-gray-200 rounded-xl overflow-hidden relative">
                <iframe
                  title="Map View"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  marginHeight="0"
                  marginWidth="0"
                  src={`https://maps.google.com/maps?q=${property.area},${property.city}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                />
              </div>
            </div>
            
            {/* Mortgage Calculator */}
            <div className="card p-6 md:p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
              <h3 className="text-xl font-bold text-primary mb-2 font-[Outfit]">Mortgage Calculator</h3>
              <p className="text-gray-500 text-sm mb-6">Estimate your monthly payments</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">Down Payment (%)</label>
                      <span className="font-bold text-primary">{downPayment}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="5" max="80" step="5"
                      value={downPayment} 
                      onChange={(e) => setDownPayment(parseInt(e.target.value))}
                      className="w-full accent-accent h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="text-xs text-gray-500 mt-1 flex justify-between">
                      <span>{formatPrice(propertyPrice * (downPayment / 100))}</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">Interest Rate (%)</label>
                      <span className="font-bold text-primary">{emiInterest}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="5" max="15" step="0.1"
                      value={emiInterest} 
                      onChange={(e) => setEmiInterest(parseFloat(e.target.value))}
                      className="w-full accent-accent h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">Loan Tenure (Years)</label>
                      <span className="font-bold text-primary">{emiTenure}</span>
                    </div>
                    <input 
                      type="range" 
                      min="5" max="30" step="1"
                      value={emiTenure} 
                      onChange={(e) => setEmiTenure(parseInt(e.target.value))}
                      className="w-full accent-accent h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center">
                  <div className="text-gray-500 text-sm font-medium mb-2 uppercase tracking-wide">Estimated Monthly EMI</div>
                  <div className="text-4xl font-bold text-accent font-[Outfit] mb-2">{formatPrice(emiAmount)}</div>
                  <div className="text-sm text-gray-400">Principal Amount: {formatPrice(principal)}</div>
                  <button className="btn-secondary w-full mt-6 py-2.5">Apply for Loan</button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Sticky Contact Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 card p-6 shadow-xl border border-gray-100">
              <h3 className="text-xl font-bold text-primary mb-2 font-[Outfit]">Interested in this property?</h3>
              <p className="text-gray-500 text-sm mb-6">Drop your details below and our expert will contact you shortly.</p>
              
              {/* Tab Switcher */}
              <div className="flex bg-gray-50 p-1 rounded-xl mb-6">
                <button 
                  onClick={() => setActiveTab('inquiry')}
                  className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${activeTab === 'inquiry' ? 'bg-white text-accent shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  Quick Inquiry
                </button>
                <button 
                  onClick={() => setActiveTab('visit')}
                  className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${activeTab === 'visit' ? 'bg-white text-accent shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                   Book Visit
                </button>
              </div>

              <form onSubmit={handleInquirySubmit} className="space-y-4">
                {activeTab === 'visit' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 mb-1 block">Preferred Date</label>
                      <input
                        type="date"
                        className="input-field py-2 text-sm"
                        value={inquiryForm.visitDate}
                        onChange={(e) => setInquiryForm({...inquiryForm, visitDate: e.target.value})}
                        required
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 mb-1 block">Preferred Time</label>
                      <select
                        className="input-field py-2 text-sm"
                        value={inquiryForm.visitTime}
                        onChange={(e) => setInquiryForm({...inquiryForm, visitTime: e.target.value})}
                        required
                      >
                        <option value="">Select Time</option>
                        <option value="10:00 AM">10:00 AM</option>
                        <option value="11:30 AM">11:30 AM</option>
                        <option value="02:00 PM">02:00 PM</option>
                        <option value="04:30 PM">04:30 PM</option>
                        <option value="06:00 PM">06:00 PM</option>
                      </select>
                    </div>
                  </div>
                )}
                <div>
                  <input
                    type="text"
                    placeholder="Your Full Name *"
                    className="input-field"
                    value={inquiryForm.name}
                    onChange={(e) => setInquiryForm({...inquiryForm, name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    placeholder="Your Phone Number *"
                    className="input-field"
                    value={inquiryForm.phone}
                    onChange={(e) => setInquiryForm({...inquiryForm, phone: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Your Email ID"
                    className="input-field"
                    value={inquiryForm.email}
                    onChange={(e) => setInquiryForm({...inquiryForm, email: e.target.value})}
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Your Message"
                    className="input-field min-h-[100px] resize-y"
                    value={inquiryForm.message}
                    onChange={(e) => setInquiryForm({...inquiryForm, message: e.target.value})}
                  ></textarea>
                </div>
                
                <button type="submit" className="btn-primary w-full py-3.5 mt-2 shadow-md">
                  {activeTab === 'visit' ? 'Confirm Booking' : 'Send Inquiry Now'}
                </button>
                
                <p className="text-xs text-gray-400 text-center mt-4">
                  By submitting this form, you agree to our Terms of Use and Privacy Policy.
                </p>
              </form>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <p className="text-sm font-medium text-gray-500 mb-4 text-center">Or connect directly</p>
                <div className="flex gap-4">
                  <a href="tel:+919876543210" className="flex-1 btn-secondary py-2.5 flex items-center justify-center gap-2 border-green-500 text-green-600 hover:bg-green-500">
                    <HiOutlinePhone className="w-4 h-4" />
                    Call
                  </a>
                  <a 
                    href={`https://wa.me/${settings.phoneNumber || '919876543210'}?text=Hello, I am interested in ${property.title}. Please provide more details.`} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex-1 btn-primary bg-[#25D366] hover:bg-[#1DA851] border-none shadow-md py-2.5 flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
