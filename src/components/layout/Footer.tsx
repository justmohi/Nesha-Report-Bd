import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Shield, PhoneCall, AlertTriangle, Lock, Heart, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { language, t } = useLanguage();

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400">
      {/* Helpline banner */}
      <div className="border-b border-slate-800/80 bg-slate-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/40 border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
                <PhoneCall className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                  {language === 'bn' ? 'জাতীয় জরুরি সেবা' : 'National Emergency'}
                </div>
                <div className="text-xl font-black text-white tracking-wider">৯৯৯ (999)</div>
                <p className="text-[11px] text-slate-400">
                  {language === 'bn' ? 'তাৎক্ষণিক পুলিশি সহায়তা ২৪/৭' : 'Bangladesh Police 24/7'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/40 border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                  {language === 'bn' ? 'মাদকদ্রব্য নিয়ন্ত্রণ অধিদপ্তর' : 'Narcotics Control (DNC)'}
                </div>
                <div className="text-xl font-black text-white tracking-wider">১৬১২৪ (16124)</div>
                <p className="text-[11px] text-slate-400">
                  {language === 'bn' ? 'মাদক সংক্রান্ত অভিযোগ ও তথ্য' : 'DNC Toll-free hotline'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/40 border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 flex-shrink-0">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                  {language === 'bn' ? 'চিকিৎসা ও পুনর্বাসন সহায়তা' : 'Medical & Rehab Support'}
                </div>
                <div className="text-xl font-black text-white tracking-wider">০২-৮৩৩৩৫৫৫</div>
                <p className="text-[11px] text-slate-400">
                  {language === 'bn' ? 'কেন্দ্রীয় মাদকাসক্তি নিরাময় কেন্দ্র' : 'Central Addiction Treatment Hospital'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & mission */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <Shield className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-white">{t('brandName')}</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-lg">
              {language === 'bn'
                ? 'একটি আধুনিক, সমন্বিত ও পূর্ণাঙ্গ গোপনীয় মাদক রিপোর্ট ও আইন প্রয়োগ ব্যবস্থাপনা ব্যবস্থা। নাগরিক অংশগ্রহণ বৃদ্ধি ও মাদকমুক্ত বাংলাদেশ বিনির্মাণের লক্ষ্য নিয়ে গঠিত।'
                : 'A confidential law enforcement and citizen incident notification management system dedicated to a drug-free Bangladesh.'}
            </p>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1.5 text-slate-300">
              <div className="flex items-center gap-2 font-semibold text-emerald-400">
                <Lock className="w-4 h-4" />
                <span>{language === 'bn' ? 'নাগরিক গোপনীয়তা ও আইনি নিশ্চয়তা' : 'Privacy & Non-Blacklist Guarantee'}</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                {language === 'bn'
                  ? 'এই প্ল্যাটফর্ম কোনোভাবেই পাবলিক ব্ল্যাকলিস্ট নয়। কারও নাম, ব্যক্তিগত ছবি, ফোন নম্বর বা পরিচয় জনসাধারণের মাঝে প্রকাশ করা হয় না। প্রাথমিক তদন্ত ব্যতিরেকে কাউকে অপরাধী হিসেবে ট্যাগ করা নিষিদ্ধ।'
                  : 'This platform is NOT a public blacklist. Personal identities, phone numbers, and evidence are never publicly displayed. Unverified persons are never labelled as criminals.'}
              </p>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-slate-200 mb-3">
              {language === 'bn' ? 'নাগরিক সেবা' : 'Public Services'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('report')}
                  className="hover:text-emerald-400 transition"
                >
                  {t('reportIncident')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('track')}
                  className="hover:text-emerald-400 transition"
                >
                  {t('trackReport')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('my-reports')}
                  className="hover:text-emerald-400 transition"
                >
                  {t('myReports')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('map')}
                  className="hover:text-emerald-400 transition"
                >
                  {t('publicMap')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('safety')}
                  className="hover:text-emerald-400 transition"
                >
                  {t('safetyInfo')}
                </button>
              </li>
            </ul>
          </div>

          {/* Portals & Security */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-slate-200 mb-3">
              {language === 'bn' ? 'আইন প্রয়োগকারী পোর্টাল' : 'Law Enforcement'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('police-dashboard')}
                  className="hover:text-blue-400 transition flex items-center gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5 text-blue-400" />
                  {t('policePortal')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admin-dashboard')}
                  className="hover:text-purple-400 transition flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5 text-purple-400" />
                  {t('adminPortal')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('login')}
                  className="hover:text-emerald-400 transition"
                >
                  {t('login')} / {t('register')}
                </button>
              </li>
            </ul>

            <div className="mt-4 pt-4 border-t border-slate-800 text-[11px] text-slate-400">
              <div>Evidence Storage: Telegram Bot API (Private Channel)</div>
              <div>Database: Firebase Firestore (Strict ABAC)</div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800/80 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            © {new Date().getFullYear()} {t('brandName')}. All Rights Reserved. Bangladesh.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" /> End-to-End Confidential
            </span>
            <span>GDPR & Privacy Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
