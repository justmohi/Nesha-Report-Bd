import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { Shield, Building2, User, Mail, Award, CheckCircle2 } from 'lucide-react';

export const PoliceProfilePage: React.FC = () => {
  const { t, language } = useLanguage();
  const { policeUser } = useAuth();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="p-8 rounded-3xl bg-slate-900 border border-blue-900/40 shadow-xl space-y-6">
        <div className="flex items-center gap-4 border-b border-slate-800 pb-6">
          <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-black text-xl">
            <Building2 className="w-8 h-8" />
          </div>
          <div>
            <div className="text-xs uppercase font-semibold text-blue-400">
              {language === 'bn' ? 'দায়িত্বপ্রাপ্ত পুলিশ কর্মকর্তা প্রোফাইল' : 'Law Enforcement Officer Profile'}
            </div>
            <h1 className="text-2xl font-bold text-white mt-0.5">
              {policeUser?.fullName}
            </h1>
            <p className="text-xs text-slate-400">
              {policeUser?.rank} | {policeUser?.badgeNumber}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-1">
            <span className="text-slate-400">{t('policeStation')}:</span>
            <div className="text-sm font-bold text-white">
              {language === 'bn' ? policeUser?.thanaNameBn : policeUser?.thanaNameEn}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-1">
            <span className="text-slate-400">{t('email')}:</span>
            <div className="text-sm font-bold text-white font-mono">
              {policeUser?.email}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-1">
            <span className="text-slate-400">{language === 'bn' ? 'স্টেশন কোড:' : 'Station Code:'}</span>
            <div className="text-sm font-bold text-emerald-400 font-mono">
              {policeUser?.assignedThanaId}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-1">
            <span className="text-slate-400">{t('accountStatus')}:</span>
            <div className="text-sm font-bold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>{t('active')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PoliceProfilePage;
