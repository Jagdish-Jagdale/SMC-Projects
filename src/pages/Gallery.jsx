/**
 * Gallery Page
 * Public gallery showcasing project images and videos from the media library
 */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlinePhoto,
  HiOutlineVideoCamera,
  HiOutlineXMark,
  HiOutlineChevronLeft,
  HiOutlineChevronRight
} from 'react-icons/hi2';
import PageHero from '../components/PageHero';
import { getMedia } from '../firebase/settings';

const Gallery = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [lightbox, setLightbox] = useState({ open: false, index: 0 });

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const data = await getMedia();
        setMedia(data || []);
      } catch (error) {
        console.error('Failed to load gallery:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMedia();
  }, []);

  const filters = ['All', 'Images', 'Videos'];

  const filteredMedia = media.filter(m => {
    if (filter === 'All') return true;
    if (filter === 'Images') return m.type?.startsWith('image/');
    if (filter === 'Videos') return m.type?.startsWith('video/');
    return true;
  });

  const imageMedia = filteredMedia.filter(m => m.type?.startsWith('image/'));

  const openLightbox = (item) => {
    const idx = imageMedia.findIndex(m => m.id === item.id);
    if (idx !== -1) {
      setLightbox({ open: true, index: idx });
    }
  };

  const closeLightbox = () => setLightbox({ open: false, index: 0 });

  const goNext = () => {
    setLightbox(prev => ({ ...prev, index: (prev.index + 1) % imageMedia.length }));
  };

  const goPrev = () => {
    setLightbox(prev => ({ ...prev, index: (prev.index - 1 + imageMedia.length) % imageMedia.length }));
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightbox.open) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightbox.open, imageMedia.length]);

  return (
    <>
      <PageHero
        title="Our Gallery"
        subtitle="Explore our portfolio of stunning projects, beautiful interiors, and construction milestones."
        bgImage="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920"
      />

      {/* Gallery Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          {/* Filter Tabs */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex bg-gray-100 rounded-2xl p-1.5 gap-1">
              {filters.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    filter === tab
                      ? 'bg-white text-accent shadow-md'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="py-20 flex justify-center">
              <div className="spinner border-t-accent border-accent/20"></div>
            </div>
          ) : filteredMedia.length === 0 ? (
            /* Empty State */
            <div className="py-20 text-center">
              <HiOutlinePhoto className="w-16 h-16 mx-auto text-gray-200 mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 font-[Outfit]">No media yet</h3>
              <p className="text-gray-400 mt-2">Check back soon for updates to our gallery.</p>
            </div>
          ) : (
            /* Gallery Grid */
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
            >
              <AnimatePresence>
                {filteredMedia.map((item, index) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500"
                    onClick={() => item.type?.startsWith('image/') && openLightbox(item)}
                  >
                    {item.type?.startsWith('video/') ? (
                      /* Video Thumbnail */
                      <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex flex-col items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mb-3 group-hover:bg-accent/80 transition-all duration-300">
                          <HiOutlineVideoCamera className="w-7 h-7 text-white" />
                        </div>
                        <span className="text-white/70 text-sm font-bold truncate max-w-[80%] text-center px-2">
                          {item.title || item.name}
                        </span>
                      </div>
                    ) : (
                      /* Image */
                      <>
                        <img
                          src={item.url}
                          alt={item.title || 'Gallery image'}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                          loading="lazy"
                        />
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                          <div className="flex items-center gap-2 mb-1">
                            <HiOutlinePhoto className="w-4 h-4 text-accent" />
                            <h3 className="text-white text-lg font-bold truncate">
                              {item.title || 'Untitled'}
                            </h3>
                          </div>
                          {item.description && (
                            <p className="text-white/70 text-xs line-clamp-2">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightbox.open && imageMedia.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
            >
              <HiOutlineXMark className="w-6 h-6" />
            </button>

            {/* Navigation Arrows */}
            {imageMedia.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); goPrev(); }}
                  className="absolute left-4 md:left-8 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
                >
                  <HiOutlineChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); goNext(); }}
                  className="absolute right-4 md:right-8 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
                >
                  <HiOutlineChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Image & Info Container */}
            <div className="flex flex-col items-center max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
              <motion.img
                key={lightbox.index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                src={imageMedia[lightbox.index]?.url}
                alt={imageMedia[lightbox.index]?.title || 'Gallery'}
                className="max-h-[75vh] object-contain rounded-lg shadow-2xl"
              />

              {/* Image Info */}
              <div className="mt-6 text-center max-w-2xl px-4">
                <h4 className="text-white text-xl font-bold font-[Outfit]">
                  {imageMedia[lightbox.index]?.title || 'Untitled'}
                </h4>
                {imageMedia[lightbox.index]?.description && (
                  <p className="text-white/60 text-sm mt-2 leading-relaxed">
                    {imageMedia[lightbox.index]?.description}
                  </p>
                )}
                <p className="text-white/30 text-[10px] mt-4 uppercase tracking-widest">
                  {lightbox.index + 1} / {imageMedia.length}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Gallery;
