/**
 * Terms & Conditions Page
 */
import { motion } from 'framer-motion';
import { useSettings } from '../hooks/useSettings';

const Terms = () => {
  const { settings } = useSettings();
  const companyName = settings?.companyName || 'Our Company';

  return (
    <div className="min-h-screen pt-24 pb-20 bg-bg">
      <div className="container-custom max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-primary font-[Outfit] mb-2">Terms & Conditions</h1>
          <p className="text-gray-500 mb-10">Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <div className="card p-8 md:p-12 space-y-8 text-gray-600 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-primary mb-3 font-[Outfit]">1. Acceptance of Terms</h2>
              <p>By accessing and using the {companyName} website and services, you agree to be bound by these Terms & Conditions. If you do not agree with any part of these terms, please do not use our services.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-primary mb-3 font-[Outfit]">2. Services Description</h2>
              <p>{companyName} provides real estate listing services, property information, and inquiry facilitation. All property details, images, and prices are provided for informational purposes only and are subject to change without notice.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-primary mb-3 font-[Outfit]">3. User Responsibilities</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Provide accurate and truthful information in inquiry forms</li>
                <li>Do not misuse or attempt to gain unauthorized access to our systems</li>
                <li>Do not reproduce, distribute, or modify any content from this website</li>
                <li>Respect the intellectual property rights of {companyName}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-primary mb-3 font-[Outfit]">4. Property Information Disclaimer</h2>
              <p>While we strive to provide accurate property information, {companyName} does not guarantee the accuracy, completeness, or reliability of any property listings. Property prices, availability, and specifications are subject to change. Users are advised to verify all details independently before making any property decisions.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-primary mb-3 font-[Outfit]">5. Intellectual Property</h2>
              <p>All content on this website, including text, images, logos, and graphics, is the property of {companyName} and is protected by intellectual property laws. Unauthorized use of any content is strictly prohibited.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-primary mb-3 font-[Outfit]">6. Limitation of Liability</h2>
              <p>{companyName} shall not be liable for any direct, indirect, incidental, or consequential damages arising from the use of our website or services. Property transactions are conducted between buyers and sellers, and {companyName} acts only as an intermediary.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-primary mb-3 font-[Outfit]">7. Third-Party Links</h2>
              <p>Our website may contain links to third-party websites. {companyName} is not responsible for the content or practices of these external sites. Users access third-party links at their own risk.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-primary mb-3 font-[Outfit]">8. Modifications</h2>
              <p>{companyName} reserves the right to modify these Terms & Conditions at any time. Changes will be effective immediately upon posting on the website. Continued use of our services after any changes constitutes acceptance of the new terms.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-primary mb-3 font-[Outfit]">9. Governing Law</h2>
              <p>These Terms & Conditions shall be governed by and construed in accordance with the laws of India. Any disputes arising shall be subject to the exclusive jurisdiction of the courts.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-primary mb-3 font-[Outfit]">10. Contact</h2>
              <p>For questions about these Terms, contact us at:</p>
              <div className="mt-3 p-4 bg-gray-50 rounded-xl">
                <p className="font-semibold text-primary">{companyName}</p>
                {settings?.email && <p>Email: {settings.email}</p>}
                {settings?.phone && <p>Phone: {settings.phone}</p>}
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Terms;
