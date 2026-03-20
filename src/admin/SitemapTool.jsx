/**
 * Sitemap Generation Tool
 * Helps admin generate sitemap.xml content for SEO
 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineGlobeAlt, HiOutlineClipboardDocument, HiOutlineArrowDownTray } from 'react-icons/hi2';
import { getProperties } from '../firebase/properties';
import { getProjects } from '../firebase/projects';
import toast from 'react-hot-toast';

const SitemapTool = () => {
  const [xml, setXml] = useState('');
  const [loading, setLoading] = useState(false);
  const baseUrl = window.location.origin;

  const generateSitemap = async () => {
    setLoading(true);
    try {
      const [props, projects] = await Promise.all([getProperties(), getProjects()]);
      
      let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n`;
      sitemap += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
      
      // Static Pages
      const staticPages = ['', '/properties', '/projects', '/contact', '/gallery', '/about', '/privacy-policy', '/terms'];
      staticPages.forEach(page => {
        sitemap += `  <url>\n    <loc>${baseUrl}${page}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${page === '' ? '1.0' : '0.8'}</priority>\n  </url>\n`;
      });
      
      // Dynamic Properties
      props.forEach(p => {
        sitemap += `  <url>\n    <loc>${baseUrl}/properties/${p.id}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>\n`;
      });
      
      // Dynamic Projects
      projects.forEach(pr => {
        sitemap += `  <url>\n    <loc>${baseUrl}/projects/${pr.id}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
      });
      
      sitemap += `</urlset>`;
      setXml(sitemap);
      toast.success('Sitemap generated!');
    } catch (error) {
      toast.error('Failed to generate sitemap');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(xml);
    toast.success('Copied to clipboard!');
  };

  const downloadSitemap = () => {
    const blob = new Blob([xml], { type: 'text/xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sitemap.xml';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary font-[Outfit]">Sitemap Generator</h2>
        <p className="text-gray-500 text-sm mt-1">Generate a fresh sitemap.xml for Google Indexing based on your current listings.</p>
      </div>

      <div className="card p-6 border border-gray-100">
        <div className="flex gap-4 mb-6">
          <button onClick={generateSitemap} disabled={loading} className="btn-primary flex items-center gap-2">
            {loading ? <span className="spinner-sm" /> : <HiOutlineGlobeAlt className="w-5 h-5" />}
            Generate XML
          </button>
          {xml && (
            <>
              <button onClick={copyToClipboard} className="btn-secondary flex items-center gap-2">
                <HiOutlineClipboardDocument className="w-5 h-5" /> Copy
              </button>
              <button onClick={downloadSitemap} className="btn-secondary flex items-center gap-2">
                <HiOutlineArrowDownTray className="w-5 h-5" /> Download
              </button>
            </>
          )}
        </div>

        {xml ? (
          <div className="relative">
            <pre className="p-4 bg-gray-950 text-gray-300 rounded-xl text-xs overflow-x-auto max-h-[500px] font-mono leading-relaxed">
              {xml}
            </pre>
          </div>
        ) : (
          <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-2xl">
            <HiOutlineGlobeAlt className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400">Click generate to build your SEO sitemap.</p>
          </div>
        )}
      </div>

      <div className="card p-6 bg-blue-50 border-none">
        <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
          <HiOutlineGlobeAlt className="w-5 h-5" /> Next Steps for SEO
        </h4>
        <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
          <li>Download the <strong>sitemap.xml</strong> file.</li>
          <li>Upload it to your website root directory via FTP or File Manager.</li>
          <li>Submit the URL <code>{baseUrl}/sitemap.xml</code> to <a href="https://search.google.com/search-console" target="_blank" className="underline font-bold">Google Search Console</a>.</li>
          <li>This helps Google find and index your properties and projects faster.</li>
        </ol>
      </div>
    </div>
  );
};

export default SitemapTool;
