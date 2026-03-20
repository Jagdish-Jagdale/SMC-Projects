import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { getSettings } from '../firebase/settings';

const SettingsContext = createContext();

const defaultSettings = {
  companyName: 'SMC Projects',
  email: 'info@smcprojects.in',
  phone: '+91 98765 43210',
  address: 'Pune, Maharashtra, India',
  logoUrl: '',
  brochureUrl: '',
  whatsappNumber: '+919876543210',
  socialLinks: { facebook: '#', instagram: '#', linkedin: '#', twitter: '#' },
  seo: { metaTitle: 'SMC Projects', metaDescription: 'Trusted Construction & EPC Partner – Pune & Pan India', keywords: 'construction, EPC, SMC Projects, Pune' }
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    try {
      const data = await getSettings();
      if (data) {
        setSettings(prev => ({
          ...prev,
          ...data,
          // Ensure socialLinks has defaults if some are missing
          socialLinks: { ...prev.socialLinks, ...(data.socialLinks || {}) }
        }));
      }
    } catch (error) {
      console.error('Error in settings provider:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Allow consumers (e.g. admin Settings page) to trigger a re-fetch
  const refreshSettings = useCallback(() => {
    return fetchSettings();
  }, [fetchSettings]);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
