import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { Report, ReportedPerson, Evidence, ReportStatus } from '../../types';
import { dataService } from '../../services/dataService';
import StatusBadge from '../../components/common/StatusBadge';
import StatusTimeline from '../../components/common/StatusTimeline';
import {
  Shield,
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  User,
  Lock,
  FileText,
  AlertCircle,
  CheckCircle2,
  Eye,
  Edit3,
  Save,
  Archive,
  Phone,
  Mail,
  XCircle,
  File
} from 'lucide-react';

interface PoliceReportDetailPageProps {
  reportId: string;
  onNavigate: (tab: string) => void;
}

export const PoliceReportDetailPage: React.FC<PoliceReportDetailPageProps> = ({
  reportId,
  onNavigate,
}) => {
  const { t, language } = useLanguage();
  const { policeUser, currentUser, role } = useAuth();

  const [report, setReport] = useState<Report | null>(null);
  const [reportedPerson, setReportedPerson] = useState<ReportedPerson | null>(null);
  const [evidenceList, setEvidenceList] = useState<Evidence[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Editing state
  const [policeNotes, setPoliceNotes] = useState<string>('');
  const [actionDetails, setActionDetails] = useState<string>('');
  const [newStatus, setNewStatus] = useState<ReportStatus | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Evidence preview modal
  const [selectedEvidencePreview, setSelectedEvidencePreview] = useState<Evidence | null>(null);

  const thanaId = policeUser?.assignedThanaId || 'thana_gulshan';

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const uid = currentUser?.uid || 'police_gulshan_01';
        const rep = await dataService.getReportById(reportId, 'POLICE_USER', uid, thanaId);

        if (!rep) {
          setError('Report not found');
          return;
        }

        setReport(rep);
        setPoliceNotes(rep.policeNotes || '');
        setActionDetails(rep.actionTakenDetails || '');
        setNewStatus(rep.status);

        // Fetch confidential person if exists
        if (rep.reportedPersonId) {
          try {
            const p = await dataService.getReportedPerson(rep.reportedPersonId, 'POLICE_USER', thanaId);
            setReportedPerson(p);
          } catch (e) {
            console.warn('Could not load reported person', e);
          }
        }

        // Fetch evidence
        try {
          const ev = await dataService.getEvidenceForReport(rep.id, 'POLICE_USER', uid, thanaId);
          setEvidenceList(ev);
        } catch (e) {
          console.warn('Could not load evidence', e);
        }
      } catch (err: any) {
        setError(err.message || 'Unauthorized or report load failure');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [reportId, thanaId, currentUser]);

  const handleUpdateStatusAndNotes = async (statusToSet: ReportStatus) => {
    if (!report || !policeUser) return;
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const updated = await dataService.updateReportStatus(
        report.id,
        statusToSet,
        {
          uid: policeUser.uid,
          name: policeUser.fullName,
          thanaId: policeUser.assignedThanaId,
          role: 'POLICE_USER',
        },
        policeNotes,
        actionDetails
      );

      setReport(updated);
      setNewStatus(updated.status);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      alert('Error updating status: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleViewEvidence = async (ev: Evidence) => {
    setSelectedEvidencePreview(ev);
    // Log audit
    if (policeUser) {
      await dataService.logAudit({
        userId: policeUser.uid,
        userName: policeUser.fullName,
        role: 'POLICE_USER',
        action: 'EVIDENCE_ACCESSED',
        reportId: report?.id,
        evidenceId: ev.id,
        metadata: { fileName: ev.fileName, thanaId },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-slate-900 border border-slate-800 rounded-3xl text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
        <h3 className="text-lg font-bold text-white">
          {language === 'bn' ? 'অননুমোদিত প্রবেশাধিকার' : 'Unauthorized Access'}
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          {error || (language === 'bn' ? 'আপনি কেবল আপনার থানার রিপোর্ট দেখতে পারেন।' : 'You can only view reports assigned to your Thana.')}
        </p>
        <button
          onClick={() => onNavigate('police-reports')}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
        >
          {t('back')}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={() => onNavigate('police-reports')}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('back')}</span>
        </button>

        <div className="flex items-center gap-2">
          <StatusBadge status={report.status} size="md" />
        </div>
      </div>

      {/* Main Investigation Panel */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-blue-900/40 space-y-8">
        {/* Incident Summary Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                {report.reportId}
              </span>
              <span className="text-xs text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20 font-medium">
                {report.jurisdiction.thanaName}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-2">
              {t(`cat_${report.incidentType}` as any, report.incidentType)}
            </h1>
          </div>

          <div className="text-xs text-slate-400 space-y-1 md:text-right">
            <div>
              {language === 'bn' ? 'ঘটনার তারিখ ও সময়:' : 'Incident Time:'}{' '}
              <span className="text-slate-200 font-medium">
                {report.incidentDate} ({report.incidentTime})
              </span>
            </div>
            <div>
              {language === 'bn' ? 'অনলাইন রিপোর্ট প্রাপ্তি:' : 'Report Received:'}{' '}
              <span className="text-slate-200 font-medium">
                {new Date(report.createdAt).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Visual Timeline */}
        <div className="border-b border-slate-800 pb-6">
          <StatusTimeline currentStatus={report.status} history={report.statusHistory} />
        </div>

        {/* Narrative & Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-blue-400" />
              <span>{language === 'bn' ? 'ঘটনার মূল বিবরণ (নাগরিক বয়ান)' : 'Incident Narrative'}</span>
            </h3>
            <p className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed">
              {report.description}
            </p>

            {/* Reporter details for police */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-1 text-slate-300">
              <div className="font-semibold text-emerald-400 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'তথ্যদাতার গোপনীয় পরিচয়' : 'Reporter Information'}</span>
              </div>
              <div>{language === 'bn' ? 'নাম:' : 'Name:'} {report.reporterName || 'গোপনীয়'}</div>
              {report.reporterPhone && <div>{language === 'bn' ? 'ফোন:' : 'Phone:'} {report.reporterPhone}</div>}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>{language === 'bn' ? 'ঘটনার অবস্থান ও ল্যান্ডমার্ক' : 'Location & Coordinates'}</span>
            </h3>
            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 text-xs space-y-2 text-slate-300">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">{t('district')}</span>
                <span className="font-medium text-slate-200">{report.jurisdiction.districtName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">{t('thana')}</span>
                <span className="font-medium text-blue-400">{report.jurisdiction.thanaName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">{t('villageArea')}</span>
                <span className="font-medium text-slate-200">{report.jurisdiction.villageArea || 'N/A'}</span>
              </div>
              {report.jurisdiction.roadLandmark && (
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">{t('roadLandmark')}</span>
                  <span className="font-medium text-slate-200">{report.jurisdiction.roadLandmark}</span>
                </div>
              )}
              {report.location?.latitude && (
                <div className="flex justify-between py-1 font-mono text-[11px] text-emerald-400">
                  <span>GPS Coordinates:</span>
                  <span>{report.location.latitude}, {report.location.longitude}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CONFIDENTIAL REPORTED PERSON SECTION (Strictly Police Authorized) */}
        {reportedPerson && (
          <div className="p-6 rounded-3xl bg-purple-950/20 border border-purple-900/50 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-purple-400" />
                <span>{language === 'bn' ? 'সন্দেহভাজন ব্যক্তি তথ্য (কঠোরভাবে গোপনীয়)' : 'Reported Individual Details (Strictly Confidential)'}</span>
              </h3>
              <span className="text-[10px] uppercase font-bold text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/20">
                Law Enforcement Only
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block">{t('personName')}</span>
                <span className="font-bold text-slate-100 text-sm mt-0.5 block">{reportedPerson.name || 'অনির্দিষ্ট'}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block">{t('alias')}</span>
                <span className="font-bold text-purple-300 text-sm mt-0.5 block">{reportedPerson.alias || 'N/A'}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block">{t('approximateAge')} & {t('gender')}</span>
                <span className="font-semibold text-slate-200 mt-0.5 block">
                  {reportedPerson.approximateAge ? `${reportedPerson.approximateAge} বছর` : ''} ({reportedPerson.gender || 'N/A'})
                </span>
              </div>
            </div>

            {reportedPerson.description && (
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                <span className="text-slate-400 block font-semibold mb-1">{t('personDescription')}</span>
                <p className="text-slate-300 leading-relaxed">{reportedPerson.description}</p>
              </div>
            )}

            {reportedPerson.knownArea && (
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                <span className="text-slate-400 block font-semibold mb-1">{t('knownArea')}</span>
                <p className="text-slate-300 leading-relaxed">{reportedPerson.knownArea}</p>
              </div>
            )}
          </div>
        )}

        {/* EVIDENCE SECTION (Telegram Private Channel Storage Viewer) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Lock className="w-4 h-4 text-blue-400" />
              <span>{language === 'bn' ? 'সংযুক্ত প্রমাণাদি (টেলিগ্রাম প্রাইভেট চ্যানেল স্টোরেজ)' : 'Attached Evidence (Telegram Private Storage)'}</span>
            </h3>
            <span className="text-[11px] text-slate-500">
              {t('evidenceAccessLogged')}
            </span>
          </div>

          {evidenceList.length === 0 ? (
            <div className="p-4 rounded-2xl bg-slate-800/30 border border-slate-800 text-center text-xs text-slate-400">
              {language === 'bn' ? 'এই রিপোর্টে কোনো প্রমাণ ফাইল সংযুক্ত করা হয়নি।' : 'No evidence files attached to this report.'}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {evidenceList.map((ev) => (
                <div
                  key={ev.id}
                  className="p-3 rounded-2xl bg-slate-800/40 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <File className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <div className="truncate">
                      <div className="font-semibold text-slate-200 truncate">{ev.fileName}</div>
                      <div className="text-[10px] text-slate-400">
                        {(ev.fileSize / (1024 * 1024)).toFixed(2)} MB • Msg #{ev.telegramMessageId || 'Vault'}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleViewEvidence(ev)}
                    className="px-3 py-1.5 rounded-lg bg-blue-600/90 hover:bg-blue-600 text-white font-medium text-xs flex items-center gap-1 transition flex-shrink-0"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'দেখুন' : 'View'}</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* EVIDENCE MODAL */}
        {selectedEvidencePreview && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-bold text-white truncate max-w-sm">
                    {selectedEvidencePreview.fileName}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedEvidencePreview(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="rounded-2xl overflow-hidden bg-black/60 max-h-[60vh] flex items-center justify-center border border-slate-800">
                {selectedEvidencePreview.previewUrl ? (
                  <img
                    src={selectedEvidencePreview.previewUrl}
                    alt="Evidence"
                    className="max-h-[60vh] w-auto object-contain"
                  />
                ) : (
                  <div className="p-8 text-center text-xs text-slate-400 space-y-2">
                    <File className="w-12 h-12 mx-auto text-blue-400" />
                    <div>Telegram Bot Storage Vault Record</div>
                    <div className="font-mono text-emerald-400">
                      ID: {selectedEvidencePreview.telegramFileId || selectedEvidencePreview.id}
                    </div>
                  </div>
                )}
              </div>

              <div className="text-[11px] text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                <span>Access verified: Officer {policeUser?.badgeNumber}</span>
                <span className="text-emerald-400 font-mono">Audit Log Generated</span>
              </div>
            </div>
          </div>
        )}

        {/* INVESTIGATION WORKFLOW & STATUS ACTIONS */}
        <div className="pt-6 border-t border-slate-800 space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              {t('policeNotes')} ({language === 'bn' ? 'অভ্যন্তরীণ থানা নোট' : 'Internal Thana Investigation Notes'})
            </label>
            <textarea
              rows={3}
              value={policeNotes}
              onChange={(e) => setPoliceNotes(e.target.value)}
              placeholder={t('policeNotesPlaceholder')}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-800 border border-slate-700 text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              {t('recordActionTaken')} ({language === 'bn' ? 'মামলা নম্বর, জব্দ তালিকা বা অভিযানের বিবরণ' : 'Action Details & Case FIR'})
            </label>
            <textarea
              rows={2}
              value={actionDetails}
              onChange={(e) => setActionDetails(e.target.value)}
              placeholder={language === 'bn' ? 'যেমন: কোতোয়ালী থানা এফআইআর নং ৪২/২০২৬, ৫০ বোতল সিরাপ জব্দ...' : 'e.g. FIR registered, contraband seized...'}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-800 border border-slate-700 text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
            />
          </div>

          {/* Action Buttons to Transition Status */}
          <div className="space-y-3 pt-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {t('updateStatus')}
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                disabled={isSaving}
                onClick={() => handleUpdateStatusAndNotes('UNDER_REVIEW')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                  report.status === 'UNDER_REVIEW'
                    ? 'bg-amber-600 text-white ring-2 ring-amber-400'
                    : 'bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
                }`}
              >
                {t('status_UNDER_REVIEW')}
              </button>

              <button
                type="button"
                disabled={isSaving}
                onClick={() => handleUpdateStatusAndNotes('VERIFIED')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                  report.status === 'VERIFIED'
                    ? 'bg-emerald-600 text-white ring-2 ring-emerald-400'
                    : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
                }`}
              >
                {t('status_VERIFIED')}
              </button>

              <button
                type="button"
                disabled={isSaving}
                onClick={() => handleUpdateStatusAndNotes('ACTION_TAKEN')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                  report.status === 'ACTION_TAKEN'
                    ? 'bg-purple-600 text-white ring-2 ring-purple-400'
                    : 'bg-purple-500/10 border border-purple-500/30 text-purple-300 hover:bg-purple-500/20'
                }`}
              >
                {t('status_ACTION_TAKEN')}
              </button>

              <button
                type="button"
                disabled={isSaving}
                onClick={() => handleUpdateStatusAndNotes('REJECTED')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                  report.status === 'REJECTED'
                    ? 'bg-rose-600 text-white ring-2 ring-rose-400'
                    : 'bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/20'
                }`}
              >
                {t('status_REJECTED')}
              </button>

              <button
                type="button"
                disabled={isSaving}
                onClick={() => handleUpdateStatusAndNotes('CLOSED')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                  report.status === 'CLOSED'
                    ? 'bg-slate-700 text-white ring-2 ring-slate-400'
                    : 'bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {t('status_CLOSED')}
              </button>
            </div>
          </div>

          {saveSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{language === 'bn' ? 'তদন্তের অবস্থা এবং নোট সফলভাবে সংরক্ষিত হয়েছে।' : 'Investigation status and notes updated.'}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default PoliceReportDetailPage;
