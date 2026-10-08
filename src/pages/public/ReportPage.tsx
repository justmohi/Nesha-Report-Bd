import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import {
  District,
  Upazila,
  Thana,
  UnionItem,
  VillageItem,
  IncidentCategory,
  Evidence
} from '../../types';
import { dataService } from '../../services/dataService';
import { storageService } from '../../services/storage/storageService';
import {
  Shield,
  MapPin,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  UploadCloud,
  FileText,
  AlertCircle,
  CheckCircle2,
  Lock,
  ChevronDown,
  ChevronUp,
  X,
  File,
  Eye,
  Crosshair,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

interface ReportPageProps {
  onNavigate: (tab: string, param?: string) => void;
}

export const ReportPage: React.FC<ReportPageProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();
  const { currentUser, role } = useAuth();

  // Jurisdiction selection states
  const [districts, setDistricts] = useState<District[]>([]);
  const [upazilas, setUpazilas] = useState<Upazila[]>([]);
  const [thanas, setThanas] = useState<Thana[]>([]);
  const [unions, setUnions] = useState<UnionItem[]>([]);
  const [villages, setVillages] = useState<VillageItem[]>([]);

  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('');
  const [selectedUpazilaId, setSelectedUpazilaId] = useState<string>('');
  const [selectedThanaId, setSelectedThanaId] = useState<string>('');
  const [selectedUnionId, setSelectedUnionId] = useState<string>('');
  const [selectedVillageId, setSelectedVillageId] = useState<string>('');
  const [villageArea, setVillageArea] = useState<string>('');
  const [roadLandmark, setRoadLandmark] = useState<string>('');
  const [latitude, setLatitude] = useState<string>('');
  const [longitude, setLongitude] = useState<string>('');

  // Reporter Information
  const [reporterName, setReporterName] = useState<string>(currentUser?.fullName || '');
  const [reporterPhone, setReporterPhone] = useState<string>(currentUser?.phoneNumber || '');
  const [reporterEmail, setReporterEmail] = useState<string>(currentUser?.email || '');

  // Incident Details
  const [incidentCategory, setIncidentCategory] = useState<IncidentCategory>('YABA');
  const [description, setDescription] = useState<string>('');
  const [incidentDate, setIncidentDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [incidentTime, setIncidentTime] = useState<string>('20:00');

  // Confidential Reported Person Details (Optional)
  const [showPersonSection, setShowPersonSection] = useState<boolean>(false);
  const [personName, setPersonName] = useState<string>('');
  const [personAlias, setPersonAlias] = useState<string>('');
  const [personAge, setPersonAge] = useState<string>('');
  const [personGender, setPersonGender] = useState<string>('male');
  const [personDescription, setPersonDescription] = useState<string>('');
  const [personKnownArea, setPersonKnownArea] = useState<string>('');
  const [personOtherNotes, setPersonOtherNotes] = useState<string>('');

  // Evidence Files
  const [evidenceFiles, setEvidenceFiles] = useState<File[]>([]);
  const [uploadedEvidence, setUploadedEvidence] = useState<Evidence[]>([]);
  const [isUploadingFiles, setIsUploadingFiles] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Form Submission
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [createdReport, setCreatedReport] = useState<{ id: string; reportId: string; pin: string } | null>(null);

  // Load jurisdictions. Each level is explicitly selected by the user.
  // Changing a parent clears all dependent selections to prevent stale jurisdiction data.
  useEffect(() => {
    dataService.getDistricts().then((list) => {
      setDistricts(list);
      setSelectedDistrictId('');
      setUpazilas([]);
      setThanas([]);
      setUnions([]);
      setVillages([]);
      setSelectedUpazilaId('');
      setSelectedThanaId('');
      setSelectedUnionId('');
      setSelectedVillageId('');
      setVillageArea('');
    });
  }, []);

  useEffect(() => {
    setSelectedUpazilaId('');
    setSelectedThanaId('');
    setSelectedUnionId('');
    setSelectedVillageId('');
    setVillageArea('');
    setUnions([]);
    setVillages([]);

    if (!selectedDistrictId) {
      setUpazilas([]);
      setThanas([]);
      return;
    }

    Promise.all([
      dataService.getUpazilas(selectedDistrictId),
      dataService.getThanas(undefined, selectedDistrictId),
    ]).then(([upazilaList, thanaList]) => {
      setUpazilas(upazilaList);
      setThanas(thanaList);
    });
  }, [selectedDistrictId]);

  // Union/Village follows the administrative Upazila, not the police station.
  useEffect(() => {
    setSelectedUnionId('');
    setSelectedVillageId('');
    setVillageArea('');
    setVillages([]);

    if (!selectedUpazilaId) {
      setUnions([]);
      return;
    }

    dataService.getUnions(selectedUpazilaId).then((list) => setUnions(list));
  }, [selectedUpazilaId]);

  useEffect(() => {
    setSelectedVillageId('');
    setVillageArea('');

    if (!selectedUnionId) {
      setVillages([]);
      return;
    }

    dataService.getVillages(selectedUnionId).then((list) => setVillages(list));
  }, [selectedUnionId]);


  // GPS Acquisition
  const handleDetectGPS = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(pos.coords.latitude.toFixed(6));
          setLongitude(pos.coords.longitude.toFixed(6));
        },
        (err) => {
          alert('GPS অবস্থান পেতে সমস্যা হয়েছে: ' + err.message);
        }
      );
    }
  };

  // Handle File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    const MAX_SIZE_BYTES = 20 * 1024 * 1024; // 20 MB

    for (const f of files) {
      if (f.size > MAX_SIZE_BYTES) {
        setUploadError(t('fileSizeError'));
        return;
      }
    }

    setEvidenceFiles((prev) => [...prev, ...files]);
  };

  const handleRemoveFile = (index: number) => {
    setEvidenceFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setUploadError(null);

    if (!currentUser) {
      setErrorMessage(language === 'bn'
        ? 'রিপোর্ট জমা দিতে অনুগ্রহ করে আগে লগইন করুন।'
        : 'Please log in before submitting a report.');
      return;
    }

    if (!description.trim()) {
      setErrorMessage(language === 'bn' ? 'অনুগ্রহ করে ঘটনার বর্ণনা প্রদান করুন।' : 'Please provide incident description.');
      return;
    }

    if (!selectedDistrictId) {
      setErrorMessage(language === 'bn' ? 'অনুগ্রহ করে জেলা নির্বাচন করুন।' : 'Please select a district.');
      return;
    }

    if (!selectedUpazilaId) {
      setErrorMessage(language === 'bn' ? 'অনুগ্রহ করে উপজেলা নির্বাচন করুন।' : 'Please select an upazila.');
      return;
    }

    if (!selectedThanaId) {
      setErrorMessage(language === 'bn' ? 'অনুগ্রহ করে দায়িত্বপ্রাপ্ত থানা নির্বাচন করুন।' : 'Please select an assigned police station.');
      return;
    }

    const selectedStation = thanas.find((t) => t.id === selectedThanaId);
    if (!selectedStation || selectedStation.districtId !== selectedDistrictId) {
      setErrorMessage(language === 'bn' ? 'নির্বাচিত থানা জেলার সাথে মিলছে না।' : 'The selected police station does not belong to the selected district.');
      return;
    }

    setIsSubmitting(true);

    try {
      const curDistrict = districts.find((d) => d.id === selectedDistrictId);
      const curUpazila = upazilas.find((u) => u.id === selectedUpazilaId);
      const curThana = thanas.find((t) => t.id === selectedThanaId);
      const curUnion = unions.find((u) => u.id === selectedUnionId);

      const reportPayload = {
        reporterId: currentUser.uid,
        reporterName: reporterName || 'গোপনীয় নাগরিক',
        reporterPhone: reporterPhone || '',
        jurisdiction: {
          districtId: selectedDistrictId,
          districtName: language === 'bn' ? (curDistrict?.nameBn || '') : (curDistrict?.nameEn || ''),
          upazilaId: selectedUpazilaId,
          upazilaName: language === 'bn' ? (curUpazila?.nameBn || '') : (curUpazila?.nameEn || ''),
          thanaId: selectedThanaId,
          thanaName: language === 'bn' ? (curThana?.nameBn || '') : (curThana?.nameEn || ''),
          unionId: selectedUnionId,
          unionName: curUnion ? (language === 'bn' ? curUnion.nameBn : curUnion.nameEn) : '',
          villageId: selectedVillageId || undefined,
          villageArea,
          roadLandmark,
        },
        incidentType: incidentCategory,
        description: description.trim(),
        incidentDate,
        incidentTime,
        location: {
          latitude: latitude ? parseFloat(latitude) : undefined,
          longitude: longitude ? parseFloat(longitude) : undefined,
          generalArea: `${villageArea ? villageArea + ', ' : ''}${curThana?.nameBn || ''}`,
        },
        evidenceIds: [],
        assignedThanaId: selectedThanaId,
      };

      const personPayload = (personName || personAlias || personDescription) ? {
        name: personName,
        alias: personAlias,
        approximateAge: personAge ? parseInt(personAge, 10) : undefined,
        gender: personGender === 'male' ? 'পুরুষ' : personGender === 'female' ? 'মহিলা' : 'অন্যান্য',
        description: personDescription,
        knownArea: personKnownArea,
        additionalNotes: personOtherNotes,
      } : undefined;

      // Create the report first. Evidence storage requires a real Firestore report ID.
      const created = await dataService.createReport(reportPayload, personPayload);

      // Upload evidence only after the report exists. The backend authenticates the
      // request and attaches each successful evidence record to this real report.
      const failedUploads: string[] = [];
      if (evidenceFiles.length > 0) {
        setIsUploadingFiles(true);
        for (let i = 0; i < evidenceFiles.length; i++) {
          const file = evidenceFiles[i];
          setUploadProgress(Math.round((i / evidenceFiles.length) * 100));
          try {
            await storageService.uploadEvidence({
              file,
              reportId: created.id,
              uploadedBy: currentUser.uid,
              onProgress: (progress) => {
                const base = (i / evidenceFiles.length) * 100;
                const portion = progress / evidenceFiles.length;
                setUploadProgress(Math.min(100, Math.round(base + portion)));
              },
            });
          } catch (uploadErr: any) {
            console.warn('Evidence upload warning:', uploadErr);
            failedUploads.push(file.name);
          }
        }
        setUploadProgress(100);
        setIsUploadingFiles(false);
      }

      if (failedUploads.length > 0) {
        setUploadError(language === 'bn'
          ? `রিপোর্ট জমা হয়েছে, তবে ${failedUploads.length}টি প্রমাণ ফাইল সংরক্ষণ করা যায়নি।`
          : `The report was submitted, but ${failedUploads.length} evidence file(s) could not be stored.`);
      }

      setCreatedReport({
        id: created.id,
        reportId: created.reportId,
        pin: created.trackingPin || '0000',
      });
    } catch (err: any) {
      console.error('Submission failed', err);
      setErrorMessage(err.message || 'রিপোর্ট দাখিলে ত্রুটি ঘটেছে। দয়া করে আবার চেষ্টা করুন।');
    } finally {
      setIsSubmitting(false);
      setIsUploadingFiles(false);
    }
  };

  // If report was created successfully, show success receipt
  if (createdReport) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              {language === 'bn' ? 'সফলভাবে নিবন্ধিত' : 'Submission Confirmed'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              {t('reportSuccessTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-lg mx-auto leading-relaxed">
              {t('reportSuccessMessage')}
            </p>
          </div>

          {/* Report credentials card */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 text-left space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs text-slate-400 font-medium">{t('trackingId')}</span>
              <span className="text-base sm:text-lg font-mono font-bold text-emerald-400">
                {createdReport.reportId}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">{t('trackingPin')}</span>
              <span className="text-base sm:text-lg font-mono font-bold text-amber-400 tracking-widest">
                {createdReport.pin}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 text-left flex items-start gap-3 text-xs text-slate-300">
            <Lock className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              {t('saveWarning')}{' '}
              {language === 'bn'
                ? 'আইনগত কারণে এই রিপোর্টের তথ্য কাউকে অভিযুক্ত করে কোনো পাবলিক তালিকায় রাখা হবে না।'
                : 'Under legal protection, unverified details are never exposed publicly.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              onClick={() => onNavigate('track')}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition"
            >
              {language === 'bn' ? 'অবস্থা ট্র্যাক করুন' : 'Track Status Now'}
            </button>
            <button
              onClick={() => onNavigate('my-reports')}
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold transition"
            >
              {t('myReports')}
            </button>
            <button
              onClick={() => {
                setCreatedReport(null);
                setDescription('');
                setEvidenceFiles([]);
              }}
              className="px-5 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white text-sm transition"
            >
              {language === 'bn' ? 'আরেকটি রিপোর্ট করুন' : 'Submit Another'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
          <Shield className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? 'গোপনীয় নাগরিক তথ্য দাখিল' : 'Confidential Citizen Submission'}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
          {t('reportIncident')}
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
          {language === 'bn'
            ? 'দায়িত্বশীলভাবে মাদক সংক্রান্ত সন্দেহজনক ঘটনা সংশ্লিষ্ট থানাকে জানান। তথ্যটি যাচাইয়ের পূর্বে কাউকে অপরাধী চিহ্নিত করা হবে না এবং আপনার পরিচয় সম্পূর্ণ সুরক্ষিত থাকবে।'
            : 'Confidential reporting form. All submissions are forwarded directly to the assigned Thana with zero public exposure.'}
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center gap-3 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SECTION 1: Jurisdiction & Location */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm">
              ১
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                {t('stepJurisdiction')}
              </h2>
              <p className="text-xs text-slate-400">
                {language === 'bn' ? 'কোন থানা ও এলাকায় ঘটনাটি ঘটছে তা নির্বাচন করুন' : 'Select Thana and jurisdiction'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* District */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {t('district')} *
              </label>
              <select
                value={selectedDistrictId}
                onChange={(e) => setSelectedDistrictId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">{language === 'bn' ? 'জেলা নির্বাচন করুন' : 'Select district'}</option>
                {districts.map((d) => (
                  <option key={d.id} value={d.id}>
                    {language === 'bn' ? d.nameBn : d.nameEn}
                  </option>
                ))}
              </select>
            </div>

            {/* Upazila */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {t('upazila')} *
              </label>
              <select
                value={selectedUpazilaId}
                onChange={(e) => setSelectedUpazilaId(e.target.value)}
                disabled={!selectedDistrictId}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
              >
                <option value="">{selectedDistrictId ? (language === 'bn' ? 'উপজেলা নির্বাচন করুন' : 'Select upazila') : (language === 'bn' ? 'আগে জেলা নির্বাচন করুন' : 'Select district first')}</option>
                {upazilas.map((u) => (
                  <option key={u.id} value={u.id}>
                    {language === 'bn' ? u.nameBn : u.nameEn}
                  </option>
                ))}
              </select>
            </div>

            {/* Thana (Assigned) */}
            <div>
              <label className="block text-xs font-semibold text-emerald-400 mb-1.5 flex items-center gap-1">
                <span>{language === 'bn' ? 'দায়িত্বপ্রাপ্ত থানা' : 'Assigned Police Station'} *</span>
              </label>
              <select
                value={selectedThanaId}
                onChange={(e) => setSelectedThanaId(e.target.value)}
                disabled={!selectedDistrictId}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-emerald-500/40 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium disabled:opacity-50"
              >
                <option value="">{selectedDistrictId ? (language === 'bn' ? 'থানা নির্বাচন করুন' : 'Select police station') : (language === 'bn' ? 'আগে জেলা নির্বাচন করুন' : 'Select district first')}</option>
                {thanas.map((th) => (
                  <option key={th.id} value={th.id}>
                    {language === 'bn' ? th.nameBn : th.nameEn} {th.code ? `(${th.code})` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {/* Union / Ward */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {t('union')}
              </label>
              <select
                value={selectedUnionId}
                onChange={(e) => setSelectedUnionId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">{t('selectUnion')}</option>
                {unions.map((un) => (
                  <option key={un.id} value={un.id}>
                    {language === 'bn' ? un.nameBn : un.nameEn}
                  </option>
                ))}
              </select>
            </div>

            {/* Village */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {language === 'bn' ? 'গ্রাম' : 'Village'}
              </label>
              <select
                value={selectedVillageId}
                onChange={(e) => {
                  const id = e.target.value;
                  setSelectedVillageId(id);
                  const village = villages.find(v => v.id === id);
                  setVillageArea(village ? (language === 'bn' ? village.nameBn : village.nameEn) : '');
                }}
                disabled={!selectedUnionId}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
              >
                <option value="">{selectedUnionId ? (language === 'bn' ? 'গ্রাম নির্বাচন করুন' : 'Select village') : (language === 'bn' ? 'আগে ইউনিয়ন নির্বাচন করুন' : 'Select union first')}</option>
                {villages.map((v) => (
                  <option key={v.id} value={v.id}>
                    {language === 'bn' ? v.nameBn : v.nameEn}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-[10px] text-slate-500">
                {language === 'bn' ? 'ইউনিয়ন নির্বাচন করলে সংশ্লিষ্ট গ্রামের তালিকা আসবে।' : 'Village list is filtered by the selected union.'}
              </p>
            </div>

            {/* Road / Landmark */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {t('roadLandmark')}
              </label>
              <input
                type="text"
                value={roadLandmark}
                onChange={(e) => setRoadLandmark(e.target.value)}
                placeholder={language === 'bn' ? 'যেমন: পানির পাম্পের পাশে' : 'e.g. Near old tea stall'}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* GPS Coordinates (Optional) */}
          <div className="pt-2 p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                {t('gpsLocation')}
              </span>
              <button
                type="button"
                onClick={handleDetectGPS}
                className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-medium bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20"
              >
                <Crosshair className="w-3.5 h-3.5" />
                <span>{t('detectGps')}</span>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="Latitude (e.g. 23.7788)"
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 text-xs font-mono"
              />
              <input
                type="text"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="Longitude (e.g. 90.4193)"
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 text-xs font-mono"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: Incident Details */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm">
              ২
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                {t('stepIncident')}
              </h2>
              <p className="text-xs text-slate-400">
                {language === 'bn' ? 'সন্দেহজনক ঘটনার প্রকৃতি এবং বস্তুনিষ্ঠ বিবরণ' : 'Nature of suspected incident and factual narrative'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {t('incidentCategory')} *
              </label>
              <select
                value={incidentCategory}
                onChange={(e) => setIncidentCategory(e.target.value as IncidentCategory)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              >
                <option value="YABA">{t('cat_YABA')}</option>
                <option value="GANJA">{t('cat_GANJA')}</option>
                <option value="PHENSEDYL">{t('cat_PHENSEDYL')}</option>
                <option value="HEROIN">{t('cat_HEROIN')}</option>
                <option value="TRAMADOL_TABLETS">{t('cat_TRAMADOL_TABLETS')}</option>
                <option value="SUSPECTED_SELLING">{t('cat_SUSPECTED_SELLING')}</option>
                <option value="SUSPECTED_DISTRIBUTION">{t('cat_SUSPECTED_DISTRIBUTION')}</option>
                <option value="SUSPECTED_USE">{t('cat_SUSPECTED_USE')}</option>
                <option value="SUSPECTED_POSSESSION">{t('cat_SUSPECTED_POSSESSION')}</option>
                <option value="OTHER">{t('cat_OTHER')}</option>
                <option value="UNKNOWN">{t('cat_UNKNOWN')}</option>
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{t('incidentDate')}</span>
              </label>
              <input
                type="date"
                value={incidentDate}
                onChange={(e) => setIncidentDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Time */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{t('incidentTime')}</span>
              </label>
              <input
                type="time"
                value={incidentTime}
                onChange={(e) => setIncidentTime(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                {t('incidentDescription')} *
              </label>
              <span className="text-[11px] text-slate-400">
                {language === 'bn' ? 'সন্দেহজনক ঘটনা' : 'Suspected incident only'}
              </span>
            </div>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('incidentDescriptionPlaceholder')}
              className="w-full px-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed"
              required
            />
          </div>
        </div>

        {/* SECTION 3: Confidential Reported Person (Optional Accordion) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div
            onClick={() => setShowPersonSection(!showPersonSection)}
            className="flex items-center justify-between cursor-pointer select-none"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-sm">
                ৩
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <span>{t('stepPerson')}</span>
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    {t('confidential')}
                  </span>
                </h2>
                <p className="text-xs text-slate-400">
                  {language === 'bn' ? 'সন্দেহভাজন ব্যক্তি সংক্রান্ত গোপনীয় তথ্য (যদি জানা থাকে)' : 'Suspected individual information (confidential)'}
                </p>
              </div>
            </div>
            <button
              type="button"
              className="p-1 rounded-lg text-slate-400 hover:text-white"
            >
              {showPersonSection ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>

          {showPersonSection && (
            <div className="pt-4 border-t border-slate-800 space-y-4">
              <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-900/40 text-xs text-purple-300 flex items-start gap-2.5">
                <Lock className="w-4 h-4 flex-shrink-0 mt-0.5 text-purple-400" />
                <p className="leading-relaxed">{t('personNotice')}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {t('personName')}
                  </label>
                  <input
                    type="text"
                    value={personName}
                    onChange={(e) => setPersonName(e.target.value)}
                    placeholder={language === 'bn' ? 'যেমন: কামাল হোসেন' : 'e.g. John Doe'}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {t('alias')}
                  </label>
                  <input
                    type="text"
                    value={personAlias}
                    onChange={(e) => setPersonAlias(e.target.value)}
                    placeholder={language === 'bn' ? 'যেমন: কালা কামাল / বাবুল ভাই' : 'e.g. Known nickname'}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {t('approximateAge')}
                  </label>
                  <input
                    type="number"
                    value={personAge}
                    onChange={(e) => setPersonAge(e.target.value)}
                    placeholder="30"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {t('personDescription')}
                  </label>
                  <textarea
                    rows={2}
                    value={personDescription}
                    onChange={(e) => setPersonDescription(e.target.value)}
                    placeholder={language === 'bn' ? 'উচ্চতা, পোশাক, শারীরিক কোনো বিশেষ চিহ্ন' : 'Height, clothing, scars, physical traits'}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {t('knownArea')}
                  </label>
                  <textarea
                    rows={2}
                    value={personKnownArea}
                    onChange={(e) => setPersonKnownArea(e.target.value)}
                    placeholder={language === 'bn' ? 'ব্যক্তিটি কোন এলাকায় আড্ডা দেয় বা বসবাস করে' : 'Frequent spots or hangouts'}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 4: Evidence Upload (Private Telegram Storage) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm">
              ৪
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>{t('evidenceTitle')}</span>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Telegram Bot Storage
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {t('evidenceDescription')}
              </p>
            </div>
          </div>

          {/* Upload Dropzone */}
          <div className="p-6 border-2 border-dashed border-slate-700 hover:border-emerald-500/60 rounded-2xl bg-slate-800/30 text-center transition">
            <input
              type="file"
              id="evidence_upload"
              multiple
              accept="image/*,video/*,application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="evidence_upload"
              className="cursor-pointer flex flex-col items-center justify-center space-y-3"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div className="text-sm font-semibold text-slate-200">
                {language === 'bn' ? 'ফাইল নির্বাচন করতে এখানে ক্লিক করুন' : 'Click to select photos, videos, or documents'}
              </div>
              <p className="text-xs text-slate-400">
                {t('maxSizeNotice')} 20 MB (JPG, PNG, MP4, PDF)
              </p>
            </label>
          </div>

          {uploadError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          {/* Selected Files List */}
          {evidenceFiles.length > 0 && (
            <div className="space-y-2 pt-2">
              <span className="text-xs font-semibold text-slate-300">
                {language === 'bn' ? 'নির্বাচিত ফাইলসমূহ:' : 'Selected files:'}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {evidenceFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-200"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <File className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span className="truncate">{file.name}</span>
                      <span className="text-[10px] text-slate-400">
                        ({(file.size / (1024 * 1024)).toFixed(1)} MB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(idx)}
                      className="p-1 text-slate-400 hover:text-rose-400 transition"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* SECTION 5: Reporter Details (Confidential) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 font-bold text-sm">
              ৫
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                {t('stepReporter')}
              </h2>
              <p className="text-xs text-slate-400">
                {language === 'bn' ? 'আপনার তথ্য কেবল আইন প্রয়োগকারী কর্মকর্তার কাছে সংরক্ষিত থাকবে' : 'Your identity is strictly confidential and protected'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t('fullName')}
              </label>
              <input
                type="text"
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                placeholder={language === 'bn' ? 'আপনার নাম (ঐচ্ছিক)' : 'Your Name (Optional)'}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t('phone')}
              </label>
              <input
                type="tel"
                value={reporterPhone}
                onChange={(e) => setReporterPhone(e.target.value)}
                placeholder="017xxxxxxxx"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t('email')}
              </label>
              <input
                type="email"
                value={reporterEmail}
                onChange={(e) => setReporterEmail(e.target.value)}
                placeholder="citizen@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Submit Action Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold text-base shadow-xl shadow-emerald-600/20 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>
                  {isUploadingFiles
                    ? `${t('uploadingFile')} (${uploadProgress}%)`
                    : t('submitting')}
                </span>
              </>
            ) : (
              <>
                <Shield className="w-5 h-5" />
                <span>{t('submitReport')}</span>
              </>
            )}
          </button>
          <p className="mt-3 text-center text-xs text-slate-400">
            {language === 'bn'
              ? 'সাবমিট করার মাধ্যমে আপনি প্রত্যয়ন করছেন যে প্রদত্ত তথ্য অসদুদ্দেশ্যমূলক নয় এবং বস্তুনিষ্ঠ।'
              : 'By submitting, you certify that information is provided in good faith.'}
          </p>
        </div>
      </form>
    </div>
  );
};
export default ReportPage;
