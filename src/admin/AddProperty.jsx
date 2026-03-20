import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineArrowLeft, HiOutlinePhoto, HiOutlineXMark } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { addProperty, uploadPropertyImages } from '../firebase/properties';
import { getAgents } from '../firebase/agents';

const AMENITIES_LIST = [
  'Swimming Pool', 'Gymnasium', 'Club House', '24/7 Security',
  'Power Backup', 'Car Parking', 'Children\'s Play Area', 'Landscaped Gardens',
  'Jogging Track', 'Tennis Court', 'Indoor Games', 'CCTV Surveillance'
];

const PROPERTY_TYPES = [
  'Apartment', 'Villa', 'Plot', 'Commercial', 'Office', 'Shop', 'Warehouse'
];

const AddProperty = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    city: '',
    area: '',
    sqft: '',
    address: '',
    bedrooms: '',
    bathrooms: '',
    parking: '',
    floor: '',
    facing: '',
    furnished: 'Unfurnished',
    status: 'Available',
    type: 'Apartment',
    description: '',
    featured: false,
    amenities: [],
    agentId: '',
    priority: 0,
    seoTitle: '',
    seoDescription: '',
    virtualTour: ''
  });
  
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    const fetchAgents = async () => {
      const data = await getAgents();
      setAgents(data || []);
    };
    fetchAgents();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAmenityChange = (amenity) => {
    setFormData(prev => {
      if (prev.amenities.includes(amenity)) {
        return { ...prev, amenities: prev.amenities.filter(a => a !== amenity) };
      } else {
        return { ...prev, amenities: [...prev.amenities, amenity] };
      }
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);
    
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...previews]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.price || !formData.city) {
      toast.error('Please fill required fields (Title, Price, City)');
      return;
    }

    setLoading(true);
    try {
      // Add a timeout to the initial operation
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timed out. Please check your internet or Firebase rules.')), 10000)
      );

      // 1. Add property data (without images first to get ID)
      const propertyRes = await Promise.race([
        addProperty({
          ...formData,
          price: Number(formData.price),
          bedrooms: Number(formData.bedrooms) || 0,
          bathrooms: Number(formData.bathrooms) || 0,
          images: [] // Temporary empty array
        }),
        timeoutPromise
      ]);

      if (!propertyRes.success) throw new Error(propertyRes.error);
      const propertyId = propertyRes.id;

      // 2. Upload Images and update property URL references
      if (images.length > 0) {
        toast.loading('Uploading images...', { id: 'upload' });
        const uploadRes = await uploadPropertyImages(images, propertyId);
        if (uploadRes.success) {
          // Ideally you update the property with image URLs. In Realtime DB, we'll patch it.
          const { updateProperty } = await import('../firebase/properties');
          await updateProperty(propertyId, { images: uploadRes.urls });
          toast.success('Images uploaded!', { id: 'upload' });
        } else {
          toast.error('Failed to upload images', { id: 'upload' });
        }
      }

      toast.success('Property added successfully!');
      navigate('/admin/properties');
    } catch (error) {
      toast.error('Failed to add property');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => navigate('/admin/properties')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <HiOutlineArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-primary font-[Outfit]">Add New Property</h2>
          <p className="text-gray-500 text-sm mt-1">Fill in the details for the new listing.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Details */}
        <div className="card border border-gray-100 p-6 space-y-6">
          <h3 className="text-lg font-bold text-primary border-b pb-2">Basic Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Property Title *</label>
              <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="input-field" placeholder="e.g. Luxury Space in Koregaon Park" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
              <input type="number" name="price" value={formData.price} onChange={handleInputChange} className="input-field" placeholder="e.g. 15000000" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
              <select name="type" value={formData.type} onChange={handleInputChange} className="input-field">
                {PROPERTY_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select name="status" value={formData.status} onChange={handleInputChange} className="input-field">
                <option value="Available">Available</option>
                <option value="Sold">Sold</option>
                <option value="Rented">Rented</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Furnished Status</label>
              <select name="furnished" value={formData.furnished} onChange={handleInputChange} className="input-field">
                <option value="Furnished">Furnished</option>
                <option value="Semi-Furnished">Semi-Furnished</option>
                <option value="Unfurnished">Unfurnished</option>
              </select>
            </div>
          </div>
        </div>

        {/* Location Details */}
        <div className="card border border-gray-100 p-6 space-y-6">
          <h3 className="text-lg font-bold text-primary border-b pb-2">Location</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
              <input type="text" name="city" value={formData.city} onChange={handleInputChange} className="input-field" placeholder="e.g. Pune" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Locality/Area</label>
              <input type="text" name="area" value={formData.area} onChange={handleInputChange} className="input-field" placeholder="e.g. Koregaon Park" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Address (Map Reference)</label>
              <textarea name="address" value={formData.address} onChange={handleInputChange} className="input-field h-24 resize-none" placeholder="Enter complete address"></textarea>
            </div>

            {agents.length > 0 && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Assign to Agent</label>
                <select name="agentId" value={formData.agentId} onChange={handleInputChange} className="input-field">
                  <option value="">— No Agent —</option>
                  {agents.map(a => <option key={a.id} value={a.id}>{a.name} ({a.designation || 'Agent'})</option>)}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Features & Specifications */}
        <div className="card border border-gray-100 p-6 space-y-6">
          <h3 className="text-lg font-bold text-primary border-b pb-2">Features</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
              <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleInputChange} className="input-field" placeholder="e.g. 3" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
              <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleInputChange} className="input-field" placeholder="e.g. 3" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Area (sq ft)</label>
              <input type="number" name="sqft" value={formData.sqft} onChange={handleInputChange} className="input-field" placeholder="e.g. 1200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Floor</label>
              <input type="text" name="floor" value={formData.floor} onChange={handleInputChange} className="input-field" placeholder="e.g. 5th" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Parking</label>
              <input type="number" name="parking" value={formData.parking} onChange={handleInputChange} className="input-field" placeholder="e.g. 2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Facing</label>
              <input type="text" name="facing" value={formData.facing} onChange={handleInputChange} className="input-field" placeholder="e.g. East" />
            </div>
          </div>

          <div className="pt-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="featured" checked={formData.featured} onChange={handleInputChange} className="w-5 h-5 text-accent rounded focus:ring-accent" />
              <span className="font-medium text-gray-700">Mark as Featured Property (Appears on Homepage)</span>
            </label>
          </div>
        </div>

        {/* Amenities Selection */}
        <div className="card border border-gray-100 p-6 space-y-6">
          <h3 className="text-lg font-bold text-primary border-b pb-2">Amenities</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {AMENITIES_LIST.map(amenity => (
              <label key={amenity} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded-lg">
                <input 
                  type="checkbox" 
                  checked={formData.amenities.includes(amenity)}
                  onChange={() => handleAmenityChange(amenity)}
                  className="w-4 h-4 text-accent rounded focus:ring-accent" 
                />
                <span className="text-sm text-gray-700">{amenity}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="card border border-gray-100 p-6 space-y-6">
          <h3 className="text-lg font-bold text-primary border-b pb-2">SEO & Priority</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title (SEO)</label>
              <input type="text" name="seoTitle" value={formData.seoTitle} onChange={handleInputChange} className="input-field" placeholder="Meta title for Google" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority (Higher numbers show first)</label>
              <input type="number" name="priority" value={formData.priority} onChange={handleInputChange} className="input-field" placeholder="e.g. 10" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description (SEO)</label>
              <textarea name="seoDescription" value={formData.seoDescription} onChange={handleInputChange} className="input-field h-20 resize-none" placeholder="Summary for search results..."></textarea>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Virtual Tour URL (e.g. YouTube, Matterport)</label>
              <input type="url" name="virtualTour" value={formData.virtualTour} onChange={handleInputChange} className="input-field" placeholder="https://..." />
            </div>
          </div>
        </div>

        {/* Description & Images */}
        <div className="card border border-gray-100 p-6 space-y-6">
          <h3 className="text-lg font-bold text-primary border-b pb-2">Description & Media</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Property Description</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} className="input-field h-32 resize-none" placeholder="Enter detailed description..."></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Images</label>
            <div className="flex flex-wrap gap-4">
              {/* Image Previews */}
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 group">
                  <img src={preview} alt="preview" className="w-full h-full object-cover" />
                  <button 
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <HiOutlineXMark className="w-6 h-6" />
                  </button>
                </div>
              ))}
              
              {/* Upload Button */}
              <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-accent hover:text-accent cursor-pointer transition-colors">
                <HiOutlinePhoto className="w-8 h-8 mb-1" />
                <span className="text-xs font-medium">Add Photo</span>
                <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4 pb-12">
          <button 
            type="submit" 
            disabled={loading}
            className={`btn-primary px-8 flex items-center gap-2 ${loading ? 'opacity-70 cursor-wait' : ''}`}
          >
            {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : null}
            {loading ? 'Publishing...' : 'Publish Property'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProperty;
