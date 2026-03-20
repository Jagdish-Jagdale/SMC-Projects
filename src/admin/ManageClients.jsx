import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlinePlus, HiOutlineTrash, HiOutlinePencilSquare, HiOutlineXMark, HiOutlineUser, HiOutlinePhone, HiOutlineEnvelope, HiOutlineBuildingOffice } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { getClients, addClient, updateClient, deleteClient } from '../firebase/clients';
import { getProperties } from '../firebase/properties';


const ManageClients = () => {
  const [items, setItems] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState({ 
    name: '', email: '', phone: '', company: '', address: '', 
    propertyInterest: '', notes: '', status: 'Active', 
    purchasedProperties: [] 
  });


  useEffect(() => { 
    fetchData(); 
  }, []);
  
  const fetchData = async () => { 
    setLoading(true); 
    const [clientData, propData] = await Promise.all([getClients(), getProperties()]);
    setItems(clientData || []); 
    setProperties(propData || []);
    setLoading(false); 
  };


  const openAdd = () => { 
    setEditing(null); 
    setForm({ 
      name: '', email: '', phone: '', company: '', address: '', 
      propertyInterest: '', notes: '', status: 'Active', 
      purchasedProperties: [] 
    }); 
    setShowModal(true); 
  };
  
  const openEdit = (item) => { 
    setEditing(item); 
    setForm({ 
      name: item.name || '', email: item.email || '', phone: item.phone || '', 
      company: item.company || '', address: item.address || '', 
      propertyInterest: item.propertyInterest || '', notes: item.notes || '', 
      status: item.status || 'Active',
      purchasedProperties: item.purchasedProperties || []
    }); 
    setShowModal(true); 
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) { toast.error('Name and phone required'); return; }
    toast.loading('Saving...', { id: 'save' });
    if (editing) {
      const res = await updateClient(editing.id, form);
      if (res.success) { toast.success('Client updated!', { id: 'save' }); setItems(prev => prev.map(i => i.id === editing.id ? { ...i, ...form } : i)); }
      else toast.error('Failed', { id: 'save' });
    } else {
      const res = await addClient(form);
      if (res.success) { toast.success('Client added!', { id: 'save' }); setItems(prev => [{ id: res.id, ...form }, ...prev]); }
      else toast.error('Failed', { id: 'save' });
    }
    setShowModal(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this client?')) return;
    const res = await deleteClient(id);
    if (res.success) { toast.success('Deleted'); setItems(prev => prev.filter(i => i.id !== id)); }
  };

  const filtered = items.filter(i => i.name?.toLowerCase().includes(searchTerm.toLowerCase()) || i.phone?.includes(searchTerm) || i.email?.toLowerCase().includes(searchTerm.toLowerCase()));

  const statusColors = { Active: 'bg-green-50 text-green-600', Inactive: 'bg-gray-50 text-gray-500', VIP: 'bg-purple-50 text-purple-600' };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div><h2 className="text-2xl font-bold text-primary font-[Outfit]">Client Management</h2><p className="text-gray-500 text-sm mt-1">Manage your client database.</p></div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2"><HiOutlinePlus className="w-5 h-5" /> Add Client</button>
      </div>

      <div className="card p-4 border border-gray-100">
        <input type="text" placeholder="Search clients by name, phone or email..." className="input-field max-w-md w-full mb-6" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />

        {loading ? (<div className="py-20 flex justify-center"><div className="spinner border-t-accent border-accent/20"></div></div>
        ) : filtered.length === 0 ? (<div className="py-20 text-center text-gray-400"><HiOutlineUser className="w-12 h-12 mx-auto opacity-20 mb-3" /><p>No clients found.</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead><tr className="border-b border-gray-100 text-sm text-gray-500">
                <th className="pb-3 px-4 font-semibold uppercase tracking-wider">Client</th>
                <th className="pb-3 px-4 font-semibold uppercase tracking-wider">Contact</th>
                <th className="pb-3 px-4 font-semibold uppercase tracking-wider">Purchased</th>
                <th className="pb-3 px-4 font-semibold uppercase tracking-wider">Status</th>
                <th className="pb-3 px-4 font-semibold uppercase tracking-wider text-right">Actions</th>
              </tr></thead>
              <tbody>
                {filtered.map(item => (
                  <motion.tr key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-4"><div className="font-semibold text-primary">{item.name}</div>{item.company && <div className="text-xs text-gray-400">{item.company}</div>}</td>
                    <td className="py-4 px-4 text-sm"><div className="text-gray-700">{item.phone}</div><div className="text-xs text-gray-400">{item.email}</div></td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {(item.purchasedProperties || []).length > 0 ? (
                        <div className="flex flex-col gap-1">
                          <span className="font-bold text-accent">{(item.purchasedProperties || []).length} Units</span>
                          <span className="text-[10px] text-gray-400 uppercase tracking-tighter truncate max-w-[120px]">
                            {properties.find(p => p.id === item.purchasedProperties[0])?.title || 'Property deleted'}...
                          </span>
                        </div>
                      ) : '—'}
                    </td>
                    <td className="py-4 px-4"><span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[item.status] || statusColors.Active}`}>{item.status || 'Active'}</span></td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(item)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><HiOutlinePencilSquare className="w-5 h-5" /></button>
                        <button onClick={() => handleDelete(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><HiOutlineTrash className="w-5 h-5" /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                <h3 className="text-xl font-bold text-primary font-[Outfit]">{editing ? 'Edit' : 'Add'} Client</h3>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-200 rounded-full"><HiOutlineXMark className="w-6 h-6" /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-semibold text-gray-700 mb-1">Name *</label><input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input-field" required /></div>
                  <div><label className="block text-sm font-semibold text-gray-700 mb-1">Phone *</label><input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="input-field" required /></div>
                </div>
                <div><label className="block text-sm font-semibold text-gray-700 mb-1">Email</label><input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="input-field" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-semibold text-gray-700 mb-1">Company</label><input value={form.company} onChange={e => setForm({...form, company: e.target.value})} className="input-field" /></div>
                  <div><label className="block text-sm font-semibold text-gray-700 mb-1">Status</label><select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="input-field"><option value="Active">Active</option><option value="Inactive">Inactive</option><option value="VIP">VIP</option></select></div>
                </div>
                <div><label className="block text-sm font-semibold text-gray-700 mb-1">Property Interest</label><input value={form.propertyInterest} onChange={e => setForm({...form, propertyInterest: e.target.value})} className="input-field" placeholder="e.g. 3BHK in Pune" /></div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Link Purchased Properties</label>
                  <select 
                    multiple
                    className="input-field h-32"
                    value={form.purchasedProperties}
                    onChange={e => {
                      const selected = Array.from(e.target.selectedOptions, option => option.value);
                      setForm({...form, purchasedProperties: selected});
                    }}
                  >
                    {properties.map(p => (
                      <option key={p.id} value={p.id}>{p.title} ({p.city})</option>
                    ))}
                  </select>
                  <p className="text-[10px] text-gray-400 mt-1">Hold Ctrl (Cmd) to select multiple properties.</p>
                </div>
                <div><label className="block text-sm font-semibold text-gray-700 mb-1">Address</label><textarea value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="input-field h-20 resize-none" /></div>
                <div><label className="block text-sm font-semibold text-gray-700 mb-1">Notes</label><textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} className="input-field h-20 resize-none" /></div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                  <button type="submit" className="btn-primary flex-1">{editing ? 'Update' : 'Add'} Client</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageClients;
