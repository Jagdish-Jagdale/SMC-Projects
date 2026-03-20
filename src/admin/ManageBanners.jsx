import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlinePlus, HiOutlineTrash, HiOutlinePencilSquare, HiOutlineXMark, HiOutlinePhoto, HiOutlineArrowUp, HiOutlineArrowDown } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { getBanners, addBanner, updateBanner, deleteBanner, uploadBannerImage } from '../firebase/settings';

const ManageBanners = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ buttonText: '', buttonLink: '', imageUrl: '', order: 0, active: true });

  useEffect(() => { fetchData(); }, []);
  const fetchData = async () => { setLoading(true); const data = await getBanners(); setItems(data || []); setLoading(false); };

  const openAdd = () => { setEditing(null); setForm({ buttonText: 'Visit Website', buttonLink: '/properties', imageUrl: '', order: items.length, active: true }); setShowModal(true); };
  const openEdit = (item) => { setEditing(item); setForm({ buttonText: item.buttonText || '', buttonLink: item.buttonLink || '', imageUrl: item.imageUrl || '', order: item.order || 0, active: item.active !== false }); setShowModal(true); };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    toast.loading('Uploading banner image...', { id: 'banner' });
    const res = await uploadBannerImage(file);
    if (res.success) { setForm(prev => ({ ...prev, imageUrl: res.url })); toast.success('Image uploaded!', { id: 'banner' }); }
    else toast.error('Upload failed', { id: 'banner' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.imageUrl) { toast.error('Image is required'); return; }
    toast.loading('Saving...', { id: 'save' });
    if (editing) {
      const res = await updateBanner(editing.id, form);
      if (res.success) { toast.success('Ad updated!', { id: 'save' }); setItems(prev => prev.map(i => i.id === editing.id ? { ...i, ...form } : i)); }
      else toast.error('Failed', { id: 'save' });
    } else {
      const res = await addBanner({ ...form, title: `Ad #${items.length + 1}` });
      if (res.success) { toast.success('Ad added!', { id: 'save' }); setItems(prev => [...prev, { id: res.id, ...form, title: `Ad #${items.length + 1}` }]); }
      else toast.error('Failed', { id: 'save' });
    }
    setShowModal(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this pop-up ad?')) return;
    const res = await deleteBanner(id);
    if (res.success) { toast.success('Deleted'); setItems(prev => prev.filter(i => i.id !== id)); }
  };

  const moveOrder = async (id, direction) => {
    const idx = items.findIndex(i => i.id === id);
    if ((direction === -1 && idx === 0) || (direction === 1 && idx === items.length - 1)) return;
    const newItems = [...items];
    const temp = newItems[idx];
    newItems[idx] = newItems[idx + direction];
    newItems[idx + direction] = temp;
    const reordered = newItems.map((item, i) => ({ ...item, order: i }));
    setItems(reordered);
    // Save order to Firebase
    for (const item of reordered) {
      await updateBanner(item.id, { order: item.order });
    }
    toast.success('Order updated');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div><h2 className="text-2xl font-bold text-primary font-[Outfit]">Pop-up Ads Management</h2><p className="text-gray-500 text-sm mt-1">Manage promotional ads that appear when users open the website.</p></div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2"><HiOutlinePlus className="w-5 h-5" /> Add New Ad</button>
      </div>

      <div className="card p-6 border border-gray-100">
        {loading ? (<div className="py-20 flex justify-center"><div className="spinner border-t-accent border-accent/20"></div></div>
        ) : items.length === 0 ? (<div className="py-20 text-center text-gray-400"><HiOutlinePhoto className="w-12 h-12 mx-auto opacity-20 mb-3" /><p>No ads yet. Add your first promotional pop-up!</p></div>
        ) : (
          <div className="space-y-4">
            {items.map((item, idx) => (
              <motion.div key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`flex flex-col md:flex-row items-stretch gap-4 border rounded-2xl overflow-hidden transition-shadow hover:shadow-lg ${item.active === false ? 'opacity-50' : ''}`}>
                <div className="w-full md:w-64 h-40 bg-gray-100 shrink-0 relative overflow-hidden">
                  {item.imageUrl ? <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-300"><HiOutlinePhoto className="w-12 h-12" /></div>}
                  <span className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold ${item.active !== false ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                    {item.active !== false ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex-1 p-4 flex flex-col justify-center">
                  <div>
                    <h3 className="text-lg font-bold text-primary">Pop-up Ad #{idx + 1}</h3>
                    {item.buttonText && <span className="inline-block mt-2 text-xs bg-accent/10 text-accent px-3 py-1 rounded-full font-medium">{item.buttonText} → {item.buttonLink}</span>}
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-xs text-gray-400 mr-auto">Order: #{idx + 1}</span>
                    <button onClick={() => moveOrder(item.id, -1)} className="p-1.5 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-lg" title="Move Up"><HiOutlineArrowUp className="w-4 h-4" /></button>
                    <button onClick={() => moveOrder(item.id, 1)} className="p-1.5 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-lg" title="Move Down"><HiOutlineArrowDown className="w-4 h-4" /></button>
                    <button onClick={() => openEdit(item)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg"><HiOutlinePencilSquare className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(item.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><HiOutlineTrash className="w-4 h-4" /></button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                <h3 className="text-xl font-bold text-primary font-[Outfit]">{editing ? 'Edit' : 'Add'} Pop-up Ad</h3>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-200 rounded-full"><HiOutlineXMark className="w-6 h-6" /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Upload Promotional Image *</label>
                  <label className="w-full h-40 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-accent group transition-all overflow-hidden bg-gray-50">
                    {form.imageUrl ? (
                      <img src={form.imageUrl} alt="" className="w-full h-full object-contain" />
                    ) : (
                      <>
                        <HiOutlinePhoto className="w-10 h-10 text-gray-300 group-hover:text-accent mb-2" />
                        <span className="text-xs text-gray-400 group-hover:text-accent">Click to upload your ad image</span>
                      </>
                    )}
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-semibold text-gray-700 mb-1">Button Text</label><input value={form.buttonText} onChange={e => setForm({...form, buttonText: e.target.value})} className="input-field" placeholder="e.g. Visit Website" /></div>
                  <div><label className="block text-sm font-semibold text-gray-700 mb-1">Button Link</label><input value={form.buttonLink} onChange={e => setForm({...form, buttonLink: e.target.value})} className="input-field" placeholder="e.g. /properties" /></div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.active} onChange={e => setForm({...form, active: e.target.checked})} className="w-4 h-4 text-accent rounded" /><span className="text-sm font-medium text-gray-700">Active (show on website)</span></label>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1 font-bold">Cancel</button>
                  <button type="submit" className="btn-primary flex-1 font-bold">{editing ? 'Update' : 'Publish'} Ad</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageBanners;
