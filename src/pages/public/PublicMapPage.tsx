import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Shield, MapPin, Lock, Info, Activity, AlertTriangle, Layers } from 'lucide-react';

interface AreaDensity {
  id: string;
  nameBn: string;
  nameEn: string;
  districtBn: string;
  districtEn: string;
  totalIncidents: number;
  verifiedCount: number;
  actionTakenCount: number;
  topSubstanceBn: string;
  topSubstanceEn: string;
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  lat: number;
  lng: number;
}

const AGGREGATED_AREAS: AreaDensity[] = [
  {
    id: 'area_1',
    nameBn: 'গুলশান ও বনানী জোন (ঢাকা)',
    nameEn: 'Gulshan & Banani Zone (Dhaka)',
    districtBn: 'ঢাকা',
    districtEn: 'Dhaka',
    totalIncidents: 142,
    verifiedCount: 88,
    actionTakenCount: 42,
    topSubstanceBn: 'ইয়াবা ও সিন্থেটিক মাদক',
    topSubstanceEn: 'Yaba & Synthetics',
    riskLevel: 'HIGH',
    lat: 23.7925,
    lng: 90.4078,
  },
  {
    id: 'area_2',
    nameBn: 'মিরপুর মডেল জোন (ঢাকা)',
    nameEn: 'Mirpur Model Zone (Dhaka)',
    districtBn: 'ঢাকা',
    districtEn: 'Dhaka',
    totalIncidents: 195,
    verifiedCount: 110,
    actionTakenCount: 65,
    topSubstanceBn: 'গাঁজা ও ট্রামাডল ট্যাবলেট',
    topSubstanceEn: 'Cannabis & Painkillers',
    riskLevel: 'HIGH',
    lat: 23.8067,
    lng: 90.3683,
  },
  {
    id: 'area_3',
    nameBn: 'ধানমন্ডি লেক ও সংলগ্ন এলাকা (ঢাকা)',
    nameEn: 'Dhanmondi Lake & Surroundings (Dhaka)',
    districtBn: 'ঢাকা',
    districtEn: 'Dhaka',
    totalIncidents: 84,
    verifiedCount: 46,
    actionTakenCount: 22,
    topSubstanceBn: 'গাঁজা সেবন ও বিক্রি',
    topSubstanceEn: 'Cannabis',
    riskLevel: 'MEDIUM',
    lat: 23.7461,
    lng: 90.3742,
  },
  {
    id: 'area_4',
    nameBn: 'কোতোয়ালী ও বন্দর জোন (চট্টগ্রাম)',
    nameEn: 'Kotwali & Port Zone (Chattogram)',
    districtBn: 'চট্টগ্রাম',
    districtEn: 'Chattogram',
    totalIncidents: 230,
    verifiedCount: 145,
    actionTakenCount: 78,
    topSubstanceBn: 'ফেনসিডিল ও সিরাপ চালান',
    topSubstanceEn: 'Phensedyl & Syrups',
    riskLevel: 'HIGH',
    lat: 22.3384,
    lng: 91.8385,
  },
  {
    id: 'area_5',
    nameBn: 'টেকনাফ সীমান্ত ও নদী জোন (কক্সবাজার)',
    nameEn: 'Teknaf Border & River Zone (Cox’s Bazar)',
    districtBn: "কক্সবাজার",
    districtEn: "Cox's Bazar",
    totalIncidents: 312,
    verifiedCount: 210,
    actionTakenCount: 115,
    topSubstanceBn: 'ইয়াবা সরবরাহ ও চোরাচালান',
    topSubstanceEn: 'Yaba Supply Networks',
    riskLevel: 'HIGH',
    lat: 20.8656,
    lng: 92.2980,
  },
  {
    id: 'area_6',
    nameBn: 'সিলেট কোতোয়ালী জোন (সিলেট)',
    nameEn: 'Sylhet Kotwali Zone (Sylhet)',
    districtBn: 'সিলেট',
    districtEn: 'Sylhet',
    totalIncidents: 76,
    verifiedCount: 42,
    actionTakenCount: 19,
    topSubstanceBn: 'অননুমোদিত ইনজেকশন ও সিরাপ',
    topSubstanceEn: 'Injections & Syrups',
    riskLevel: 'LOW',
    lat: 24.8949,
    lng: 91.8687,
  },
];

