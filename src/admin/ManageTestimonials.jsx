import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlinePlus, HiOutlineTrash, HiOutlinePencilSquare, HiOutlineXMark, HiOutlineStar, HiOutlineUser } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { getTestimonials, addTestimonial, updateTestimonial, deleteTestimonial, uploadTestimonialPhoto } from '../firebase/testimonials';

const ManageTestimonials = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', role: '', company: '', message: '', rating: 5, photoUrl: '' });

  const fetchData = async () => {
    setLoading(true);
    const data = await getTestimonials();
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const openAdd = () => { setEditing(null); setForm({ name: '', role: '', company: '', message: '', rating: 5, photoUrl: '' }); setShowModal(true); };
  const openEdit = (item) => { setEditing(item); setForm({ name: item.name || '', role: item.role || '', company: item.company || '', message: item.message || '', rating: item.rating || 5, photoUrl: item.photoUrl || '' }); setShowModal(true); };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    toast.loading('Uploading photo...', { id: 'photo' });
    const res = await uploadTestimonialPhoto(file);
    if (res.success) { setForm(prev => ({ ...prev, photoUrl: res.url })); toast.success('Photo uploaded!', { id: 'photo' }); }
    else toast.error('Upload failed', { id: 'photo' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.message) { toast.error('Name and message are required'); return; }
    toast.loading('Saving...', { id: 'save' });

    if (editing) {
      const res = await updateTestimonial(editing.id, form);
      if (res.success) {
        toast.success('Testimonial updated!', { id: 'save' });
        setItems(prev => prev.map(i => i.id === editing.id ? { ...i, ...form } : i));
      } else toast.error('Update failed', { id: 'save' });
    } else {
      const res = await addTestimonial(form);
      if (res.success) {
        toast.success('Testimonial added!', { id: 'save' });
        setItems(prev => [{ id: res.id, ...form }, ...prev]);
      } else toast.error('Add failed', { id: 'save' });
    }
    setShowModal(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this testimonial?')) return;
    const res = await deleteTestimonial(id);
    if (res.success) { toast.success('Deleted'); setItems(prev => prev.filter(i => i.id !== id)); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-primary font-[Outfit]">Manage Testimonials</h2>
          <p className="text-gray-500 text-sm mt-1">Add and manage client reviews displayed on the website.</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2"><HiOutlinePlus className="w-5 h-5" /> Add Review</button>
      </div>

      <div className="card p-6 border border-gray-100">
        {loading ? (
          <div className="py-20 flex justify-center"><div className="spinner border-t-accent border-accent/20"></div></div>
        ) : items.length === 0 ? (
          <div className="py-20 text-center text-gray-400"><HiOutlineStar className="w-12 h-12 mx-auto opacity-20 mb-3" /><p>No testimonials yet. Add your first client review!</p></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {items.map((item) => (
              <motion.div key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow group relative">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center shrink-0 overflow-hidden">
                    {item.photoUrl ? <img src={item.photoUrl} alt="" className="w-full h-full object-cover" /> : <HiOutlineUser className="w-6 h-6 text-accent" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-primary truncate">{item.name}</h4>
                    <p className="text-xs text-gray-500 truncate">{item.role}{item.company ? `, ${item.company}` : ''}</p>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-3">{[1,2,3,4,5].map(s => <HiOutlineStar key={s} className={`w-4 h-4 ${s <= (item.rating || 5) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />)}</div>
                <p className="text-sm text-gray-600 line-clamp-3 italic">"{item.message}"</p>
                <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(item)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><HiOutlinePencilSquare className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><HiOutlineTrash className="w-4 h-4" /></button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                <h3 className="text-xl font-bold text-primary font-[Outfit]">{editing ? 'Edit' : 'Add'} Testimonial</h3>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-200 rounded-full"><HiOutlineXMark className="w-6 h-6" /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-semibold text-gray-700 mb-1">Name *</label><input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input-field" required /></div>
                  <div><label className="block text-sm font-semibold text-gray-700 mb-1">Role</label><input type="text" value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="input-field" placeholder="e.g. CEO" /></div>
                </div>
                <div><label className="block text-sm font-semibold text-gray-700 mb-1">Company</label><input type="text" value={form.company} onChange={e => setForm({...form, company: e.target.value})} className="input-field" /></div>
                <div><label className="block text-sm font-semibold text-gray-700 mb-1">Review Message *</label><textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})} className="input-field h-28 resize-none" required /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-semibold text-gray-700 mb-1">Rating</label><select value={form.rating} onChange={e => setForm({...form, rating: Number(e.target.value)})} className="input-field"><option value={5}>⭐⭐⭐⭐⭐ (5)</option><option value={4}>⭐⭐⭐⭐ (4)</option><option value={3}>⭐⭐⭐ (3)</option><option value={2}>⭐⭐ (2)</option><option value={1}>⭐ (1)</option></select></div>
                  <div><label className="block text-sm font-semibold text-gray-700 mb-1">Photo</label><input type="file" accept="image/*" onChange={handlePhotoUpload} className="input-field text-sm" /></div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                  <button type="submit" className="btn-primary flex-1">{editing ? 'Update' : 'Add'} Review</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageTestimonials;
