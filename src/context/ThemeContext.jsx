// src/context/ThemeContext.js
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark' || savedTheme === 'light') {
        return savedTheme;
      }
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    return 'light';
  });

  const [isTransitioning, setIsTransitioning] = useState(false);

  const applyTheme = useCallback((newTheme, withTransition = true) => {
    const root = window.document.documentElement;
    
    if (withTransition) {
      // Add transitioning class for smooth effect
      root.classList.add('theme-transitioning');
      setIsTransitioning(true);
      
      // Remove the class after animation completes
      setTimeout(() => {
        root.classList.remove('theme-transitioning');
        setIsTransitioning(false);
      }, 300);
    }
    
    // Remove both classes
    root.classList.remove('light', 'dark');
    
    // Add the current theme class
    root.classList.add(newTheme);
    
    // Save to localStorage
    localStorage.setItem('theme', newTheme);
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', newTheme === 'dark' ? '#030712' : '#ffffff');
    }

    // Update color-scheme
    root.style.colorScheme = newTheme;
  }, []);

  // Apply theme on mount and when theme changes
  useEffect(() => {
    // On mount, apply without transition
    const isInitialMount = !document.documentElement.classList.contains('light') && 
                          !document.documentElement.classList.contains('dark');
    applyTheme(theme, !isInitialMount);
  }, [theme, applyTheme]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      const savedTheme = localStorage.getItem('theme');
      const lastManualChange = localStorage.getItem('themeManualChange');
      const now = Date.now();
      
      if (!lastManualChange || (now - parseInt(lastManualChange)) > 86400000) {
        if (!savedTheme) {
          setTheme(e.matches ? 'dark' : 'light');
        }
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const newTheme = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('themeManualChange', Date.now().toString());
      return newTheme;
    });
  }, []);

  const setLightTheme = useCallback(() => {
    setTheme('light');
    localStorage.setItem('themeManualChange', Date.now().toString());
  }, []);

  const setDarkTheme = useCallback(() => {
    setTheme('dark');
    localStorage.setItem('themeManualChange', Date.now().toString());
  }, []);

  const setSystemTheme = useCallback(() => {
    localStorage.removeItem('theme');
    localStorage.removeItem('themeManualChange');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    setTheme(systemTheme);
  }, []);

  const value = {
    theme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
    isTransitioning,
    toggleTheme,
    setLightTheme,
    setDarkTheme,
    setSystemTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;