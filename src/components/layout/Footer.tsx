import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Shield, PhoneCall, Lock, Heart, CheckCircle2 } from 'lucide-react';

interface FooterProps { onNavigate: (tab: string) => void; }

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { language, t } = useLanguage();

  return (
    <footer className="bg-white border-t border-slate-300 text-slate-600">
      <div className="bg-[#00563f] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex items-center gap-3">
            <PhoneCall className="w-5 h-5" />
            <div><div className="text-[10px] uppercase opacity-80">{language === 'bn' ? 'জাতীয় জরুরি সেবা' : 'National Emergency'}</div><div className="font-bold">৯৯৯ (999)</div></div>
          </div>
          <div className="flex items-center gap-3 sm:border-l sm:border-white/20 sm:pl-5">
            <Shield className="w-5 h-5" />
            <div><div className="text-[10px] uppercase opacity-80">{language === 'bn' ? 'মাদকদ্রব্য নিয়ন্ত্রণ' : 'Narcotics Control'}</div><div className="font-bold">১৬১২৪ (16124)</div></div>
          </div>
          <div className="flex items-center gap-3 sm:border-l sm:border-white/20 sm:pl-5">
            <Heart className="w-5 h-5" />
            <div><div className="text-[10px] uppercase opacity-80">{language === 'bn' ? 'সহায়তা' : 'Support'}</div><div className="font-bold">{language === 'bn' ? 'প্রয়োজনে ৯৯৯' : 'Call 999 when urgent'}</div></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#006a4e]"><Shield className="w-5 h-5" /></div>
              <div><div className="font-bold text-slate-900">{t('brandName')}</div><div className="text-xs text-slate-500">{language === 'bn' ? 'গোপনীয় নাগরিক রিপোর্টিং সেবা' : 'Confidential citizen reporting service'}</div></div>
            </div>
            <p className="mt-4 text-sm text-slate-500 leading-relaxed max-w-xl">{language === 'bn' ? 'নাগরিকদের কাছ থেকে মাদক-সংক্রান্ত সন্দেহজনক ঘটনার তথ্য গ্রহণ ও সংশ্লিষ্ট আইন প্রয়োগকারী কর্মকর্তার কাছে পৌঁছে দেওয়ার জন্য একটি ডিজিটাল প্ল্যাটফর্ম।' : 'A digital platform for receiving suspected narcotics incident information from citizens and routing reports to the responsible law-enforcement authority.'}</p>
            <div className="mt-4 flex items-start gap-2 p-3 rounded-md bg-slate-50 border border-slate-200 text-xs text-slate-500">
              <Lock className="w-4 h-4 text-[#006a4e] flex-shrink-0 mt-0.5" />
              <span>{language === 'bn' ? 'রিপোর্টের ব্যক্তিগত তথ্য জনসাধারণের জন্য প্রকাশ করা হয় না।' : 'Personal report information is not displayed publicly.'}</span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-3">{language === 'bn' ? 'নাগরিক সেবা' : 'Public Services'}</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => onNavigate('report')} className="hover:text-[#006a4e]"> {t('reportIncident')}</button></li>
              <li><button onClick={() => onNavigate('track')} className="hover:text-[#006a4e]"> {t('trackReport')}</button></li>
              <li><button onClick={() => onNavigate('my-reports')} className="hover:text-[#006a4e]"> {t('myReports')}</button></li>
              <li><button onClick={() => onNavigate('map')} className="hover:text-[#006a4e]"> {t('publicMap')}</button></li>
              <li><button onClick={() => onNavigate('safety')} className="hover:text-[#006a4e]"> {t('safetyInfo')}</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-3">{language === 'bn' ? 'সিস্টেম' : 'System'}</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => onNavigate('login')} className="hover:text-[#006a4e]">{t('login')} / {t('register')}</button></li>
              <li><button onClick={() => onNavigate('police-dashboard')} className="hover:text-[#006a4e]">{t('policePortal')}</button></li>
              <li><button onClick={() => onNavigate('admin-dashboard')} className="hover:text-[#006a4e]">{t('adminPortal')}</button></li>
            </ul>
            <div className="mt-4 pt-4 border-t border-slate-200 text-[11px] text-slate-400">Firebase Firestore · Protected access controls</div>
          </div>
        </div>

        <div className="mt-7 pt-5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <span>© {new Date().getFullYear()} {t('brandName')}. {language === 'bn' ? 'সর্বস্বত্ব সংরক্ষিত।' : 'All rights reserved.'}</span>
          <span className="inline-flex items-center gap-1 text-[#006a4e]"><CheckCircle2 className="w-3.5 h-3.5" /> Confidential reporting</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;