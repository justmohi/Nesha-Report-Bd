import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { Report, ReportStatus, IncidentCategory } from '../../types';
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

interface PoliceReportsPageProps {
  onNavigate: (tab: string, param?: string) => void;
}

export const PoliceReportsPage: React.FC<PoliceReportsPageProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();
  const { policeUser, currentUser } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const thanaId = policeUser?.assignedThanaId;

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        if (!currentUser || !policeUser?.assignedThanaId) {
          setReports([]);
          return;
        }
        const list = await dataService.getReports('POLICE_USER', currentUser.uid, policeUser.assignedThanaId);
        setReports(list);
      } catch (err) {
        console.error('Failed to load reports', err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [thanaId, currentUser, policeUser]);

  const filteredReports = reports.filter((r) => {
    if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
    if (categoryFilter !== 'ALL' && r.incidentType !== categoryFilter) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        r.reportId.toLowerCase().includes(term) ||
        r.description.toLowerCase().includes(term) ||
        r.incidentType.toLowerCase().includes(term) ||
        (r.jurisdiction.villageArea && r.jurisdiction.villageArea.toLowerCase().includes(term))
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-2">
            <Lock className="w-3.5 h-3.5" />
            <span>
              {language === 'bn'
                ? `এখতিয়ারভুক্ত থানা: ${policeUser?.thanaNameBn || 'গুলশান থানা'}`
                : `Assigned Thana: ${policeUser?.thanaNameEn || 'Gulshan Thana'}`}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {language === 'bn' ? 'থানায় প্রাপ্ত সকল রিপোর্ট' : 'Assigned Incident Reports'}
          </h1>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('search')}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs sm:text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

        <div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs sm:text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">{language === 'bn' ? 'সকল ক্যাটাগরি' : 'All Categories'}</option>
            <option value="YABA">{t('cat_YABA')}</option>
            <option value="GANJA">{t('cat_GANJA')}</option>
            <option value="PHENSEDYL">{t('cat_PHENSEDYL')}</option>
            <option value="HEROIN">{t('cat_HEROIN')}</option>
            <option value="TRAMADOL_TABLETS">{t('cat_TRAMADOL_TABLETS')}</option>
            <option value="SUSPECTED_SELLING">{t('cat_SUSPECTED_SELLING')}</option>
            <option value="SUSPECTED_DISTRIBUTION">{t('cat_SUSPECTED_DISTRIBUTION')}</option>
            <option value="OTHER">{t('cat_OTHER')}</option>
          </select>
        </div>
      </div>

      {/* Reports List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredReports.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <FileText className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-slate-300">
            {language === 'bn' ? 'কোনো রিপোর্ট পাওয়া যায়নি' : 'No matching reports found'}
          </h3>
          <p className="text-xs text-slate-500">
            {language === 'bn' ? 'ফিল্টার পরিবর্তন করে পুনরায় চেষ্টা করুন।' : 'Try resetting your search or filters.'}
          </p>
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
                  <StatusBadge status={report.status} size="sm" />
                  {report.hasReportedPerson && (
                    <span className="text-[10px] font-bold uppercase text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                      {language === 'bn' ? 'সন্দেহভাজন ব্যক্তি' : 'Suspect Attached'}
                    </span>
                  )}
                  {report.evidenceIds.length > 0 && (
                    <span className="text-[10px] font-bold uppercase text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                      {report.evidenceIds.length} {language === 'bn' ? 'প্রমাণ ফাইল' : 'Evidence Files'}
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-white">
                  {t(`cat_${report.incidentType}` as any, report.incidentType)}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                  {report.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    {report.jurisdiction.villageArea || report.jurisdiction.thanaName}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    {report.incidentDate} ({report.incidentTime})
                  </span>
                </div>
              </div>

              <button className="px-4 py-2 rounded-xl bg-blue-600/90 hover:bg-blue-600 text-white text-xs font-semibold flex items-center gap-1.5 self-start md:self-center transition">
                <span>{language === 'bn' ? 'তদন্ত ও নোট' : 'Investigate'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default PoliceReportsPage;
