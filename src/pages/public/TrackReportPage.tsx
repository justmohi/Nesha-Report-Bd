import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Report } from '../../types';
import { dataService } from '../../services/dataService';
import StatusBadge from '../../components/common/StatusBadge';
import StatusTimeline from '../../components/common/StatusTimeline';
import { Search, Shield, Lock, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

interface TrackReportPageProps {
  onNavigate: (tab: string, param?: string) => void;
}

export const TrackReportPage: React.FC<TrackReportPageProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();
  const [reportIdInput, setReportIdInput] = useState<string>('');
  const [pinInput, setPinInput] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [matchedReport, setMatchedReport] = useState<Report | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMatchedReport(null);

    if (!reportIdInput.trim() || !pinInput.trim()) {
      setError(language === 'bn' ? 'অনুগ্রহ করে রিপোর্ট আইডি ও পিন লিখুন।' : 'Please enter Report ID and PIN.');
      return;
    }

    setIsSearching(true);
    try {
      const found = await dataService.findReportByTracking(reportIdInput, pinInput);
      if (!found) {
        setError(
          language === 'bn'
            ? 'প্রদত্ত রিপোর্ট আইডি বা পিন নম্বরে কোনো রিপোর্ট পাওয়া যায়নি।'
            : 'No matching report found for this Report ID and PIN combination.'
        );
      } else {
        setMatchedReport(found);
      }
    } catch (err: any) {
      setError(err.message || 'অনুসন্ধানে ত্রুটি ঘটেছে');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#006a4e] text-xs font-semibold">
          <Lock className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? 'নিরাপদ অনুসন্ধান' : 'Secure Tracking'}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
          {t('trackReport')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          {language === 'bn'
            ? 'রিপোর্ট দাখিলের সময় প্রাপ্ত আইডি এবং নিরাপত্তা পিন প্রদান করে তদন্তের বর্তমান অবস্থা জানুন'
            : 'Lookup investigation status using your unique Report ID and PIN'}
        </p>
      </div>

      {/* Lookup Form */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-5">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                {t('trackingId')} *
              </label>
              <input
                type="text"
                value={reportIdInput}
                onChange={(e) => setReportIdInput(e.target.value)}
                placeholder="REP-2026-DH-101"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                {t('trackingPin')} *
              </label>
              <input
                type="text"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="••••"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSearching}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-900 font-bold text-sm shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSearching ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>{language === 'bn' ? 'অবস্থা অনুসন্ধান করুন' : 'Track Status'}</span>
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-red-600 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Matched Result Card */}
      {matchedReport && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-emerald-200 space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <span className="text-xs font-mono font-bold text-[#006a4e]">
                {matchedReport.reportId}
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">
                {t(`cat_${matchedReport.incidentType}` as any, matchedReport.incidentType)}
              </h3>
            </div>
            <StatusBadge status={matchedReport.status} size="md" />
          </div>

          <StatusTimeline
            currentStatus={matchedReport.status}
            history={matchedReport.statusHistory}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50/40 p-4 rounded-2xl border border-slate-200">
            <div>
              <span className="text-slate-500">{t('thana')}:</span>{' '}
              <span className="text-[#006a4e] font-medium">{matchedReport.jurisdiction.thanaName}</span>
            </div>
            <div>
              <span className="text-slate-500">{t('incidentDate')}:</span>{' '}
              <span className="text-slate-700 font-medium">{matchedReport.incidentDate}</span>
            </div>
            <div>
              <span className="text-slate-500">{language === 'bn' ? 'সাধারণ এলাকা:' : 'General Area:'}</span>{' '}
              <span className="text-slate-700">{matchedReport.jurisdiction.villageArea || matchedReport.jurisdiction.thanaName}</span>
            </div>
            <div>
              <span className="text-slate-500">{language === 'bn' ? 'সর্বশেষ আপডেট:' : 'Last Updated:'}</span>{' '}
              <span className="text-slate-700">{new Date(matchedReport.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>

          {matchedReport.actionTakenDetails && (
            <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-200 text-purple-200 text-xs">
              <span className="font-bold uppercase tracking-wider block mb-1 text-purple-700">
                {t('recordActionTaken')}
              </span>
              <p className="leading-relaxed">{matchedReport.actionTakenDetails}</p>
            </div>
          )}

        </div>
      )}
    </div>
  );
};
export default TrackReportPage;
