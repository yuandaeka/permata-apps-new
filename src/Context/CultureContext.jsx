import React, { createContext, useState, useEffect } from 'react';

export const CultureContext = createContext();

export const CultureProvider = ({ children }) => {
  const [culture, setCulture] = useState('Aceh'); // Default simulasi

  const toggleCulture = () => {
    setCulture(prev => prev === 'Aceh' ? 'Sumatera Barat' : 'Aceh');
  };

  return (
    <CultureContext.Provider value={{ culture, setCulture, toggleCulture }}>
      <div className={`min-h-screen transition-all duration-700 ${culture === 'Aceh' ? 'bg-aceh-background' : 'bg-minang-background'}`}>
        {children}
      </div>
    </CultureContext.Provider>
  );
};