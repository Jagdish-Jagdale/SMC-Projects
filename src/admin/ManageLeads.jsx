import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiOutlineUser, 
  HiOutlinePhone, 
  HiOutlineEnvelope,
  HiOutlineDocumentText,
  HiOutlineXMark,
  HiOutlineChatBubbleBottomCenterText,
  HiOutlineUserPlus
} from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { getLeads, updateLeadStatus, addLeadNote, deleteLead, assignAgentToLead } from '../firebase/leads';
import { getAgents } from '../firebase/agents';

const ManageLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [agents, setAgents] = useState([]);
  const [assigningLoading, setAssigningLoading] = useState(false);
  
  // Modal state
  const [selectedLead, setSelectedLead] = useState(null);
  const [noteText, setNoteText] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [leadsData, agentsData] = await Promise.all([
        getLeads(),
        getAgents()
      ]);
      setLeads(leadsData);
      setAgents(agentsData.filter(a => a.active !== false));
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    toast.loading('Updating status...', { id: 'status' });
    const res = await updateLeadStatus(id, newStatus);
    if (res.success) {
      toast.success('Status updated', { id: 'status' });
      setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
      if (selectedLead && selectedLead.id === id) {
        setSelectedLead({ ...selectedLead, status: newStatus });
      }
    } else {
      toast.error('Failed to update status', { id: 'status' });
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;

    toast.loading('Adding note...', { id: 'note' });
    const res = await addLeadNote(selectedLead.id, noteText);
    if (res.success) {
      toast.success('Note added', { id: 'note' });
      const newNote = { text: noteText, date: new Date().toISOString() };
      
      const updatedNotes = [...(selectedLead.notes || []), newNote];
      setSelectedLead({ ...selectedLead, notes: updatedNotes });
      setLeads(prev => prev.map(l => l.id === selectedLead.id ? { ...l, notes: updatedNotes } : l));
      setNoteText('');
    } else {
      toast.error('Failed to add note', { id: 'note' });
    }
  };

  const handleAssignAgent = async (id, agentId) => {
    if (!agentId) {
       // Clear assignment
       toast.loading('Updating assignment...', { id: 'assign' });
       const res = await assignAgentToLead(id, null);
       if (res.success) {
         toast.success('Assignment cleared', { id: 'assign' });
         const update = l => l.id === id ? { ...l, assignedAgent: null } : l;
         setLeads(prev => prev.map(update));
         if (selectedLead?.id === id) setSelectedLead(prev => ({ ...prev, assignedAgent: null }));
       } else { toast.error('Failed to clear', { id: 'assign' }); }
       return;
    }

    const agent = agents.find(a => a.id === agentId);
    if (!agent) return;

    setAssigningLoading(true);
    toast.loading(`Assigning to ${agent.name}...`, { id: 'assign' });
    
    const agentData = { id: agent.id, name: agent.name };
    const res = await assignAgentToLead(id, agentData);
    
    if (res.success) {
      toast.success(`Assigned to ${agent.name}`, { id: 'assign' });
      const update = l => l.id === id ? { ...l, assignedAgent: agentData } : l;
      setLeads(prev => prev.map(update));
      if (selectedLead?.id === id) setSelectedLead(prev => ({ ...prev, assignedAgent: agentData }));
    } else {
      toast.error('Assignment failed', { id: 'assign' });
    }
    setAssigningLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      const res = await deleteLead(id);
      if (res.success) {
        toast.success('Lead deleted');
        setLeads(prev => prev.filter(l => l.id !== id));
        if (selectedLead && selectedLead.id === id) setSelectedLead(null);
      } else {
        toast.error('Failed to delete lead');
      }
    }
  };

  const filteredLeads = leads.filter(l => statusFilter === 'All' ? true : l.status === statusFilter);

  const statusColors = {
    'New': 'bg-blue-50 text-blue-600 border-blue-200',
    'Contacted': 'bg-yellow-50 text-yellow-600 border-yellow-200',
    'Follow-up': 'bg-purple-50 text-purple-600 border-purple-200',
    'Closed': 'bg-green-50 text-green-600 border-green-200'
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-primary font-[Outfit]">Lead Management</h2>
          <p className="text-gray-500 text-sm mt-1">Track and manage customer inquiries.</p>
        </div>
        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input-field max-w-xs"
        >
          <option value="All">All Leads</option>
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Follow-up">Follow-up</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leads List */}
        <div className="lg:col-span-2 card border border-gray-100 p-0 overflow-hidden">
          {loading ? (
            <div className="py-20 flex justify-center">
              <div className="spinner border-t-accent border-accent/20"></div>
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="py-20 text-center text-gray-500">
              No leads found for status: {statusFilter}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-500 font-medium">
                    <th className="py-4 px-6 font-semibold">Client</th>
                    <th className="py-4 px-6 font-semibold">Interest</th>
                    <th className="py-4 px-6 font-semibold">Assigned To</th>
                    <th className="py-4 px-6 font-semibold">Status</th>
                    <th className="py-4 px-6 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead) => (
                    <motion.tr 
                      key={lead.id} 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer ${selectedLead?.id === lead.id ? 'bg-accent/5' : ''}`}
                      onClick={() => setSelectedLead(lead)}
                    >
                      <td className="py-4 px-6">
                        <div className="font-semibold text-primary">{lead.name}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <HiOutlinePhone className="w-3 h-3" /> {lead.phone}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600 max-w-[200px] truncate">
                        {lead.propertyInterest || 'General Inquiry'}
                      </td>
                      <td className="py-4 px-6">
                        {lead.assignedAgent ? (
                          <div className="flex items-center gap-2 text-xs font-medium text-primary">
                            <div className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center font-bold">
                              {lead.assignedAgent.name.charAt(0)}
                            </div>
                            {lead.assignedAgent.name}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 italic">Unassigned</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[lead.status || 'New']}`}>
                          {lead.status || 'New'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button 
                          className="btn-secondary py-1.5 px-3 text-xs"
                          onClick={(e) => { e.stopPropagation(); setSelectedLead(lead); }}
                        >
                          Review
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Lead Details Panel */}
        <div className="lg:col-span-1">
          <AnimatePresence mode="wait">
            {selectedLead ? (
              <motion.div 
                key={selectedLead.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="card border border-gray-100 sticky top-4 flex flex-col h-[calc(100vh-8rem)]" // Fill available height
              >
                <div className="p-5 border-b border-gray-100 flex justify-between items-start shrink-0">
                  <div>
                    <h3 className="text-lg font-bold text-primary font-[Outfit]">{selectedLead.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">Lead Details</p>
                  </div>
                  <button onClick={() => setSelectedLead(null)} className="p-1 text-gray-400 hover:bg-gray-100 rounded">
                    <HiOutlineXMark className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-5 custom-scrollbar space-y-6 bg-gray-50/50">
                  
                  {/* Contact Info */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Contact Info</h4>
                    <div className="bg-white p-4 rounded-xl border border-gray-100 space-y-3 shadow-sm">
                      <div className="flex items-center gap-3 text-sm">
                        <HiOutlinePhone className="w-5 h-5 text-accent" />
                        <span className="font-medium text-gray-700">{selectedLead.phone}</span>
                      </div>
                      {selectedLead.email && (
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-3 text-sm">
                            <HiOutlineEnvelope className="w-5 h-5 text-accent" />
                            <span className="text-gray-600">{selectedLead.email}</span>
                          </div>
                          <a 
                            href={`mailto:${selectedLead.email}?subject=Regarding your inquiry for ${selectedLead.propertyInterest || 'property'}&body=Hello ${selectedLead.name},%0D%0A%0D%0AThank you for reaching out to BuildEstate. regarding your inquiry about ${selectedLead.propertyInterest || 'our property'}.`}
                            className="btn-secondary py-1.5 text-xs flex items-center justify-center gap-2"
                          >
                            <HiOutlineEnvelope className="w-4 h-4" />
                            Reply via Email
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Inquiry Details */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Inquiry</h4>
                    <div className="bg-white p-4 rounded-xl border border-gray-100 space-y-3 shadow-sm">
                      <div>
                        <span className="text-xs text-gray-500 block mb-1">Interested In:</span>
                        <div className="font-medium text-gray-800">{selectedLead.propertyInterest || 'General Details'}</div>
                      </div>
                      {selectedLead.message && (
                        <div className="pt-2 border-t border-gray-50">
                          <span className="text-xs text-gray-500 block mb-1">Message:</span>
                          <p className="text-sm text-gray-600 italic">"{selectedLead.message}"</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status Management */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Status</h4>
                    <select 
                      value={selectedLead.status || 'New'} 
                      onChange={(e) => handleStatusChange(selectedLead.id, e.target.value)}
                      className="input-field w-full bg-white font-medium"
                    >
                      <option value="New">New Lead</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Follow-up">Follow-up</option>
                      <option value="Closed">Closed (Deal Won/Lost)</option>
                    </select>
                  </div>

                  {/* Agent Assignment Management */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Assign Agent</h4>
                    <div className="relative">
                      <select 
                        value={selectedLead.assignedAgent?.id || ''} 
                        onChange={(e) => handleAssignAgent(selectedLead.id, e.target.value)}
                        className="input-field w-full bg-white pr-10"
                        disabled={assigningLoading}
                      >
                        <option value="">Unassigned</option>
                        {agents.map(a => (
                          <option key={a.id} value={a.id}>{a.name}</option>
                        ))}
                      </select>
                      <HiOutlineUserPlus className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                    {selectedLead.assignedAgent && (
                       <p className="text-[10px] text-gray-500 italic mt-1 pl-1">
                         Currently assigned to {selectedLead.assignedAgent.name}
                       </p>
                    )}
                  </div>

                  {/* Notes Timeline */}
                  <div className="space-y-3 pb-4">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Activity Notes</h4>
                    {(!selectedLead.notes || selectedLead.notes.length === 0) ? (
                      <p className="text-sm text-gray-400 italic">No notes added yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {selectedLead.notes.map((note, idx) => (
                          <div key={idx} className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm relative pl-4 border-l-2 border-l-accent">
                            <p className="text-sm text-gray-700">{note.text}</p>
                            <span className="text-[10px] text-gray-400 mt-2 block">
                              {new Date(note.date).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Add Note Input Area */}
                <div className="p-4 border-t border-gray-100 bg-white shrink-0">
                  <form onSubmit={handleAddNote} className="flex flex-col gap-2">
                    <textarea 
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="Type a note here..." 
                      className="input-field h-20 resize-none text-sm bg-gray-50"
                    />
                    <div className="flex justify-between items-center mt-2">
                       <button 
                        type="button" 
                        onClick={() => handleDelete(selectedLead.id)}
                        className="text-xs text-red-500 hover:underline font-medium"
                      >
                        Delete Lead
                      </button>
                      <button 
                        type="submit" 
                        disabled={!noteText.trim()}
                        className="btn-primary py-2 px-4 text-sm disabled:opacity-50"
                      >
                        Add Note
                      </button>
                    </div>
                  </form>
                </div>

              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full min-h-[400px] border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 p-8 text-center"
              >
                <HiOutlineChatBubbleBottomCenterText className="w-12 h-12 mb-3 text-gray-300" />
                <p>Select a lead from the table to view their complete details and add follow-up notes.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ManageLeads;