export const PublicMapPage: React.FC = () => {
  const { t, language } = useLanguage();
  const [selectedArea, setSelectedArea] = useState<AreaDensity>(AGGREGATED_AREAS[0]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
          <Layers className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? 'অজ্ঞাতনামা এলাকা ঘনত্ব' : 'Anonymized Area Heatmap'}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
          {t('publicMap')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
          {language === 'bn'
            ? 'আইন প্রয়োগকারী কর্তৃপক্ষের সহায়তায় সাধারণ এলাকাভিত্তিক সামগ্রিক তথ্যচিত্র। কোনো ব্যক্তি বা সুনির্দিষ্ট আবাসিক ঠিকানার তথ্য এখানে কখনোই প্রদর্শিত হয় না।'
            : 'Aggregated zonal statistics. Strictly prohibits displaying exact residential coordinates or personal names.'}
        </p>
      </div>

      {/* Mandatory Non-Blacklist Legal Banner */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/30 flex items-start gap-3.5 text-xs text-slate-300">
        <Lock className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-white block">
            {language === 'bn'
              ? 'আইনি গোপনীয়তা শর্তাবলী (Strict Privacy & Anonymization)'
              : 'Strict Anonymization & Legal Privacy Commitment'}
          </span>
          <p className="leading-relaxed text-slate-300">
            {language === 'bn'
              ? 'এই মানচিত্রে কেবল থানা বা জোনের সাধারণ পরিসংখ্যান দেখানো হয়েছে (যেমন: "মিরপুর এলাকা — ২৪টি রিপোর্ট")। কারও নাম, ব্যক্তিগত ছবি, সুনির্দিষ্ট ফ্ল্যাট বা বাড়ির অবস্থান আইনত সংরক্ষিত এবং এখানে অপ্রকাশ্য।'
              : 'Only aggregated area numbers are displayed (e.g. "Mirpur Area — 24 incidents"). Exact residential addresses, names, and photos are strictly excluded.'}
          </p>
        </div>
      </div>

      {/* Main Grid: Visual Map representation + Selected Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left/Middle: Interactive Regional Visual Board */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>{language === 'bn' ? 'এলাকা নির্বাচন করুন' : 'Select Aggregated Area'}</span>
            </h3>
            <span className="text-xs text-slate-400">
              {AGGREGATED_AREAS.length} {language === 'bn' ? 'টি জোন নিরীক্ষিত' : 'Monitored Zones'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {AGGREGATED_AREAS.map((area) => {
              const isSelected = selectedArea.id === area.id;
              return (
                <div
                  key={area.id}
                  onClick={() => setSelectedArea(area)}
                  className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col justify-between space-y-3 ${
                    isSelected
                      ? 'bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20'
                      : 'bg-slate-800/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-semibold uppercase text-slate-400">
                        {language === 'bn' ? area.districtBn : area.districtEn}
                      </span>
                      <h4 className="text-sm font-bold text-white mt-0.5">
                        {language === 'bn' ? area.nameBn : area.nameEn}
                      </h4>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        area.riskLevel === 'HIGH'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : area.riskLevel === 'MEDIUM'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-teal-500/10 text-teal-400 border border-teal-500/20'
                      }`}
                    >
                      {area.riskLevel}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                    <span className="text-slate-400">
                      {language === 'bn' ? 'মোট প্রাপ্ত তথ্য:' : 'Total Reports:'}
                    </span>
                    <span className="font-bold text-emerald-400 font-mono">
                      {area.totalIncidents}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* SVG Map Visualization Illustration */}
          <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 relative overflow-hidden flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                {language === 'bn' ? 'বাংলাদেশ জাতীয় জোন পরিসংখ্যান গ্রিড' : 'Bangladesh National Zonal Density Grid'}
              </h4>
              <p className="text-xs text-slate-400 mt-1 max-w-md">
                {language === 'bn'
                  ? 'আইন প্রয়োগকারী সংস্থার নজরদারি ও প্রতিরোধমূলক পেট্রোলিং সক্ষমতা বৃদ্ধির জন্য এই তথ্য ব্যবহৃত হয়।'
                  : 'Used by law enforcement dispatchers to allocate patrols and preventative narcotics enforcement.'}
              </p>
            </div>
          </div>
        </div>

        {/* Right Details Panel */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              {language === 'bn' ? 'নির্বাচিত জোনের সংক্ষিপ্ত তথ্য' : 'Zone Breakdown'}
            </span>
            <h3 className="text-xl font-extrabold text-white mt-1">
              {language === 'bn' ? selectedArea.nameBn : selectedArea.nameEn}
            </h3>
            <span className="text-xs text-slate-400">
              {language === 'bn' ? selectedArea.districtBn : selectedArea.districtEn} জেলা
            </span>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-800 flex justify-between items-center">
              <span className="text-xs text-slate-400">
                {language === 'bn' ? 'মোট প্রাপ্ত রিপোর্ট' : 'Total Reports'}
              </span>
              <span className="text-lg font-bold text-white font-mono">
                {selectedArea.totalIncidents}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-800 flex justify-between items-center">
              <span className="text-xs text-slate-400">
                {language === 'bn' ? 'যাচাইকৃত সত্যতা' : 'Verified Incidents'}
              </span>
              <span className="text-lg font-bold text-emerald-400 font-mono">
                {selectedArea.verifiedCount}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-800 flex justify-between items-center">
              <span className="text-xs text-slate-400">
                {language === 'bn' ? 'গৃহীত আইনি ব্যবস্থা' : 'Action Taken'}
              </span>
              <span className="text-lg font-bold text-purple-400 font-mono">
                {selectedArea.actionTakenCount}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400 block">
                {language === 'bn' ? 'প্রধান চিহ্নিত উপাদান' : 'Primary Substances'}
              </span>
              <span className="text-sm font-semibold text-amber-300">
                {language === 'bn' ? selectedArea.topSubstanceBn : selectedArea.topSubstanceEn}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-900/40 text-xs text-emerald-300/90 leading-relaxed">
            {language === 'bn'
              ? 'আপনার এলাকায় সন্দেহজনক মাদক বিক্রয় বা লেনদেনের তথ্য জানা থাকলে দায়িত্বশীলভাবে রিপোর্ট করুন।'
              : 'Notice something suspicious in your locality? Report responsibly to assist local police stations.'}
          </div>
        </div>
      </div>
    </div>
  );
};
export default PublicMapPage;
