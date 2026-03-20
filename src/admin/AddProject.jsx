import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineArrowLeft, HiOutlinePhoto, HiOutlineXMark } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { addProject, uploadProjectImages } from '../firebase/projects';

const PROJECT_TYPES = [
  'Residential Project', 'Commercial Project', 'Township Project', 'Layout Project'
];

const PROJECT_STATUS = [
  'Upcoming', 'Ongoing', 'Completed'
];

const AddProject = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: 'Residential Project',
    status: 'Upcoming',
    location: '',
    description: '',
    timeline: '',
    amenities: '',
    featured: false,
    seoTitle: '',
    seoDescription: ''
  });
  
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
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
    if (!formData.title || !formData.location) {
      toast.error('Please fill required fields (Title, Location)');
      return;
    }

    setLoading(true);
    try {
      // Add a timeout to the initial addProject call
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timed out. Please check your internet or Firebase rules.')), 10000)
      );

      // Add project data without images first to get ID
      const projectRes = await Promise.race([
        addProject({
          ...formData,
          images: [] 
        }),
        timeoutPromise
      ]);

      if (!projectRes.success) throw new Error(projectRes.error);
      const projectId = projectRes.id;

      // Upload Images
      if (images.length > 0) {
        toast.loading('Uploading project images...', { id: 'upload' });
        const uploadRes = await uploadProjectImages(images, projectId);
        if (uploadRes.success) {
          const { updateProjectDoc } = await import('../firebase/projects');
          await updateProjectDoc(projectId, { images: uploadRes.urls });
          toast.success('Images uploaded!', { id: 'upload' });
        } else {
          toast.error('Failed to upload images', { id: 'upload' });
        }
      }

      toast.success('Project added successfully!');
      navigate('/admin/projects');
    } catch (error) {
      toast.error('Failed to add project');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => navigate('/admin/projects')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <HiOutlineArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-primary font-[Outfit]">Add New Project</h2>
          <p className="text-gray-500 text-sm mt-1">Create a showcase for your major builds.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card border border-gray-100 p-6 space-y-6">
          <h3 className="text-lg font-bold text-primary border-b pb-2">Basic Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Project Name *</label>
              <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="input-field" placeholder="e.g. Advik Townships" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project Type</label>
              <select name="type" value={formData.type} onChange={handleInputChange} className="input-field">
                {PROJECT_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select name="status" value={formData.status} onChange={handleInputChange} className="input-field">
                {PROJECT_STATUS.map(st => <option key={st} value={st}>{st}</option>)}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
              <input type="text" name="location" value={formData.location} onChange={handleInputChange} className="input-field" placeholder="e.g. Hinjewadi Phase 1, Pune" required />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Timeline / Expected Completion</label>
              <input type="text" name="timeline" value={formData.timeline} onChange={handleInputChange} className="input-field" placeholder="e.g. December 2026" />
            </div>
          </div>
        </div>

        {/* Description & Amenities */}
        <div className="card border border-gray-100 p-6 space-y-6">
          <h3 className="text-lg font-bold text-primary border-b pb-2">Description & Features</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Key Amenities (comma separated)</label>
            <input type="text" name="amenities" value={formData.amenities} onChange={handleInputChange} className="input-field" placeholder="Swimming Pool, Smart Security, Solar Backup" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Description</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} className="input-field h-32 resize-none" placeholder="Enter detailed project description..."></textarea>
          </div>
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

        {/* Images */}
        <div className="card border border-gray-100 p-6 space-y-6">
          <h3 className="text-lg font-bold text-primary border-b pb-2">Project Media</h3>
          
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
            {loading ? 'Publishing...' : 'Publish Project'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProject;
