/**
 * Properties Page
 * Advanced property listing with comprehensive filters
 */
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineAdjustmentsHorizontal, HiOutlineMagnifyingGlass } from 'react-icons/hi2';
import PageHero from '../components/PageHero';
import PropertyCard from '../components/PropertyCard';
import SectionHeading from '../components/SectionHeading';
import { sampleProperties } from '../utils/sampleData';
import { getProperties } from '../firebase/properties';

const propertyTypes = ['All', 'Apartment', 'Villa', 'Office', 'Shop', 'Warehouse'];
const furnishingStatus = ['All', 'Furnished', 'Semi-Furnished', 'Unfurnished'];
const AMENITIES_LIST = ['Swimming Pool', 'Gym', 'Club House', 'Garden', 'Security', 'Parking', 'Power Backup', 'Lift'];

const priceRanges = [
  { label: 'Any', value: 'any' },
  { label: 'Under ₹50 L', min: 0, max: 5000000 },
  { label: '₹50 L - ₹1 Cr', min: 5000000, max: 10000000 },
  { label: '₹1 Cr - ₹5 Cr', min: 10000000, max: 50000000 },
  { label: 'Above ₹5 Cr', min: 50000000, max: 9999999999 }
];

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter States
  const [filters, setFilters] = useState({
    type: 'All',
    city: '',
    minBedrooms: '',
    priceRange: 'any',
    furnishing: 'All',
    minArea: '',
    amenities: []
  });
  
  const [sortBy, setSortBy] = useState('Newest First');
  
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const data = await getProperties();
        if (data && data.length > 0) {
          setProperties(data);
        } else {
          setProperties(sampleProperties);
        }
      } catch (error) {
        setProperties(sampleProperties);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleAmenityToggle = (amenity) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const filteredProperties = properties.filter(prop => {
    // Search Term
    if (searchTerm && !prop.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !prop.area.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Type Filter
    if (filters.type !== 'All' && prop.type !== filters.type) return false;
    
    // City Filter
    if (filters.city && !prop.city?.toLowerCase().includes(filters.city.toLowerCase())) return false;
    
    // Bedrooms Filter
    if (filters.minBedrooms && (prop.bedrooms || 0) < parseInt(filters.minBedrooms)) return false;

    // Area Filter
    if (filters.minArea && (prop.areaSize || 0) < parseInt(filters.minArea)) return false;

    // Furnishing Filter
    if (filters.furnishing !== 'All' && prop.furnished !== filters.furnishing) return false;

    // Amenities Filter
    if (filters.amenities.length > 0) {
      const hasAll = filters.amenities.every(a => (prop.amenities || []).includes(a));
      if (!hasAll) return false;
    }
    
    // Price Filter
    if (filters.priceRange !== 'any') {
      const range = priceRanges.find(r => r.label === filters.priceRange);
      if (range && (prop.price < range.min || prop.price > range.max)) return false;
    }
    
    return true;
  }).sort((a, b) => {
    if (sortBy === 'Price: Low to High') return a.price - b.price;
    if (sortBy === 'Price: High to Low') return b.price - a.price;
    return (b.createdAt || 0) - (a.createdAt || 0);
  });

  return (
    <>
      <PageHero
        title="Find Your Dream Property"
        subtitle="Browse through our exclusive collection of premium properties"
        bgImage="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920"
      />

      <section className="py-20 bg-bg min-h-screen">
        <div className="container-custom">
          
          {/* Search and Filters Bar */}
          <div className="card p-6 mb-12 -mt-28 relative z-20">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <HiOutlineMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by area, location or property name..."
                  className="input-field !pl-14 h-14"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`btn-secondary h-14 flex items-center justify-center gap-2 flex-shrink-0 ${showFilters ? 'bg-accent text-white' : ''}`}
              >
                <HiOutlineAdjustmentsHorizontal className="w-5 h-5" />
                <span className="hidden sm:inline">Advanced Filters</span>
              </button>
            </div>

            {/* Expandable Filters */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-6 mt-6 border-t border-gray-100"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                  <select
                    className="input-field"
                    value={filters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                  >
                    {propertyTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                  <select
                    className="input-field"
                    value={filters.priceRange}
                    onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                  >
                    {priceRanges.map(range => (
                      <option key={range.label} value={range.label}>{range.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                  <select
                    className="input-field"
                    value={filters.minBedrooms}
                    onChange={(e) => handleFilterChange('minBedrooms', e.target.value)}
                  >
                    <option value="">Any</option>
                    <option value="1">1+ BHK</option>
                    <option value="2">2+ BHK</option>
                    <option value="3">3+ BHK</option>
                    <option value="4">4+ BHK</option>
                  </select>
                </div>
                 <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    placeholder="e.g. Pune"
                    className="input-field"
                    value={filters.city}
                    onChange={(e) => handleFilterChange('city', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min Area (sq ft)</label>
                  <input
                    type="number"
                    placeholder="e.g. 1000"
                    className="input-field"
                    value={filters.minArea}
                    onChange={(e) => handleFilterChange('minArea', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Furnishing</label>
                  <select
                    className="input-field"
                    value={filters.furnishing}
                    onChange={(e) => handleFilterChange('furnishing', e.target.value)}
                  >
                    {furnishingStatus.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Must-have Amenities</label>
                  <div className="flex flex-wrap gap-2">
                    {AMENITIES_LIST.map(amenity => (
                      <button
                        key={amenity}
                        onClick={() => handleAmenityToggle(amenity)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                          filters.amenities.includes(amenity)
                            ? 'bg-accent border-accent text-white shadow-md'
                            : 'bg-white border-gray-200 text-gray-600 hover:border-accent/40'
                        }`}
                      >
                        {amenity}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Results Info */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-primary font-[Outfit]">
              {filteredProperties.length} Properties Found
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Sort by:</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent font-medium text-primary outline-none cursor-pointer"
              >
                <option>Newest First</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Properties Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="spinner border-accent border-t-transparent"></div>
            </div>
          ) : filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProperties.map((property, index) => (
                <PropertyCard key={property.id} property={property} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                <HiOutlineMagnifyingGlass className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-2 font-[Outfit]">No properties match your filters</h3>
              <p className="text-gray-500 mb-6">Try adjusting your search criteria or resetting filters.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilters({ type: 'All', city: '', minBedrooms: '', priceRange: 'any' });
                }}
                className="btn-primary"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Properties;
