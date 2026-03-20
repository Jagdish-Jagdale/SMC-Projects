import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  HiOutlineGlobeAlt, 
  HiOutlineHashtag, 
  HiOutlineEnvelope, 
  HiOutlinePhone,
  HiOutlineMapPin,
  HiOutlineCheckBadge,
  HiOutlinePhoto,
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlineBuildingOffice,
  HiOutlinePencilSquare
} from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { 
  getSettings, 
  updateSettings, 
  uploadLogo,
  uploadBrochure,
  getPropertyTypes,
  addPropertyType,
  deletePropertyType,
  updatePropertyType,
  getCities,
  addCity,
  deleteCity,
  getAreas,
  addArea,
  deleteArea
} from '../firebase/settings';

import { useSettings } from '../hooks/useSettings';

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('Company');
  const { refreshSettings } = useSettings();
  
  // Settings State
  const [settings, setSettings] = useState({
    companyName: '',
    email: '',
    phone: '',
    whatsappNumber: '',
    brochureUrl: '',
    address: '',
    logoUrl: '',
    socialLinks: { facebook: '', instagram: '', linkedin: '', twitter: '', youtube: '' },
    seo: { metaTitle: '', metaDescription: '', keywords: '' },
    footer: {
      quickLinks: [
        { name: "Home", path: "/" },
        { name: "About", path: "/about" },
        { name: "Services", path: "/services" },
        { name: "Projects", path: "/projects" },
        { name: "Properties", path: "/properties" },
        { name: "Contact", path: "/contact" },
        { name: "Admin Login", path: "/admin/login" }
      ],
      services: [
        "Contracting & EPC",
        "Industrial Construction",
        "Commercial Construction",
        "Residential Construction",
        "Interior Design",
        "Land Development"
      ]
    }
  });

  // Master Data State
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [newTypeName, setNewTypeName] = useState('');
  const [newCityName, setNewCityName] = useState('');
  const [newAreaName, setNewAreaName] = useState('');
  const [selectedCityId, setSelectedCityId] = useState('');
  const [editingTypeId, setEditingTypeId] = useState(null);
  const [editingTypeName, setEditingTypeName] = useState('');

  const fetchData = async () => {
    try {
      const [settingsData, typesData, citiesData, areasData] = await Promise.all([
        getSettings(),
        getPropertyTypes(),
        getCities(),
        getAreas()
      ]);
      if (settingsData) {
        setSettings(prev => ({ 
          ...prev, 
          ...settingsData,
          footer: settingsData.footer || prev.footer
        }));
      }
      setPropertyTypes(typesData || []);
      setCities(citiesData || []);
      setAreas(areasData || []);
      if (citiesData?.length > 0) setSelectedCityId(citiesData[0].id);
    } catch (error) {
      console.error('Settings fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (field, value, category = null) => {
    if (category) {
      setSettings(prev => ({
        ...prev,
        [category]: { ...prev[category], [field]: value }
      }));
    } else {
      setSettings(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    toast.loading('Uploading logo...', { id: 'logo' });
    const res = await uploadLogo(file);
    if (res.success) {
      setSettings(prev => ({ ...prev, logoUrl: res.url }));
      toast.success('Logo updated (Save to persist changes)', { id: 'logo' });
    } else {
      toast.error('Logo upload failed', { id: 'logo' });
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    toast.loading('Saving settings...', { id: 'save' });
    try {
      const res = await updateSettings(settings);
      if (res.success) {
        toast.success('Settings saved successfully', { id: 'save' });
        // Refresh the global settings context so navbar/footer update immediately
        await refreshSettings();
      }
      else throw new Error(res.error);
    } catch (error) {
      toast.error('Failed to save settings', { id: 'save' });
    } finally {
      setSaving(false);
    }
  };

  // CRUD for Types
  const handleAddType = async () => {
    if (!newTypeName.trim()) return;
    const res = await addPropertyType(newTypeName);
    if (res.success) {
      setPropertyTypes(prev => [...prev, { id: res.id, name: newTypeName }]);
      setNewTypeName('');
      toast.success('Type added');
    }
  };

  const handleDeleteType = async (id) => {
    const res = await deletePropertyType(id);
    if (res.success) {
      setPropertyTypes(prev => prev.filter(t => t.id !== id));
      toast.success('Type removed');
    }
  };

  const handleSaveType = async (id) => {
    if (!editingTypeName.trim()) return;
    const res = await updatePropertyType(id, editingTypeName.trim());
    if (res.success) {
      setPropertyTypes(prev => prev.map(t => t.id === id ? { ...t, name: editingTypeName.trim() } : t));
      setEditingTypeId(null);
      toast.success('Type updated');
    } else {
      toast.error('Failed to update type');
    }
  };

  // CRUD for Locations
  const handleAddCity = async () => {
    if (!newCityName.trim()) return;
    const res = await addCity(newCityName);
    if (res.success) {
      setCities(prev => [...prev, { id: res.id, name: newCityName }]);
      setNewCityName('');
      toast.success('City added');
    }
  };

  const handleAddArea = async () => {
    if (!newAreaName.trim() || !selectedCityId) return;
    const res = await addArea(newAreaName, selectedCityId);
    if (res.success) {
      setAreas(prev => [...prev, { id: res.id, name: newAreaName, cityId: selectedCityId }]);
      setNewAreaName('');
      toast.success('Area added');
    }
  };

  if (loading) {
    return <div className="py-20 flex justify-center"><div className="spinner border-t-accent border-accent/20"></div></div>;
  }

  const tabs = ['Company', 'Social', 'SEO', 'Footer', 'Property Types', 'Locations'];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-primary font-[Outfit]">Global Settings</h2>
          <p className="text-gray-500 text-sm mt-1">Configure company profile, types, and locations.</p>
        </div>
        <button onClick={saveSettings} disabled={saving} className="btn-primary flex items-center gap-2">
          {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : <HiOutlineCheckBadge className="w-5 h-5" />}
          {saving ? 'Saving...' : 'Save Site Settings'}
        </button>
      </div>

      <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100 overflow-x-auto custom-scrollbar">
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 min-w-[120px] py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === tab ? 'bg-accent text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>
            {tab}
          </button>
        ))}
      </div>

      <div className="card p-8 border border-gray-100 min-h-[400px]">
        {activeTab === 'Company' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex items-center gap-8 pb-6 border-b border-gray-50">
              <div className="relative h-24 min-w-[96px] bg-gray-50 border border-gray-200 rounded-xl overflow-hidden flex items-center justify-center group shrink-0">
                {settings.logoUrl ? <img src={settings.logoUrl} alt="Logo" className="h-full w-auto object-contain p-2" /> : <HiOutlineGlobeAlt className="w-10 h-10 text-gray-300" />}
                <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                  <HiOutlinePhoto className="w-6 h-6 text-white" />
                  <input type="file" onChange={handleLogoUpload} className="hidden" accept="image/*" />
                </label>
              </div>
              <div>
                <h3 className="font-bold text-primary text-lg">Company Branding</h3>
                <p className="text-sm text-gray-500">Update your logo and business identity.</p>
                {settings.logoUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      setSettings(prev => ({ ...prev, logoUrl: '' }));
                      toast.success('Logo removed (Save to persist changes)');
                    }}
                    className="mt-2 flex items-center gap-1.5 text-xs font-medium text-red-500 hover:text-red-700 transition-colors"
                  >
                    <HiOutlineTrash className="w-4 h-4" />
                    Remove Logo
                  </button>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="md:col-span-2"><label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"><HiOutlineBuildingOffice className="w-4 h-4 text-accent" /> Company Name</label>
                <input type="text" value={settings.companyName} onChange={(e) => handleInputChange('companyName', e.target.value)} className="input-field" /></div>
              <div><label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"><HiOutlineEnvelope className="w-4 h-4 text-accent" /> Email</label>
                <input type="email" value={settings.email} onChange={(e) => handleInputChange('email', e.target.value)} className="input-field" /></div>
              <div><label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"><HiOutlinePhone className="w-4 h-4 text-accent" /> Phone (Sales)</label>
                <input type="text" value={settings.phone} onChange={(e) => handleInputChange('phone', e.target.value)} className="input-field" /></div>
              <div><label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"><HiOutlineHashtag className="w-4 h-4 text-accent" /> WhatsApp Number (with Country Code)</label>
                <input type="text" value={settings.whatsappNumber} onChange={(e) => handleInputChange('whatsappNumber', e.target.value)} className="input-field" placeholder="+919876543210" /></div>
              <div><label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"><HiOutlineGlobeAlt className="w-4 h-4 text-accent" /> Company Brochure (PDF)</label>
                <div className="flex gap-2">
                  <input type="text" value={settings.brochureUrl} readOnly className="input-field bg-gray-50 flex-1" placeholder="Upload PDF brochure" />
                  <label className="btn-secondary px-4 flex items-center justify-center cursor-pointer hover:bg-gray-100 border-gray-300">
                    <HiOutlinePlus className="w-5 h-5 text-gray-600" />
                    <input type="file" accept=".pdf" className="hidden" onChange={async (e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      toast.loading('Uploading brochure...', { id: 'brochure' });
                      const res = await uploadBrochure(file);
                      if (res.success) {
                        handleInputChange('brochureUrl', res.url);
                        toast.success('Brochure uploaded!', { id: 'brochure' });
                      } else {
                        toast.error('Upload failed', { id: 'brochure' });
                      }
                    }} />
                  </label>
                </div>
              </div>
              <div className="md:col-span-2"><label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"><HiOutlineMapPin className="w-4 h-4 text-accent" /> Address</label>
                <textarea value={settings.address} onChange={(e) => handleInputChange('address', e.target.value)} className="input-field h-24 resize-none" /></div>
            </div>
          </motion.div>
        )}

        {/* Property Types Management */}
        {activeTab === 'Property Types' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <h3 className="text-lg font-bold text-primary border-b pb-2">Manage Property Types</h3>
            <div className="flex gap-2">
              <input type="text" value={newTypeName} onChange={(e) => setNewTypeName(e.target.value)} className="input-field" placeholder="Add new type (e.g. Penthouse)" />
              <button onClick={handleAddType} className="btn-primary flex items-center gap-2 px-6"><HiOutlinePlus /> Add</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {propertyTypes.map(t => (
                <div key={t.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex justify-between items-center group">
                  {editingTypeId === t.id ? (
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="text"
                        value={editingTypeName}
                        onChange={(e) => setEditingTypeName(e.target.value)}
                        className="input-field py-1 text-sm flex-1"
                        autoFocus
                        onKeyDown={(e) => { if (e.key === 'Enter') handleSaveType(t.id); if (e.key === 'Escape') setEditingTypeId(null); }}
                      />
                      <button onClick={() => handleSaveType(t.id)} className="text-green-500 hover:text-green-700 text-sm font-semibold">Save</button>
                      <button onClick={() => setEditingTypeId(null)} className="text-gray-400 hover:text-gray-600 text-sm">Cancel</button>
                    </div>
                  ) : (
                    <>
                      <span
                        className="text-sm font-medium text-gray-700 cursor-pointer hover:text-accent"
                        onDoubleClick={() => { setEditingTypeId(t.id); setEditingTypeName(t.name); }}
                        title="Double-click to edit"
                      >{t.name}</span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { setEditingTypeId(t.id); setEditingTypeName(t.name); }} className="text-blue-400 hover:text-blue-600"><HiOutlinePencilSquare className="w-4 h-4" /></button>
                        <button onClick={() => handleDeleteType(t.id)} className="text-red-400 hover:text-red-600"><HiOutlineTrash className="w-4 h-4" /></button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Locations Management */}
        {activeTab === 'Locations' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-primary border-b pb-2">Cities</h3>
              <div className="flex gap-2">
                <input type="text" value={newCityName} onChange={(e) => setNewCityName(e.target.value)} className="input-field" placeholder="Add City" />
                <button onClick={handleAddCity} className="btn-primary flex items-center gap-2 px-6"><HiOutlinePlus /> Add City</button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {cities.map(c => (
                  <div key={c.id} className="p-3 bg-white shadow-sm rounded-xl border border-gray-100 flex justify-between items-center">
                    <span className="text-sm font-medium">{c.name}</span>
                    <button onClick={() => deleteCity(c.id).then(() => fetchData())} className="text-red-300 hover:text-red-500"><HiOutlineTrash /></button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <h3 className="text-lg font-bold text-primary border-b pb-2">Areas / Localities</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <select value={selectedCityId} onChange={(e) => setSelectedCityId(e.target.value)} className="input-field">
                  {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <input type="text" value={newAreaName} onChange={(e) => setNewAreaName(e.target.value)} className="input-field" placeholder="Add Area Name" />
                <button onClick={handleAddArea} className="btn-primary flex items-center gap-2"><HiOutlinePlus /> Add Area</button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {areas.filter(a => a.cityId === selectedCityId).map(a => (
                  <div key={a.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex justify-between items-center">
                    <span className="text-sm text-gray-600">{a.name}</span>
                    <button onClick={() => deleteArea(a.id).then(() => fetchData())} className="text-red-300"><HiOutlineTrash /></button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Existing SEO & Social Tabs (kept clean for brevity) */}
        {activeTab === 'Social' && (
           <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
             <h3 className="text-lg font-bold text-primary border-b pb-2">Social Networking</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.keys(settings.socialLinks).map(p => (
                  <div key={p}><label className="text-sm font-medium text-gray-700 mb-1 capitalize flex items-center gap-2"><HiOutlineHashtag className="w-4 h-4 text-accent" /> {p}</label>
                  <input type="text" value={settings.socialLinks[p]} onChange={(e) => handleInputChange(p, e.target.value, 'socialLinks')} className="input-field" /></div>
                ))}
             </div>
           </motion.div>
        )}
        
        {activeTab === 'SEO' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
             <h3 className="text-lg font-bold text-primary border-b pb-2">SEO Configurations</h3>
             <div className="space-y-4">
                <div><label className="text-sm font-medium text-gray-700 mb-1">Meta Title</label><input type="text" value={settings.seo.metaTitle} onChange={(e) => handleInputChange('metaTitle', e.target.value, 'seo')} className="input-field" /></div>
                <div><label className="text-sm font-medium text-gray-700 mb-1">Meta Description</label><textarea value={settings.seo.metaDescription} onChange={(e) => handleInputChange('metaDescription', e.target.value, 'seo')} className="input-field h-24" /></div>
                <div><label className="text-sm font-medium text-gray-700 mb-1">Keywords</label><input type="text" value={settings.seo.keywords} onChange={(e) => handleInputChange('keywords', e.target.value, 'seo')} className="input-field" /></div>
             </div>
          </motion.div>
        )}
        {activeTab === 'Footer' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
             <div className="space-y-4">
               <div className="flex justify-between items-center border-b pb-2">
                 <h3 className="text-lg font-bold text-primary">Footer Quick Links</h3>
                 <button onClick={() => setSettings(p => ({ ...p, footer: { ...p.footer, quickLinks: [...(p.footer?.quickLinks || []), { name: '', path: '' }] } }))} className="text-accent hover:text-accent-dark flex items-center gap-1 text-sm font-medium"><HiOutlinePlus /> Add Link</button>
               </div>
               <div className="space-y-3">
                 {settings.footer?.quickLinks?.map((link, idx) => (
                   <div key={idx} className="flex gap-4 items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                     <input type="text" value={link.name} placeholder="Link Name (e.g. Home)" onChange={(e) => {
                       const newLinks = [...settings.footer.quickLinks];
                       newLinks[idx].name = e.target.value;
                       setSettings(p => ({ ...p, footer: { ...p.footer, quickLinks: newLinks } }));
                     }} className="input-field py-2 flex-1" />
                     <input type="text" value={link.path} placeholder="Path (e.g. /home)" onChange={(e) => {
                       const newLinks = [...settings.footer.quickLinks];
                       newLinks[idx].path = e.target.value;
                       setSettings(p => ({ ...p, footer: { ...p.footer, quickLinks: newLinks } }));
                     }} className="input-field py-2 flex-1" />
                     <button onClick={() => {
                       const newLinks = settings.footer.quickLinks.filter((_, index) => index !== idx);
                       setSettings(p => ({ ...p, footer: { ...p.footer, quickLinks: newLinks } }));
                     }} className="text-red-400 hover:text-red-600 p-2"><HiOutlineTrash /></button>
                   </div>
                 ))}
                 {(!settings.footer?.quickLinks || settings.footer.quickLinks.length === 0) && <p className="text-sm text-gray-400">No links added.</p>}
               </div>
             </div>

             <div className="space-y-4 pt-4">
               <div className="flex justify-between items-center border-b pb-2">
                 <h3 className="text-lg font-bold text-primary">Footer Services</h3>
                 <button onClick={() => setSettings(p => ({ ...p, footer: { ...p.footer, services: [...(p.footer?.services || []), ''] } }))} className="text-accent hover:text-accent-dark flex items-center gap-1 text-sm font-medium"><HiOutlinePlus /> Add Service</button>
               </div>
               <div className="space-y-3">
                 {settings.footer?.services?.map((service, idx) => (
                   <div key={idx} className="flex gap-4 items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                     <input type="text" value={service} placeholder="Service Name" onChange={(e) => {
                       const newServices = [...settings.footer.services];
                       newServices[idx] = e.target.value;
                       setSettings(p => ({ ...p, footer: { ...p.footer, services: newServices } }));
                     }} className="input-field py-2 flex-1" />
                     <button onClick={() => {
                       const newServices = settings.footer.services.filter((_, index) => index !== idx);
                       setSettings(p => ({ ...p, footer: { ...p.footer, services: newServices } }));
                     }} className="text-red-400 hover:text-red-600 p-2"><HiOutlineTrash /></button>
                   </div>
                 ))}
                 {(!settings.footer?.services || settings.footer.services.length === 0) && <p className="text-sm text-gray-400">No services added.</p>}
               </div>
             </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Settings;

