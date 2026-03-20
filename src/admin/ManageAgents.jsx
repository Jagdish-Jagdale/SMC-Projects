import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlinePlus, HiOutlineTrash, HiOutlinePencilSquare, HiOutlineXMark, HiOutlineUser, HiOutlinePhone, HiOutlineEnvelope, HiOutlinePhoto } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { getAgents, addAgent, updateAgent, deleteAgent, uploadAgentPhoto } from '../firebase/agents';

const ManageAgents = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', designation: '', bio: '', photoUrl: '', specialization: '', status: 'Active' });

  useEffect(() => { fetchData(); }, []);
  const fetchData = async () => { setLoading(true); const data = await getAgents(); setItems(data || []); setLoading(false); };

  const openAdd = () => { setEditing(null); setForm({ name: '', email: '', phone: '', designation: '', bio: '', photoUrl: '', specialization: '', status: 'Active' }); setShowModal(true); };
  const openEdit = (item) => { setEditing(item); setForm({ name: item.name || '', email: item.email || '', phone: item.phone || '', designation: item.designation || '', bio: item.bio || '', photoUrl: item.photoUrl || '', specialization: item.specialization || '', status: item.status || 'Active' }); setShowModal(true); };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    toast.loading('Uploading...', { id: 'photo' });
    const res = await uploadAgentPhoto(file);
    if (res.success) { setForm(prev => ({ ...prev, photoUrl: res.url })); toast.success('Photo uploaded!', { id: 'photo' }); }
    else toast.error('Upload failed', { id: 'photo' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) { toast.error('Name and phone required'); return; }
    toast.loading('Saving...', { id: 'save' });
    if (editing) {
      const res = await updateAgent(editing.id, form);
      if (res.success) { toast.success('Agent updated!', { id: 'save' }); setItems(prev => prev.map(i => i.id === editing.id ? { ...i, ...form } : i)); }
      else toast.error('Failed', { id: 'save' });
    } else {
      const res = await addAgent(form);
      if (res.success) { toast.success('Agent added!', { id: 'save' }); setItems(prev => [{ id: res.id, ...form }, ...prev]); }
      else toast.error('Failed', { id: 'save' });
    }
    setShowModal(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this agent?')) return;
    const res = await deleteAgent(id);
    if (res.success) { toast.success('Deleted'); setItems(prev => prev.filter(i => i.id !== id)); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div><h2 className="text-2xl font-bold text-primary font-[Outfit]">Agents / Staff</h2><p className="text-gray-500 text-sm mt-1">Manage your sales team and staff members.</p></div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2"><HiOutlinePlus className="w-5 h-5" /> Add Agent</button>
      </div>

      <div className="card p-6 border border-gray-100">
        {loading ? (<div className="py-20 flex justify-center"><div className="spinner border-t-accent border-accent/20"></div></div>
        ) : items.length === 0 ? (<div className="py-20 text-center text-gray-400"><HiOutlineUser className="w-12 h-12 mx-auto opacity-20 mb-3" /><p>No agents added yet.</p></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {items.map(item => (
              <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group relative">
                <div className="h-3 bg-gradient-to-r from-accent to-blue-400"></div>
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center shrink-0 overflow-hidden">
                      {item.photoUrl ? <img src={item.photoUrl} alt="" className="w-full h-full object-cover" /> : <HiOutlineUser className="w-8 h-8 text-accent" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-primary text-lg">{item.name}</h4>
                      <p className="text-sm text-accent font-medium">{item.designation || 'Agent'}</p>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${item.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>{item.status}</span>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600"><HiOutlinePhone className="w-4 h-4 text-accent" />{item.phone}</div>
                    {item.email && <div className="flex items-center gap-2 text-gray-600"><HiOutlineEnvelope className="w-4 h-4 text-accent" /><span className="truncate">{item.email}</span></div>}
                    {item.specialization && <div className="text-xs text-gray-400 mt-2 pt-2 border-t">Specialization: {item.specialization}</div>}
                  </div>
                </div>
                <div className="absolute top-5 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(item)} className="p-2 bg-white text-blue-500 hover:bg-blue-50 rounded-lg shadow-sm"><HiOutlinePencilSquare className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 bg-white text-red-500 hover:bg-red-50 rounded-lg shadow-sm"><HiOutlineTrash className="w-4 h-4" /></button>
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
                <h3 className="text-xl font-bold text-primary font-[Outfit]">{editing ? 'Edit' : 'Add'} Agent</h3>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-200 rounded-full"><HiOutlineXMark className="w-6 h-6" /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-semibold text-gray-700 mb-1">Name *</label><input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input-field" required /></div>
                  <div><label className="block text-sm font-semibold text-gray-700 mb-1">Phone *</label><input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="input-field" required /></div>
                </div>
                <div><label className="block text-sm font-semibold text-gray-700 mb-1">Email</label><input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="input-field" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-semibold text-gray-700 mb-1">Designation</label><input value={form.designation} onChange={e => setForm({...form, designation: e.target.value})} className="input-field" placeholder="e.g. Sales Manager" /></div>
                  <div><label className="block text-sm font-semibold text-gray-700 mb-1">Status</label><select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="input-field"><option value="Active">Active</option><option value="Inactive">Inactive</option></select></div>
                </div>
                <div><label className="block text-sm font-semibold text-gray-700 mb-1">Specialization</label><input value={form.specialization} onChange={e => setForm({...form, specialization: e.target.value})} className="input-field" placeholder="e.g. Residential, Commercial" /></div>
                <div><label className="block text-sm font-semibold text-gray-700 mb-1">Bio</label><textarea value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} className="input-field h-20 resize-none" /></div>
                <div><label className="block text-sm font-semibold text-gray-700 mb-1">Profile Photo</label><input type="file" accept="image/*" onChange={handlePhotoUpload} className="input-field text-sm" />{form.photoUrl && <img src={form.photoUrl} alt="" className="w-16 h-16 rounded-lg mt-2 object-cover" />}</div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                  <button type="submit" className="btn-primary flex-1">{editing ? 'Update' : 'Add'} Agent</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageAgents;
