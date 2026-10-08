import React from 'react';
import { ReportStatus, StatusHistoryItem } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { CheckCircle2, Clock, AlertCircle, ShieldAlert, Sparkles, XCircle } from 'lucide-react';

interface StatusTimelineProps {
  currentStatus: ReportStatus;
  history?: StatusHistoryItem[];
}

export const StatusTimeline: React.FC<StatusTimelineProps> = ({
  currentStatus,
  history = [],
}) => {
  const { language } = useLanguage();

  const steps: { key: ReportStatus; labelBn: string; labelEn: string; descBn: string; descEn: string }[] = [
    {
      key: 'SUBMITTED',
      labelBn: 'দাখিলকৃত',
      labelEn: 'Submitted',
      descBn: 'নাগরিক কর্তৃক অনলাইনে প্রাথমিক তথ্য জমা',
      descEn: 'Citizen report logged securely',
    },
    {
      key: 'UNDER_REVIEW',
      labelBn: 'পুলিশ পর্যালোচনা',
      labelEn: 'Police Review',
      descBn: 'থানা তদন্ত কর্মকর্তা কর্তৃক প্রাথমিক যাচাই',
      descEn: 'Assigned Thana examining data',
    },
    {
      key: 'VERIFIED',
      labelBn: 'সত্যতা যাচাই',
      labelEn: 'Verified',
      descBn: 'আইন প্রয়োগকারী সংস্থার গোয়েন্দা নিশ্চিতকরণ',
      descEn: 'Factual corroboration confirmed',
    },
    {
      key: 'ACTION_TAKEN',
      labelBn: 'ব্যবস্থা গ্রহণ',
      labelEn: 'Action Taken',
      descBn: 'অভিযান পরিচালনা ও আইনি প্রক্রিয়া সম্পন্ন',
      descEn: 'Official law-enforcement action executed',
    },
    {
      key: 'CLOSED',
      labelBn: 'নিষ্পত্তিকৃত',
      labelEn: 'Closed',
      descBn: 'মামলা বা তদন্তের সমাপ্তি ঘোষণা',
      descEn: 'Case closed and filed',
    },
  ];

  // Helper to determine step state
  const getStepIndex = (status: ReportStatus) => {
    switch (status) {
      case 'SUBMITTED': return 0;
      case 'UNDER_REVIEW': return 1;
      case 'VERIFIED': return 2;
      case 'ACTION_TAKEN': return 3;
      case 'CLOSED': return 4;
      case 'REJECTED': return 1;
      default: return 0;
    }
  };

  const currentIndex = getStepIndex(currentStatus);
  const isRejected = currentStatus === 'REJECTED';

  return (
    <div className="w-full py-4">
      <div className="relative">
        {/* Step Progression Bar */}
        <div className="hidden md:grid md:grid-cols-5 gap-2 relative">
          <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-800 -z-0">
            <div
              className={`h-full transition-all duration-500 ${isRejected ? 'bg-rose-500' : 'bg-emerald-500'}`}
              style={{
                width: isRejected ? '30%' : `${(Math.min(currentIndex, 4) / 4) * 100}%`,
              }}
            />
          </div>

          {steps.map((step, idx) => {
            const isCompleted = !isRejected && idx <= currentIndex;
            const isCurrent = !isRejected && idx === currentIndex;
            const historyMatch = history.find((h) => h.status === step.key);

            return (
              <div key={step.key} className="flex flex-col items-center text-center relative z-10 px-2">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold text-xs border-2 transition-all ${
                    isCompleted
                      ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20'
                      : isCurrent
                      ? 'bg-slate-900 border-emerald-400 text-emerald-400 ring-4 ring-emerald-500/20'
                      : 'bg-slate-900 border-slate-700 text-slate-500'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                </div>
                <h4
                  className={`mt-2.5 text-xs sm:text-sm font-semibold ${
                    isCompleted || isCurrent ? 'text-slate-100' : 'text-slate-500'
                  }`}
                >
                  {language === 'bn' ? step.labelBn : step.labelEn}
                </h4>
                <p className="mt-0.5 text-[11px] text-slate-400 leading-tight hidden lg:block">
                  {language === 'bn' ? step.descBn : step.descEn}
                </p>
                {historyMatch && (
                  <span className="mt-1 text-[10px] text-emerald-400/90 font-mono">
                    {new Date(historyMatch.timestamp).toLocaleDateString()}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* If Rejected Banner */}
        {isRejected && (
          <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-3 text-rose-300">
            <XCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />
            <div className="text-xs">
              <span className="font-semibold">
                {language === 'bn' ? 'রিপোর্টটি বাতিল বা ভিত্তিহীন হিসেবে চিহ্নিত:' : 'Report marked as Rejected / Unsubstantiated:'}
              </span>{' '}
              {history.find((h) => h.status === 'REJECTED')?.notes ||
                (language === 'bn'
                  ? 'তদন্তে উপযুক্ত তথ্যের ঘাটতি বা ভুল তথ্য প্রতীয়মান হয়েছে।'
                  : 'Insufficient factual evidence or found inaccurate.')}
            </div>
          </div>
        )}

        {/* Detailed History Feed */}
        {history.length > 0 && (
          <div className="mt-6 border-t border-slate-800/80 pt-4">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              {language === 'bn' ? 'অডিট হিস্ট্রি ও তদন্ত অগ্রগতির রেকর্ড' : 'Audit History & Progress Log'}
            </h5>
            <div className="space-y-3">
              {history.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/40 border border-slate-800"
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                  <div className="flex-1 text-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-semibold text-slate-200">{item.status}</span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {new Date(item.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-slate-400 text-[11px] mt-0.5">
                      {language === 'bn' ? 'হালনাগাদ করেছেন:' : 'Updated by:'}{' '}
                      <span className="text-slate-300 font-medium">{item.updatedBy}</span> ({item.role})
                    </div>
                    {item.notes && (
                      <p className="mt-1 text-slate-300 bg-slate-900/60 p-2 rounded border border-slate-800/60">
                        {item.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default StatusTimeline;
