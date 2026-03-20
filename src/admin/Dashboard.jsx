import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  HiOutlineHome, 
  HiOutlineBuildingOffice2, 
  HiOutlineUserGroup, 
  HiOutlineArrowTrendingUp,
  HiOutlineEye
} from 'react-icons/hi2';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts';
import { getProperties } from '../firebase/properties';
import { getProjects } from '../firebase/projects';
import { getLeads } from '../firebase/leads';
import { getClients } from '../firebase/clients';

const Dashboard = () => {
  const [stats, setStats] = useState({
    properties: 0,
    projects: 0,
    leads: 0,
    clients: 0,
    views: 0
  });
  const [recentLeads, setRecentLeads] = useState([]);
  const [latestProperties, setLatestProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sample data for charts
  const salesData = [
    { name: 'Jan', sales: 4 },
    { name: 'Feb', sales: 3 },
    { name: 'Mar', sales: 7 },
    { name: 'Apr', sales: 5 },
    { name: 'May', sales: 8 },
    { name: 'Jun', sales: 6 },
  ];

  const leadsData = [
    { name: 'Mon', leads: 12 },
    { name: 'Tue', leads: 19 },
    { name: 'Wed', leads: 15 },
    { name: 'Thu', leads: 22 },
    { name: 'Fri', leads: 25 },
    { name: 'Sat', leads: 32 },
    { name: 'Sun', leads: 28 },
  ];

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      try {
        // Fallback demo data instantly for demo purposes
        setStats({
          properties: 24,
          projects: 15,
          leads: 85,
          clients: 42,
          views: 12500
        });
        
        // Non-blocking fetch from Firebase
        const [props, projs, leads, clients] = await Promise.all([
          getProperties(),
          getProjects(),
          getLeads(),
          getClients()
        ]);

        if (isMounted) {
          let totalViews = 0;
          if (props && props.length > 0) {
            props.forEach(p => totalViews += p.views || 0);
          }

          setStats({
            properties: props?.length || 0,
            projects: projs?.length || 0,
            leads: leads?.length || 0,
            clients: clients?.length || 0,
            views: totalViews
          });

          if (leads && leads.length > 0) {
            setRecentLeads(leads.slice(0, 5));
          }

          if (props && props.length > 0) {
            setLatestProperties(props.slice(0, 5));
          }
        }
      } catch (err) {
        console.warn('Firebase sync failed, using demo stats', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    fetchData();
    
    return () => { isMounted = false; };
  }, []);

  const statCards = [
    { title: 'Total Properties', value: stats.properties, icon: HiOutlineHome, color: 'text-blue-500', bg: 'bg-blue-50' },
    { title: 'Total Projects', value: stats.projects, icon: HiOutlineBuildingOffice2, color: 'text-purple-500', bg: 'bg-purple-50' },
    { title: 'Total Leads', value: stats.leads, icon: HiOutlineUserGroup, color: 'text-green-500', bg: 'bg-green-50' },
    { title: 'Total Clients', value: stats.clients, icon: HiOutlineUserGroup, color: 'text-teal-500', bg: 'bg-teal-50' },
    { title: 'Property Views', value: stats.views.toLocaleString(), icon: HiOutlineEye, color: 'text-orange-500', bg: 'bg-orange-50' },
  ];

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="spinner border-t-accent border-accent/20"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card p-6 border border-gray-100 flex items-center gap-4"
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.bg}`}>
              <stat.icon className={`w-7 h-7 ${stat.color}`} />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
              <h3 className="text-2xl font-bold text-primary font-[Outfit]">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Array */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="card p-6 border border-gray-100 shadow-sm"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-primary font-[Outfit]">Property Performance</h3>
              <p className="text-xs text-gray-400">Monthly conversion rates</p>
            </div>
            <select className="text-xs bg-gray-50 border-none rounded-lg focus:ring-accent">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity={1} />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
                />
                <Bar dataKey="sales" fill="url(#barGradient)" radius={[6, 6, 0, 0]} barSize={35} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Leads Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="card p-6 border border-gray-100 shadow-sm"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-primary font-[Outfit]">Leads Traffic</h3>
              <p className="text-xs text-gray-400">Weekly lead generation trend</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-accent"></span>
              <span className="text-[10px] font-bold text-gray-500 uppercase">Active Leads</span>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={leadsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0EA5E9" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#0EA5E9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
                />
                <Area type="monotone" dataKey="leads" stroke="#0EA5E9" strokeWidth={3} fillOpacity={1} fill="url(#lineGradient)" />
                <Line type="monotone" dataKey="leads" stroke="#0EA5E9" strokeWidth={3} dot={{ r: 4, fill: '#fff', stroke: '#0EA5E9', strokeWidth: 2 }} activeDot={{ r: 6, strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card p-6 border border-gray-100"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-primary font-[Outfit]">Recent Leads</h3>
          <button className="text-sm text-accent font-medium hover:underline">View All</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-sm text-gray-500 font-medium">
                <th className="pb-3 px-4 uppercase tracking-wider font-semibold">Name</th>
                <th className="pb-3 px-4 uppercase tracking-wider font-semibold">Contact</th>
                <th className="pb-3 px-4 uppercase tracking-wider font-semibold">Interest</th>
                <th className="pb-3 px-4 uppercase tracking-wider font-semibold">Status</th>
                <th className="pb-3 px-4 uppercase tracking-wider font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {recentLeads.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-500">No recent leads found.</td>
                </tr>
              ) : (
                recentLeads.map((lead) => (
                  <tr key={lead.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-semibold text-primary">{lead.name}</div>
                      <div className="text-xs text-gray-400">{lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : 'Recently'}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-gray-700">{lead.phone}</div>
                      <div className="text-xs text-gray-400">{lead.email}</div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600 truncate max-w-[150px]">
                      {lead.propertyInterest || 'General Inquiry'}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        lead.status === 'New' ? 'bg-blue-50 text-blue-600' : 
                        lead.status === 'Contacted' ? 'bg-yellow-50 text-yellow-600' : 
                        'bg-green-50 text-green-600'
                      }`}>
                        {lead.status || 'New'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button 
                        className="text-accent hover:underline text-sm font-medium"
                        onClick={() => window.location.href = '/admin/leads'}
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Latest Added Properties */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="card p-6 border border-gray-100"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-primary font-[Outfit]">Latest Added Properties</h3>
          <button className="text-sm text-accent font-medium hover:underline" onClick={() => window.location.href = '/admin/properties'}>View All</button>
        </div>

        {latestProperties.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No properties added yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
            {latestProperties.map((prop) => (
              <div key={prop.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer" onClick={() => window.location.href = `/admin/properties/edit/${prop.id}`}>
                <div className="h-32 bg-gray-100 relative overflow-hidden">
                  {prop.images && prop.images[0] ? (
                    <img src={prop.images[0]} alt={prop.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300"><HiOutlineHome className="w-10 h-10" /></div>
                  )}
                  <span className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold ${prop.status === 'Sold' ? 'bg-red-100 text-red-600' : prop.status === 'Rented' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'}`}>
                    {prop.status || 'Available'}
                  </span>
                </div>
                <div className="p-3">
                  <h4 className="font-semibold text-primary text-sm truncate">{prop.title}</h4>
                  <p className="text-xs text-gray-500 truncate">{prop.area}, {prop.city}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-accent font-bold text-sm font-[Outfit]">₹{(prop.price / 100000).toFixed(1)}L</span>
                    <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded">{prop.type}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;
