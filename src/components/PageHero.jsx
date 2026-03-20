/**
 * PageHero - Reusable page hero/banner for inner pages
 */
import { motion } from 'framer-motion';

const PageHero = ({ title, subtitle, bgImage }) => {
  return (
    <section
      className="relative h-[350px] md:h-[400px] flex items-center justify-center overflow-hidden pt-20"
      style={{
        background: bgImage
          ? `linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.85)), url(${bgImage}) center/cover no-repeat`
          : 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)'
      }}
    >
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <div className="container-custom relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-[Outfit]">
            {title}
          </h1>
          {subtitle && (
            <p className="text-gray-300 text-lg max-w-xl mx-auto">
              {subtitle}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default PageHero;
