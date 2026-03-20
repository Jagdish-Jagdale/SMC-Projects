/**
 * Manage Properties Page
 * CRUD operations for properties in Admin panel
 */
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  HiOutlinePlus, 
  HiOutlinePencil, 
  HiOutlineTrash, 
  HiOutlineStar,
  HiStar,
  HiOutlineHashtag
} from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { 
  getProperties, 
  deleteProperty, 
  toggleFeatured 
} from '../firebase/properties';
import { sampleProperties } from '../utils/sampleData';
import { formatPrice } from '../utils/helpers';

import { useNavigate } from 'react-router-dom';

const ManageProperties = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination & Filtering
  const [searchTerm, setSearchTerm] = useState('');

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Firebase fetch timeout')), 1500)
      );
      
      const data = await Promise.race([
        getProperties(),
        timeoutPromise
      ]);
      setProperties(data || []);
    } catch (error) {
      console.warn("Using sample properties due to Missing Config / Timeout:", error.message);
      setProperties(sampleProperties || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      const res = await deleteProperty(id);
      if (res.success) {
        toast.success('Property deleted successfully');
        setProperties(prev => prev.filter(p => p.id !== id));
      } else {
        toast.error('Failed to delete property');
      }
    }
  };

  const handleToggleFeatured = async (id, currentStatus) => {
    const res = await toggleFeatured(id, !currentStatus);
    if (res.success) {
      toast.success(currentStatus ? 'Removed from featured' : 'Marked as featured');
      setProperties(prev => prev.map(p => p.id === id ? { ...p, featured: !currentStatus } : p));
    } else {
      toast.error('Failed to update status');
    }
  };

  const filteredProperties = properties
    .filter(p => 
      p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.city?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => (Number(b.priority) || 0) - (Number(a.priority) || 0));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-primary font-[Outfit]">Manage Properties</h2>
          <p className="text-gray-500 text-sm mt-1">Add, edit, or remove properties from your listings</p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={() => navigate('/admin/properties/add')}>
          <HiOutlinePlus className="w-5 h-5" />
          Add Property
        </button>
      </div>

      <div className="card p-4 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
          <input 
            type="text" 
            placeholder="Search properties by name or city..." 
            className="input-field max-w-md w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex gap-2">
            <select className="input-field text-sm py-2">
              <option>All Types</option>
              <option>Apartment</option>
              <option>Villa</option>
              <option>Commercial</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="spinner border-t-accent border-accent/20"></div>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="py-20 text-center text-gray-500">
            No properties found. Add your first property!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-sm text-gray-500 font-medium">
                  <th className="pb-3 px-4 uppercase tracking-wider font-semibold">Property</th>
                  <th className="pb-3 px-4 uppercase tracking-wider font-semibold">Location</th>
                  <th className="pb-3 px-4 uppercase tracking-wider font-semibold">Price</th>
                  <th className="pb-3 px-4 uppercase tracking-wider font-semibold text-center">Priority</th>
                  <th className="pb-3 px-4 uppercase tracking-wider font-semibold text-center">Featured</th>
                  <th className="pb-3 px-4 uppercase tracking-wider font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProperties.map((property) => (
                  <motion.tr 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key={property.id} 
                    className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                          {property.images && property.images[0] ? (
                            <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No img</div>
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-primary max-w-xs truncate">{property.title}</div>
                          <div className="text-xs text-accent mt-0.5">{property.type}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {property.area}, {property.city}
                    </td>
                    <td className="py-4 px-4 font-semibold text-primary">
                      {formatPrice(property.price)}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs font-bold text-gray-600">
                        <HiOutlineHashtag className="w-3 h-3" /> {property.priority || 0}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button 
                        onClick={() => handleToggleFeatured(property.id, property.featured)}
                        className={`p-2 rounded-full transition-colors ${property.featured ? 'text-yellow-500 hover:bg-yellow-50' : 'text-gray-300 hover:text-yellow-500 hover:bg-yellow-50'}`}
                        title={property.featured ? 'Remove from featured' : 'Mark as featured'}
                      >
                        {property.featured ? <HiStar className="w-5 h-5" /> : <HiOutlineStar className="w-5 h-5" />}
                      </button>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => navigate(`/admin/properties/edit/${property.id}`)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                          <HiOutlinePencil className="w-5 h-5" />
                        </button>
                        <button 
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          onClick={() => handleDelete(property.id, property.title)}
                        >
                          <HiOutlineTrash className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageProperties;
