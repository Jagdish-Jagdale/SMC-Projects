import { useState, useEffect } from 'react';
import { getAboutData, updateAboutData } from '../firebase/about';

export const useAbout = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const aboutData = await getAboutData();
      setData(aboutData);
      setError(null);
    } catch (err) {
      console.error('Error fetching about data:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateData = async (newData) => {
    try {
      const success = await updateAboutData(newData);
      if (success) {
        setData((prev) => ({ ...prev, ...newData }));
      }
      return success;
    } catch (err) {
      console.error('Error updating about data:', err);
      return false;
    }
  };

  return {
    data,
    loading,
    error,
    updateData,
    refreshData: fetchData
  };
};
