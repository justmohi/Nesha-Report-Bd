import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { Report } from '../../types';
import { dataService } from '../../services/dataService';
import StatusBadge from '../../components/common/StatusBadge';
import StatusTimeline from '../../components/common/StatusTimeline';
import {
  ArrowLeft,
  Shield,
  MapPin,
  Calendar,
  Clock,
  Lock,
  FileText,
  AlertCircle,
  Building2,
  CheckCircle2
} from 'lucide-react';

interface ReportDetailPageProps {
  reportId: string;
  onNavigate: (tab: string) => void;
}

export const ReportDetailPage: React.FC<ReportDetailPageProps> = ({
  reportId,
  onNavigate,
}) => {
  const { t, language } = useLanguage();
  const { currentUser, role } = useAuth();
  const [report, setReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const uid = currentUser?.uid || 'citizen_demo_01';
        const data = await dataService.getReportById(reportId, 'PUBLIC_USER', uid);
        setReport(data);
      } catch (err: any) {
        setError(err.message || 'রিপোর্ট লোড করা সম্ভব হয়নি');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [reportId, currentUser]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 bg-white border border-slate-200 rounded-2xl text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-600 mx-auto" />
        <h3 className="text-lg font-bold text-slate-900">
          {language === 'bn' ? 'রিপোর্টটি পাওয়া যায়নি' : 'Report Not Found'}
        </h3>
        <p className="text-xs text-slate-500">
          {error || (language === 'bn' ? 'আপনার প্রবেশাধিকার নেই অথবা রিপোর্টটি বিদ্যমান নেই।' : 'You do not have permission or report does not exist.')}
        </p>
        <button
          onClick={() => onNavigate('my-reports')}
          className="px-4 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold"
        >
          {t('back')}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Back & Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('my-reports')}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('back')}</span>
        </button>

        <div className="flex items-center gap-2">
          <StatusBadge status={report.status} size="md" />
        </div>
      </div>

      {/* Main Report Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#006a4e] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {report.reportId}
              </span>
              <span className="text-xs text-slate-500 font-mono">
                PIN: {report.trackingPin || '****'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2">
              {t(`cat_${report.incidentType}` as any, report.incidentType)}
            </h1>
          </div>

          <div className="text-xs text-slate-500 sm:text-right space-y-1">
            <div>
              {language === 'bn' ? 'জমা দেওয়ার তারিখ:' : 'Submitted on:'}{' '}
              <span className="text-slate-700 font-medium">
                {new Date(report.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div>
              {language === 'bn' ? 'দায়িত্বপ্রাপ্ত থানা:' : 'Assigned Station:'}{' '}
              <span className="text-[#006a4e] font-medium">
                {report.jurisdiction.thanaName}
              </span>
            </div>
          </div>
        </div>

        {/* Visual Timeline */}
        <div className="border-b border-slate-200 pb-6">
          <StatusTimeline currentStatus={report.status} history={report.statusHistory} />
        </div>

        {/* Narrative & Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {language === 'bn' ? 'ঘটনার বিবরণ' : 'Incident Narrative'}
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50/40 p-4 rounded-2xl border border-slate-200">
              {report.description}
            </p>

            <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                {report.incidentDate}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                {report.incidentTime}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {language === 'bn' ? 'স্থান ও এখতিয়ারভুক্ত তথ্য' : 'Location Details'}
            </h3>
            <div className="bg-slate-50/40 p-4 rounded-2xl border border-slate-200 text-xs space-y-2 text-slate-600">
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">{t('district')}</span>
                <span className="font-medium text-slate-700">{report.jurisdiction.districtName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">{t('upazila')}</span>
                <span className="font-medium text-slate-700">{report.jurisdiction.upazilaName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">{t('thana')}</span>
                <span className="font-medium text-[#006a4e]">{report.jurisdiction.thanaName}</span>
              </div>
              {report.jurisdiction.villageArea && (
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">{t('villageArea')}</span>
                  <span className="font-medium text-slate-700">{report.jurisdiction.villageArea}</span>
                </div>
              )}
              {report.jurisdiction.roadLandmark && (
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">{t('roadLandmark')}</span>
                  <span className="font-medium text-slate-700">{report.jurisdiction.roadLandmark}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Official Action Record if present */}
        {report.actionTakenDetails && (
          <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-200 text-purple-200 space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-700 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              {t('recordActionTaken')}
            </h4>
            <p className="text-xs sm:text-sm text-purple-700/90 leading-relaxed">
              {report.actionTakenDetails}
            </p>
          </div>
        )}

        {/* Confidentiality Reminder */}
        <div className="p-4 rounded-2xl bg-slate-50/60 border border-slate-200 flex items-start gap-3 text-xs text-slate-500">
          <Lock className="w-4 h-4 text-[#006a4e] flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            {language === 'bn'
              ? 'নিরাপত্তা বিধি: আপনার পরিচয় ও সংশ্লিষ্ট প্রমাণ টেলিগ্রামের এনক্রিপ্টেড চ্যানেলে সংরক্ষিত। কোনো সাধারণ নাগরিক বা অননুমোদিত ব্যক্তি এই তথ্য দেখতে পাবে না।'
              : 'Security protocol: Reporter identity and evidence are locked in encrypted storage and accessible solely by verified Thana police.'}
          </p>
        </div>
      </div>
    </div>
  );
};
export default ReportDetailPage;
