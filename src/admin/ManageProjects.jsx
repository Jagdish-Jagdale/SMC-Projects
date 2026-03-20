/**
 * Manage Projects Page
 * CRUD operations for projects in Admin panel
 */
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  HiOutlinePlus, 
  HiOutlinePencil, 
  HiOutlineTrash,
  HiOutlineStar,
  HiStar
} from 'react-icons/hi2';
import toast from 'react-hot-toast';
import { getProjects, deleteProject, toggleFeaturedProject } from '../firebase/projects';

const ManageProjects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination & Filtering
  const [searchTerm, setSearchTerm] = useState('');

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await getProjects();
      setProjects(data || []);
    } catch (error) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      const res = await deleteProject(id);
      if (res.success) {
        toast.success('Project deleted successfully');
        setProjects(prev => prev.filter(p => p.id !== id));
      } else {
        toast.error('Failed to delete project');
      }
    }
  };

  const handleToggleFeatured = async (id, currentStatus) => {
    const res = await toggleFeaturedProject(id, !currentStatus);
    if (res.success) {
      toast.success(currentStatus ? 'Removed from featured' : 'Marked as featured');
      setProjects(prev => prev.map(p => p.id === id ? { ...p, featured: !currentStatus } : p));
    } else {
      toast.error('Failed to update status');
    }
  };

  const filteredProjects = projects.filter(p => 
    p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-primary font-[Outfit]">Manage Projects</h2>
          <p className="text-gray-500 text-sm mt-1">Add, edit, or remove your major developments</p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={() => navigate('/admin/projects/add')}>
          <HiOutlinePlus className="w-5 h-5" />
          Add Project
        </button>
      </div>

      <div className="card p-4 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
          <input 
            type="text" 
            placeholder="Search projects by name or location..." 
            className="input-field max-w-md w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="spinner border-t-accent border-accent/20"></div>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="py-20 text-center text-gray-500">
            No projects found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-sm text-gray-500 font-medium">
                  <th className="pb-3 px-4 uppercase tracking-wider font-semibold">Project Name</th>
                  <th className="pb-3 px-4 uppercase tracking-wider font-semibold">Location</th>
                  <th className="pb-3 px-4 uppercase tracking-wider font-semibold">Status</th>
                  <th className="pb-3 px-4 uppercase tracking-wider font-semibold">Type</th>
                  <th className="pb-3 px-4 uppercase tracking-wider font-semibold text-center">Featured</th>
                  <th className="pb-3 px-4 uppercase tracking-wider font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project) => (
                  <motion.tr 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key={project.id} 
                    className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="py-4 px-4 font-semibold text-primary max-w-xs truncate">{project.title}</td>
                    <td className="py-4 px-4 text-sm text-gray-600">{project.location}</td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${project.status === 'Completed' ? 'bg-green-100 text-green-700' : project.status === 'Ongoing' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {project.status || 'Upcoming'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">{project.type}</td>
                    <td className="py-4 px-4 text-center">
                      <button 
                         onClick={() => handleToggleFeatured(project.id, project.featured)}
                         className={`p-2 rounded-full transition-colors ${project.featured ? 'text-yellow-500 hover:bg-yellow-50' : 'text-gray-300 hover:text-yellow-500 hover:bg-yellow-50'}`}
                         title={project.featured ? 'Remove from featured' : 'Mark as featured'}
                       >
                         {project.featured ? <HiStar className="w-5 h-5" /> : <HiOutlineStar className="w-5 h-5" />}
                       </button>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => navigate(`/admin/projects/edit/${project.id}`)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                          <HiOutlinePencil className="w-5 h-5" />
                        </button>
                        <button 
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          onClick={() => handleDelete(project.id, project.title)}
                        >
                          <HiOutlineTrash className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageProjects;
