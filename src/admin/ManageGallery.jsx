import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiOutlineCloudArrowUp, 
  HiOutlineTrash, 
  HiOutlinePhoto,
  HiOutlineVideoCamera,
  HiOutlineClipboard,
  HiOutlinePencilSquare,
  HiOutlineXMark
} from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { uploadMedia, getMedia, deleteMedia, updateMedia } from '../firebase/settings';

const ManageGallery = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [filter, setFilter] = useState('All');
  const [editingItem, setEditingItem] = useState(null);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const data = await getMedia();
      setMedia(data || []);
    } catch (error) {
      toast.error('Failed to load gallery');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    toast.loading(`Uploading ${files.length} file(s)...`, { id: 'upload' });

    try {
      const uploadPromises = files.map(file => {
        const folder = file.type.startsWith('video/') ? 'videos' : 'images';
        return uploadMedia(file, folder);
      });

      const results = await Promise.all(uploadPromises);
      const successful = results.filter(r => r.success);
      
      if (successful.length > 0) {
        toast.success(`Uploaded ${successful.length} file(s) successfully`, { id: 'upload' });
        fetchMedia(); // Refresh list
      } else {
        toast.error('Upload failed', { id: 'upload' });
      }
    } catch (error) {
      toast.error('Error during upload', { id: 'upload' });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this file? This will remove it from the website.')) {
      const res = await deleteMedia(id);
      if (res.success) {
        toast.success('File deleted');
        setMedia(prev => prev.filter(m => m.id !== id));
      } else {
        toast.error('Failed to delete');
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const { id, title, description } = editingItem;
    toast.loading('Updating...', { id: 'update' });
    
    const res = await updateMedia(id, { title, description });
    if (res.success) {
      toast.success('Updated successfully', { id: 'update' });
      setMedia(prev => prev.map(m => m.id === id ? { ...m, title, description } : m));
      setEditingItem(null);
    } else {
      toast.error('Update failed', { id: 'update' });
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('URL copied to clipboard');
  };

  const filteredMedia = media.filter(m => {
    if (filter === 'All') return true;
    if (filter === 'Images') return m.type?.startsWith('image/');
    if (filter === 'Videos') return m.type?.startsWith('video/');
    return false;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-primary font-[Outfit]">Media Gallery</h2>
          <p className="text-gray-500 text-sm mt-1">Manage project images and videos.</p>
        </div>
        <div className="flex gap-2">
          <label className={`btn-primary flex items-center gap-2 cursor-pointer ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
            <HiOutlineCloudArrowUp className="w-5 h-5" />
            {uploading ? 'Uploading...' : 'Upload Media'}
            <input type="file" multiple onChange={handleUpload} className="hidden" accept="image/*,video/*" />
          </label>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        {['All', 'Images', 'Videos'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all ${
              filter === tab ? 'bg-accent text-white shadow-lg' : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="card p-6 border border-gray-100">
        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="spinner border-t-accent border-accent/20"></div>
          </div>
        ) : filteredMedia.length === 0 ? (
          <div className="py-20 text-center text-gray-400 space-y-3">
            <HiOutlinePhoto className="w-12 h-12 mx-auto opacity-20" />
            <p>No media files found. Upload your first media file.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xxl:grid-cols-5 gap-6">
            <AnimatePresence>
              {filteredMedia.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group relative aspect-square rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  {item.type?.startsWith('video/') ? (
                    <div className="w-full h-full flex flex-col items-center justify-center text-accent">
                      <HiOutlineVideoCamera className="w-10 h-10" />
                      <span className="text-xs mt-3 font-semibold truncate w-full px-4 text-center text-gray-500">
                        {item.title || item.name}
                      </span>
                    </div>
                  ) : (
                    <img src={item.url} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  )}

                  {/* Info Overlay (Static) */}
                  <div className="absolute top-0 left-0 right-0 p-3 bg-gradient-to-b from-black/60 to-transparent">
                    <p className="text-white text-xs font-bold truncate">{item.title || 'No Title'}</p>
                  </div>

                  {/* Hover Actions */}
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setEditingItem(item)}
                        className="p-2.5 bg-white/20 hover:bg-accent text-white rounded-xl transition-all"
                        title="Edit Info"
                      >
                        <HiOutlinePencilSquare className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => copyToClipboard(item.url)}
                        className="p-2.5 bg-white/20 hover:bg-white/40 text-white rounded-xl transition-all"
                        title="Copy URL"
                      >
                        <HiOutlineClipboard className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-2.5 bg-white/20 hover:bg-red-500 text-white rounded-xl transition-all"
                        title="Delete"
                      >
                        <HiOutlineTrash className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setEditingItem(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                <h3 className="text-xl font-bold text-primary font-[Outfit]">Update Media Info</h3>
                <button onClick={() => setEditingItem(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                  <HiOutlineXMark className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleUpdate} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                  <input 
                    type="text" 
                    value={editingItem.title || ''} 
                    onChange={e => setEditingItem({...editingItem, title: e.target.value})}
                    className="input-field"
                    placeholder="Enter image title"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <textarea 
                    value={editingItem.description || ''} 
                    onChange={e => setEditingItem({...editingItem, description: e.target.value})}
                    className="input-field h-32 resize-none"
                    placeholder="Enter short description"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setEditingItem(null)} className="btn-secondary flex-1">Cancel</button>
                  <button type="submit" className="btn-primary flex-1">Save Changes</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageGallery;
