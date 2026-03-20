/**
 * Admin Reports Page
 * Analytics and summaries for properties, projects, leads, and clients
 */
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  HiOutlineChartBar, 
  HiOutlineDocumentChartBar, 
  HiOutlineUserGroup, 
  HiOutlineHome,
  HiOutlineArrowDownTray
} from 'react-icons/hi2';
import { getProperties } from '../firebase/properties';
import { getLeads } from '../firebase/leads';
import { getClients } from '../firebase/clients';
import { getProjects } from '../firebase/projects';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';

const COLORS = ['#0F172A', '#0EA5E9', '#6366F1', '#8B5CF6', '#EC4899', '#F43F5E'];

const ManageReports = () => {
  const [data, setData] = useState({
    properties: [],
    leads: [],
    clients: [],
    projects: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const [props, leads, clients, projects] = await Promise.all([
          getProperties(),
          getLeads(),
          getClients(),
          getProjects()
        ]);
        setData({
          properties: props || [],
          leads: leads || [],
          clients: clients || [],
          projects: projects || []
        });
      } catch (error) {
        console.error("Failed to fetch report data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  // Process data for charts
  const leadSourceData = [
    { name: 'Property Page', value: data.leads.filter(l => l.source === 'Property Details Page').length },
    { name: 'Contact Page', value: data.leads.filter(l => l.source === 'Contact Page').length },
    { name: 'Home Page', value: data.leads.filter(l => l.source === 'Home Page').length },
    { name: 'Other', value: data.leads.filter(l => !['Property Details Page', 'Contact Page', 'Home Page'].includes(l.source)).length }
  ].filter(d => d.value > 0);

  const propertyStatusData = [
    { name: 'Available', value: data.properties.filter(p => p.status === 'Available').length },
    { name: 'Sold', value: data.properties.filter(p => p.status === 'Sold').length },
    { name: 'Rented', value: data.properties.filter(p => p.status === 'Rented').length }
  ].filter(d => d.value > 0);

  const propertyTypeData = [
    { name: 'Apartment', value: data.properties.filter(p => p.type === 'Apartment').length },
    { name: 'Villa', value: data.properties.filter(p => p.type === 'Villa').length },
    { name: 'Plot', value: data.properties.filter(p => p.type === 'Plot').length },
    { name: 'Commercial', value: data.properties.filter(p => p.type === 'Commercial').length }
  ].filter(d => d.value > 0);

  // Leads by month (last 6 months)
  const getLast6Months = () => {
    const months = [];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      months.push({ 
        name: monthNames[d.getMonth()], 
        count: 0, 
        monthIdx: d.getMonth(), 
        year: d.getFullYear() 
      });
    }
    return months;
  };

  const leadsTimeline = getLast6Months().map(month => {
    const count = data.leads.filter(lead => {
      const date = lead.createdAt ? new Date(lead.createdAt) : null;
      return date && date.getMonth() === month.monthIdx && date.getFullYear() === month.year;
    }).length;
    return { name: month.name, leads: count };
  });

  const exportCSV = (type) => {
    let csvContent = "data:text/csv;charset=utf-8,";
    let filename = "";
    
    if (type === 'leads') {
      csvContent += "Name,Email,Phone,Source,Status,Date\n";
      data.leads.forEach(l => {
        csvContent += `${l.name},${l.email},${l.phone},${l.source},${l.status},${new Date(l.createdAt).toLocaleDateString()}\n`;
      });
      filename = "leads_report.csv";
    } else {
      csvContent += "Title,Price,Type,Status,Area,City\n";
      data.properties.forEach(p => {
        csvContent += `${p.title},${p.price},${p.type},${p.status},${p.area},${p.city}\n`;
      });
      filename = "properties_report.csv";
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center">
        <div className="spinner border-t-accent border-accent/20"></div>
        <p className="text-gray-500 mt-4">Generating reports...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-primary font-[Outfit]">Business Reports</h2>
          <p className="text-gray-500 text-sm mt-1">Analyze your lead generation and property inventory performance.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => exportCSV('leads')} className="btn-secondary flex items-center gap-2">
            <HiOutlineArrowDownTray className="w-4 h-4" /> Leads CSV
          </button>
          <button onClick={() => exportCSV('properties')} className="btn-secondary flex items-center gap-2">
            <HiOutlineArrowDownTray className="w-4 h-4" /> Properties CSV
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-6 border-l-4 border-l-blue-500">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Conversion Rate</p>
          <p className="text-2xl font-bold text-primary font-[Outfit]">
            {data.leads.length > 0 ? ((data.clients.length / data.leads.length) * 100).toFixed(1) : 0}%
          </p>
          <p className="text-xs text-green-600 mt-1 font-medium">Leads to Clients</p>
        </div>
        <div className="card p-6 border-l-4 border-l-purple-500">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Inventory Value</p>
          <p className="text-2xl font-bold text-primary font-[Outfit]">
            ₹{(data.properties.reduce((acc, p) => acc + (Number(p.price) || 0), 0) / 10000000).toFixed(2)}Cr
          </p>
          <p className="text-xs text-gray-400 mt-1 font-medium">Total Listing Price</p>
        </div>
        <div className="card p-6 border-l-4 border-l-emerald-500">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Avg. Property Price</p>
          <p className="text-2xl font-bold text-primary font-[Outfit]">
            ₹{(data.properties.reduce((acc, p) => acc + (Number(p.price) || 0), 0) / (data.properties.length || 1) / 100000).toFixed(1)}L
          </p>
          <p className="text-xs text-gray-400 mt-1 font-medium">Across all types</p>
        </div>
        <div className="card p-6 border-l-4 border-l-orange-500">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Inquiries/Prop</p>
          <p className="text-2xl font-bold text-primary font-[Outfit]">
            {(data.leads.length / (data.properties.length || 1)).toFixed(1)}
          </p>
          <p className="text-xs text-gray-400 mt-1 font-medium">Engagement ratio</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Leads Timeline */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
          <h3 className="text-lg font-bold text-primary mb-6 flex items-center gap-2 font-[Outfit]">
            <HiOutlineChartBar className="text-accent" /> Leads Acquisition Timeline
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={leadsTimeline}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="leads" stroke="#0EA5E9" strokeWidth={3} dot={{ r: 6, fill: '#0EA5E9' }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Lead Sources */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-6">
          <h3 className="text-lg font-bold text-primary mb-6 flex items-center gap-2 font-[Outfit]">
            <HiOutlineDocumentChartBar className="text-accent" /> Traffic & Engagement Sources
          </h3>
          <div className="h-80 w-full flex flex-col md:flex-row items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={leadSourceData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {leadSourceData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend layout="vertical" verticalAlign="middle" align="right" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Property Status */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-6">
          <h3 className="text-lg font-bold text-primary mb-6 flex items-center gap-2 font-[Outfit]">
            <HiOutlineHome className="text-accent" /> Inventory Status Distribution
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={propertyStatusData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="value" fill="#6366F1" radius={[4, 4, 0, 0]} barSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Property Types */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card p-6">
          <h3 className="text-lg font-bold text-primary mb-6 flex items-center gap-2 font-[Outfit]">
            <HiOutlineHome className="text-accent" /> Property Type Mix
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={propertyTypeData} cx="50%" cy="50%" innerRadius={0} outerRadius={80} dataKey="value" label>
                  {propertyTypeData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Agents Performance Preview */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-primary font-[Outfit]">Asset Distribution</h3>
          <p className="text-sm text-gray-500">Breakdown of properties and projects in system</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-4 bg-gray-50 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
              <HiOutlineHome className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Active Properties</p>
              <p className="text-2xl font-bold text-primary">{data.properties.length}</p>
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
              <HiOutlineDocumentChartBar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Major Projects</p>
              <p className="text-2xl font-bold text-primary">{data.projects.length}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ManageReports;
