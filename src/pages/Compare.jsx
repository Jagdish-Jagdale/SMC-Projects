import { useState } from 'react';
import { motion } from 'framer-motion';
import { useComparison } from '../context/ComparisonContext';
import { HiOutlineArrowLeft, HiOutlineXMark, HiCheckCircle, HiStar } from 'react-icons/hi2';
import { useNavigate, Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import { formatPrice } from '../utils/helpers';

const Compare = () => {
  const { comparedProperties, removeFromCompare } = useComparison();
  const [highlightDifferences, setHighlightDifferences] = useState(false);
  const navigate = useNavigate();

  const comparisonFeatures = [
    { label: 'Total Price', key: 'price', format: (v) => formatPrice(v) },
    { label: 'Configuration', key: 'type' },
    { label: 'Bedrooms', key: 'bedrooms' },
    { label: 'Bathrooms', key: 'bathrooms' },
    { label: 'Super Area', key: 'areaSize', format: (v) => `${v} sq ft` },
    { label: 'Price per Sq.Ft', key: 'price', format: (v, p) => `₹${Math.round(v / (p.areaSize || 1))}` },
    { label: 'Parking', key: 'parking' },
    { label: 'Furnishing', key: 'furnished' },
    { label: 'Primary Facing', key: 'facing' },
    { label: 'Availability', key: 'status', default: 'Ready to Move' },
  ];

  if (comparedProperties.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center container-custom bg-[#0f172a]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-white/5 backdrop-blur-xl border border-white/10 p-12 rounded-[2.5rem] max-w-lg shadow-2xl"
        >
          <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6 text-accent">
            <HiOutlineArrowLeft className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4 font-[Outfit]">Your Comparison is Empty</h2>
          <p className="text-gray-400 mb-8">Add properties to your comparison bucket to see a side-by-side analytical breakdown.</p>
          <Link to="/properties" className="btn-primary px-10">Browse Properties</Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] pb-24">
      <div className="pt-32 pb-20 px-4">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
            <div>
              <Link to="/properties" className="inline-flex items-center gap-2 text-accent font-bold mb-4 hover:gap-3 transition-all group">
                <HiOutlineArrowLeft className="w-5 h-5" />
                <span>Back to Listings</span>
              </Link>
              <h1 className="text-4xl md:text-6xl font-black text-white font-[Outfit] tracking-tight">
                Property <span className="gradient-text">Analysis</span>
              </h1>
              <p className="text-gray-400 mt-2">Side-by-side technical comparison of your selected units.</p>
            </div>
            
            <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/10 backdrop-blur-md">
               <button 
                onClick={() => setHighlightDifferences(!highlightDifferences)}
                className={`py-2.5 px-6 rounded-xl text-sm font-bold transition-all ${highlightDifferences ? 'bg-accent text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
               >
                 Compare Differences
               </button>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-3xl overflow-hidden">
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-white/10">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="p-8 text-left w-72 bg-white/[0.02]">
                       <div className="space-y-4">
                        <div className="p-4 rounded-2xl bg-accent/10 border border-accent/20">
                          <p className="text-[10px] font-bold text-accent uppercase tracking-widest mb-1">Analytical View</p>
                          <p className="text-sm font-medium text-white">Feature-wise breakdown enabled</p>
                        </div>
                       </div>
                    </th>
                    {comparedProperties.map((property) => (
                      <th key={property.id} className="p-8 border-l border-white/5 relative group min-w-[300px]">
                        <div className="relative mb-6 group">
                          <div className="h-56 rounded-3xl overflow-hidden border border-white/10">
                            <img src={property.images?.[0]} alt={property.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent" />
                          </div>
                          <button 
                            onClick={() => removeFromCompare(property.id)}
                            className="absolute top-4 right-4 bg-white/10 hover:bg-red-500 backdrop-blur-md p-2.5 rounded-2xl text-white transition-all border border-white/10"
                          >
                            <HiOutlineXMark className="w-5 h-5" />
                          </button>
                          
                          <div className="absolute bottom-4 left-4 right-4">
                             <div className="text-2xl font-black text-white font-[Outfit] shadow-sm">
                               {formatPrice(property.price)}
                             </div>
                          </div>
                        </div>
                        <h3 className="font-bold text-lg text-white mb-1 line-clamp-1 tracking-tight">{property.title}</h3>
                        <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">{property.type} in {property.area}</p>
                      </th>
                    ))}
                    {Array.from({ length: Math.max(0, 4 - comparedProperties.length) }).map((_, i) => (
                      <th key={`ph-${i}`} className="p-8 border-l border-white/5 bg-black/20">
                        <Link to="/properties" className="w-20 h-20 rounded-3xl bg-white/5 border-2 border-dashed border-white/10 flex items-center justify-center text-white/20 hover:border-accent/40 hover:text-accent transition-all mx-auto group">
                           <HiCheckCircle className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity" />
                           <span className="text-3xl font-light absolute group-hover:opacity-0 transition-opacity">+</span>
                        </Link>
                        <p className="mt-6 text-[10px] font-bold text-gray-600 uppercase tracking-[0.3em]">Select Property</p>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((feature, idx) => {
                    // Check if values are different across properties
                    const values = comparedProperties.map(p => p[feature.key]);
                    const isDifferent = new Set(values).size > 1;

                    return (
                      <tr 
                        key={idx} 
                        className={`transition-colors group/row ${idx % 2 === 0 ? 'bg-white/[0.01]' : 'bg-transparent'} ${highlightDifferences && isDifferent ? 'bg-accent/5' : ''}`}
                      >
                        <td className="p-6 pl-8 font-bold text-gray-400 text-sm border-t border-white/5 uppercase tracking-widest bg-white/[0.02] group-hover/row:text-white transition-colors">
                          {feature.label}
                        </td>
                        {comparedProperties.map((property) => (
                          <td key={property.id} className="p-6 border-l border-t border-white/5 text-white font-bold font-[Outfit] text-lg">
                            {feature.format 
                              ? feature.format(property[feature.key], property) 
                              : (property[feature.key] || feature.default || 'N/A')}
                          </td>
                        ))}
                        {Array.from({ length: 4 - comparedProperties.length }).map((_, i) => (
                          <td key={`vph-${i}`} className="p-6 border-l border-t border-white/5"></td>
                        ))}
                      </tr>
                    );
                  })}
                  
                  {/* Amenities - Detailed Comparison */}
                  <tr className="bg-white/[0.03]">
                    <td className="p-8 pl-8 font-bold text-gray-400 text-sm border-t border-white/5 align-top uppercase tracking-widest group-hover/row:text-white transition-colors">
                       Key Amenities
                    </td>
                    {comparedProperties.map((property) => (
                       <td key={property.id} className="p-8 border-l border-t border-white/5">
                         <div className="grid grid-cols-1 gap-4">
                           {(property.amenities || []).slice(0, 8).map((item, i) => (
                              <div key={i} className="flex items-center gap-3 text-sm text-gray-300 font-medium">
                                <div className="p-1 rounded-md bg-accent/10 border border-accent/20">
                                  <HiCheckCircle className="text-accent w-4 h-4" />
                                </div>
                                {item}
                              </div>
                           ))}
                         </div>
                       </td>
                     ))}
                     {Array.from({ length: 4 - comparedProperties.length }).map((_, i) => (
                        <td key={`aph-${i}`} className="p-8 border-l border-t border-white/5"></td>
                     ))}
                  </tr>

                  {/* CTA Footer Row */}
                  <tr className="bg-black/20">
                    <td className="p-10 border-t border-white/5 bg-white/[0.05]"></td>
                    {comparedProperties.map((property) => (
                       <td key={property.id} className="p-10 border-l border-t border-white/5">
                         <Link 
                          to={`/properties/${property.id}`} 
                          className="btn-primary w-full py-4 px-6 text-center text-sm font-black uppercase tracking-widest shadow-xl shadow-accent/10 hover:shadow-accent/30 transition-shadow"
                         >
                           Inquire Now
                         </Link>
                       </td>
                     ))}
                     {Array.from({ length: 4 - comparedProperties.length }).map((_, i) => (
                        <td key={`bph-${i}`} className="p-10 border-l border-t border-white/5"></td>
                     ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Compare;
