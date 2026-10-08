import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Languages } from 'lucide-react';

export const LanguageSwitcher: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors bg-slate-800/90 text-slate-200 hover:text-white hover:bg-slate-700 border border-slate-700/60 shadow-sm ${className}`}
      title="Switch Language / ভাষা পরিবর্তন করুন"
    >
      <Languages className="w-4 h-4 text-emerald-400" />
      <span>{language === 'bn' ? 'English' : 'বাংলা'}</span>
    </button>
  );
};
export default LanguageSwitcher;
