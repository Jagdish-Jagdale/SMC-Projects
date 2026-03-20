/**
 * Public Agent Profile Page
 * Displays agent details, specialization, and contact info
 */
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlinePhone, HiOutlineEnvelope, HiOutlineMapPin, HiOutlineBriefcase, HiOutlineUser } from 'react-icons/hi2';
import { getAgentById } from '../firebase/agents';
import { getProperties } from '../firebase/properties';
import PropertyCard from '../components/PropertyCard';

const AgentProfile = () => {
  const { id } = useParams();
  const [agent, setAgent] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const agentData = await getAgentById(id);
        if (agentData) {
          setAgent(agentData);
          // Fetch properties assigned to this agent
          const allProps = await getProperties();
          const agentProps = (allProps || []).filter(p => p.agentId === id);
          setProperties(agentProps);
        }
      } catch (error) {
        console.error('Failed to load agent', error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex justify-center items-center bg-bg">
        <div className="spinner border-accent border-t-transparent"></div>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex justify-center items-center bg-bg">
        <div className="text-center card p-10 max-w-lg">
          <h2 className="text-2xl font-bold text-primary mb-4 font-[Outfit]">Agent Not Found</h2>
          <p className="text-gray-500 mb-6">This agent profile is no longer available.</p>
          <Link to="/" className="btn-primary">Return Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 bg-bg">
      <div className="container-custom">
        {/* Agent Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-8 md:p-12 mb-8"
        >
          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Photo */}
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center overflow-hidden shrink-0 shadow-lg">
              {agent.photoUrl ? (
                <img src={agent.photoUrl} alt={agent.name} className="w-full h-full object-cover" />
              ) : (
                <HiOutlineUser className="w-16 h-16 text-accent" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold text-primary font-[Outfit]">{agent.name}</h1>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${agent.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                  {agent.status || 'Active'}
                </span>
              </div>
              <p className="text-accent font-semibold text-lg mb-4">{agent.designation || 'Real Estate Agent'}</p>

              {agent.bio && <p className="text-gray-600 leading-relaxed mb-6 max-w-2xl">{agent.bio}</p>}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a href={`tel:${agent.phone}`} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-accent/5 transition-colors">
                  <HiOutlinePhone className="w-5 h-5 text-accent" />
                  <span className="text-primary font-medium">{agent.phone}</span>
                </a>
                {agent.email && (
                  <a href={`mailto:${agent.email}`} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-accent/5 transition-colors">
                    <HiOutlineEnvelope className="w-5 h-5 text-accent" />
                    <span className="text-primary font-medium">{agent.email}</span>
                  </a>
                )}
                {agent.specialization && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <HiOutlineBriefcase className="w-5 h-5 text-accent" />
                    <span className="text-gray-600">Specialization: <strong className="text-primary">{agent.specialization}</strong></span>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <a href={`tel:${agent.phone}`} className="btn-primary px-6 py-2.5 flex items-center gap-2">
                  <HiOutlinePhone className="w-4 h-4" /> Call Now
                </a>
                <a href={`https://wa.me/${agent.phone?.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer"
                  className="btn-primary bg-[#25D366] hover:bg-[#1DA851] border-none px-6 py-2.5 flex items-center gap-2">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Agent's Assigned Properties */}
        {properties.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h2 className="text-2xl font-bold text-primary mb-6 font-[Outfit]">Properties by {agent.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map(prop => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AgentProfile;
