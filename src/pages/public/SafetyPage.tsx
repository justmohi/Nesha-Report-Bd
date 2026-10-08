import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { PhoneCall, Shield, Heart, AlertTriangle, BookOpen, CheckCircle2, Lock } from 'lucide-react';

export const SafetyPage: React.FC = () => {
  const { t, language } = useLanguage();

  const helplines = [
    {
      nameBn: 'জাতীয় জরুরি সেবা (পুলিশ, ফায়ার সার্ভিস, অ্যাম্বুলেন্স)',
      nameEn: 'National Emergency Service (Police, Fire, Ambulance)',
      number: '৯৯৯ (999)',
      descBn: 'যেকোনো তাৎক্ষণিক পুলিশি সহায়তা বা জীবননাশের আশঙ্কায় কল করুন (২৪/৭ ফ্রি)।',
      descEn: 'Instant police assistance and emergency 24/7 toll-free.',
      color: 'bg-emerald-50 border-emerald-200 text-[#006a4e]',
    },
    {
      nameBn: 'মাদকদ্রব্য নিয়ন্ত্রণ অধিদপ্তর (DNC)',
      nameEn: 'Department of Narcotics Control (DNC)',
      number: '১৬১২৪ (16124)',
      descBn: 'মাদক সংক্রান্ত তথ্য, অভিযোগ ও নিরাময় পরামর্শ বিষয়ক সরকারি হটলাইন।',
      descEn: 'Official government hotline for drug abuse information & complaints.',
      color: 'bg-blue-500/10 border-blue-500/30 text-blue-700',
    },
    {
      nameBn: 'কেন্দ্রীয় মাদকাসক্তি নিরাময় হাসপাতাল (তেজগাঁও, ঢাকা)',
      nameEn: 'Central Drug Addiction Treatment Hospital (Tejgaon, Dhaka)',
      number: '০২-৮৩৩৩৫৫৫ (02-8333555)',
      descBn: 'সরকারি উদ্যোগে আধুনিক চিকিৎসা, ডিটক্সিফিকেশন ও পুনর্বাসন সুবিধা।',
      descEn: 'Government psychiatric detoxification and rehabilitation services.',
      color: 'bg-teal-50 border-teal-500/30 text-teal-700',
    },
    {
      nameBn: 'জাতীয় মানসিক স্বাস্থ্য ইনস্টিটিউট (NIMH)',
      nameEn: 'National Institute of Mental Health (NIMH)',
      number: '০২-৯১১৮৮৬৬ (02-9118866)',
      descBn: 'মানসিক স্বাস্থ্য ও আচরণগত কাউন্সেলিং সহায়তা।',
      descEn: 'Mental health and behavioral counselling support.',
      color: 'bg-purple-500/10 border-purple-500/30 text-purple-700',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#006a4e] text-xs font-semibold mb-2">
          <Heart className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? 'সচেতনতা ও চিকিৎসা গাইড' : 'Awareness & Rehab Directory'}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
          {t('safetyInfo')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
          {language === 'bn'
            ? 'মাদকাসক্তি একটি নিরাময়যোগ্য ব্যাধি। সঠিক চিকিৎসা ও সামাজিক পুনর্বাসনের মাধ্যমে ভুক্তভোগীকে স্বাভাবিক জীবনে ফিরিয়ে আনা সম্ভব।'
            : 'Addiction is a treatable condition. Learn about legal protections, medical recovery, and verified helplines.'}
        </p>
      </div>

      {/* Helplines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {helplines.map((h, idx) => (
          <div
            key={idx}
            className={`p-6 rounded-3xl border bg-white flex flex-col justify-between space-y-4 ${h.color}`}
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {language === 'bn' ? 'জরুরি যোগাযোগ' : 'Emergency Contact'}
                </span>
                <PhoneCall className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-1">
                {language === 'bn' ? h.nameBn : h.nameEn}
              </h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                {language === 'bn' ? h.descBn : h.descEn}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <span className="text-lg font-black text-slate-900 font-mono">{h.number}</span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-50 text-slate-600">
                {language === 'bn' ? 'সরাসরি কল করুন' : 'Toll-free / Call'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Legal & Citizen Rights Section */}
      <div className="p-8 rounded-3xl bg-white border border-slate-200 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#006a4e]">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {language === 'bn'
                ? 'মাদকদ্রব্য নিয়ন্ত্রণ আইন ২০১৮ ও নাগরিক অধিকার'
                : 'Narcotics Control Act 2018 & Citizen Rights'}
            </h2>
            <p className="text-xs text-slate-500">
              {language === 'bn' ? 'দায়িত্বশীল নাগরিক হিসেবে আপনার করণীয় ও আইনি সুরক্ষা' : 'Legal guidelines for reporting and public safety'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600 leading-relaxed">
          <div className="p-4 rounded-2xl bg-slate-50/40 border border-slate-200 space-y-2">
            <h4 className="font-bold text-[#006a4e] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              {language === 'bn' ? 'তথ্যদাতার সর্বোচ্চ গোপনীয়তা' : 'Reporter Protection'}
            </h4>
            <p>
              {language === 'bn'
                ? 'আইন অনুযায়ী তথ্যদাতার পরিচয় প্রকাশ করা সম্পূর্ণ নিষিদ্ধ। আপনি প্ল্যাটফর্মে যে তথ্য দেবেন তা সরাসরি সংশ্লিষ্ট থানার তদন্ত টিম ব্যতীত অন্য কেউ দেখতে পারবে না।'
                : 'Under Bangladesh law, informant identity is confidential and protected against disclosure.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50/40 border border-slate-200 space-y-2">
            <h4 className="font-bold text-[#006a4e] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              {language === 'bn' ? 'পাবলিক ব্ল্যাকলিস্টের বিরুদ্ধে সুরক্ষা' : 'Protection from Public Labelling'}
            </h4>
            <p>
              {language === 'bn'
                ? 'কাউকে ব্যক্তিগত শত্রুতা বা ক্ষোভের বশে সামাজিকভাবে অপদস্ত করা দণ্ডনীয় অপরাধ। তাই এই প্ল্যাটফর্ম কোনো ব্যক্তিকে প্রকাশ্যে "মাদকাসক্ত" বা "অপরাধী" আখ্যা দেয় না।'
                : 'Defamatory naming is strictly prohibited. Unsubstantiated claims never result in public criminal branding.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SafetyPage;
