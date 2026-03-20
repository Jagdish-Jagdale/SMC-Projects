import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const ComparisonContext = createContext();

export const ComparisonProvider = ({ children }) => {
  const [comparedProperties, setComparedProperties] = useState([]);

  // Load from localStorage on init
  useEffect(() => {
    const saved = localStorage.getItem('comparedProperties');
    if (saved) {
      try {
        setComparedProperties(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved comparison data", e);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('comparedProperties', JSON.stringify(comparedProperties));
  }, [comparedProperties]);

  const addToCompare = (property) => {
    if (comparedProperties.find(p => p.id === property.id)) {
      toast.error('Property already in comparison');
      return;
    }
    if (comparedProperties.length >= 4) {
      toast.error('You can compare max 4 properties');
      return;
    }
    setComparedProperties(prev => [...prev, property]);
    toast.success('Added to comparison');
  };

  const removeFromCompare = (id) => {
    setComparedProperties(prev => prev.filter(p => p.id !== id));
    toast.success('Removed from comparison');
  };

  const clearComparison = () => {
    setComparedProperties([]);
  };

  return (
    <ComparisonContext.Provider value={{
      comparedProperties,
      addToCompare,
      removeFromCompare,
      clearComparison
    }}>
      {children}
    </ComparisonContext.Provider>
  );
};

export const useComparison = () => {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
};
