import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  HiOutlineCheckCircle, 
  HiOutlineArrowUpTray, 
  HiOutlineTrash,
  HiOutlinePlus 
} from 'react-icons/hi2';
import { useAbout } from '../hooks/useAbout';
import { uploadAboutImage } from '../firebase/about';
import { toast } from 'react-hot-toast';

const ManageAbout = () => {
  const { data, loading, updateData } = useAbout();
  const [formData, setFormData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  if (loading || !formData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="spinner border-accent/20 border-t-accent"></div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const res = await uploadAboutImage(file);
      if (res.success) {
        setFormData((prev) => ({
          ...prev,
          images: [...(prev.images || []), res.url]
        }));
        toast.success('Image uploaded successfully');
      } else {
        toast.error('Failed to upload image');
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while uploading');
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleTeamMemberChange = (index, field, value) => {
    const updatedTeam = [...(formData.teamMembers || [])];
    updatedTeam[index] = { ...updatedTeam[index], [field]: value };
    setFormData((prev) => ({ ...prev, teamMembers: updatedTeam }));
  };

  const addTeamMember = () => {
    setFormData((prev) => ({
      ...prev,
      teamMembers: [...(prev.teamMembers || []), { name: '', role: '', image: '' }]
    }));
  };

  const removeTeamMember = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      teamMembers: prev.teamMembers.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const success = await updateData(formData);
    setIsSaving(false);
    if (!success) {
      // Toast handles error internally in hook
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-5xl mx-auto"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary font-[Outfit]">Manage About Page</h2>
          <p className="text-sm text-gray-500 mt-1">Update content for the About Us page</p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={isSaving}
          className="btn-primary flex items-center gap-2"
        >
          {isSaving ? (
            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
          ) : (
            <HiOutlineCheckCircle className="w-5 h-5" />
          )}
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6 space-y-4">
            <h3 className="text-lg font-bold text-primary font-[Outfit] border-b pb-2">Main Content</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g. About Our Premium Real Estate"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                <input
                  type="text"
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g. Building Trust & Luxury"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="input-field min-h-[120px]"
                render="true"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mission</label>
                <textarea
                  name="mission"
                  value={formData.mission}
                  onChange={handleChange}
                  className="input-field min-h-[100px]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vision</label>
                <textarea
                  name="vision"
                  value={formData.vision}
                  onChange={handleChange}
                  className="input-field min-h-[100px]"
                />
              </div>
            </div>
          </div>

          <div className="card p-6 space-y-4">
            <h3 className="text-lg font-bold text-primary font-[Outfit] border-b pb-2">Key Stats</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experience (Years)</label>
                <input
                  type="text"
                  name="experienceYears"
                  value={formData.experienceYears}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Projects Completed</label>
                <input
                  type="text"
                  name="projectsCompleted"
                  value={formData.projectsCompleted}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cities Served</label>
                <input
                  type="text"
                  name="citiesServed"
                  value={formData.citiesServed}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
            </div>
          </div>

          <div className="card p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-lg font-bold text-primary font-[Outfit]">Team Members</h3>
              <button 
                type="button" 
                onClick={addTeamMember}
                className="text-accent hover:text-accent-dark text-sm font-medium flex items-center gap-1"
              >
                <HiOutlinePlus className="w-4 h-4" /> Add Member
              </button>
            </div>
            
            {formData.teamMembers?.length === 0 ? (
              <p className="text-gray-500 text-sm italic text-center py-4">No team members added yet.</p>
            ) : (
              <div className="space-y-4">
                {formData.teamMembers?.map((member, index) => (
                  <div key={index} className="flex gap-4 items-start bg-gray-50 p-4 rounded-xl border border-gray-100 relative">
                    <button 
                      onClick={() => removeTeamMember(index)}
                      className="absolute top-2 right-2 text-red-400 hover:text-red-500 bg-white shadow-sm p-1 rounded-full"
                    >
                      <HiOutlineTrash className="w-4 h-4" />
                    </button>
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Name</label>
                        <input
                          type="text"
                          value={member.name}
                          onChange={(e) => handleTeamMemberChange(index, 'name', e.target.value)}
                          className="input-field"
                          placeholder="Full Name"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Role/Title</label>
                        <input
                          type="text"
                          value={member.role}
                          onChange={(e) => handleTeamMemberChange(index, 'role', e.target.value)}
                          className="input-field"
                          placeholder="e.g. CEO"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Image URL</label>
                        <input
                          type="text"
                          value={member.image}
                          onChange={(e) => handleTeamMemberChange(index, 'image', e.target.value)}
                          className="input-field"
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        <div className="space-y-6">
          <div className="card p-6 space-y-4">
            <h3 className="text-lg font-bold text-primary font-[Outfit] border-b pb-2">About Images</h3>
            
            <div className="space-y-4">
              <label className="block w-full border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-accent hover:bg-accent/5 transition-colors cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                />
                <div className="flex flex-col items-center justify-center gap-2">
                  {uploadingImage ? (
                    <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center text-accent">
                        <HiOutlineArrowUpTray className="w-6 h-6" />
                      </div>
                      <span className="text-sm font-medium text-gray-600 border-b border-transparent hover:border-accent">
                        Click to upload images
                      </span>
                    </>
                  )}
                </div>
              </label>

              <div className="grid grid-cols-2 gap-3">
                {formData.images?.map((img, index) => (
                  <div key={index} className="relative group rounded-xl overflow-hidden aspect-video bg-gray-100 border border-gray-200">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={() => removeImage(index)}
                        className="bg-white text-red-500 p-2 rounded-full transform scale-0 group-hover:scale-100 transition-transform"
                      >
                        <HiOutlineTrash className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ManageAbout;
