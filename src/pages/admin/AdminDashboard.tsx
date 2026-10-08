import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { Report, PoliceUser, AuditLog } from '../../types';
import { dataService } from '../../services/dataService';
import StatusBadge from '../../components/common/StatusBadge';
import {
  Shield,
  Layers,
  Users,
  Building2,
  FileText,
  Activity,
  ArrowRight,
  Lock,
  Calendar,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (tab: string, param?: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();
  const { currentUser } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [policeUsers, setPoliceUsers] = useState<PoliceUser[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const reps = await dataService.getReports('SUPER_ADMIN', currentUser?.uid || 'admin_central_01');
        const police = await dataService.getPoliceUsers();
        const logs = await dataService.getAuditLogs();
        setReports(reps);
        setPoliceUsers(police);
        setAuditLogs(logs);
      } catch (e) {
        console.error('Failed to load admin stats', e);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [currentUser]);

  const totalReports = reports.length;
  const verifiedReports = reports.filter((r) => r.status === 'VERIFIED').length;
  const actionTakenReports = reports.filter((r) => r.status === 'ACTION_TAKEN').length;
  const activePoliceCount = policeUsers.filter((p) => p.isActive).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-purple-900/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 flex-shrink-0">
            <Layers className="w-8 h-8" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-semibold mb-1">
              <Shield className="w-3.5 h-3.5" />
              <span>{t('adminDashboardTitle')}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {language === 'bn' ? 'কেন্দ্রীয় মাদক নিয়ন্ত্রণ মনিটরিং ও প্রশাসন' : 'Central Narcotics Enforcement Administration'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {t('allJurisdictions')}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigate('admin-banners')}
            className="px-4 py-2.5 rounded-xl bg-[#006a4e] hover:bg-[#00563f] text-white font-semibold text-xs sm:text-sm transition flex items-center gap-1.5"
          >
            <Layers className="w-4 h-4" />
            <span>{language === 'bn' ? 'হোম ব্যানার' : 'Home Banners'}</span>
          </button>
          <button
            onClick={() => onNavigate('admin-police')}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs sm:text-sm transition flex items-center gap-1.5"
          >
            <Users className="w-4 h-4" />
            <span>{t('managePoliceAccounts')}</span>
          </button>
          <button
            onClick={() => onNavigate('admin-audit-logs')}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs sm:text-sm transition flex items-center gap-1.5"
          >
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>{t('systemAuditLogs')}</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400 font-medium">
            {language === 'bn' ? 'জাতীয় মোট রিপোর্ট' : 'National Reports'}
          </div>
          <div className="text-3xl font-black text-white mt-1 font-mono">
            {totalReports}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-emerald-500/20">
          <div className="text-xs text-emerald-400 font-medium">
            {language === 'bn' ? 'যাচাইকৃত রিপোর্ট' : 'Verified Reports'}
          </div>
          <div className="text-3xl font-black text-emerald-400 mt-1 font-mono">
            {verifiedReports}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-purple-500/20">
          <div className="text-xs text-purple-400 font-medium">
            {language === 'bn' ? 'সক্রিয় পুলিশ অফিসার' : 'Active Police Accounts'}
          </div>
          <div className="text-3xl font-black text-purple-400 mt-1 font-mono">
            {activePoliceCount}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-blue-500/20">
          <div className="text-xs text-blue-400 font-medium">
            {language === 'bn' ? 'নিরাপত্তা অডিট লগ' : 'Audit Trail Logs'}
          </div>
          <div className="text-3xl font-black text-blue-400 mt-1 font-mono">
            {auditLogs.length}
          </div>
        </div>
      </div>

      {/* Dual Panel: Nationwide Reports & Recent Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reports Panel */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-400" />
              <span>{language === 'bn' ? 'সর্বশেষ জাতীয় রিপোর্টসমূহ' : 'Latest National Submissions'}</span>
            </h3>
            <button
              onClick={() => onNavigate('admin-reports')}
              className="text-xs text-purple-400 hover:text-purple-300 font-semibold"
            >
              {language === 'bn' ? 'সকল দেখুন' : 'View All'}
            </button>
          </div>

          <div className="space-y-2.5">
            {reports.slice(0, 4).map((rep) => (
              <div
                key={rep.id}
                onClick={() => onNavigate('admin-report-detail', rep.id)}
                className="p-3.5 rounded-2xl bg-slate-800/40 hover:bg-slate-800 border border-slate-800 transition cursor-pointer flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-emerald-400">{rep.reportId}</span>
                    <span className="text-slate-400">{rep.jurisdiction.thanaName}</span>
                  </div>
                  <div className="font-semibold text-slate-200 mt-0.5">
                    {t(`cat_${rep.incidentType}` as any, rep.incidentType)}
                  </div>
                </div>
                <StatusBadge status={rep.status} size="sm" showIcon={false} />
              </div>
            ))}
          </div>
        </div>

        {/* Security Audit Trail Panel */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>{t('systemAuditLogs')}</span>
            </h3>
            <button
              onClick={() => onNavigate('admin-audit-logs')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
            >
              {language === 'bn' ? 'পূর্ণাঙ্গ লগ' : 'Full Trail'}
            </button>
          </div>

          <div className="space-y-2.5">
            {auditLogs.slice(0, 4).map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-2xl bg-slate-800/40 border border-slate-800 text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200">{log.action}</span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="text-slate-400 text-[11px] flex justify-between">
                  <span>User: {log.userName}</span>
                  <span className="text-emerald-400/80 font-mono">{log.ipAddress}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminDashboard;
