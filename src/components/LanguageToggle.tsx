import React from 'react';
import { Language } from '../utils/i18n';

interface LanguageToggleProps {
  currentLang: Language;
  onToggle: (lang: Language) => void;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({ currentLang, onToggle }) => {
  return (
    <div className="inline-flex items-center p-1 bg-slate-950/45 border border-violet-300/20 rounded-xl text-xs font-semibold backdrop-blur-md">
      <button
        type="button"
        onClick={() => onToggle('vi')}
        className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
          currentLang === 'vi'
            ? 'bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white shadow-xs'
            : 'text-slate-400 hover:text-white'
        }`}
      >
        VI
      </button>
      <button
        type="button"
        onClick={() => onToggle('en')}
        className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
          currentLang === 'en'
            ? 'bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white shadow-xs'
            : 'text-slate-400 hover:text-white'
        }`}
      >
        EN
      </button>
    </div>
  );
};
