import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { Report } from '../../types';
import { dataService } from '../../services/dataService';
import StatusBadge from '../../components/common/StatusBadge';
import {
  FileText,
  Search,
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  Shield,
  Plus
} from 'lucide-react';

interface MyReportsPageProps {
  onNavigate: (tab: string, param?: string) => void;
}

export const MyReportsPage: React.FC<MyReportsPageProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();
  const { currentUser, role } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        if (!currentUser) {
          setReports([]);
          return;
        }
        const list = await dataService.getReports('PUBLIC_USER', currentUser.uid);
        setReports(list);
      } catch (err) {
        console.error('Failed to load reports', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [currentUser]);

  const filteredReports = reports.filter((r) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      r.reportId.toLowerCase().includes(term) ||
      r.incidentType.toLowerCase().includes(term) ||
      r.jurisdiction.thanaName.toLowerCase().includes(term) ||
      r.description.toLowerCase().includes(term)
    );
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#006a4e] text-xs font-semibold mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'নাগরিক সংরক্ষিত তালিকা' : 'Protected Citizen Records'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {t('myReports')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {language === 'bn'
              ? 'আপনার দাখিলকৃত রিপোর্টসমূহের তালিকা এবং তদন্তের অগ্রগতি ট্র্যাক করুন'
              : 'Track submitted reports and law-enforcement updates'}
          </p>
        </div>

        <button
          onClick={() => onNavigate('report')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-900 font-semibold text-sm transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t('reportIncident')}</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={t('search')}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-slate-500"
        />
      </div>

      {/* Reports List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredReports.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-500 mx-auto">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-700">
            {language === 'bn' ? 'কোনো রিপোর্ট পাওয়া যায়নি' : 'No Reports Found'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
            {language === 'bn'
              ? 'আপনি এখনো কোনো রিপোর্ট দাখিল করেননি অথবা অনুসন্ধানের সাথে কোনো রেকর্ড মেলেনি।'
              : 'You have not submitted any reports yet or no records match your search.'}
          </p>
          <button
            onClick={() => onNavigate('report')}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-900 text-xs sm:text-sm font-semibold transition"
          >
            {t('reportIncident')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono font-bold text-[#006a4e]">
                    {report.reportId}
                  </span>
                  <StatusBadge status={report.status} size="sm" />
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {t(`cat_${report.incidentType}` as any, report.incidentType)}
                  </h3>
                  <p className="mt-1 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {report.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/80 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                    <span className="truncate">{report.jurisdiction.thanaName}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                    <span>{report.incidentDate}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-mono">
                  PIN: {report.trackingPin || '****'}
                </span>
                <button
                  onClick={() => onNavigate('report-detail', report.id)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#006a4e] hover:text-[#006a4e] transition"
                >
                  <span>{t('viewDetails')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default MyReportsPage;
