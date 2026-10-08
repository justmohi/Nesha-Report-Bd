import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { PublicStatistics, IncidentCategory, HomeBanner } from '../../types';
import { dataService } from '../../services/dataService';
import {
  Shield, FileText, Search, Lock, CheckCircle2, HeartHandshake,
  MapPin, ChevronRight, Building2, Users, ArrowRight
} from 'lucide-react';

interface HomePageProps { onNavigate: (tab: string) => void; }

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();
  const [stats, setStats] = useState<PublicStatistics | null>(null);
  const [banners, setBanners] = useState<HomeBanner[]>([]);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    Promise.all([dataService.getPublicStatistics(), dataService.getHomeBanners()])
      .then(([statistics, slides]) => { setStats(statistics); setBanners(slides); });
  }, []);

  useEffect(() => {
    if (banners.length < 2) return;
    const timer = window.setInterval(() => setActiveSlide((current) => (current + 1) % banners.length), 5000);
    return () => window.clearInterval(timer);
  }, [banners.length]);

  useEffect(() => {
    if (activeSlide >= banners.length && banners.length) setActiveSlide(0);
  }, [activeSlide, banners.length]);

  const categories: { key: IncidentCategory; titleBn: string; titleEn: string; descBn: string; descEn: string; icon: React.ReactNode }[] = [
    { key: 'YABA', titleBn: 'ইয়াবা / মেথাম্ফেটামিন', titleEn: 'Yaba / Methamphetamine', descBn: 'নিষিদ্ধ ট্যাবলেটের লেনদেন, সংরক্ষণ বা সরবরাহ সংক্রান্ত তথ্য।', descEn: 'Information about suspected distribution or possession of illicit tablets.', icon: <Shield className="w-5 h-5" /> },
    { key: 'GANJA', titleBn: 'গাঁজা / ক্যানাবিস', titleEn: 'Ganja / Cannabis', descBn: 'সন্দেহজনক বিক্রি, সরবরাহ বা প্রকাশ্য সেবন সংক্রান্ত তথ্য।', descEn: 'Information about suspected cannabis trade, supply or public use.', icon: <MapPin className="w-5 h-5" /> },
    { key: 'PHENSEDYL', titleBn: 'ফেনসিডিল ও সিরাপ', titleEn: 'Phensedyl & Illicit Syrups', descBn: 'নিষিদ্ধ সিরাপ বা সীমান্তপথে পাচার সংক্রান্ত তথ্য।', descEn: 'Information about suspected illicit syrup trafficking.', icon: <FileText className="w-5 h-5" /> },
    { key: 'HEROIN', titleBn: 'হেরোইন / ব্রাউন সুগার', titleEn: 'Heroin & Brown Sugar', descBn: 'গুরুতর মাদকদ্রব্য ও সংগঠিত সরবরাহ সংক্রান্ত তথ্য।', descEn: 'Information about suspected serious narcotics activity.', icon: <Lock className="w-5 h-5" /> },
    { key: 'TRAMADOL_TABLETS', titleBn: 'ট্রামাডল ও প্রেসক্রিপশন মাদক', titleEn: 'Tramadol & Prescription Narcotics', descBn: 'অননুমোদিত বিক্রি বা অপব্যবহার সংক্রান্ত তথ্য।', descEn: 'Information about unauthorized sales or misuse.', icon: <Users className="w-5 h-5" /> },
    { key: 'SUSPECTED_DISTRIBUTION', titleBn: 'সন্দেহজনক পাচার ও সরবরাহ', titleEn: 'Suspected Supply & Distribution', descBn: 'যানবাহন, কুরিয়ার বা গোপন পথে সন্দেহজনক মাদক পরিবহন।', descEn: 'Suspicious movement of substances through vehicles, parcels or other routes.', icon: <Building2 className="w-5 h-5" /> },
  ];

  return (
    <div className="bg-slate-50">
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {banners.length ? (
            <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-900 shadow-sm">
              {banners.map((banner,index) => (
                <div key={banner.id} className={`absolute inset-0 transition-opacity duration-700 ${index===activeSlide?'opacity-100':'opacity-0 pointer-events-none'}`}>
                  <img src={banner.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/10" />
                  <div className="relative min-h-[300px] sm:min-h-[390px] lg:min-h-[430px] flex items-center px-6 sm:px-10 lg:px-14 py-10">
                    <div className="max-w-2xl text-white">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold mb-5"><Shield className="w-4 h-4"/> {t('brandBadge')}</div>
                      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">{language==='bn'?banner.titleBn:banner.titleEn}</h1>
                      {(language==='bn'?banner.subtitleBn:banner.subtitleEn) && <p className="mt-4 text-sm sm:text-base text-white/85 max-w-xl leading-relaxed">{language==='bn'?banner.subtitleBn:banner.subtitleEn}</p>}
                      {(language==='bn'?banner.buttonLabelBn:banner.buttonLabelEn) && <button onClick={()=>onNavigate(banner.buttonTab||'report')} className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-md bg-white text-[#006a4e] font-bold text-sm hover:bg-emerald-50 transition">{language==='bn'?banner.buttonLabelBn:banner.buttonLabelEn}<ArrowRight className="w-4 h-4"/></button>}
                    </div>
                  </div>
                </div>
              ))}
              <div className="relative min-h-[300px] sm:min-h-[390px] lg:min-h-[430px] pointer-events-none" />
              {banners.length>1 && <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
                {banners.map((banner,index)=><button key={banner.id} onClick={()=>setActiveSlide(index)} className={`pointer-events-auto h-2 rounded-full transition-all ${index===activeSlide?'w-7 bg-white':'w-2 bg-white/50'}`} aria-label={`Go to slide ${index+1}`}/>)}
              </div>}
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-gradient-to-r from-[#006a4e] to-[#008b68] text-white">
              <div className="px-6 sm:px-10 lg:px-14 py-10 lg:py-14">
                <div className="max-w-3xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold mb-5"><Shield className="w-4 h-4"/> {t('brandBadge')}</div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">{t('heroTitle')}</h1>
                  <p className="mt-4 text-sm sm:text-base text-emerald-50 leading-relaxed">{t('heroSubtitle')}</p>
                  <div className="mt-7 flex flex-wrap gap-3">
                    <button onClick={()=>onNavigate('report')} className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-white text-[#006a4e] font-bold text-sm"><FileText className="w-4 h-4"/> {t('heroBtnReport')}</button>
                    <button onClick={()=>onNavigate('track')} className="inline-flex items-center gap-2 px-5 py-3 rounded-md border border-white/50 text-white font-semibold text-sm"><Search className="w-4 h-4"/> {t('heroBtnTrack')}</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">{language === 'bn' ? 'সেবা এক নজরে' : 'Services at a Glance'}</h2>
              <p className="text-xs text-slate-500 mt-1">{language === 'bn' ? 'দ্রুত প্রয়োজনীয় সেবায় প্রবেশ করুন' : 'Access the most important public services quickly'}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              ['report', FileText, language === 'bn' ? 'নতুন রিপোর্ট' : 'Submit Report'],
              ['track', Search, language === 'bn' ? 'রিপোর্ট ট্র্যাক' : 'Track Report'],
              ['my-reports', Users, language === 'bn' ? 'আমার রিপোর্ট' : 'My Reports'],
              ['safety', HeartHandshake, language === 'bn' ? 'নিরাপত্তা তথ্য' : 'Safety Information'],
            ].map(([tab, Icon, label]) => {
              const IconComp = Icon as React.ComponentType<{ className?: string }>;
              return <button key={tab as string} onClick={() => onNavigate(tab as string)} className="group flex items-center gap-3 p-4 rounded-md border border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/40 text-left transition">
                <span className="w-9 h-9 rounded-md bg-emerald-50 text-[#006a4e] flex items-center justify-center"><IconComp className="w-4 h-4" /></span>
                <span className="text-sm font-semibold text-slate-700 group-hover:text-[#006a4e]">{label as string}</span>
              </button>;
            })}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            [stats?.totalReports, t('statsTotal')],
            [stats?.underReview, t('statsReview')],
            [stats?.verifiedIncidents, t('statsVerified')],
            [stats?.actionTaken, t('statsActionTaken')],
            [stats?.areasCovered, t('statsAreas')],
          ].map(([value, label], index) => (
            <div key={index} className="bg-white border border-slate-200 rounded-md p-5 text-center">
              <div className="text-2xl font-bold text-[#006a4e]">{value?.toLocaleString?.() || '—'}</div>
              <div className="mt-1 text-xs text-slate-500">{label as string}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[#006a4e]">{language === 'bn' ? 'রিপোর্টিং সেবা' : 'Reporting Services'}</div>
              <h2 className="text-2xl font-bold text-slate-900 mt-1">{language === 'bn' ? 'কোন ধরনের ঘটনা সম্পর্কে তথ্য দিতে পারেন?' : 'What can you report?'}</h2>
            </div>
            <button onClick={() => onNavigate('report')} className="inline-flex items-center gap-1 text-sm font-semibold text-[#006a4e] hover:underline">{language === 'bn' ? 'রিপোর্ট দাখিল করুন' : 'Submit a report'} <ArrowRight className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map(cat => (
              <button key={cat.key} onClick={() => onNavigate('report')} className="text-left p-5 bg-white border border-slate-200 rounded-md hover:border-emerald-300 hover:shadow-sm transition">
                <div className="w-10 h-10 rounded-md bg-emerald-50 text-[#006a4e] flex items-center justify-center mb-4">{cat.icon}</div>
                <h3 className="text-base font-bold text-slate-900">{language === 'bn' ? cat.titleBn : cat.titleEn}</h3>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">{language === 'bn' ? cat.descBn : cat.descEn}</p>
                <div className="mt-4 text-xs font-semibold text-[#006a4e] inline-flex items-center gap-1">{language === 'bn' ? 'রিপোর্ট করুন' : 'Report'} <ChevronRight className="w-3.5 h-3.5" /></div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white border border-slate-200 rounded-md p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-md bg-emerald-50 text-[#006a4e] flex items-center justify-center"><CheckCircle2 className="w-5 h-5" /></div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{language === 'bn' ? 'রিপোর্টিং প্রক্রিয়া' : 'How the service works'}</h2>
              <p className="text-xs text-slate-500 mt-1">{language === 'bn' ? 'সহজ চারটি ধাপে রিপোর্ট দাখিল ও অগ্রগতি অনুসরণ' : 'A simple four-step reporting and follow-up process'}</p>
            </div>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              [FileText, language === 'bn' ? 'তথ্য দাখিল' : 'Submit information', language === 'bn' ? 'ঘটনার বিবরণ ও প্রয়োজনীয় তথ্য দিন।' : 'Provide the incident details.'],
              [Lock, language === 'bn' ? 'নিরাপদ সংরক্ষণ' : 'Secure handling', language === 'bn' ? 'সংযুক্ত তথ্য অনুমোদিত ব্যবস্থায় সংরক্ষিত হয়।' : 'Submitted information is handled through protected systems.'],
              [Building2, language === 'bn' ? 'সংশ্লিষ্ট কর্তৃপক্ষ' : 'Assigned authority', language === 'bn' ? 'রিপোর্ট নির্ধারিত থানার কাছে যায়।' : 'The report is routed to the assigned police station.'],
              [Search, language === 'bn' ? 'স্ট্যাটাস দেখুন' : 'Track status', language === 'bn' ? 'ট্র্যাকিং তথ্য দিয়ে অগ্রগতি দেখুন।' : 'Use your tracking details to follow progress.'],
            ].map(([Icon, title, desc], index) => {
              const IconComp = Icon as React.ComponentType<{ className?: string }>;
              return <div key={index} className="p-4 border border-slate-200 rounded-md bg-slate-50">
                <div className="text-xs font-bold text-[#006a4e] mb-3">০{index + 1}</div>
                <IconComp className="w-5 h-5 text-[#006a4e] mb-3" />
                <h3 className="text-sm font-bold text-slate-900">{title as string}</h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{desc as string}</p>
              </div>;
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#f4f8f6] border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900">{language === 'bn' ? 'আইন প্রয়োগকারী পোর্টাল' : 'Law Enforcement Portal'}</h2>
              <p className="text-sm text-slate-500 mt-1 max-w-2xl">{language === 'bn' ? 'অনুমোদিত পুলিশ কর্মকর্তা ও প্রশাসকরা পৃথক নিরাপদ পোর্টাল থেকে কাজ পরিচালনা করেন।' : 'Authorized police officers and administrators use separate protected portals.'}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => onNavigate('police-dashboard')} className="px-4 py-2.5 rounded-md bg-[#006a4e] text-white text-sm font-semibold hover:bg-[#00563f]">{t('policePortal')}</button>
              <button onClick={() => onNavigate('login')} className="px-4 py-2.5 rounded-md border border-slate-300 bg-white text-slate-700 text-sm font-semibold hover:border-emerald-300">{language === 'bn' ? 'লগইন' : 'Login'}</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;