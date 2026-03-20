/**
 * Projects Page
 * Filterable list of all projects (completed, ongoing, upcoming)
 */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageHero from '../components/PageHero';
import SectionHeading from '../components/SectionHeading';
import ProjectCard from '../components/ProjectCard';
import { sampleProjects } from '../utils/sampleData';
import { getProjects } from '../firebase/projects';

const categories = ['All', 'Residential', 'Commercial', 'Industrial', 'Interior'];

const Projects = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Try to fetch from Firebase
        const data = await getProjects();
        if (data && data.length > 0) {
          setProjects(data);
        } else {
          // Fallback to sample data
          setProjects(sampleProjects);
        }
      } catch (error) {
        setProjects(sampleProjects);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(project => 
    activeCategory === 'All' ? true : project.category === activeCategory
  );

  return (
    <>
      <PageHero
        title="Our Projects"
        subtitle="Explore our portfolio of landmark developments"
        bgImage="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1920"
      />

      <section className="py-20 bg-bg min-h-screen">
        <div className="container-custom">
          {/* Filters */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === category
                    ? 'btn-primary shadow-lg scale-105'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 hover:border-accent/30 hover:text-accent'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="spinner border-accent border-t-transparent"></div>
            </div>
          ) : filteredProjects.length > 0 ? (
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <AnimatePresence>
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProjectCard project={project} index={index} />
                  </motion.div>
                ))}
          </AnimatePresence>
            </motion.div>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🏗️</span>
              </div>
              <h3 className="text-xl font-bold text-primary mb-2 font-[Outfit]">No Projects Found</h3>
              <p className="text-gray-500">We couldn't find any projects matching your criteria.</p>
              <button 
                onClick={() => setActiveCategory('All')}
                className="mt-6 text-accent hover:underline font-medium"
              >
                View all projects
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Projects;
