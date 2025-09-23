// contexts/ThemeContext.tsx
import React, { useState, useContext, createContext, ReactNode } from 'react';
import { ColorSchemeName, Appearance } from 'react-native';

type ThemeContextType = {
  theme: ColorSchemeName;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }:any) => {
  const systemScheme = Appearance.getColorScheme();
  const [theme, setTheme] = useState<ColorSchemeName>(systemScheme ?? 'light');

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useThemeContext must be used inside ThemeProvider');
  }
  return ctx;
};
