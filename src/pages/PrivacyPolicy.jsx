/**
 * Privacy Policy Page
 */
import { motion } from 'framer-motion';
import { useSettings } from '../hooks/useSettings';

const PrivacyPolicy = () => {
  const { settings } = useSettings();
  const companyName = settings?.companyName || 'Our Company';

  return (
    <div className="min-h-screen pt-24 pb-20 bg-bg">
      <div className="container-custom max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-primary font-[Outfit] mb-2">Privacy Policy</h1>
          <p className="text-gray-500 mb-10">Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <div className="card p-8 md:p-12 space-y-8 text-gray-600 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-primary mb-3 font-[Outfit]">1. Information We Collect</h2>
              <p>At {companyName}, we collect information you provide directly to us, such as when you fill out an inquiry form, subscribe to our newsletter, or contact us. This includes your name, email address, phone number, and any other information you choose to provide.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-primary mb-3 font-[Outfit]">2. How We Use Your Information</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>To provide, maintain, and improve our services</li>
                <li>To respond to your inquiries about properties and projects</li>
                <li>To send you updates about properties matching your interests</li>
                <li>To communicate with you about promotions, events, and news</li>
                <li>To detect, investigate, and prevent fraudulent activities</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-primary mb-3 font-[Outfit]">3. Information Sharing</h2>
              <p>We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:</p>
              <ul className="list-disc list-inside space-y-2 mt-3">
                <li>With your consent or at your direction</li>
                <li>With service providers who assist in our operations</li>
                <li>To comply with legal obligations or enforce our policies</li>
                <li>In connection with a merger, acquisition, or sale of assets</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-primary mb-3 font-[Outfit]">4. Data Security</h2>
              <p>We take reasonable measures to help protect your personal information from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction. All data is encrypted during transmission using SSL technology.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-primary mb-3 font-[Outfit]">5. Cookies</h2>
              <p>Our website uses cookies to enhance your browsing experience. Cookies are small text files stored on your device. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-primary mb-3 font-[Outfit]">6. Your Rights</h2>
              <p>You have the right to access, correct, or delete your personal information at any time. You may also opt out of receiving promotional communications. To exercise these rights, please contact us using the details provided below.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-primary mb-3 font-[Outfit]">7. Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, please contact us at:</p>
              <div className="mt-3 p-4 bg-gray-50 rounded-xl">
                <p className="font-semibold text-primary">{companyName}</p>
                {settings?.email && <p>Email: {settings.email}</p>}
                {settings?.phone && <p>Phone: {settings.phone}</p>}
                {settings?.address && <p>Address: {settings.address}</p>}
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
