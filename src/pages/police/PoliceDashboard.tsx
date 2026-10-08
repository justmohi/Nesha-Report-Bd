import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { Report } from '../../types';
import { dataService } from '../../services/dataService';
import StatusBadge from '../../components/common/StatusBadge';
import {
  Shield,
  Building2,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Archive,
  ArrowRight,
  TrendingUp,
  MapPin,
  Calendar,
  Lock,
  Search
} from 'lucide-react';

interface PoliceDashboardProps {
  onNavigate: (tab: string, param?: string) => void;
}

export const PoliceDashboard: React.FC<PoliceDashboardProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();
  const { policeUser, role, currentUser } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const thanaId = policeUser?.assignedThanaId || 'thana_gulshan';
  const thanaName = policeUser ? (language === 'bn' ? policeUser.thanaNameBn : policeUser.thanaNameEn) : 'গুলশান থানা';

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const uid = currentUser?.uid || 'police_gulshan_01';
        const list = await dataService.getReports('POLICE_USER', uid, thanaId);
        setReports(list);
      } catch (e) {
        console.error('Failed to load police dashboard reports', e);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [thanaId, currentUser]);

  const totalCount = reports.length;
  const newCount = reports.filter((r) => r.status === 'SUBMITTED').length;
  const reviewCount = reports.filter((r) => r.status === 'UNDER_REVIEW').length;
  const verifiedCount = reports.filter((r) => r.status === 'VERIFIED').length;
  const actionCount = reports.filter((r) => r.status === 'ACTION_TAKEN').length;
  const closedCount = reports.filter((r) => r.status === 'CLOSED').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Station Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-blue-900/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 flex-shrink-0">
            <Building2 className="w-8 h-8" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold mb-1">
              <Shield className="w-3.5 h-3.5" />
              <span>{t('policeStation')}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {thanaName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {policeUser?.fullName} | {policeUser?.badgeNumber} ({policeUser?.rank})
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigate('police-reports')}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm transition"
          >
            {language === 'bn' ? 'সকল রিপোর্ট দেখুন' : 'View All Reports'}
          </button>
          <button
            onClick={() => onNavigate('police-map')}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs sm:text-sm transition flex items-center gap-1.5"
          >
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>{language === 'bn' ? 'থানা ম্যাপ' : 'Thana Map'}</span>
          </button>
        </div>
      </div>

      {/* Strict Scoping Notice */}
      <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-800/40 flex items-start gap-3 text-xs text-blue-300">
        <Lock className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">{t('policeRestrictedNotice')}</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400 font-medium">{t('totalReports')}</div>
          <div className="text-2xl sm:text-3xl font-black text-white mt-1 font-mono">
            {totalCount}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-blue-500/20">
          <div className="text-xs text-blue-400 font-medium">{t('newReports')}</div>
          <div className="text-2xl sm:text-3xl font-black text-blue-400 mt-1 font-mono">
            {newCount}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-amber-500/20">
          <div className="text-xs text-amber-400 font-medium">{t('underReviewReports')}</div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400 mt-1 font-mono">
            {reviewCount}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/20">
          <div className="text-xs text-emerald-400 font-medium">{t('verifiedReports')}</div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1 font-mono">
            {verifiedCount}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-purple-500/20">
          <div className="text-xs text-purple-400 font-medium">{t('actionTakenReports')}</div>
          <div className="text-2xl sm:text-3xl font-black text-purple-400 mt-1 font-mono">
            {actionCount}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400 font-medium">{t('closedReports')}</div>
          <div className="text-2xl sm:text-3xl font-black text-slate-300 mt-1 font-mono">
            {closedCount}
          </div>
        </div>
      </div>

      {/* Recent Assigned Incident Feed */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            <span>{t('recentAssignedIncidents')}</span>
          </h2>

          <button
            onClick={() => onNavigate('police-reports')}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition"
          >
            {language === 'bn' ? 'সকল ফিল্টার ও তালিকা' : 'Full Reports List'}
          </button>
        </div>

        {reports.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            {language === 'bn' ? 'আপনার থানায় এখনো কোনো রিপোর্ট জমা হয়নি।' : 'No reports assigned to this Thana yet.'}
          </div>
        ) : (
          <div className="space-y-3">
            {reports.slice(0, 5).map((rep) => (
              <div
                key={rep.id}
                onClick={() => onNavigate('police-report-detail', rep.id)}
                className="p-4 rounded-2xl bg-slate-800/40 hover:bg-slate-800/90 border border-slate-800 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      {rep.reportId}
                    </span>
                    <StatusBadge status={rep.status} size="sm" />
                    {rep.hasReportedPerson && (
                      <span className="text-[10px] uppercase font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                        {language === 'bn' ? 'ব্যক্তির তথ্য সংযোজিত' : 'Suspect Attached'}
                      </span>
                    )}
                    {rep.evidenceIds.length > 0 && (
                      <span className="text-[10px] uppercase font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                        {rep.evidenceIds.length} {language === 'bn' ? 'প্রমাণ' : 'Evidence'}
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-white">
                    {t(`cat_${rep.incidentType}` as any, rep.incidentType)}
                  </h3>

                  <p className="text-xs text-slate-300 line-clamp-1">
                    {rep.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      {rep.jurisdiction.villageArea || rep.jurisdiction.thanaName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      {rep.incidentDate} ({rep.incidentTime})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <span className="text-xs font-semibold text-blue-400 hover:text-blue-300 inline-flex items-center gap-1">
                    <span>{t('viewDetails')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default PoliceDashboard;
