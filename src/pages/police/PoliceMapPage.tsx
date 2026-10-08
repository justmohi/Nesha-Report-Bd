import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { Report } from '../../types';
import { dataService } from '../../services/dataService';
import StatusBadge from '../../components/common/StatusBadge';
import { MapPin, Shield, Calendar, Clock, ArrowRight, Lock, Eye } from 'lucide-react';

interface PoliceMapPageProps {
  onNavigate: (tab: string, param?: string) => void;
}

export const PoliceMapPage: React.FC<PoliceMapPageProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();
  const { policeUser, currentUser } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const thanaId = policeUser?.assignedThanaId || 'thana_gulshan';

  useEffect(() => {
    dataService.getReports('POLICE_USER', currentUser?.uid || 'police_gulshan_01', thanaId).then((list) => {
      setReports(list);
      if (list.length > 0) setSelectedReport(list[0]);
    });
  }, [thanaId, currentUser]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-2">
            <Lock className="w-3.5 h-3.5" />
            <span>
              {language === 'bn'
                ? `থানা এখতিয়ার ম্যাপ: ${policeUser?.thanaNameBn || 'গুলশান থানা'}`
                : `Thana Jurisdiction Map: ${policeUser?.thanaNameEn || 'Gulshan Thana'}`}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {language === 'bn' ? 'থানার আওতাধীন ঘটনার ভৌগোলিক অবস্থান' : 'Thana Jurisdiction Incident Map'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {language === 'bn'
              ? 'শুধুমাত্র আপনার থানায় নথিভুক্ত রিপোর্টসমূহ এখানে প্রদর্শিত হচ্ছে।'
              : 'Displays incidents confined strictly to your assigned Thana jurisdiction.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Canvas / Visualizer */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-3">
            <span>{language === 'bn' ? 'ঘটনার মার্কার তালিকা' : 'Incident Markers in Station Jurisdiction'}</span>
            <span className="font-mono text-emerald-400">{reports.length} Reports</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-1">
            {reports.map((rep) => {
              const isSelected = selectedReport?.id === rep.id;
              return (
                <div
                  key={rep.id}
                  onClick={() => setSelectedReport(rep)}
                  className={`p-4 rounded-2xl border cursor-pointer transition space-y-2 ${
                    isSelected
                      ? 'bg-blue-950/40 border-blue-500 ring-2 ring-blue-500/20'
                      : 'bg-slate-800/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      {rep.reportId}
                    </span>
                    <StatusBadge status={rep.status} size="sm" showIcon={false} />
                  </div>

                  <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-1">
                    {t(`cat_${rep.incidentType}` as any, rep.incidentType)}
                  </h4>

                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5 truncate">
                    <MapPin className="w-3 h-3 text-slate-500 flex-shrink-0" />
                    <span className="truncate">{rep.jurisdiction.villageArea || rep.jurisdiction.thanaName}</span>
                  </div>

                  <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800">
                    <span>{rep.incidentDate}</span>
                    <span className="text-blue-400 font-mono text-[10px]">
                      {rep.location?.latitude ? `${rep.location.latitude.toFixed(3)}, ${rep.location.longitude?.toFixed(3)}` : 'Coordinates Recorded'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Marker Detail Card */}
        {selectedReport ? (
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-400">
                Marker Details (Preview)
              </span>
              <div className="text-base font-bold text-white mt-1">
                {selectedReport.reportId}
              </div>
              <div className="mt-1">
                <StatusBadge status={selectedReport.status} size="sm" />
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">{t('incidentCategory')}:</span>
                <span className="text-slate-200 font-semibold">
                  {t(`cat_${selectedReport.incidentType}` as any, selectedReport.incidentType)}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">{language === 'bn' ? 'তারিখ ও সময়:' : 'Date & Time:'}</span>
                <span className="text-slate-200">
                  {selectedReport.incidentDate} at {selectedReport.incidentTime}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">{language === 'bn' ? 'সাধারণ এলাকা:' : 'General Area:'}</span>
                <span className="text-slate-200">
                  {selectedReport.jurisdiction.villageArea || selectedReport.jurisdiction.thanaName}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                <span className="text-slate-400 block mb-1">{language === 'bn' ? 'সংক্ষিপ্ত বিবরণ:' : 'Preview:'}</span>
                <p className="text-slate-300 line-clamp-3 leading-relaxed">
                  {selectedReport.description}
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('police-report-detail', selectedReport.id)}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition flex items-center justify-center gap-1.5"
            >
              <span>{language === 'bn' ? 'সম্পূর্ণ তদন্ত ফাইলে যান' : 'Open Full Investigation File'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-center text-xs text-slate-500 flex items-center justify-center">
            {language === 'bn' ? 'মার্কার নির্বাচন করুন' : 'Select a marker'}
          </div>
        )}
      </div>
    </div>
  );
};
export default PoliceMapPage;
