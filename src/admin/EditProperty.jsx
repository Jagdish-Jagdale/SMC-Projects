import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { HiOutlineArrowLeft, HiOutlinePhoto, HiOutlineXMark } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { getPropertyById, updateProperty, uploadPropertyImages } from '../firebase/properties';
import { getAgents } from '../firebase/agents';

const AMENITIES_LIST = [
  'Swimming Pool', 'Gymnasium', 'Club House', '24/7 Security',
  'Power Backup', 'Car Parking', 'Children\'s Play Area', 'Landscaped Gardens',
  'Jogging Track', 'Tennis Court', 'Indoor Games', 'CCTV Surveillance'
];
const PROPERTY_TYPES = ['Apartment', 'Villa', 'Plot', 'Commercial', 'Office', 'Shop', 'Warehouse'];

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    title: '', price: '', city: '', area: '', sqft: '', address: '',
    bedrooms: '', bathrooms: '', parking: '', floor: '', facing: '',
    furnished: 'Unfurnished', status: 'Available', type: 'Apartment',
    description: '', featured: false, amenities: [], images: [], agentId: '',
    priority: 0, seoTitle: '', seoDescription: ''
  });
  const [newImages, setNewImages] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [data, agentData] = await Promise.all([getPropertyById(id), getAgents()]);
      if (data) {
        setFormData({ ...formData, ...data });
      } else {
        toast.error('Property not found');
        navigate('/admin/properties');
      }
      setAgents(agentData || []);
      setFetching(false);
    };
    fetchData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleAmenityChange = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleNewImages = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(prev => [...prev, ...files]);
    setNewPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
  };

  const removeExistingImage = (index) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const removeNewImage = (index) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
    setNewPreviews(prev => { URL.revokeObjectURL(prev[index]); return prev.filter((_, i) => i !== index); });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.price || !formData.city) {
      toast.error('Please fill required fields'); return;
    }
    setLoading(true);
    try {
      let allImages = [...(formData.images || [])];
      if (newImages.length > 0) {
        toast.loading('Uploading new images...', { id: 'upload' });
        const res = await uploadPropertyImages(newImages, id);
        if (res.success) { allImages = [...allImages, ...res.urls]; toast.success('Images uploaded!', { id: 'upload' }); }
        else toast.error('Image upload failed', { id: 'upload' });
      }
      const { id: _, ...updateData } = formData;
      await updateProperty(id, { 
        ...updateData, 
        price: Number(updateData.price), 
        bedrooms: Number(updateData.bedrooms) || 0, 
        bathrooms: Number(updateData.bathrooms) || 0,
        priority: Number(updateData.priority) || 0,
        images: allImages 
      });
      toast.success('Property updated!');
      navigate('/admin/properties');
    } catch (error) { toast.error('Update failed'); console.error(error); }
    finally { setLoading(false); }
  };

  if (fetching) return <div className="py-20 flex justify-center"><div className="spinner border-t-accent border-accent/20"></div></div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/admin/properties')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><HiOutlineArrowLeft className="w-6 h-6 text-gray-600" /></button>
        <div><h2 className="text-2xl font-bold text-primary font-[Outfit]">Edit Property</h2><p className="text-gray-500 text-sm mt-1">Update the property listing details.</p></div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="card border border-gray-100 p-6 space-y-6">
          <h3 className="text-lg font-bold text-primary border-b pb-2">Basic Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Property Title *</label><input type="text" name="title" value={formData.title} onChange={handleInputChange} className="input-field" required /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label><input type="number" name="price" value={formData.price} onChange={handleInputChange} className="input-field" required /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label><select name="type" value={formData.type} onChange={handleInputChange} className="input-field">{PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Status</label><select name="status" value={formData.status} onChange={handleInputChange} className="input-field"><option value="Available">Available</option><option value="Sold">Sold</option><option value="Rented">Rented</option></select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Furnished</label><select name="furnished" value={formData.furnished} onChange={handleInputChange} className="input-field"><option value="Furnished">Furnished</option><option value="Semi-Furnished">Semi-Furnished</option><option value="Unfurnished">Unfurnished</option></select></div>
          </div>
        </div>

        <div className="card border border-gray-100 p-6 space-y-6">
          <h3 className="text-lg font-bold text-primary border-b pb-2">Location</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">City *</label><input type="text" name="city" value={formData.city} onChange={handleInputChange} className="input-field" required /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Locality/Area</label><input type="text" name="area" value={formData.area} onChange={handleInputChange} className="input-field" /></div>
            <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label><textarea name="address" value={formData.address} onChange={handleInputChange} className="input-field h-24 resize-none"></textarea></div>
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

        <div className="card border border-gray-100 p-6 space-y-6">
          <h3 className="text-lg font-bold text-primary border-b pb-2">Features</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Area (sq ft)</label><input type="number" name="sqft" value={formData.sqft} onChange={handleInputChange} className="input-field" placeholder="e.g. 1200" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label><input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleInputChange} className="input-field" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label><input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleInputChange} className="input-field" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Floor</label><input type="text" name="floor" value={formData.floor} onChange={handleInputChange} className="input-field" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Parking</label><input type="number" name="parking" value={formData.parking} onChange={handleInputChange} className="input-field" /></div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer pt-2"><input type="checkbox" name="featured" checked={formData.featured} onChange={handleInputChange} className="w-5 h-5 text-accent rounded" /><span className="font-medium text-gray-700">Mark as Featured</span></label>
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
          </div>
        </div>

        <div className="card border border-gray-100 p-6 space-y-6">
          <h3 className="text-lg font-bold text-primary border-b pb-2">Amenities</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {AMENITIES_LIST.map(a => (<label key={a} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded-lg"><input type="checkbox" checked={(formData.amenities || []).includes(a)} onChange={() => handleAmenityChange(a)} className="w-4 h-4 text-accent rounded" /><span className="text-sm text-gray-700">{a}</span></label>))}
          </div>
        </div>

        <div className="card border border-gray-100 p-6 space-y-6">
          <h3 className="text-lg font-bold text-primary border-b pb-2">Description & Media</h3>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea name="description" value={formData.description} onChange={handleInputChange} className="input-field h-32 resize-none"></textarea></div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Images</label>
            <div className="flex flex-wrap gap-4">
              {(formData.images || []).map((url, i) => (<div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden border group"><img src={url} alt="" className="w-full h-full object-cover" /><button type="button" onClick={() => removeExistingImage(i)} className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><HiOutlineXMark className="w-6 h-6" /></button></div>))}
              {newPreviews.map((url, i) => (<div key={`new-${i}`} className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-accent group"><img src={url} alt="" className="w-full h-full object-cover" /><button type="button" onClick={() => removeNewImage(i)} className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><HiOutlineXMark className="w-6 h-6" /></button></div>))}
              <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-accent hover:text-accent cursor-pointer transition-colors"><HiOutlinePhoto className="w-8 h-8 mb-1" /><span className="text-xs font-medium">Add</span><input type="file" multiple accept="image/*" onChange={handleNewImages} className="hidden" /></label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4 pb-12">
          <button type="button" onClick={() => navigate('/admin/properties')} className="btn-secondary px-6">Cancel</button>
          <button type="submit" disabled={loading} className={`btn-primary px-8 flex items-center gap-2 ${loading ? 'opacity-70' : ''}`}>
            {loading && <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>}
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProperty;
