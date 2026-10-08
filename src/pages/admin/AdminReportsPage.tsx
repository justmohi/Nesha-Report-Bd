import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { Report } from '../../types';
import { dataService } from '../../services/dataService';
import StatusBadge from '../../components/common/StatusBadge';
import {
  Shield,
  Search,
  Filter,
  MapPin,
  Calendar,
  Lock,
  ArrowRight,
  FileText
} from 'lucide-react';

interface AdminReportsPageProps {
  onNavigate: (tab: string, param?: string) => void;
}

export const AdminReportsPage: React.FC<AdminReportsPageProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();
  const { currentUser } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    dataService.getReports('SUPER_ADMIN', currentUser?.uid || 'admin_central_01').then((list) => {
      setReports(list);
      setIsLoading(false);
    });
  }, [currentUser]);

  const filteredReports = reports.filter((r) => {
    if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        r.reportId.toLowerCase().includes(term) ||
        r.jurisdiction.thanaName.toLowerCase().includes(term) ||
        r.incidentType.toLowerCase().includes(term) ||
        r.description.toLowerCase().includes(term)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>{t('allJurisdictions')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {language === 'bn' ? 'জাতীয় সেন্ট্রাল রিপোর্ট তালিকা' : 'National Master Reports'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {language === 'bn'
              ? 'সমগ্র বাংলাদেশের সকল থানার দাখিলকৃত রিপোর্ট ও তদন্তের অবস্থান'
              : 'All nationwide incident submissions across all Thana jurisdictions'}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('search')}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs sm:text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="ALL">{language === 'bn' ? 'সকল অবস্থা (Status)' : 'All Statuses'}</option>
            <option value="SUBMITTED">{t('status_SUBMITTED')}</option>
            <option value="UNDER_REVIEW">{t('status_UNDER_REVIEW')}</option>
            <option value="VERIFIED">{t('status_VERIFIED')}</option>
            <option value="REJECTED">{t('status_REJECTED')}</option>
            <option value="ACTION_TAKEN">{t('status_ACTION_TAKEN')}</option>
            <option value="CLOSED">{t('status_CLOSED')}</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              onClick={() => onNavigate('police-report-detail', report.id)}
              className="p-5 rounded-2xl bg-slate-900 hover:bg-slate-800/80 border border-slate-800 transition cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                    {report.reportId}
                  </span>
                  <span className="text-xs text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20 font-medium">
                    {report.jurisdiction.thanaName}
                  </span>
                  <StatusBadge status={report.status} size="sm" />
                </div>

                <h3 className="text-base font-bold text-white">
                  {t(`cat_${report.incidentType}` as any, report.incidentType)}
                </h3>

                <p className="text-xs text-slate-300 line-clamp-1">
                  {report.description}
                </p>

                <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    {report.jurisdiction.villageArea || report.jurisdiction.thanaName}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    {report.incidentDate}
                  </span>
                </div>
              </div>

              <button className="px-4 py-2 rounded-xl bg-purple-600/90 hover:bg-purple-600 text-white text-xs font-semibold flex items-center gap-1.5 self-start md:self-center transition">
                <span>{language === 'bn' ? 'পর্যালোচনা' : 'Review'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default AdminReportsPage;
