import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { AuditLog } from '../../types';
import { dataService } from '../../services/dataService';
import { Activity, Shield, Lock, Search, Filter, Clock, Terminal } from 'lucide-react';

export const AdminAuditLogsPage: React.FC = () => {
  const { t, language } = useLanguage();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [actionFilter, setActionFilter] = useState<string>('ALL');

  useEffect(() => {
    dataService.getAuditLogs().then(setLogs);
  }, []);

  const filteredLogs = logs.filter((log) => {
    if (actionFilter !== 'ALL' && log.action !== actionFilter) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        log.logId.toLowerCase().includes(term) ||
        log.action.toLowerCase().includes(term) ||
        (log.userName && log.userName.toLowerCase().includes(term)) ||
        (log.reportId && log.reportId.toLowerCase().includes(term))
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
          <Terminal className="w-3.5 h-3.5" />
          <span>Immutable Audit Records</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          {t('systemAuditLogs')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          {language === 'bn'
            ? 'রিপোর্ট তৈরি, প্রমাণ অ্যাক্সেস, স্ট্যাটাস পরিবর্তন এবং প্রশাসনিক কাজের অপরিবর্তনীয় অডিট ট্রেইল'
            : 'Immutable security log tracking report creation, evidence access, and status changes'}
        </p>
      </div>

      {/* Filter and Search */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('search')}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs sm:text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ALL">All Audit Actions</option>
            <option value="REPORT_CREATED">REPORT_CREATED</option>
            <option value="STATUS_UPDATED">STATUS_UPDATED</option>
            <option value="EVIDENCE_ACCESSED">EVIDENCE_ACCESSED</option>
            <option value="POLICE_ACCOUNT_CREATED">POLICE_ACCOUNT_CREATED</option>
            <option value="LOGIN_POLICE">LOGIN_POLICE</option>
            <option value="LOGIN_ADMIN">LOGIN_ADMIN</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Log ID</th>
                <th className="py-3.5 px-4">Action</th>
                <th className="py-3.5 px-4">User & Role</th>
                <th className="py-3.5 px-4">Target Ref</th>
                <th className="py-3.5 px-4">IP Address</th>
                <th className="py-3.5 px-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                    {log.logId}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`font-semibold px-2 py-0.5 rounded-full text-[10px] ${
                        log.action.includes('EVIDENCE')
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : log.action.includes('STATUS')
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          : log.action.includes('CREATED')
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                      }`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-white">{log.userName}</div>
                    <div className="text-[10px] text-slate-400">{log.role}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-300">
                    {log.reportId || log.evidenceId || '-'}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                    {log.ipAddress || '103.xxx.xxx.xxx'}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default AdminAuditLogsPage;
