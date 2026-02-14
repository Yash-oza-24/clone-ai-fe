// src/components/ThemeToggle.js
import React, { useState } from 'react';
import { Sun, Moon, Monitor, ChevronDown } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

// Simple Toggle Button
export const ThemeToggleButton = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`relative p-2.5 rounded-xl transition-all duration-300 
                 bg-gray-100 dark:bg-gray-800 
                 hover:bg-gray-200 dark:hover:bg-gray-700
                 border border-gray-200 dark:border-gray-700
                 text-gray-600 dark:text-gray-300
                 hover:text-gray-900 dark:hover:text-white
                 active:scale-95 ${className}`}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <div className="relative w-5 h-5">
        {/* Sun Icon */}
        <Sun 
          size={20} 
          className={`absolute inset-0 transform transition-all duration-500 
                     ${theme === 'dark' 
                       ? 'rotate-0 scale-100 opacity-100' 
                       : 'rotate-90 scale-0 opacity-0'}`}
        />
        {/* Moon Icon */}
        <Moon 
          size={20} 
          className={`absolute inset-0 transform transition-all duration-500 
                     ${theme === 'light' 
                       ? 'rotate-0 scale-100 opacity-100' 
                       : '-rotate-90 scale-0 opacity-0'}`}
        />
      </div>
    </button>
  );
};

// Advanced Toggle with Dropdown
export const ThemeToggleDropdown = ({ className = '' }) => {
  const { theme, setLightTheme, setDarkTheme, setSystemTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const options = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ];

  const currentOption = options.find(opt => opt.value === theme) || options[2];
  const CurrentIcon = currentOption.icon;

  const handleSelect = (value) => {
    switch (value) {
      case 'light':
        setLightTheme();
        break;
      case 'dark':
        setDarkTheme();
        break;
      case 'system':
        setSystemTheme();
        break;
      default:
        break;
    }
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200
                   bg-gray-100 dark:bg-gray-800 
                   hover:bg-gray-200 dark:hover:bg-gray-700
                   border border-gray-200 dark:border-gray-700
                   text-gray-700 dark:text-gray-300"
      >
        <CurrentIcon size={18} />
        <span className="text-sm font-medium hidden sm:inline">{currentOption.label}</span>
        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-40 py-2 rounded-xl shadow-xl z-50
                         bg-white dark:bg-gray-800 
                         border border-gray-200 dark:border-gray-700
                         animate-in fade-in slide-in-from-top-2 duration-200">
            {options.map((option) => {
              const Icon = option.icon;
              const isActive = theme === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors
                             ${isActive 
                               ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                               : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                >
                  <Icon size={16} />
                  <span className="font-medium">{option.label}</span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

// Animated Switch Toggle
export const ThemeSwitch = ({ className = '' }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`relative w-16 h-8 rounded-full transition-colors duration-300
                 ${isDark ? 'bg-gray-700' : 'bg-blue-100'}
                 border-2 ${isDark ? 'border-gray-600' : 'border-blue-200'}
                 ${className}`}
      aria-label="Toggle theme"
    >
      {/* Background Icons */}
      <Sun size={14} className={`absolute left-1.5 top-1/2 -translate-y-1/2 transition-opacity duration-300
                                 ${isDark ? 'opacity-30 text-gray-500' : 'opacity-100 text-yellow-500'}`} />
      <Moon size={14} className={`absolute right-1.5 top-1/2 -translate-y-1/2 transition-opacity duration-300
                                  ${isDark ? 'opacity-100 text-blue-400' : 'opacity-30 text-gray-400'}`} />
      
      {/* Sliding Circle */}
      <div className={`absolute top-1 w-6 h-6 rounded-full shadow-md transition-all duration-300 transform
                      ${isDark 
                        ? 'translate-x-8 bg-gray-900 border border-gray-600' 
                        : 'translate-x-1 bg-white border border-blue-200'}`}>
        {isDark ? (
          <Moon size={14} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-400" />
        ) : (
          <Sun size={14} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-yellow-500" />
        )}
      </div>
    </button>
  );
};

export default ThemeToggleButton;