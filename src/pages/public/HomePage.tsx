import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { PublicStatistics, IncidentCategory } from '../../types';
import { dataService } from '../../services/dataService';
import {
  Shield,
  FileText,
  Search,
  Lock,
  CheckCircle2,
  AlertTriangle,
  HeartHandshake,
  MapPin,
  ChevronRight,
  TrendingUp,
  FileCheck,
  Send,
  EyeOff,
  Building2,
  Users
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (tab: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();
  const [stats, setStats] = useState<PublicStatistics | null>(null);

  useEffect(() => {
    dataService.getPublicStatistics().then(setStats);
  }, []);

  const categories: { key: IncidentCategory; titleBn: string; titleEn: string; descBn: string; descEn: string; color: string }[] = [
    {
      key: 'YABA',
      titleBn: 'ইয়াবা / মেথাম্ফেটামিন',
      titleEn: 'Yaba / Methamphetamine',
      descBn: 'লাল/গোলাপি রঙের নিষিদ্ধ ট্যাবলেট লেনদেন বা সংরক্ষণ সংক্রান্ত তথ্য',
      descEn: 'Suspected distribution or possession of illicit yaba tablets',
      color: 'from-pink-500/20 to-rose-500/10 border-rose-500/30 text-rose-300',
    },
    {
      key: 'GANJA',
      titleBn: 'গাঁজা / ক্যানাবিস',
      titleEn: 'Ganja / Cannabis',
      descBn: 'পাড়া-মহল্লায় বা নির্জন স্থানে প্রকাশ্য গাঁজা সেবন ও বিক্রি',
      descEn: 'Suspected cannabis trade, peddling, or consumption in local areas',
      color: 'from-emerald-500/20 to-green-500/10 border-emerald-500/30 text-emerald-300',
    },
    {
      key: 'PHENSEDYL',
      titleBn: 'ফেনসিডিল ও সিরাপ',
      titleEn: 'Phensedyl & Illicit Syrups',
      descBn: 'সীমান্তবর্তী বা গোপন গোডাউন থেকে কোডিনযুক্ত নিষিদ্ধ সিরাপ পাচার',
      descEn: 'Cross-border or depot trafficking of codeine-based banned syrups',
      color: 'from-amber-500/20 to-yellow-500/10 border-amber-500/30 text-amber-300',
    },
    {
      key: 'HEROIN',
      titleBn: 'হেরোইন / ব্রাউন সুগার',
      titleEn: 'Heroin & Brown Sugar',
      descBn: 'গুরুতর ক্ষতিকর মাদক পাউডার ও জটিল চোরাকারবার সংক্রান্ত রিপোর্ট',
      descEn: 'Severe illicit powders and organized narcotics networks',
      color: 'from-purple-500/20 to-indigo-500/10 border-purple-500/30 text-purple-300',
    },
    {
      key: 'TRAMADOL_TABLETS',
      titleBn: 'ট্রামাডল ও প্রেসক্রিপশন মাদক',
      titleEn: 'Tramadol & Prescription Narcotics',
      descBn: 'অননুমোদিত ফার্মেসি থেকে চিকিৎসকের পরামর্শ ছাড়া নেশার ওষুধ বিক্রি',
      descEn: 'Unauthorized pharmacy sales of restricted narcotic painkillers',
      color: 'from-blue-500/20 to-cyan-500/10 border-blue-500/30 text-blue-300',
    },
    {
      key: 'SUSPECTED_DISTRIBUTION',
      titleBn: 'সন্দেহজনক পাচার ও সরবরাহ',
      titleEn: 'Suspected Supply & Distribution',
      descBn: 'যানবাহন, কুরিয়ার বা গোপন পথে অজ্ঞাত মাদক প্যাকেট স্থানান্তর',
      descEn: 'Suspicious vehicle or transit parcel movements of unknown substances',
      color: 'from-teal-500/20 to-emerald-500/10 border-teal-500/30 text-teal-300',
    },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.15),rgba(255,255,255,0))]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs sm:text-sm font-semibold mb-6">
            <Shield className="w-4 h-4" />
            <span>{t('brandBadge')}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-tight">
            {t('heroTitle')}
          </h1>

          <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {t('heroSubtitle')}
          </p>

          {/* Primary Action Buttons */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('report')}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base shadow-lg shadow-emerald-600/30 transition transform hover:-translate-y-0.5"
            >
              <FileText className="w-5 h-5" />
              <span>{t('heroBtnReport')}</span>
            </button>

            <button
              onClick={() => onNavigate('track')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-base transition"
            >
              <Search className="w-4 h-4 text-emerald-400" />
              <span>{t('heroBtnTrack')}</span>
            </button>

            <button
              onClick={() => onNavigate('safety')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800 font-semibold text-base transition"
            >
              <HeartHandshake className="w-4 h-4 text-teal-400" />
              <span>{t('heroBtnSafety')}</span>
            </button>
          </div>

          {/* Critical Privacy Banner */}
          <div className="mt-12 max-w-4xl mx-auto p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-emerald-500/30 shadow-xl text-left flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0 mt-0.5">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>{t('privacyNoticeTitle')}</span>
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-slate-300 leading-relaxed">
                {t('privacyNoticeDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Anonymized Statistics Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-white">
            {language === 'bn' ? 'জাতীয় অগ্রগতি ও বাস্তব চিত্র' : 'National Progress & Statistics'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {language === 'bn'
              ? 'আইন প্রয়োগকারী সংস্থার গৃহীত ব্যবস্থা ও যাচাইকৃত তথ্যের সার্বিক চিত্র (ব্যক্তিগত তথ্য সম্পূর্ণ গোপন)'
              : 'Aggregated verified law enforcement outcomes (All personal data strictly confidential)'}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
            <div className="text-2xl sm:text-3xl font-black text-emerald-400">
              {stats?.totalReports.toLocaleString() || '1,428'}
            </div>
            <div className="mt-1 text-xs text-slate-400 font-medium">{t('statsTotal')}</div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
            <div className="text-2xl sm:text-3xl font-black text-amber-400">
              {stats?.underReview.toLocaleString() || '184'}
            </div>
            <div className="mt-1 text-xs text-slate-400 font-medium">{t('statsReview')}</div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
            <div className="text-2xl sm:text-3xl font-black text-teal-400">
              {stats?.verifiedIncidents.toLocaleString() || '812'}
            </div>
            <div className="mt-1 text-xs text-slate-400 font-medium">{t('statsVerified')}</div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
            <div className="text-2xl sm:text-3xl font-black text-purple-400">
              {stats?.actionTaken.toLocaleString() || '365'}
            </div>
            <div className="mt-1 text-xs text-slate-400 font-medium">{t('statsActionTaken')}</div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-center col-span-2 md:col-span-1">
            <div className="text-2xl sm:text-3xl font-black text-blue-400">
              {stats?.areasCovered || '64'}
            </div>
            <div className="mt-1 text-xs text-slate-400 font-medium">{t('statsAreas')}</div>
          </div>
        </div>
      </section>

      {/* Incident Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs uppercase font-semibold tracking-wider text-emerald-400">
              {language === 'bn' ? 'সন্দেহজনক ঘটনার ধরন' : 'Incident Types'}
            </div>
            <h2 className="text-2xl font-bold text-white mt-1">
              {language === 'bn' ? 'কোন ধরনের ঘটনা সম্পর্কে তথ্য দিতে পারেন?' : 'What Can You Report?'}
            </h2>
          </div>
          <button
            onClick={() => onNavigate('report')}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition"
          >
            <span>{language === 'bn' ? 'সরাসরি রিপোর্ট জমা দিন' : 'File a report now'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => (
            <div
              key={cat.key}
              onClick={() => onNavigate('report')}
              className={`p-5 rounded-2xl bg-gradient-to-br ${cat.color} border bg-slate-900/60 hover:bg-slate-900 cursor-pointer transition transform hover:-translate-y-1`}
            >
              <h3 className="text-base font-bold text-white">
                {language === 'bn' ? cat.titleBn : cat.titleEn}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                {language === 'bn' ? cat.descBn : cat.descEn}
              </p>
              <div className="mt-4 flex items-center justify-between text-xs font-semibold text-emerald-400">
                <span>{language === 'bn' ? 'রিপোর্ট করুন' : 'Report Incident'}</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Workflow Architecture */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/90 border border-slate-800">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl font-bold text-white">
              {language === 'bn' ? 'গোপনীয় রিপোর্ট ও তদন্ত প্রক্রিয়া' : 'Confidential Reporting Workflow'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              {language === 'bn'
                ? 'আপনার তথ্য কীভাবে সংশ্লিষ্ট থানায় পৌঁছায় এবং যাচাই করা হয়'
                : 'How your submission reaches assigned Thana officers securely'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-800 relative">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 font-black text-sm flex items-center justify-center mb-4">
                ১
              </div>
              <h4 className="text-sm font-bold text-white">
                {language === 'bn' ? 'তথ্য দাখিল ও প্রমাণ আপলোড' : '1. Submit Confidential Report'}
              </h4>
              <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                {language === 'bn'
                  ? 'নাগরিক অনলাইনে ঘটনার বিবরণ, স্থান এবং প্রমাণ সংযুক্ত করেন। কোনো পাবলিক প্রকাশ হয় না।'
                  : 'Citizen fills report narrative and attaches photo/video evidence.'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-800 relative">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 font-black text-sm flex items-center justify-center mb-4">
                ২
              </div>
              <h4 className="text-sm font-bold text-white">
                {language === 'bn' ? 'প্রাইভেট টেলিগ্রাম স্টোরেজ' : '2. Telegram Private Vault'}
              </h4>
              <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                {language === 'bn'
                  ? 'প্রমাণ সরাসরি টেলিগ্রামের এনক্রিপ্টেড প্রাইভেট চ্যানেলে সুরক্ষিত হয়। পাবলিক লিংক তৈরি হয় না।'
                  : 'Evidence is stored in an encrypted private Telegram channel managed by the bot.'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-800 relative">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 font-black text-sm flex items-center justify-center mb-4">
                ৩
              </div>
              <h4 className="text-sm font-bold text-white">
                {language === 'bn' ? 'থানাভিত্তিক পুলিশ যাচাই' : '3. Thana Police Investigation'}
              </h4>
              <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                {language === 'bn'
                  ? 'শুধুমাত্র সংশ্লিষ্ট থানার দায়িত্বপ্রাপ্ত পুলিশ কর্মকর্তা লগইন করে অডিট ট্রেইলের মাধ্যমে ফাইল যাচাই করেন।'
                  : 'Only assigned Thana officers can access the incident and evaluate evidence.'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-800 relative">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 font-black text-sm flex items-center justify-center mb-4">
                ৪
              </div>
              <h4 className="text-sm font-bold text-white">
                {language === 'bn' ? 'আইনি ব্যবস্থা ও ট্র্যাকিং' : '4. Action & Citizen Tracking'}
              </h4>
              <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                {language === 'bn'
                  ? 'অভিযান পরিচালিত হলে ট্র্যাকিং পিনের মাধ্যমে নাগরিক তদন্তের অগ্রগতি দেখতে পারেন।'
                  : 'Official action is taken and citizen tracks status with private PIN.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Law Enforcement Portal Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-3xl bg-gradient-to-r from-blue-950/60 to-slate-900 border border-blue-900/60 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 flex-shrink-0">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                {language === 'bn' ? 'বাংলাদেশ পুলিশ ও আইন প্রয়োগকারী সংস্থা লগইন' : 'Law Enforcement & Police Portal'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                {language === 'bn'
                  ? 'দায়িত্বপ্রাপ্ত থানার তদন্তকারী কর্মকর্তা আপনার স্টেশন আইডির মাধ্যমে লগইন করে রিপোর্ট পর্যবেক্ষণ করতে পারেন।'
                  : 'Authorized Thana officers log in to review assigned incidents, evidence, and update status.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('police-dashboard')}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition"
            >
              {language === 'bn' ? 'পুলিশ পোর্টাল প্রবেশ' : 'Access Police Portal'}
            </button>
            <button
              onClick={() => onNavigate('admin-dashboard')}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm transition"
            >
              {language === 'bn' ? 'সুপার অ্যাডমিন' : 'Super Admin'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
export default HomePage;
