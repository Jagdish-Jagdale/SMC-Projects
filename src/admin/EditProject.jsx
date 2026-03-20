import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { HiOutlineArrowLeft, HiOutlinePhoto, HiOutlineXMark } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { getProjectById, updateProjectDoc, uploadProjectImages } from '../firebase/projects';

const PROJECT_TYPES = ['Residential Project', 'Commercial Project', 'Township Project', 'Layout Project'];
const PROJECT_STATUS = ['Upcoming', 'Ongoing', 'Completed'];

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    title: '', type: 'Residential Project', status: 'Upcoming',
    location: '', description: '', timeline: '', amenities: '', images: [],
    featured: false, seoTitle: '', seoDescription: ''
  });
  const [newImages, setNewImages] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const data = await getProjectById(id);
      if (data) setFormData({ ...formData, ...data });
      else { toast.error('Project not found'); navigate('/admin/projects'); }
      setFetching(false);
    };
    fetch();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
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
    if (!formData.title || !formData.location) { toast.error('Fill required fields'); return; }
    setLoading(true);
    try {
      let allImages = [...(formData.images || [])];
      if (newImages.length > 0) {
        toast.loading('Uploading images...', { id: 'upload' });
        const res = await uploadProjectImages(newImages, id);
        if (res.success) { allImages = [...allImages, ...res.urls]; toast.success('Uploaded!', { id: 'upload' }); }
      }
      const { id: _, ...updateData } = formData;
      await updateProjectDoc(id, { ...updateData, images: allImages });
      toast.success('Project updated!');
      navigate('/admin/projects');
    } catch (error) { toast.error('Update failed'); }
    finally { setLoading(false); }
  };

  if (fetching) return <div className="py-20 flex justify-center"><div className="spinner border-t-accent border-accent/20"></div></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/admin/projects')} className="p-2 hover:bg-gray-100 rounded-lg"><HiOutlineArrowLeft className="w-6 h-6 text-gray-600" /></button>
        <div><h2 className="text-2xl font-bold text-primary font-[Outfit]">Edit Project</h2><p className="text-gray-500 text-sm mt-1">Update project details.</p></div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card border border-gray-100 p-6 space-y-6">
          <h3 className="text-lg font-bold text-primary border-b pb-2">Basic Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Project Name *</label><input type="text" name="title" value={formData.title} onChange={handleInputChange} className="input-field" required /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Type</label><select name="type" value={formData.type} onChange={handleInputChange} className="input-field">{PROJECT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Status</label><select name="status" value={formData.status} onChange={handleInputChange} className="input-field">{PROJECT_STATUS.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
            <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Location *</label><input type="text" name="location" value={formData.location} onChange={handleInputChange} className="input-field" required /></div>
            <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Timeline</label><input type="text" name="timeline" value={formData.timeline} onChange={handleInputChange} className="input-field" /></div>
          </div>
        </div>
        <div className="card border border-gray-100 p-6 space-y-6">
          <h3 className="text-lg font-bold text-primary border-b pb-2">Description & Features</h3>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Key Amenities (comma separated)</label><input type="text" name="amenities" value={formData.amenities} onChange={handleInputChange} className="input-field" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea name="description" value={formData.description} onChange={handleInputChange} className="input-field h-32 resize-none"></textarea></div>
        </div>
        {/* SEO & Status */}
        <div className="card border border-gray-100 p-6 space-y-6">
          <h3 className="text-lg font-bold text-primary border-b pb-2">SEO & Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title (SEO)</label>
              <input type="text" name="seoTitle" value={formData.seoTitle} onChange={handleInputChange} className="input-field" placeholder="SEO optimized title" />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="featured" checked={formData.featured} onChange={handleInputChange} className="w-5 h-5 text-accent rounded focus:ring-accent" />
                <span className="font-semibold text-gray-700">Featured Project (Show on Homepage)</span>
              </label>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description (SEO)</label>
              <textarea name="seoDescription" value={formData.seoDescription} onChange={handleInputChange} className="input-field h-20 resize-none" placeholder="Search result summary..."></textarea>
            </div>
          </div>
        </div>

        <div className="card border border-gray-100 p-6 space-y-6">
          <h3 className="text-lg font-bold text-primary border-b pb-2">Project Media</h3>
          <div className="flex flex-wrap gap-4">
            {(formData.images || []).map((url, i) => (<div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden border group"><img src={url} alt="" className="w-full h-full object-cover" /><button type="button" onClick={() => removeExistingImage(i)} className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><HiOutlineXMark className="w-6 h-6" /></button></div>))}
            {newPreviews.map((url, i) => (<div key={`n-${i}`} className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-accent group"><img src={url} alt="" className="w-full h-full object-cover" /><button type="button" onClick={() => removeNewImage(i)} className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><HiOutlineXMark className="w-6 h-6" /></button></div>))}
            <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-accent cursor-pointer"><HiOutlinePhoto className="w-8 h-8 mb-1" /><span className="text-xs">Add</span><input type="file" multiple accept="image/*" onChange={handleNewImages} className="hidden" /></label>
          </div>
        </div>
        <div className="flex justify-end gap-4 pt-4 pb-12">
          <button type="button" onClick={() => navigate('/admin/projects')} className="btn-secondary px-6">Cancel</button>
          <button type="submit" disabled={loading} className={`btn-primary px-8 flex items-center gap-2 ${loading ? 'opacity-70' : ''}`}>
            {loading && <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>}
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProject;
